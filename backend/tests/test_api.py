import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["authoritative"] is True

def test_list_all_six_stations():
    response = client.get("/api/stations")
    assert response.status_code == 200
    stations = response.json()
    assert len(stations) == 6
    station_ids = [s["station_id"] for s in stations]
    assert "dadar" in station_ids
    assert "csmt" in station_ids
    assert "byculla" in station_ids
    assert "ghatkopar" in station_ids
    assert "thane" in station_ids
    assert "kalyan" in station_ids

    # Dadar must be detailed prototype
    dadar = next(s for s in stations if s["station_id"] == "dadar")
    assert dadar["coverage"] == "detailed_prototype"
    assert dadar["is_official"] is False
    assert dadar["verification_status"] == "prototype_data"

    # Other 5 must be basic station info
    for sid in ["csmt", "byculla", "ghatkopar", "thane", "kalyan"]:
        st = next(s for s in stations if s["station_id"] == sid)
        assert st["coverage"] == "basic_station_info"
        assert st["is_official"] is False

def test_dadar_facilities():
    response = client.get("/api/stations/dadar/facilities")
    assert response.status_code == 200
    facs = response.json()
    assert len(facs) >= 8

    # Category filter: shoepolish
    res_shoe = client.get("/api/stations/dadar/facilities?category=shoepolish")
    assert res_shoe.status_code == 200
    shoes = res_shoe.json()
    assert len(shoes) >= 2
    assert all(s["category"] == "shoepolish" for s in shoes)

    # Category filter: washroom
    res_wash = client.get("/api/stations/dadar/facilities?category=washroom")
    assert res_wash.status_code == 200
    washrooms = res_wash.json()
    assert len(washrooms) >= 1
    assert washrooms[0]["category"] == "washroom"
    assert "node_id" in washrooms[0]

def test_graph_endpoints():
    # Dadar has graph
    res_graph = client.get("/api/stations/dadar/graph")
    assert res_graph.status_code == 200
    g = res_graph.json()
    assert "node_entrance_east" in g["nodes"]
    assert "node_pf5" in g["nodes"]
    assert "node_pf4" in g["nodes"]

    # Thane does not have graph (basic coverage)
    res_thane = client.get("/api/stations/thane/graph")
    assert res_thane.status_code == 404

def test_dijkstra_route_east_to_pf5():
    payload = {
        "station_id": "dadar",
        "origin_node_id": "node_entrance_east",
        "destination_node_id": "node_pf5",
        "preference": "shortest"
    }
    response = client.post("/api/navigation/route", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["total_distance_m"] > 0
    assert data["estimated_steps"] > 0
    assert len(data["steps"]) >= 3
    assert data["path_node_ids"][0] == "node_entrance_east"
    assert data["path_node_ids"][-1] == "node_pf5"

def test_accessibility_route_avoid_stairs():
    # Route to Platform 4 with avoid_stairs
    payload = {
        "station_id": "dadar",
        "origin_node_id": "node_entrance_east",
        "destination_node_id": "node_pf4",
        "preference": "avoid_stairs"
    }
    response = client.post("/api/navigation/route", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["is_step_free"] is True
    # Verify elevators were traversed
    step_types = [s["edge_type"] for s in data["steps"]]
    assert "stairs" not in step_types
    assert "elevator" in step_types
    assert "node_elevator_east" in data["path_node_ids"]
    assert "node_elevator_pf4" in data["path_node_ids"]

def test_nlp_shoe_polish_query():
    payload = {
        "query": "Where can I polish my shoes?",
        "station_id": "dadar"
    }
    response = client.post("/api/assistant/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["category"] == "shoepolish"
    assert len(data["matched_facilities"]) >= 1

def test_nlp_nearest_washroom_without_landmark():
    # Rule: cannot claim nearest without selected landmark
    payload = {
        "query": "Find the nearest washroom",
        "station_id": "dadar"
    }
    response = client.post("/api/assistant/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["requires_current_landmark"] is True
    assert data["category"] == "washroom"

def test_nlp_reach_platform4_without_stairs():
    payload = {
        "query": "Reach Platform 4 without using stairs",
        "station_id": "dadar",
        "current_node_id": "node_entrance_east"
    }
    response = client.post("/api/assistant/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["interpreted_intent"] == "accessibility_route"
    assert data["route_preference"] == "avoid_stairs"
    assert data["recommended_destination_node_id"] == "node_pf4"
