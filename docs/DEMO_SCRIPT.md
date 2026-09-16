# StationSathi 5–7 Minute Live Demonstration Script

This script guides presenters through an end-to-end hackathon demonstration of StationSathi.

---

## Pre-Demo Checklist
- [ ] Backend running on `http://127.0.0.1:8000` (`python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000`).
- [ ] Frontend running on `http://localhost:5173` (`cmd.exe /c npm.cmd run dev`).
- [ ] Status indicator in header displays **FastAPI Live** (green dot).
- [ ] Browser zoom set to 100% or comfortable display size.

---

## Step-by-Step Presentation Flow

### Minute 0:00 – 1:00: Problem & Project Intro
1. **Screen**: Landing page (`http://localhost:5173/`).
2. **Talking Points**:
   > "Judges and commuters alike know the challenge: You reach Dadar or CSMT with 6 minutes before your train, and outdoor GPS is completely useless indoors. Where is the elevator? Which bridge has no stairs if you're carrying two heavy suitcases? Where can you get your shoes polished before an interview?"
   > "Introducing **StationSathi: Intelligent Railway Station Assistant for Mumbai Central Railway**. Our tagline is *'Find your way inside the station.'*"
3. **Action**: Click **Explore Interactive Prototype (Dadar)** or click the Dadar station card.

---

### Minute 1:00 – 2:00: Station Dashboard & SVG Map Orientation
1. **Screen**: Dadar Central Station Dashboard.
2. **Talking Points**:
   > "Here is our custom 2D SVG station map for Dadar Central (DR). It is not a generic Google Maps tile or an external proprietary SDK. It models the actual physical layout: the East Main Concourse on Swami Gyan Jivandas Marg, the 3 major Foot Overbridges (North, Central, South), and the suburban/express platforms."
3. **Action**:
   - Pan by dragging the mouse across the canvas.
   - Zoom in using the `+` button or mouse wheel to show platform safety yellow lines and track beds.
   - Click the **Legend** button to briefly show the facility color codes (WC, Shoe-Shine, Elevators, Ticketing).

---

### Minute 2:00 – 3:00: Facility Discovery & Shoe-Polishing Kiosks (Scenarios 1 & 2)
1. **Action (Scenario 1)**:
   - In the Search input, type `"washroom"`.
   - The map filters to the East Concourse Washroom Complex. Click it.
2. **Talking Points**:
   > "Notice the verification badge: *Prototype Data*. We do not claim official railway endorsement. Every facility record specifies the level, availability status, and provenance notes—including Divyangjan accessible stalls."
3. **Action (Scenario 2)**:
   - In the search bar or category pills, click **Shoe Polish** (or open Demo Scenarios and click Scenario 2).
   - Point to the traditional shoe-polishing kiosk located under the East FOB staircase and on Platform 2.
   > "StationSathi maps micro-amenities that regular transit apps overlook: licensed shoe-shine stands, potable water vending machines, and RPF help desks."

---

### Minute 3:00 – 4:15: Graph Navigation & Accessibility-Aware Routing (Scenarios 3 & 4)
1. **Action (Scenario 3 - Shortest Route)**:
   - In the Route Planner:
     - Select current landmark: **East Entrance (Dadar TT)**.
     - Select destination: **Platform 5 (Mainline & Express)**.
     - Select preference: **Shortest route**.
   - Click **Calculate Indoor Route**.
2. **Talking Points**:
   > "Notice the path drawn dynamically using Dijkstra's algorithm. It guides the passenger from the East Entrance, up the Central FOB staircase, across the span, and down to Platform 5. Total distance: 127 meters, approximately 169 steps (~0.75m/stride), taking ~115 seconds. Notice the warning badge: *Involves flight of stairs*."
3. **Action (Scenario 4 - Accessibility Route)**:
   - Change Destination to **Platform 4 (Central Fast Southbound)**.
   - Change Preference to **Avoid stairs** (or click Scenario 4 in the Demo Controller).
   - Click **Calculate Indoor Route**.
4. **Talking Points**:
   > "Look at what happened to the route: The engine strictly excluded all stairwells. Instead of climbing stairs, it routes the passenger into the Central FOB Accessible Elevator, across the bridge deck, and down via the Platform 4 Elevator! Notice the Step-Free verified badge."

---

### Minute 4:15 – 5:30: Grounded Natural-Language Assistant
1. **Action**: Click the **Assistant** button in the header.
2. **Action**: Click the prompt chip: *"Where can I polish my shoes?"* (or type it in).
3. **Talking Points**:
   > "Our assistant doesn't invent answers or hallucinate. Watch the query breakdown card:
   > - Intent: `facility_search`
   > - Category: `shoepolish`
   > - Station: `Dadar`
   > - Action: `Show mapped facilities`
   > It immediately locates the two licensed kiosks at Dadar."
4. **Action**: Try: *"Reach Platform 4 without using stairs"*.
   > "The assistant detects the target platform AND the stair-avoidance constraint, and offers one-click navigation directly onto the map."

---

### Minute 5:30 – 6:30: Station Switching & Coverage Transparency (Scenario 5)
1. **Action**: Use the header station dropdown to switch from **Dadar** to **Thane**.
2. **Talking Points**:
   > "Notice the interface changes cleanly. The coverage badge now reads: *Basic station information*. We don't pretend to have indoor navigation graphs for stations we haven't surveyed yet. We provide verified entrance/exit directories, platform counts, and public facility records for Byculla, CSMT, Ghatkopar, Thane, and Kalyan."

---

### Minute 6:30 – 7:00: Architecture & Wrap-Up
1. **Talking Points**:
   > "To recap the architecture: A FastAPI Python backend running authoritative Dijkstra graph routing and intent classification, coupled with a responsive React frontend and a clean JSON repository ready for PostgreSQL/PostGIS. If the network drops, the app features an offline prototype fallback so commuters are never stranded."
   > "Thank you! We welcome any questions on StationSathi."
