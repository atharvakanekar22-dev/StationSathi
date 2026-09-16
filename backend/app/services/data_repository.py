import os
import json
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from pathlib import Path

from backend.app.models.schemas import Station, Facility, StationGraph, GraphNode, GraphEdge

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

class StationRepository(ABC):
    @abstractmethod
    def get_all_stations(self) -> List[Station]:
        pass

    @abstractmethod
    def get_station_by_id(self, station_id: str) -> Optional[Station]:
        pass

    @abstractmethod
    def get_facilities_by_station(
        self, station_id: str, category: Optional[str] = None, search: Optional[str] = None
    ) -> List[Facility]:
        pass

    @abstractmethod
    def get_facility_by_id(self, station_id: str, facility_id: str) -> Optional[Facility]:
        pass

    @abstractmethod
    def get_station_graph(self, station_id: str) -> Optional[StationGraph]:
        pass

class JsonStationRepository(StationRepository):
    def __init__(self, data_dir: Path = DATA_DIR):
        self.data_dir = data_dir
        self._stations: Dict[str, Station] = {}
        self._facilities: Dict[str, List[Facility]] = {}
        self._graphs: Dict[str, StationGraph] = {}
        self._load_data()

    def _load_data(self):
        stations_path = self.data_dir / "stations.json"
        if stations_path.exists():
            with open(stations_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                for item in data:
                    station = Station(**item)
                    self._stations[station.station_id] = station

        # Load facilities for all stations
        for station_id in ["dadar", "csmt", "byculla", "ghatkopar", "thane", "kalyan"]:
            fac_path = self.data_dir / f"facilities_{station_id}.json"
            if fac_path.exists():
                with open(fac_path, "r", encoding="utf-8") as f:
                    fac_data = json.load(f)
                    self._facilities[station_id] = [Facility(**item) for item in fac_data]
            else:
                self._facilities[station_id] = []

        # Load graph for dadar
        graph_path = self.data_dir / "graph_dadar.json"
        if graph_path.exists():
            with open(graph_path, "r", encoding="utf-8") as f:
                g_data = json.load(f)
                nodes_dict = {
                    nid: GraphNode(**nval) for nid, nval in g_data.get("nodes", {}).items()
                }
                edges_list = [GraphEdge(**eval_) for eval_ in g_data.get("edges", [])]
                self._graphs["dadar"] = StationGraph(
                    station_id="dadar",
                    nodes=nodes_dict,
                    edges=edges_list
                )

    def get_all_stations(self) -> List[Station]:
        return list(self._stations.values())

    def get_station_by_id(self, station_id: str) -> Optional[Station]:
        return self._stations.get(station_id.lower())

    def get_facilities_by_station(
        self, station_id: str, category: Optional[str] = None, search: Optional[str] = None
    ) -> List[Facility]:
        facs = self._facilities.get(station_id.lower(), [])
        if category and category != "all":
            facs = [f for f in facs if f.category.lower() == category.lower()]
        if search:
            q = search.lower().strip()
            facs = [
                f for f in facs
                if q in f.name.lower() or (f.notes and q in f.notes.lower()) or q in f.category.lower()
            ]
        return facs

    def get_facility_by_id(self, station_id: str, facility_id: str) -> Optional[Facility]:
        facs = self._facilities.get(station_id.lower(), [])
        for f in facs:
            if f.facility_id == facility_id:
                return f
        return None

    def get_station_graph(self, station_id: str) -> Optional[StationGraph]:
        return self._graphs.get(station_id.lower())

# Singleton instance for dependency injection
repository = JsonStationRepository()
