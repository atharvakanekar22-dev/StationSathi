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
    for expected_id in ["dadar", "csmt", "byculla", "ghatkopar", "thane", "kalyan"]:
        assert expected_id in station_ids

    # Dadar must be detailed prototype
    dadar = next(s for s in stations if s["station_id"] == "dadar")
    assert dadar["coverage"] == "detailed_prototype"
    assert dadar["is_official"] is False
    assert dadar["verification_status"] == "prototype_data"
    assert dadar["platforms_count"] == 7  # 7 active CR platforms (8 to 14)
    assert "8 to 14" in dadar["platform_information"]

    # All stations must have valid metadata
    for st in stations:
        assert st["is_official"] is False
        assert len(st["entrances"]) > 0
        assert len(st["facilities_summary"]) > 0
        assert st["last_updated"] == "2026-09-19"
        assert st["source_access_date"] == "2026-09-19"

def test_dadar_renumbered_platforms_audit():
    """Verify that obsolete Dadar platform references are completely gone."""
    res_graph = client.get("/api/stations/dadar/graph")
    assert res_graph.status_code == 200
    g = res_graph.json()

    # Obsolete nodes must NOT exist
    assert "node_pf4" not in g["nodes"]
    assert "node_pf5" not in g["nodes"]
    assert "node_pf1" not in g["nodes"]
    assert "node_pf2" not in g["nodes"]

    # Current renumbered nodes MUST exist
    assert "node_pf8" in g["nodes"]
    assert "node_pf9" in g["nodes"]
    assert "node_pf10" in g["nodes"]
    assert "node_pf11" in g["nodes"]
    assert "node_elevator_pf10" in g["nodes"]
    assert "node_elevator_pf11" in g["nodes"]
    assert "node_shoepolish_pf8" in g["nodes"]

    # Facilities audit
    res_fac = client.get("/api/stations/dadar/facilities")
    assert res_fac.status_code == 200
    facs = res_fac.json()
    fac_ids = [f["facility_id"] for f in facs]
    assert "dadar_pf_04" not in fac_ids
    assert "dadar_pf_05" not in fac_ids
    assert "dadar_pf_10" in fac_ids
    assert "dadar_pf_11" in fac_ids
    assert "dadar_pf_08" in fac_ids

def test_graph_endpoints_all_six_stations():
    """Verify that all six stations have valid graph topology models."""
    for sid in ["dadar", "csmt", "byculla", "ghatkopar", "thane", "kalyan"]:
        res = client.get(f"/api/stations/{sid}/graph")
        assert res.status_code == 200, f"Graph for {sid} should be available."
        data = res.json()
        assert data["station_id"] == sid
        assert len(data["nodes"]) >= 10, f"Station {sid} must have at least 10 nodes."
        assert len(data["edges"]) >= 10, f"Station {sid} must have at least 10 edges."

def test_dijkstra_route_dadar_east_to_pf11():
    """Test standard shortest route to Platform 11 (former Platform 5)."""
    payload = {
        "station_id": "dadar",
        "origin_node_id": "node_entrance_east",
        "destination_node_id": "node_pf11",
        "preference": "shortest"
    }
    response = client.post("/api/navigation/route", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["total_distance_m"] > 0
    assert data["path_node_ids"][0] == "node_entrance_east"
    assert data["path_node_ids"][-1] == "node_pf11"

def test_dadar_accessibility_route_avoid_stairs_pf10():
    """Test step-free route to Platform 10 (former Platform 4) avoiding all stairs."""
    payload = {
        "station_id": "dadar",
        "origin_node_id": "node_entrance_east",
        "destination_node_id": "node_pf10",
        "preference": "avoid_stairs"
    }
    response = client.post("/api/navigation/route", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["is_step_free"] is True
    step_types = [s["edge_type"] for s in data["steps"]]
    assert "stairs" not in step_types
    assert "elevator" in step_types
    assert "node_elevator_east" in data["path_node_ids"]
    assert "node_elevator_pf10" in data["path_node_ids"]

def test_csmt_route_suburban_to_pf4():
    """Test CSMT route from Suburban gate to Platform 4 buffer apron."""
    payload = {
        "station_id": "csmt",
        "origin_node_id": "node_csmt_gate_suburban",
        "destination_node_id": "node_csmt_pf4",
        "preference": "shortest"
    }
    response = client.post("/api/navigation/route", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["path_node_ids"][-1] == "node_csmt_pf4"

def test_ghatkopar_metro_interchange_accessible_route():
    """Test Ghatkopar step-free transfer from Metro 1 turnstiles down to Platform 1."""
    payload = {
        "station_id": "ghatkopar",
        "origin_node_id": "node_ghatkopar_gate_metro",
        "destination_node_id": "node_ghatkopar_pf1",
        "preference": "avoid_stairs"
    }
    response = client.post("/api/navigation/route", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["is_step_free"] is True
    assert "node_ghatkopar_elevator_metro" in data["path_node_ids"]

def test_thane_satis_accessible_ramp_route():
    """Test Thane route from SATIS elevated bus deck via ramp to Platform 1."""
    payload = {
        "station_id": "thane",
        "origin_node_id": "node_thane_gate_satis",
        "destination_node_id": "node_thane_pf1",
        "preference": "shortest"
    }
    response = client.post("/api/navigation/route", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "node_thane_ramp_satis" in data["path_node_ids"]

def test_kalyan_route_west_to_pf4():
    """Test Kalyan route from West entrance to Express Platform 4."""
    payload = {
        "station_id": "kalyan",
        "origin_node_id": "node_kalyan_gate_west",
        "destination_node_id": "node_kalyan_pf4",
        "preference": "shortest"
    }
    response = client.post("/api/navigation/route", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["path_node_ids"][-1] == "node_kalyan_pf4"

def test_nlp_platform10_dadar_query():
    """Verify that asking for Platform 10 resolves to node_pf10."""
    payload = {
        "query": "How do I reach Platform 10?",
        "station_id": "dadar",
        "current_node_id": "node_entrance_east"
    }
    response = client.post("/api/assistant/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["recommended_destination_node_id"] == "node_pf10"
    assert "Platform 10" in data["target_platform"]

def test_nlp_platform11_without_stairs():
    """Verify accessibility query to Platform 11 avoids stairs."""
    payload = {
        "query": "Take me to Platform 11 without stairs",
        "station_id": "dadar",
        "current_node_id": "node_entrance_east"
    }
    response = client.post("/api/assistant/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["interpreted_intent"] == "accessibility_route"
    assert data["route_preference"] == "avoid_stairs"
    assert data["recommended_destination_node_id"] == "node_pf11"

def test_nlp_nearest_facility_requires_landmark():
    """Rule: 'nearest' query without current location must prompt user for landmark."""
    payload = {
        "query": "Where is the nearest washroom?",
        "station_id": "dadar"
    }
    response = client.post("/api/assistant/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["requires_current_landmark"] is True
    assert data["suggested_action"] == "select_landmark"

def test_nlp_nearest_facility_with_landmark_calculates_distance():
    """Rule: 'nearest' query with current location returns ranked nearest facility."""
    payload = {
        "query": "Where is the nearest washroom?",
        "station_id": "dadar",
        "current_node_id": "node_entrance_east"
    }
    response = client.post("/api/assistant/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["interpreted_intent"] == "nearest_facility"
    assert data["recommended_destination_node_id"] == "node_washroom_east"
    assert data["requires_current_landmark"] is False

def test_invalid_station_handling():
    res = client.get("/api/stations/andheri")
    assert res.status_code == 404

def test_invalid_facility_handling():
    res = client.get("/api/stations/dadar/facilities/invalid_fac_999")
    assert res.status_code == 404

def test_invalid_route_node_handling():
    payload = {
        "station_id": "dadar",
        "origin_node_id": "non_existent_origin",
        "destination_node_id": "node_pf10",
        "preference": "shortest"
    }
    res = client.post("/api/navigation/route", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is False
    assert "Invalid landmark" in data.get("warning", "")

def test_submit_user_feedback():
    """Test commuter feedback submission queue."""
    payload = {
        "station_id": "dadar",
        "item_id": "dadar_fac_washroom_east",
        "issue_type": "facility_unavailable",
        "description": "Cleaning in progress between 2-3 PM",
        "timestamp": "2026-09-19T10:00:00Z"
    }
    res = client.post("/api/feedback", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "report_id" in data
    assert "queued" in data["message"]

def test_feedback_queue():
    """Test retrieving feedback queue."""
    res = client.get("/api/feedback/queue")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0


