"""
StationSathi Data Validation Engine
Performs comprehensive data auditing across stations, facilities, and graphs.
Detects ID duplications, broken graph references, obsolete platform numbering,
missing provenance metadata, and produces a readable diagnostic report.
"""

import sys
import json
from pathlib import Path
from typing import List, Dict, Any, Set

DATA_DIR = Path(__file__).resolve().parent.parent / "app" / "data"

class StationDataValidator:
    def __init__(self, data_dir: Path = DATA_DIR):
        self.data_dir = data_dir
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.station_ids: Set[str] = set()
        self.facility_ids: Set[str] = set()
        self.graph_nodes_by_station: Dict[str, Set[str]] = {}

    def log_error(self, msg: str):
        self.errors.append(f"[ERROR] {msg}")

    def log_warning(self, msg: str):
        self.warnings.append(f"[WARNING] {msg}")

    def validate_all(self) -> bool:
        print("=" * 60)
        print("StationSathi: Running Data Validation Suite...")
        print("=" * 60)

        self._validate_stations_json()
        self._validate_facilities()
        self._validate_graphs()
        self._audit_dadar_obsolete_references()

        print("\nValidation Summary:")
        print(f"Total Errors:   {len(self.errors)}")
        print(f"Total Warnings: {len(self.warnings)}")

        if self.warnings:
            print("\nWarnings:")
            for w in self.warnings:
                print(f"  {w}")

        if self.errors:
            print("\nErrors:")
            for e in self.errors:
                print(f"  {e}")
            print("\nRESULT: FAILED")
            return False

        print("\nRESULT: PASSED (All station datasets, graphs, and provenance verified)")
        return True

    def _validate_stations_json(self):
        stations_file = self.data_dir / "stations.json"
        if not stations_file.exists():
            self.log_error(f"Missing stations.json file at {stations_file}")
            return

        with open(stations_file, "r", encoding="utf-8") as f:
            try:
                stations = json.load(f)
            except Exception as e:
                self.log_error(f"Invalid JSON format in stations.json: {e}")
                return

        expected_stations = {"dadar", "csmt", "byculla", "ghatkopar", "thane", "kalyan"}
        found_stations = set()

        for s in stations:
            sid = s.get("station_id")
            if not sid:
                self.log_error("Station entry missing 'station_id'.")
                continue

            if sid in self.station_ids:
                self.log_error(f"Duplicate station_id '{sid}' detected.")
            self.station_ids.add(sid)
            found_stations.add(sid)

            # Metadata completeness checks
            for req_field in ["name", "code", "network", "description", "coverage", "verification_status", "last_updated", "source_method"]:
                if not s.get(req_field):
                    self.log_error(f"Station '{sid}' is missing required field '{req_field}'.")

            if s.get("platforms_count", 0) <= 0:
                self.log_error(f"Station '{sid}' has invalid platforms_count: {s.get('platforms_count')}")

            if not s.get("entrances") or len(s.get("entrances")) == 0:
                self.log_error(f"Station '{sid}' has empty entrances list.")

        missing = expected_stations - found_stations
        if missing:
            self.log_error(f"Missing expected stations: {missing}")

    def _validate_facilities(self):
        for sid in self.station_ids:
            fac_file = self.data_dir / f"facilities_{sid}.json"
            if not fac_file.exists():
                self.log_error(f"Missing facilities file for station '{sid}': {fac_file}")
                continue

            with open(fac_file, "r", encoding="utf-8") as f:
                try:
                    facs = json.load(f)
                except Exception as e:
                    self.log_error(f"Invalid JSON in facilities_{sid}.json: {e}")
                    continue

            if len(facs) == 0:
                self.log_warning(f"Facilities list for station '{sid}' is empty.")

            for fac in facs:
                fid = fac.get("facility_id")
                if not fid:
                    self.log_error(f"Facility in station '{sid}' is missing 'facility_id'.")
                    continue

                if fid in self.facility_ids:
                    self.log_error(f"Duplicate facility_id '{fid}' across dataset.")
                self.facility_ids.add(fid)

                if fac.get("station_id") != sid:
                    self.log_error(f"Facility '{fid}' station_id '{fac.get('station_id')}' does not match file '{sid}'.")

                for req_field in ["name", "category", "floor_level", "verification_status", "source_method", "last_updated"]:
                    if not fac.get(req_field):
                        self.log_error(f"Facility '{fid}' is missing required field '{req_field}'.")

                # SVG coordinates validation
                coords = fac.get("svg_coords")
                if coords:
                    if not isinstance(coords.get("x"), (int, float)) or not isinstance(coords.get("y"), (int, float)):
                        self.log_error(f"Facility '{fid}' has invalid svg_coords: {coords}")

    def _validate_graphs(self):
        for sid in self.station_ids:
            graph_file = self.data_dir / f"graph_{sid}.json"
            if not graph_file.exists():
                self.log_error(f"Missing graph file for station '{sid}': {graph_file}")
                continue

            with open(graph_file, "r", encoding="utf-8") as f:
                try:
                    gdata = json.load(f)
                except Exception as e:
                    self.log_error(f"Invalid JSON in graph_{sid}.json: {e}")
                    continue

            nodes = gdata.get("nodes", {})
            edges = gdata.get("edges", [])

            self.graph_nodes_by_station[sid] = set(nodes.keys())

            if len(nodes) == 0:
                self.log_error(f"Graph for station '{sid}' has zero nodes.")
            if len(edges) == 0:
                self.log_error(f"Graph for station '{sid}' has zero edges.")

            # Validate nodes
            for nid, node in nodes.items():
                if node.get("id") != nid:
                    self.log_error(f"Node key '{nid}' does not match node id '{node.get('id')}' in graph_{sid}.json.")
                for nf in ["name", "type", "x", "y"]:
                    if nf not in node:
                        self.log_error(f"Node '{nid}' in '{sid}' is missing required field '{nf}'.")

            # Validate edges
            edge_ids = set()
            for edge in edges:
                eid = edge.get("id")
                if not eid:
                    self.log_error(f"Edge in '{sid}' missing 'id'.")
                    continue
                if eid in edge_ids:
                    self.log_error(f"Duplicate edge ID '{eid}' in graph_{sid}.json.")
                edge_ids.add(eid)

                from_n = edge.get("from_node")
                to_n = edge.get("to_node")

                if from_n not in nodes:
                    self.log_error(f"Edge '{eid}' in '{sid}' references non-existent from_node '{from_n}'.")
                if to_n not in nodes:
                    self.log_error(f"Edge '{eid}' in '{sid}' references non-existent to_node '{to_n}'.")

                dist = edge.get("distance_m", 0)
                if dist <= 0:
                    self.log_error(f"Edge '{eid}' in '{sid}' has invalid distance: {dist}")

                if "is_accessible" not in edge:
                    self.log_error(f"Edge '{eid}' in '{sid}' is missing 'is_accessible' flag.")

            # Cross-check facilities node_id references
            fac_file = self.data_dir / f"facilities_{sid}.json"
            if fac_file.exists():
                with open(fac_file, "r", encoding="utf-8") as f:
                    facs = json.load(f)
                    for fac in facs:
                        fnid = fac.get("node_id")
                        if fnid and fnid not in nodes:
                            self.log_error(f"Facility '{fac.get('facility_id')}' references node '{fnid}' which is not in graph_{sid}.json.")

    def _audit_dadar_obsolete_references(self):
        """Strictly audits Dadar files for obsolete platform numbering."""
        dadar_graph_file = self.data_dir / "graph_dadar.json"
        dadar_fac_file = self.data_dir / "facilities_dadar.json"

        # Check graph
        if dadar_graph_file.exists():
            with open(dadar_graph_file, "r", encoding="utf-8") as f:
                content = f.read()
                for obsolete in ["node_pf4", "node_pf5", "node_pf1\"", "node_pf2\""]:
                    if obsolete in content:
                        self.log_error(f"Obsolete Dadar platform reference '{obsolete}' found in graph_dadar.json!")

        # Check facilities
        if dadar_fac_file.exists():
            with open(dadar_fac_file, "r", encoding="utf-8") as f:
                content = f.read()
                for obsolete in ["dadar_pf_04", "dadar_pf_05", "node_pf4", "node_pf5", "node_pf1\"", "node_pf2\""]:
                    if obsolete in content:
                        self.log_error(f"Obsolete Dadar platform reference '{obsolete}' found in facilities_dadar.json!")

if __name__ == "__main__":
    validator = StationDataValidator()
    success = validator.validate_all()
    sys.exit(0 if success else 1)
