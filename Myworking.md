# StationSathi: Complete Project Guide & Working Manual (Myworking.md)

Welcome to **StationSathi: Intelligent Railway Station Assistant for Mumbai Central Railway**.
> **Tagline:** *"Find your way inside the station."*

This document provides a complete guide for:
1. How to start the project step-by-step
2. How the system works under the hood
3. How to demonstrate and present it to judges, evaluators, or commuters
4. How to inspect, explain, and demonstrate the database architecture

---

## 1. Step-by-Step Guide: How to Start the Project

StationSathi consists of two parts:
1. **Python FastAPI Backend** (Runs on port `8000`)
2. **React.js + Tailwind CSS Frontend** (Runs on port `5173`)

### Prerequisites Installed on Windows
- **Python 3.10+** (Tested on Python 3.14)
- **Node.js** (v18+ or v20+) & `npm`

---

### Step 1: Open Terminal 1 (Start the Backend)
Open PowerShell or Command Prompt, navigate to the project directory, and run:

```powershell
# Navigate to project root
cd c:\Users\Atharva\OneDrive\Desktop\Projects\GeeksToCode\StationSathi

# Install Python dependencies (only needed the first time)
python -m pip install -r backend/requirements.txt

# Start the FastAPI Backend Server
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

- **Backend URL:** `http://127.0.0.1:8000`
- **Interactive API Documentation (Swagger UI):** `http://127.0.0.1:8000/docs`
- When started, you will see:
  `INFO: Uvicorn running on http://127.0.0.1:8000`

---

### Step 2: Open Terminal 2 (Start the Frontend)
Open a second PowerShell or Command Prompt window:

```powershell
# Navigate to the frontend directory
cd c:\Users\Atharva\OneDrive\Desktop\Projects\GeeksToCode\StationSathi\frontend

# Install dependencies (only needed the first time)
cmd.exe /c npm.cmd install

# Start the Vite Development Server
cmd.exe /c npm.cmd run dev
```

- **Frontend URL:** `http://localhost:5173/`
- Open your browser (Chrome, Edge, or Firefox) and go to: **[http://localhost:5173/](http://localhost:5173/)**

---

### Step 3: Run Automated Verification Tests
To confirm all algorithms, API routes, and graph traversals are working perfectly:

```powershell
cd c:\Users\Atharva\OneDrive\Desktop\Projects\GeeksToCode\StationSathi
python -m pytest backend/tests/test_api.py -v
```
You will see 9 passing tests covering station lists, Dadar facilities, Dijkstra shortest route, stair-free elevator routing, and natural language intent parsing.

---

## 2. How to Show the Project to Others (Demonstration Guide)

When presenting StationSathi in a hackathon, viva, or live demo, follow this structured **5-minute flow**:

### Minute 1: The Problem & Landing Page
1. Open **`http://localhost:5173/`**.
2. **Explain the Core Problem**:
   > *"Standard GPS apps only tell you when your train arrives or show outdoor driving directions. Once you step inside Dadar or CSMT, outdoor GPS fails. You are left guessing: Where is the elevator? Which bridge has no stairs for heavy luggage? Where can I polish my shoes or find drinking water?"*
3. **Show the Station Network**:
   - Scroll down to show all **6 initial stations**: Dadar, CSMT, Byculla, Ghatkopar, Thane, Kalyan.
   - Point out the coverage status badges: **Dadar** is the *Detailed navigation prototype*, while others are clearly marked as *Basic station information* (highlighting honesty in engineering).
4. Click **"Explore Interactive Prototype (Dadar)"**.

---

### Minute 2: Interactive 2D Station Map (Dadar Central)
1. **Explain the Custom Map**:
   > *"This is a custom 2D vector map built for Dadar Central (DR). It represents the actual surveyed layout: West Concourse, East Main Concourse on Swami Gyan Jivandas Marg, Platforms 1 to 6 with safety yellow tactile strips, and the 3 major Foot Overbridges (North, Central, South)."*
2. **Show the Interactions**:
   - **Pan**: Click and drag the map smoothly.
   - **Zoom**: Use the mouse wheel or click `+` and `-` in the top right.
   - **Reset**: Click the maximize button to re-center.
   - **Legend**: Click **Legend** to show the color-coded markers for washrooms, elevators, shoe-polishing stands, and ticket windows.

---

### Minute 3: The 5 Live Demo Scenarios
Click the **"Demo Scenarios"** button in the top header. You can run all 5 scenarios with a single click:

#### Scenario 1: Facility Discovery (Washrooms)
- Click **"Run" on Scenario 1** (or search `"washroom"` in the search bar).
- **Result**: The map immediately highlights the **East Concourse Washroom Complex**.
- Click the marker on the map to show the **Inspector Card**:
  - Name, category, floor level, operational status.
  - **Verification badge**: `Prototype Data`.
  - Explains Divyangjan accessible stalls.

#### Scenario 2: Shoe-Polishing Kiosks
- Click **"Run" on Scenario 2** (or click the **Shoe Polish** filter pill).
- **Result**: Points out the traditional licensed shoe-shine kiosks located under the East FOB staircase and on Platform 2.
- Explain: *"StationSathi maps essential station micro-amenities that big tech map apps ignore."*

#### Scenario 3: Indoor Graph Navigation (Shortest Route)
- Click **"Run" on Scenario 3**.
- Origin: **East Entrance (Dadar TT)**
- Destination: **Platform 5 (Mainline & Express)**
- Preference: **Shortest route**
- **Result**:
  - Dijkstra calculates the shortest path (127 meters, ~169 steps, ~115 seconds).
  - An animated blue glowing line draws the route on the SVG map.
  - The **Directions Panel** gives step-by-step turns with a warning that this route involves stairs.

#### Scenario 4: Accessibility-Aware Routing (Stair-Free Route)
- Click **"Run" on Scenario 4**.
- Origin: **East Entrance**
- Destination: **Platform 4 (Central Fast Southbound)**
- Preference: **Avoid stairs**
- **Result**:
  - The algorithm **strictly eliminates all staircases**.
  - Instead of climbing stairs, it routes the commuter through the **Central FOB Accessible Elevator**, across the bridge deck, and down via the **Platform 4 Elevator**.
  - Displays the green **"Step-Free Route Verified"** badge!

#### Scenario 5: Station Switching & Transparency
- Click **"Run" on Scenario 5** (or use the station dropdown to choose **Thane**).
- **Result**:
  - Shows Thane's verified basic overview, platform count, and entrance directory.
  - Clearly explains: *"Detailed 2D indoor map is active for Dadar Central prototype; Thane is in basic information coverage."*
  - Shows that we do not fabricate fake indoor graphs for unsurveyed stations.

---

### Minute 4: The Natural-Language Station Assistant
1. Click the **"Assistant"** button in the top header.
2. Click any of the prompt chips (e.g., *"Where can I polish my shoes?"* or *"Reach Platform 4 without using stairs"*).
3. **Show the Query Interpretation Breakdown**:
   - **Interpreted Intent**: `facility_search` or `accessibility_route`
   - **Category**: `shoepolish`
   - **Station**: `Dadar`
   - **Action**: `show_facilities` or `calculate_route`
4. Show the **"Honest Distance Rule"**:
   - Ask: *"Find the nearest washroom"*.
   - Because no start location is selected, the assistant honestly explains:
     > *"Mapped 1 washroom location at Dadar. Please select your current landmark above to calculate exact walking distance."*
   - It will **never invent a false distance** without knowing where the commuter is!

---

### Minute 5: Resetting the Demo
At any point during a presentation, click **"Demo Scenarios"** -> **"Reset State"**.
The application immediately resets to a clean state with zero errors.

---

## 3. How to Show and Explain the Database

When a judge or developer asks: *"Where is the data stored, and how does the database work?"*, follow these points:

### Where the Files Are Located
Open the `backend/app/data/` folder in your code editor:
- **`backend/app/data/stations.json`**: Station metadata, platform counts, and coverage labels for all 6 stations.
- **`backend/app/data/facilities_dadar.json`**: Detailed facilities for Dadar Central (washrooms, shoe-shine, elevators, ticketing, food, water).
- **`backend/app/data/graph_dadar.json`**: The walkable topology graph (nodes, (x, y) coordinates, edges, distances in meters, accessibility flags).
- **`backend/app/data/facilities_*.json`**: Basic records for CSMT, Byculla, Ghatkopar, Thane, and Kalyan.

---

### Explain the Hybrid Data Model
Explain that Indian Railways does not offer an official indoor indoor-mapping API. StationSathi uses a **4-tier hybrid data pipeline**:
1. **OpenStreetMap (OSM) & Overpass API**: Station perimeters, platform edges, and public entrance coordinates.
2. **OpenRailwayMap**: Track geometries and rail lines.
3. **On-Site Surveyor Layouts**: Foot overbridges, elevator locations, stairwells, and licensed vendor kiosks.
4. **Data Verification Status Model**: Every record tracks its provenance:
   - `prototype_data`: Digitized for research/demo.
   - `publicly_sourced`: From OpenStreetMap or public railway portals.
   - `needs_verification`: Commuter-reported amenity pending verification.
   - `manually_collected`: Audited by field team.

---

### Show the Live API & Data via Swagger UI
1. In your browser, open **`http://127.0.0.1:8000/docs`**.
2. Expand `GET /api/stations` -> Click **Try it out** -> **Execute**.
   - Show the returned JSON with all 6 stations, coverage badges, and disclaimers.
3. Expand `GET /api/stations/dadar/facilities` -> Filter by category `shoepolish` -> **Execute**.
   - Show the shoe-polishing kiosk record with its `svg_coords`, `node_id`, and `verification_status`.
4. Expand `POST /api/navigation/route` -> Click **Execute** with `preference: "avoid_stairs"`.
   - Show that the server returns `is_step_free: true` and paths containing elevator nodes.

---

### Explain the PostgreSQL / PostGIS Migration Path
When asked about scalability and enterprise database support:
1. Open **[`docs/DATA_MODEL.md`](docs/DATA_MODEL.md)**.
2. Explain the **Repository Pattern**:
   > *"In `backend/app/services/data_repository.py`, we created an abstract interface `StationRepository`. Currently, `JsonStationRepository` reads from structured JSON. To migrate to PostgreSQL, we simply implement `PostgresStationRepository` without changing a single line in the FastAPI controllers or frontend."*
3. Show the complete SQL DDL schema provided in `docs/DATA_MODEL.md` including spatial `GEOMETRY(Point, 4326)` columns for outdoor station gates.

---

## 4. Summary of Project Commands Quick-Reference

| Action | Command | Where to Run |
|---|---|---|
| **Start Backend** | `python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload` | Project root |
| **Start Frontend** | `cmd.exe /c npm.cmd run dev` | `frontend/` directory |
| **Run Tests** | `python -m pytest backend/tests/test_api.py -v` | Project root |
| **Build Frontend** | `cmd.exe /c npm.cmd run build` | `frontend/` directory |
| **Open App** | Visit `http://localhost:5173/` | Web Browser |
| **Open API Docs** | Visit `http://127.0.0.1:8000/docs` | Web Browser |
