import json
from pathlib import Path

backend_data = Path(__file__).resolve().parent.parent / "app" / "data"
frontend_data = Path(__file__).resolve().parent.parent.parent / "frontend" / "src" / "data"

with open(backend_data / "stations.json", encoding="utf-8") as f:
    stations = json.load(f)

facilities = {}
for sid in ["dadar", "csmt", "byculla", "ghatkopar", "thane", "kalyan"]:
    with open(backend_data / f"facilities_{sid}.json", encoding="utf-8") as f:
        facilities[sid] = json.load(f)

graphs = {}
for sid in ["dadar", "csmt", "byculla", "ghatkopar", "thane", "kalyan"]:
    with open(backend_data / f"graph_{sid}.json", encoding="utf-8") as f:
        graphs[sid] = json.load(f)

demo_routes = {
    "node_entrance_east-node_pf11-shortest": {
        "success": True,
        "station_id": "dadar",
        "preference_applied": "shortest",
        "explanation": "Direct walking route to Platform 11 via Central Foot Overbridge (127m).",
        "total_distance_m": 127.0,
        "estimated_steps": 169,
        "estimated_time_seconds": 115,
        "is_step_free": False,
        "path_node_ids": [
            "node_entrance_east",
            "node_concourse_east",
            "node_stairs_fob_east",
            "node_fob_central_span_east",
            "node_fob_central_span_pf11_12",
            "node_stairs_pf11",
            "node_pf11"
        ],
        "steps": [
            {"step_number": 1, "instruction": "Start at East Entrance (Ground Concourse).", "edge_type": "walkway", "distance_m": 0, "is_accessible": True},
            {"step_number": 2, "instruction": "Walk straight into East Main Concourse (approx. 25m)", "edge_type": "walkway", "distance_m": 25, "is_accessible": True},
            {"step_number": 3, "instruction": "Approach the East staircase ascending to Central FOB (approx. 20m)", "edge_type": "walkway", "distance_m": 20, "is_accessible": True},
            {"step_number": 4, "instruction": "Climb Central FOB East Staircase to the bridge level (approx. 15m)", "edge_type": "stairs", "distance_m": 15, "is_accessible": False},
            {"step_number": 5, "instruction": "Walk west along Central FOB deck over tracks towards Platform 11/12 (approx. 45m)", "edge_type": "fob", "distance_m": 45, "is_accessible": True},
            {"step_number": 6, "instruction": "Approach Platform 11 stairway landing on the bridge (approx. 10m)", "edge_type": "walkway", "distance_m": 10, "is_accessible": True},
            {"step_number": 7, "instruction": "Descend stairs from Central FOB down onto Platform 11 (approx. 18m)", "edge_type": "stairs", "distance_m": 18, "is_accessible": False},
            {"step_number": 8, "instruction": "Arrive at destination: Platform 11 (Mainline & Express).", "edge_type": "walkway", "distance_m": 0, "is_accessible": True}
        ],
        "verification_status": "prototype_data"
    },
    "node_entrance_east-node_pf10-avoid_stairs": {
        "success": True,
        "station_id": "dadar",
        "preference_applied": "avoid_stairs",
        "explanation": "Step-free route to Platform 10 using accessible elevators and level concourses.",
        "total_distance_m": 188.0,
        "estimated_steps": 251,
        "estimated_time_seconds": 221,
        "is_step_free": True,
        "path_node_ids": [
            "node_entrance_east",
            "node_concourse_east",
            "node_elevator_east",
            "node_fob_central_span_east",
            "node_fob_central_span_pf11_12",
            "node_fob_central_span_pf9_10",
            "node_elevator_pf10",
            "node_pf10"
        ],
        "steps": [
            {"step_number": 1, "instruction": "Start at East Entrance (Ground Concourse).", "edge_type": "walkway", "distance_m": 0, "is_accessible": True},
            {"step_number": 2, "instruction": "Walk straight into East Main Concourse (approx. 25m)", "edge_type": "walkway", "distance_m": 25, "is_accessible": True},
            {"step_number": 3, "instruction": "Proceed directly to Central FOB Accessible Elevator (East side) (approx. 22m)", "edge_type": "walkway", "distance_m": 22, "is_accessible": True},
            {"step_number": 4, "instruction": "Take the Accessible Elevator up to Central FOB Bridge Level (approx. 12m)", "edge_type": "elevator", "distance_m": 12, "is_accessible": True},
            {"step_number": 5, "instruction": "Walk west along Central FOB deck over tracks towards Platform 11/12 (approx. 45m)", "edge_type": "fob", "distance_m": 45, "is_accessible": True},
            {"step_number": 6, "instruction": "Continue walking west along Central FOB crossway towards Platform 9/10 (approx. 50m)", "edge_type": "fob", "distance_m": 50, "is_accessible": True},
            {"step_number": 7, "instruction": "Proceed to the Platform 10 Accessible Elevator shaft on the bridge (approx. 12m)", "edge_type": "walkway", "distance_m": 12, "is_accessible": True},
            {"step_number": 8, "instruction": "Take Accessible Elevator down directly onto Platform 10 (approx. 12m)", "edge_type": "elevator", "distance_m": 12, "is_accessible": True},
            {"step_number": 9, "instruction": "Arrive at destination: Platform 10 (Central Fast Southbound to CSMT).", "edge_type": "walkway", "distance_m": 0, "is_accessible": True}
        ],
        "verification_status": "prototype_data"
    },
    "node_csmt_gate_suburban-node_csmt_pf4-shortest": {
        "success": True,
        "station_id": "csmt",
        "preference_applied": "shortest",
        "explanation": "Shortest indoor route from Walchand Hirachand Marg entrance to Platform 4 buffer apron.",
        "total_distance_m": 85.0,
        "estimated_steps": 113,
        "estimated_time_seconds": 77,
        "is_step_free": True,
        "path_node_ids": ["node_csmt_gate_suburban", "node_csmt_concourse_suburban", "node_csmt_pf4"],
        "steps": [
            {"step_number": 1, "instruction": "Start at Walchand Hirachand Marg Suburban Gate.", "edge_type": "walkway", "distance_m": 0, "is_accessible": True},
            {"step_number": 2, "instruction": "Enter through Walchand Hirachand Marg suburban entrance (approx. 35m)", "edge_type": "walkway", "distance_m": 35, "is_accessible": True},
            {"step_number": 3, "instruction": "Walk along step-free concourse apron to Platform 4 (approx. 50m)", "edge_type": "walkway", "distance_m": 50, "is_accessible": True},
            {"step_number": 4, "instruction": "Arrive at Platform 4 (Suburban Main Line Buffer).", "edge_type": "walkway", "distance_m": 0, "is_accessible": True}
        ],
        "verification_status": "publicly_sourced"
    },
    "node_ghatkopar_gate_metro-node_ghatkopar_pf1-avoid_stairs": {
        "success": True,
        "station_id": "ghatkopar",
        "preference_applied": "avoid_stairs",
        "explanation": "Step-free accessible interchange from Metro Line 1 turnstiles via elevator to Platform 1.",
        "total_distance_m": 54.0,
        "estimated_steps": 72,
        "estimated_time_seconds": 74,
        "is_step_free": True,
        "path_node_ids": ["node_ghatkopar_gate_metro", "node_ghatkopar_deck_metro", "node_ghatkopar_elevator_metro", "node_ghatkopar_pf1"],
        "steps": [
            {"step_number": 1, "instruction": "Start at Metro Line 1 Elevated Concourse Gate.", "edge_type": "walkway", "distance_m": 0, "is_accessible": True},
            {"step_number": 2, "instruction": "Pass through Metro Line 1 fare turnstiles onto elevated interchange concourse (approx. 25m)", "edge_type": "walkway", "distance_m": 25, "is_accessible": True},
            {"step_number": 3, "instruction": "Proceed to Metro interchange accessible elevator (approx. 15m)", "edge_type": "walkway", "distance_m": 15, "is_accessible": True},
            {"step_number": 4, "instruction": "Take accessible lift down directly onto Platform 1 (approx. 14m)", "edge_type": "elevator", "distance_m": 14, "is_accessible": True},
            {"step_number": 5, "instruction": "Arrive at Platform 1 (Central Slow Northbound).", "edge_type": "walkway", "distance_m": 0, "is_accessible": True}
        ],
        "verification_status": "publicly_sourced"
    },
    "node_thane_gate_satis-node_thane_pf1-shortest": {
        "success": True,
        "station_id": "thane",
        "preference_applied": "shortest",
        "explanation": "Route from elevated SATIS bus deck down ramp and bridge onto Platform 1.",
        "total_distance_m": 98.0,
        "estimated_steps": 131,
        "estimated_time_seconds": 89,
        "is_step_free": False,
        "path_node_ids": ["node_thane_gate_satis", "node_thane_satis_deck", "node_thane_ramp_satis", "node_thane_fob_central_west", "node_thane_stairs_pf1_2", "node_thane_pf1"],
        "steps": [
            {"step_number": 1, "instruction": "Start at Elevated SATIS Deck Bus Terminal Entrance.", "edge_type": "walkway", "distance_m": 0, "is_accessible": True},
            {"step_number": 2, "instruction": "Alight at elevated SATIS bus terminal platform deck (approx. 20m)", "edge_type": "walkway", "distance_m": 20, "is_accessible": True},
            {"step_number": 3, "instruction": "Walk towards accessible ramp connection (approx. 20m)", "edge_type": "walkway", "distance_m": 20, "is_accessible": True},
            {"step_number": 4, "instruction": "Descend gradual accessible ramp directly onto Central FOB bridge deck (approx. 25m)", "edge_type": "ramp", "distance_m": 25, "is_accessible": True},
            {"step_number": 5, "instruction": "Approach Platform 1/2 stair landing on FOB (approx. 15m)", "edge_type": "walkway", "distance_m": 15, "is_accessible": True},
            {"step_number": 6, "instruction": "Descend stairs from FOB down onto Platform 1 (approx. 18m)", "edge_type": "stairs", "distance_m": 18, "is_accessible": False},
            {"step_number": 7, "instruction": "Arrive at Platform 1 (Slow Northbound).", "edge_type": "walkway", "distance_m": 0, "is_accessible": True}
        ],
        "verification_status": "publicly_sourced"
    },
    "node_kalyan_gate_west-node_kalyan_pf4-shortest": {
        "success": True,
        "station_id": "kalyan",
        "preference_applied": "shortest",
        "explanation": "Direct route from West Bus Depot Entrance via South FOB to Express Platform 4.",
        "total_distance_m": 130.0,
        "estimated_steps": 173,
        "estimated_time_seconds": 118,
        "is_step_free": False,
        "path_node_ids": ["node_kalyan_gate_west", "node_kalyan_concourse_west", "node_kalyan_stairs_fob_west", "node_kalyan_fob_south_west", "node_kalyan_fob_south_mid", "node_kalyan_stairs_pf4_5", "node_kalyan_pf4"],
        "steps": [
            {"step_number": 1, "instruction": "Start at West Entrance (Kalyan Bus Depot & Market area).", "edge_type": "walkway", "distance_m": 0, "is_accessible": True},
            {"step_number": 2, "instruction": "Enter West Concourse from Kalyan Bus Depot & Market area (approx. 25m)", "edge_type": "walkway", "distance_m": 25, "is_accessible": True},
            {"step_number": 3, "instruction": "Approach West staircase to South FOB (approx. 18m)", "edge_type": "walkway", "distance_m": 18, "is_accessible": True},
            {"step_number": 4, "instruction": "Climb West staircase onto South FOB deck (approx. 16m)", "edge_type": "stairs", "distance_m": 16, "is_accessible": False},
            {"step_number": 5, "instruction": "Walk east along South FOB deck towards Platform 4/5 (approx. 45m)", "edge_type": "fob", "distance_m": 45, "is_accessible": True},
            {"step_number": 6, "instruction": "Approach Platform 4/5 stairway landing (approx. 12m)", "edge_type": "walkway", "distance_m": 12, "is_accessible": True},
            {"step_number": 7, "instruction": "Descend stairs down onto Platform 4 (approx. 18m)", "edge_type": "stairs", "distance_m": 18, "is_accessible": False},
            {"step_number": 8, "instruction": "Arrive at Platform 4 (Express Northbound to Kasara/Nashik).", "edge_type": "walkway", "distance_m": 0, "is_accessible": True}
        ],
        "verification_status": "publicly_sourced"
    },
    "node_byculla_entrance_east-node_byculla_pf3-shortest": {
        "success": True,
        "station_id": "byculla",
        "preference_applied": "shortest",
        "explanation": "Shortest route from Dr. Ambedkar Road East Entrance via Central FOB to Platform 3.",
        "total_distance_m": 114.0,
        "estimated_steps": 152,
        "estimated_time_seconds": 104,
        "is_step_free": False,
        "path_node_ids": ["node_byculla_entrance_east", "node_byculla_concourse_east", "node_byculla_stairs_fob_east", "node_byculla_fob_span_east", "node_byculla_fob_span_mid", "node_byculla_stairs_pf3_4", "node_byculla_pf3"],
        "steps": [
            {"step_number": 1, "instruction": "Start at East Entrance (Dr. Babasaheb Ambedkar Road).", "edge_type": "walkway", "distance_m": 0, "is_accessible": True},
            {"step_number": 2, "instruction": "Enter East Heritage Booking Hall (approx. 20m)", "edge_type": "walkway", "distance_m": 20, "is_accessible": True},
            {"step_number": 3, "instruction": "Approach East staircase to Central FOB (approx. 18m)", "edge_type": "walkway", "distance_m": 18, "is_accessible": True},
            {"step_number": 4, "instruction": "Climb East staircase to Central FOB deck (approx. 15m)", "edge_type": "stairs", "distance_m": 15, "is_accessible": False},
            {"step_number": 5, "instruction": "Walk west along Central FOB deck across tracks (approx. 35m)", "edge_type": "fob", "distance_m": 35, "is_accessible": True},
            {"step_number": 6, "instruction": "Approach Platform 3/4 stairway landing on FOB (approx. 10m)", "edge_type": "walkway", "distance_m": 10, "is_accessible": True},
            {"step_number": 7, "instruction": "Descend stairs from FOB down onto Platform 3 (approx. 16m)", "edge_type": "stairs", "distance_m": 16, "is_accessible": False},
            {"step_number": 8, "instruction": "Arrive at Platform 3 (Central Fast Northbound).", "edge_type": "walkway", "distance_m": 0, "is_accessible": True}
        ],
        "verification_status": "publicly_sourced"
    }
}

content = (
    "// Client-side fallback dataset ensuring 100% resilient demonstration mode\n"
    f"export const FALLBACK_STATIONS = {json.dumps(stations, indent=2)};\n\n"
    f"export const FALLBACK_FACILITIES = {json.dumps(facilities, indent=2)};\n\n"
    f"export const FALLBACK_DADAR_FACILITIES = FALLBACK_FACILITIES['dadar'];\n\n"
    f"export const FALLBACK_GRAPHS = {json.dumps(graphs, indent=2)};\n\n"
    f"export const FALLBACK_DADAR_GRAPH = FALLBACK_GRAPHS['dadar'];\n\n"
    f"export const DEMO_FALLBACK_ROUTES = {json.dumps(demo_routes, indent=2)};\n"
)

with open(frontend_data / "fallbackData.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Generated frontend/src/data/fallbackData.js successfully!")
