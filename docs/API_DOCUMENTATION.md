# StationSathi REST API Documentation

Base URL: `http://127.0.0.1:8000/api`

---

## 1. System Health

### `GET /api/health`
Returns service health and backend authority state.

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "app": "StationSathi Backend",
  "version": "1.0.0",
  "environment": "prototype_demonstration",
  "authoritative": true
}
```

---

## 2. Stations Endpoints

### `GET /api/stations`
Lists all initial 6 stations with their coverage status.

**Response `200 OK`**:
```json
[
  {
    "station_id": "dadar",
    "name": "Dadar Central",
    "code": "DR",
    "network": "Central Railway",
    "description": "Critical multimodal interchange...",
    "coverage": "detailed_prototype",
    "coverage_label": "Detailed navigation prototype",
    "map_type": "interactive_svg",
    "platforms_count": 8,
    "entrances": ["East Entrance (Dadar TT)", "West Entrance (Flower Market)"],
    "facilities_summary": ["8 Platforms", "Central Accessible Elevators"],
    "verification_status": "prototype_data",
    "is_official": false,
    "source_method": "OSM Overpass extraction & manual survey",
    "last_updated": "2025-02-15"
  }
]
```

### `GET /api/stations/{station_id}`
Returns details for a specific station.

### `GET /api/stations/{station_id}/graph`
Returns graph nodes and edges for stations with `detailed_prototype` coverage.

**Response `200 OK` (for Dadar)**:
```json
{
  "station_id": "dadar",
  "nodes": {
    "node_entrance_east": {
      "id": "node_entrance_east",
      "name": "East Entrance (Dadar TT)",
      "type": "entrance",
      "x": 890.0,
      "y": 330.0,
      "level": "Ground Concourse"
    }
  },
  "edges": [
    {
      "id": "edge_e1",
      "from_node": "node_entrance_east",
      "to_node": "node_concourse_east",
      "distance_m": 25.0,
      "edge_type": "walkway",
      "is_accessible": true,
      "direction": "bidirectional",
      "description": "Walk straight into East Main Concourse"
    }
  ]
}
```

---

## 3. Facilities Endpoints

### `GET /api/stations/{station_id}/facilities`
Filters facilities by optional category and keyword search.

**Query Parameters:**
- `category` (optional, string): e.g. `washroom`, `shoepolish`, `elevator`, `ticket_counter`, `food_stall`, `drinking_water`
- `search` (optional, string): text search filter

**Sample Request:**
`GET /api/stations/dadar/facilities?category=shoepolish`

**Response `200 OK`**:
```json
[
  {
    "facility_id": "dadar_shoepolish_01",
    "station_id": "dadar",
    "station_name": "Dadar Central",
    "station_code": "DR",
    "name": "Shoe-Polishing Kiosk (East Concourse)",
    "category": "shoepolish",
    "floor_level": "Ground Concourse",
    "svg_coords": { "x": 820.0, "y": 290.0 },
    "node_id": "node_shoepolish_east",
    "availability_status": "operational",
    "verification_status": "prototype_data",
    "is_official": false,
    "last_updated": "2025-02-15",
    "source_method": "Field verified prototype record",
    "notes": "Traditional station shoe-shine stand with fixed pricing."
  }
]
```

---

## 4. Indoor Navigation Routing

### `POST /api/navigation/route`
Calculates indoor walkable route via Dijkstra's algorithm.

**Request Body:**
```json
{
  "station_id": "dadar",
  "origin_node_id": "node_entrance_east",
  "destination_node_id": "node_pf4",
  "preference": "avoid_stairs"
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "station_id": "dadar",
  "preference_applied": "avoid_stairs",
  "explanation": "Route calculated avoiding all staircases using accessible elevators and level concourses.",
  "total_distance_m": 178.0,
  "estimated_steps": 237,
  "estimated_time_seconds": 212,
  "is_step_free": true,
  "path_node_ids": [
    "node_entrance_east",
    "node_concourse_east",
    "node_elevator_east",
    "node_fob_central_span_east",
    "node_fob_central_span_pf5",
    "node_fob_central_span_pf4",
    "node_elevator_pf4",
    "node_pf4"
  ],
  "steps": [
    {
      "step_number": 1,
      "instruction": "Start at East Entrance (Dadar TT / Swami Gyan Jivandas Marg) (Ground Concourse).",
      "from_node": "node_entrance_east",
      "to_node": "node_entrance_east",
      "distance_m": 0.0,
      "edge_type": "walkway",
      "is_accessible": true
    },
    {
      "step_number": 2,
      "instruction": "Walk straight into East Main Concourse (approx. 25m)",
      "from_node": "node_entrance_east",
      "to_node": "node_concourse_east",
      "distance_m": 25.0,
      "edge_type": "walkway",
      "is_accessible": true
    },
    {
      "step_number": 3,
      "instruction": "Proceed directly to the Central FOB Accessible Elevator (East side) (approx. 22m)",
      "from_node": "node_concourse_east",
      "to_node": "node_elevator_east",
      "distance_m": 22.0,
      "edge_type": "walkway",
      "is_accessible": true
    },
    {
      "step_number": 4,
      "instruction": "Take the Accessible Elevator up to Central FOB Bridge Level (approx. 12m)",
      "from_node": "node_elevator_east",
      "to_node": "node_fob_central_span_east",
      "distance_m": 12.0,
      "edge_type": "elevator",
      "is_accessible": true
    }
  ],
  "warning": null,
  "verification_status": "prototype_data"
}
```

---

## 5. Domain Assistant Query

### `POST /api/assistant/query`
Parses natural language requests into structured intent and coordinates.

**Sample Request 1 (Shoe Polish):**
```json
{
  "query": "Where can I polish my shoes?",
  "station_id": "dadar"
}
```

**Response `200 OK`**:
```json
{
  "interpreted_intent": "facility_search",
  "category": "shoepolish",
  "target_platform": null,
  "route_preference": null,
  "explanation": "Found 2 shoe polish facility record(s) in Dadar.",
  "answer_text": "Found 2 mapped shoe polish facility record(s) at Dadar.",
  "suggested_action": "show_facilities",
  "matched_facilities": [...],
  "recommended_destination_node_id": "node_shoepolish_east",
  "requires_current_landmark": false,
  "verification_status": "prototype_data"
}
```

**Sample Request 2 (Nearest Washroom without landmark):**
```json
{
  "query": "Find the nearest washroom",
  "station_id": "dadar"
}
```

**Response `200 OK`**:
```json
{
  "interpreted_intent": "facility_search",
  "category": "washroom",
  "explanation": "Found 1 washroom facility record(s). Distance ranking requires your current landmark.",
  "answer_text": "Mapped 1 washroom location(s) at Dadar. Please select your current landmark above to calculate exact walking distance and step-by-step directions.",
  "suggested_action": "select_landmark",
  "matched_facilities": [...],
  "recommended_destination_node_id": "node_washroom_east",
  "requires_current_landmark": true,
  "verification_status": "prototype_data"
}
```
