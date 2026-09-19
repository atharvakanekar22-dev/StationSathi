# StationSathi Data Model & Verification Schema

StationSathi operates on a **hybrid data strategy** acknowledging that no single free API provides complete, reliable indoor station navigation data for Mumbai suburban railway terminals.

---

## 1. Hybrid Data Architecture

```
OpenStreetMap (OSM)  ──────┐
Overpass API Queries ──────┼──► Ingestion & Normalization Layer ──► Verified Prototype Dataset
Local Field Surveys  ──────┤                                              │
OpenRailwayMap Tags  ──────┘                                              ▼
                                                                Dijkstra Navigation Graph
                                                                + Facility Registry
```

1. **OpenStreetMap / Overpass API**: Station boundaries, platform geometries, major entrances, and publicly mapped ticket windows.
2. **OpenRailwayMap**: Track centerline alignments, platform designations, and rail crossovers.
3. **Surveyed Prototype Corridors**: Station Foot Overbridges (FOBs), concourses, stairs, accessible elevators, and licensed commuter stalls (shoe-polishing kiosks, water taps, IRCTC food stalls).
4. **Verification Layer**: Every facility record maintains an explicit verification state, provenance notes, and last-updated timestamp.

---

## 2. Core Entities & Schemas

### Station Schema

```json
{
  "station_id": "dadar",
  "name": "Dadar Central",
  "code": "DR",
  "network": "Central Railway",
  "railway_zone": "Central Railway",
  "division": "Mumbai",
  "station_type": "Multimodal Interchange Hub",
  "description": "Major suburban and outstation multimodal terminal...",
  "coverage": "detailed_prototype",
  "coverage_label": "Detailed navigation prototype",
  "map_type": "interactive_svg",
  "map_accuracy": "prototype",
  "platforms_count": 7,
  "platform_information": "7 active Central Railway platforms (renumbered 8 to 14 effective 9 Dec 2023). Western Railway operates platforms 1 to 7 separately.",
  "entrances": ["East Entrance (Dadar TT)", "West Entrance (Senapati Bapat Marg)"],
  "exits": ["East Exit", "West Exit", "Central FOB Exit"],
  "facilities_summary": ["7 CR Platforms (8-14)", "Central Accessible Elevators", "Washrooms", "Shoe-Polishing Kiosks"],
  "verification_status": "prototype_data",
  "is_official": false,
  "source_method": "Central Railway station layout renumbering notice (Dec 2023) & surveyed concourse layout",
  "source_reference": "Central Railway Press Release Ref: CR/BB/2023/12/03",
  "source_access_date": "2026-09-19",
  "last_updated": "2026-09-19"
}
```

### Facility Schema

```json
{
  "facility_id": "dadar_shoepolish_01",
  "station_id": "dadar",
  "station_name": "Dadar Central",
  "station_code": "DR",
  "name": "Shoe-Polishing Kiosk (East Concourse)",
  "category": "shoepolish",
  "floor_level": "Ground Concourse",
  "svg_coords": { "x": 820, "y": 290 },
  "node_id": "node_shoepolish_east",
  "availability_status": "operational",
  "verification_status": "prototype_data",
  "is_official": false,
  "last_updated": "2026-09-19",
  "source_method": "Field verified prototype record (Railway licensed vendor kiosk under East FOB stairwell)",
  "source_reference": "Physical Station Audit & Central Railway Commercial Stall Directory",
  "source_access_date": "2026-09-19",
  "notes": "Traditional station shoe-shine stand with fixed pricing regulated by Central Railway."
}
```

### Graph Node Schema

```json
{
  "id": "node_elevator_east",
  "name": "Central FOB Accessible Elevator (East Concourse)",
  "type": "elevator",
  "x": 780.0,
  "y": 330.0,
  "level": "Ground / FOB Level 1"
}
```

### Graph Edge Schema

```json
{
  "id": "edge_e11",
  "from_node": "node_elevator_east",
  "to_node": "node_fob_central_span_east",
  "distance_m": 12.0,
  "edge_type": "elevator",
  "is_accessible": true,
  "direction": "bidirectional",
  "description": "Take the Accessible Elevator up to Central FOB Bridge Level"
}
```

---

## 3. Verification Status Lifecycle

| Status Code | Interface Badge | Definition |
|---|---|---|
| `prototype_data` | **Prototype Data** | Digitized geometry created for hackathon demonstration. |
| `publicly_sourced` | **Publicly Sourced** | Extracted directly from OpenStreetMap or public railway documentation. |
| `manually_collected` | **Manually Collected** | On-the-ground surveyor audit of physical station infrastructure. |
| `needs_verification` | **Needs Verification** | Secondary observation awaiting railway confirmation. |
| `user_reported` | **User Reported** | Commuter-submitted amenity report pending moderation. |
| `temporarily_unavailable`| **Temporarily Unavailable**| Out-of-order lift, under repair washroom, or blocked bridge. |

---

## 4. PostgreSQL / PostGIS Migration Blueprint

To transition from the initial JSON repository to PostgreSQL with spatial capabilities:

### SQL DDL Schema

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Stations Table
CREATE TABLE stations (
    station_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    network VARCHAR(100) DEFAULT 'Central Railway',
    description TEXT,
    coverage VARCHAR(50) NOT NULL,
    coverage_label VARCHAR(100) NOT NULL,
    map_type VARCHAR(50) NOT NULL,
    platforms_count INT NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'prototype_data',
    is_official BOOLEAN DEFAULT FALSE,
    source_method TEXT,
    last_updated DATE DEFAULT CURRENT_DATE,
    geom GEOMETRY(Point, 4326) -- Outdoor station entrance coordinates
);

-- 2. Facilities Table
CREATE TABLE facilities (
    facility_id VARCHAR(100) PRIMARY KEY,
    station_id VARCHAR(50) REFERENCES stations(station_id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    floor_level VARCHAR(50) NOT NULL,
    svg_x DOUBLE PRECISION,
    svg_y DOUBLE PRECISION,
    node_id VARCHAR(100),
    availability_status VARCHAR(50) DEFAULT 'operational',
    verification_status VARCHAR(50) DEFAULT 'prototype_data',
    is_official BOOLEAN DEFAULT FALSE,
    last_updated DATE DEFAULT CURRENT_DATE,
    source_method TEXT,
    notes TEXT
);

-- 3. Navigation Graph Nodes Table
CREATE TABLE graph_nodes (
    node_id VARCHAR(100) PRIMARY KEY,
    station_id VARCHAR(50) REFERENCES stations(station_id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    node_type VARCHAR(50) NOT NULL,
    x DOUBLE PRECISION NOT NULL,
    y DOUBLE PRECISION NOT NULL,
    level VARCHAR(50) DEFAULT 'Ground'
);

-- 4. Navigation Graph Edges Table
CREATE TABLE graph_edges (
    edge_id VARCHAR(100) PRIMARY KEY,
    station_id VARCHAR(50) REFERENCES stations(station_id) ON DELETE CASCADE,
    from_node VARCHAR(100) REFERENCES graph_nodes(node_id),
    to_node VARCHAR(100) REFERENCES graph_nodes(node_id),
    distance_m DOUBLE PRECISION NOT NULL,
    edge_type VARCHAR(50) NOT NULL,
    is_accessible BOOLEAN DEFAULT TRUE,
    direction VARCHAR(20) DEFAULT 'bidirectional',
    description TEXT
);
```

### Migration Process
1. Instantiate the `PostgresStationRepository` conforming to `backend/app/services/data_repository.py:StationRepository`.
2. Seed the relational tables from `backend/app/data/*.json` using SQLAlchemy or asyncpg.
3. Switch the FastAPI dependency injection in `data_repository.py` from `JsonStationRepository` to `PostgresStationRepository`.
