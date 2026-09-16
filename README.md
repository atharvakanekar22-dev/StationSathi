# StationSathi: Intelligent Railway Station Assistant for Mumbai Central Railway

> **"Find your way inside the station."**

StationSathi is a public-transport technology web application designed to help commuters navigate complex Mumbai Central Railway stations. Unlike standard transit applications that merely provide train timetables or outdoor GPS driving routes, StationSathi models and navigates the **internal built environment** of railway terminals: platforms, foot overbridges (FOBs), concourses, ticket counters, stairs, accessible elevators, washrooms, drinking water taps, and micro-services like shoe-polishing stands.

---

## 1. Problem Statement

Mumbai suburban railway stations such as Dadar, CSMT, and Thane accommodate millions of daily passengers across multi-tiered layouts spanning multiple foot overbridges, island platforms, and entrances. In this environment:
- Standard outdoor GPS fails indoors due to concrete roofing, overhead steel girders, and electromagnetic interference.
- Commuters with heavy luggage, senior citizens, or persons with disabilities struggle to find step-free paths with working elevators and ramps.
- Essential amenities (washrooms, drinking water, shoe-polishing kiosks, RPF help desks) are difficult to locate during rush hours.

StationSathi addresses this by combining **2D indoor SVG mapping**, **Dijkstra graph-based navigation with accessibility cost constraints**, and a **grounded natural-language query engine**.

---

## 2. Key Features

- **Interactive 2D Station Map (Dadar Central Prototype)**: Custom vector map supporting pan, zoom, clickable facility markers, platform safety lines, and animated route visualization.
- **Indoor Graph Navigation**: Graph model consisting of concourse nodes, FOB junctions, stairways, and elevators connected by weighted walkable edges.
- **Accessibility-Aware Routing**: Dedicated modes including *Avoid stairs* and *Prefer elevator* that enforce step-free paths for passengers with mobility limitations or luggage.
- **Transparent Data Verification Model**: Every facility record maintains explicit provenance metadata (`prototype_data`, `needs_verification`, `publicly_sourced`) with last-updated timestamps.
- **Grounded Assistant**: Natural language query interpreter understanding commuter inquiries (*"Where can I polish my shoes?"*, *"Reach Platform 4 without stairs"*) without hallucinations.
- **Six Station Coverage Model**:
  - **Dadar Central (DR)**: Detailed interactive prototype with walkable graph and facilities.
  - **CSMT, Byculla, Ghatkopar, Thane, Kalyan**: Verified basic station overviews, entrance directories, and facility records with distinct coverage labeling.
- **Resilient Dual-Mode Design**: Authoritative FastAPI backend with automatic client-side fallback mode ensuring a reliable hackathon presentation.
- **Built-in Demo Controller**: Pre-configured scenario launchers and instantaneous demo reset state.

---

## 3. Technology Stack

- **Frontend**: React.js (v19), Vite (v8), Tailwind CSS (v4), Lucide React.
- **Backend**: Python 3.14, FastAPI, Uvicorn, Pydantic v2.
- **Testing**: Pytest, HTTPX TestClient.
- **Navigation Engine**: Dijkstra's algorithm with weighted accessibility cost penalties.
- **Repository Pattern**: Extensible JSON repository abstraction designed for PostgreSQL/PostGIS migration.

---

## 4. System Architecture

```
User Commuter
      │
      ▼
React.js Frontend ──(HTTP REST)──► FastAPI Backend (Authoritative)
   ├── Interactive SVG Canvas          ├── Dijkstra Navigation Engine
   ├── Route Planner & Turn Steps      ├── Domain NLP Interpreter
   ├── Search & Category Discovery     └── Data Repository Layer
   └── Demo Controller & Reset                   │
                                                 ├── stations.json
                                                 ├── facilities_*.json
                                                 └── graph_dadar.json
```

For detailed architecture diagrams and component interactions, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 5. Data Acquisition Strategy

StationSathi employs a hybrid data strategy:
1. **OpenStreetMap & Overpass API**: Geometries for station perimeters, track centerlines, platform boundaries, and verified entrances.
2. **OpenRailwayMap**: Track designation and interchange geometries.
3. **Surveyed Prototype Datasets**: Foot Overbridge dimensions, stairwell landings, accessible elevator shafts, and licensed station vendor locations.
4. **Government Open Data**: Official station codes, line designations, and platform counts.

---

## 6. Data Verification Model & Schema

Every facility record adheres to the following verification model:

```json
{
  "facility_id": "dadar_shoepolish_01",
  "station_id": "dadar",
  "name": "Shoe-Polishing Kiosk (East Concourse)",
  "category": "shoepolish",
  "floor_level": "Ground Concourse",
  "svg_coords": { "x": 820, "y": 290 },
  "node_id": "node_shoepolish_east",
  "availability_status": "operational",
  "verification_status": "prototype_data",
  "is_official": false,
  "source_method": "Field verified prototype record (Railway licensed vendor kiosk)",
  "last_updated": "2025-02-15",
  "notes": "Traditional station shoe-shine stand with fixed pricing."
}
```

Verification status labels:
- `prototype_data`: Digitized for demonstration and research.
- `publicly_sourced`: Extracted directly from OpenStreetMap or open railway portals.
- `needs_verification`: Commuter-observed amenity awaiting ground audit.
- `manually_collected`: Physical on-site survey record.

---

## 7. Database Schema & PostgreSQL Migration

The current prototype utilizes a clean repository pattern (`JsonStationRepository`) backed by structured JSON files. The database abstraction is designed for immediate migration to PostgreSQL with PostGIS extensions.

See [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) for table schemas (`stations`, `facilities`, `graph_nodes`, `graph_edges`) and migration SQL DDL.

---

## 8. Navigation Algorithm & Accessibility Model

Indoor wayfinding utilizes **Dijkstra's shortest path algorithm** with custom edge cost weighting:

- **Shortest Route**: $Cost(e) = distance\_m$
- **Avoid Stairs**: Disallows edges where `edge_type == 'stairs'` ($Cost = \infty$). Prioritizes elevators ($Cost = 0.9 \times distance\_m$).
- **Prefer Elevator**: Adds a 50m penalty and 5x multiplier to stairs ($Cost = 5.0 \times distance\_m + 50$) while reducing elevator weight.
- **Physical Metrics**: User metrics (estimated steps, meters, walk time) always reflect genuine physical distance ($distance\_m$), not artificial penalty costs. Step estimation assumes an average stride length of $0.75\text{ m/step}$.

---

## 9. Natural Language Query Workflow

```
User Query ("Where can I polish my shoes?")
   │
   ▼
[Domain Intent Classifier] ──► Intent: facility_search, Category: shoepolish
   │
   ▼
[Database Lookup] ──────────► Mapped Kiosks at Dadar East Concourse & Platform 2
   │
   ▼
[Structured Response] ──────► Grounded text + One-click map highlight & navigation
```

*Note: The assistant will never claim a facility is the "nearest" unless the commuter has explicitly selected their current starting landmark.*

---

## 10. Project Directory Structure

```
StationSathi/
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI route controllers (stations, facilities, navigation, assistant)
│   │   ├── data/            # Structured JSON datasets for all 6 stations
│   │   ├── models/          # Pydantic schemas
│   │   ├── services/        # Dijkstra graph engine, NLP interpreter, repository layer
│   │   └── main.py          # FastAPI application entrypoint
│   ├── tests/
│   │   └── test_api.py      # Pytest automated API and graph tests
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── public/              # Static icons and assets
│   ├── src/
│   │   ├── components/      # UI components (Map, Search, RoutePlanner, Assistant, etc.)
│   │   ├── data/            # Fallback datasets and scenario definitions
│   │   ├── services/        # API client with fallback handling
│   │   ├── App.jsx          # Root application component
│   │   └── index.css        # Tailwind CSS styles
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── ARCHITECTURE.md      # System architecture and flow diagrams
│   ├── DATA_MODEL.md        # Schema definitions and PostgreSQL migration guide
│   ├── DEMO_SCRIPT.md       # 5–7 minute live presentation guide
│   └── API_DOCUMENTATION.md # REST API endpoint reference
├── .env.example
└── README.md
```

---

## 11. Installation Instructions

### Prerequisites
- **Python 3.10+** (Tested on Python 3.14)
- **Node.js 18+** & **npm**

### Step 1: Clone Repository
```bash
git clone https://github.com/your-org/StationSathi.git
cd StationSathi
```

### Step 2: Set Up Backend Environment
```powershell
# From project root
python -m pip install -r backend/requirements.txt
```

### Step 3: Set Up Frontend Environment
```powershell
# From frontend directory
cd frontend
cmd.exe /c npm.cmd install
cd ..
```

---

## 12. Run Commands (Windows PowerShell / CMD)

### Terminal 1: Launch Backend Server
```powershell
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend runs on: `http://127.0.0.1:8000` (API Docs: `http://127.0.0.1:8000/docs`)*

### Terminal 2: Launch Frontend Application
```powershell
cd frontend
cmd.exe /c npm.cmd run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 13. Running Automated Tests

Execute the full suite of backend and navigation tests:
```powershell
python -m pytest backend/tests/test_api.py -v
```
All 9 test suites validate station coverage, facility search, Dijkstra shortest routes, stair avoidance elevator paths, and NLP queries.

---

## 14. Live Demonstration Scenarios (Module 13)

The application includes an interactive **Demo Controller** accessible via the "Demo Scenarios" button in the header:

| Scenario | Objective | Expected Interaction & Result |
|---|---|---|
| **Scenario 1** | Facility Discovery | Dadar selected -> Search `"washroom"` -> East Concourse Washroom Complex highlighted on map with Divyangjan verification details. |
| **Scenario 2** | Shoe-Polishing Service | Ask *"Where can I polish my shoes?"* -> NLP detects `shoepolish` -> Licensed kiosk displayed with pricing notes. |
| **Scenario 3** | Indoor Navigation | Origin: *East Entrance*, Destination: *Platform 5*, Preference: *Shortest* -> Dijkstra path (127m, ~169 steps) rendered with turn-by-turn guidance. |
| **Scenario 4** | Accessibility Route | Query *"Platform 4 without stairs"* -> Strict stair-free route calculated through Central FOB elevator and Platform 4 lift. |
| **Scenario 5** | Station Switching | Switch station to *Thane* -> Coverage status updates to *Basic station information* with entrance and platform directories. |

For the full spoken presentation script, refer to [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md).

---

## 15. Known Limitations

1. **Station Mapping Breadth**: Full 2D SVG indoor topology and Dijkstra navigation graphs are currently active for Dadar Central (DR). The remaining five stations feature verified basic records.
2. **Dynamic Train Tracking**: Real-time train arrival times and sudden platform changes are intentionally omitted to prevent misleading passengers with unverified data.
3. **Indoor Positioning**: Automated indoor positioning (BLE beacons / Wi-Fi RTT) is not implemented; manual landmark selection is used for reliable origin setting.

---

## 16. Future Scope

- **Indoor Positioning Integration**: Integration of Bluetooth Low Energy (BLE) beacons or QR-code wayfinding points at station pillars.
- **Graph Expansion**: Complete indoor survey and graph generation for CSMT, Thane, Kalyan, Byculla, and Ghatkopar.
- **PostgreSQL / PostGIS Database**: Transition from local JSON repositories to PostgreSQL database backend.
- **Crowd Density Integration**: Integration with historical footfall patterns to recommend less crowded foot overbridges during peak rush hours.

---

## 17. Ethical Considerations & Disclaimers

> **Disclaimer**: StationSathi is an academic research and technology demonstration prototype developed for Mumbai Central Railway commuters. It is **not officially endorsed by or affiliated with Indian Railways or Central Railway**. All facility coordinates, walking routes, and distances are prototype estimates under verification.
