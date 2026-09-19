# StationSathi: Standard On-Site Field Survey Protocol & Template

**Form Identifier**: `STN-SURVEY-V2`  
**Purpose**: Standardized on-site physical auditing protocol for mapping indoor railway station concourses, platforms, vertical circulation, and micro-amenities.  
**Applicability**: Mumbai Suburban Network (Central & Western Railways).

---

## 1. Survey Metadata & Pre-requisites

```
Station Name: ___________________________________ Station Code: [      ]
Railway Zone: [ ] Central Railway  [ ] Western Railway  [ ] Harbour Line
Survey Date (DD/MM/YYYY): ____ / ____ / ________   Time: ____:____ [AM/PM]
Lead Surveyor Name: ____________________________ Contact: ________________
Weather/Lighting Conditions: [ ] Clear  [ ] Heavy Rain  [ ] Night (Artificial)
Crowd Level during Audit:    [ ] Peak Crushing  [ ] Moderate  [ ] Lean/Night
```

### Safety & Code of Conduct
1. **Yellow Safety Line Invariant**: Never step beyond the tactile yellow platform edge line during active train arrivals.
2. **Photography Permissions**: Ensure legitimate station access; do not photograph sensitive signaling relays or RPF security control rooms without permission.
3. **Divyangjan Verification**: Always test elevator emergency alarms, tactile push-buttons, and ramp slopes with a digital inclinometer where available.

---

## 2. Station Entrance & Concourse Audit Form

For each perimeter entrance, complete a record:

| Field | Entrance 1 | Entrance 2 | Entrance 3 |
| :--- | :--- | :--- | :--- |
| **Entrance Name / ID** | | | |
| **Connecting Road / Street** | | | |
| **Floor Level** (Ground / Elevated / Subway) | | | |
| **Step-Free Access Available?** (Yes/No) | | | |
| **Ramp Available?** (Yes/No & Slope if known) | | | |
| **Tactile Guiding Path Present?** (Yes/No) | | | |
| **Direct Ticket Counter / ATVMs?** | | | |
| **Security Scanning / Metal Detector Door?** | | | |
| **Width of Entry Corridor (meters)** | | | |

---

## 3. Platform & Track Geometry Audit Form

| Platform No. (Official) | Platform Type (Island / Side / Buffer) | Line Served (Slow / Fast / Harbour / Express) | Max Train Length (12 / 15 / 24 coach) | Tactile Warning Strip Present? | Direct FOB Connection(s) | Elevator Present on Platform? |
| :---: | :--- | :--- | :---: | :---: | :--- | :---: |
| | | | | [ ] Yes [ ] No | | [ ] Yes [ ] No |
| | | | | [ ] Yes [ ] No | | [ ] Yes [ ] No |
| | | | | [ ] Yes [ ] No | | [ ] Yes [ ] No |
| | | | | [ ] Yes [ ] No | | [ ] Yes [ ] No |

> [!IMPORTANT]
> **Renumbering Invariant**: Inquire with the Station Master / Duty Station Superintendent to verify whether any platform has been recently renumbered or surrendered (e.g., Dadar CR Old Platform 2 surrendered in Dec 2023).

---

## 4. Vertical Circulation Checklist (Bridges, Stairs, Lifts)

### Foot Overbridges (FOB)
- **Bridge Identifier**: `[ North FOB / Middle FOB / South FOB / Skywalk ]`
- **Deck Width (meters)**: ________ m
- **Clearance Height**: Standard railway overhead catenary clearance.
- **Surface Condition**: [ ] Smooth concrete  [ ] Chequered steel tile  [ ] Uneven/Damaged

### Staircases
- **Stair Location / ID**: ___________________________________________
- **Step Count**: ________ steps  |  **Riser Height**: _____ cm  |  **Tread Width**: _____ cm
- **Continuous Handrails**: [ ] Both Sides  [ ] Single Side  [ ] Missing
- **Anti-Slip Grooves / Edges**: [ ] Present & Good  [ ] Worn Out  [ ] None

### Accessible Elevators (Lifts)
- **Elevator ID**: __________________________________________________
- **Connecting Levels**: Level ________ to Level ________
- **Operational Status**: [ ] Fully Operational  [ ] Under Maintenance  [ ] Out of Service
- **Door Clear Opening Width**: ________ cm (Minimum 90 cm required for standard wheelchair)
- **Braille / Embossed Buttons**: [ ] Present  [ ] Absent
- **Audio Voice Annunciation**: [ ] Working  [ ] Inaudible / Absent
- **Dedicated Power Generator Backup**: [ ] Confirmed  [ ] Unconfirmed

### Pedestrian Ramps
- **Ramp Location**: ________________________________________________
- **Gradient**: 1:________ (Ideal standard: 1:12 or gentler)
- **Handrails on Both Sides**: [ ] Yes  [ ] No

---

## 5. Micro-Amenity & Facility Registry

Map all commuter-facing amenities with their nearest landmark or pillar number:

| Category | Facility Name | Nearest Pillar / Landmark | Availability Status | Wheelchair Accessible? | Operational Notes / Verified Fee |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Washroom** | Divyangjan Accessible WC | | [ ] Active [ ] Locked | [ ] Yes [ ] No | Key with Station Master? [ ] Yes |
| **Washroom** | General Ladies / Gents WC | | [ ] Active [ ] Closed | [ ] Yes [ ] No | Pay-and-use (Rs 5) / Free Urinal |
| **Shoe Polish** | Licensed Shoe-Shine Kiosk | | [ ] Active [ ] Closed | [ ] Yes [ ] No | CR licensed badge number: _______ |
| **Drinking Water**| Water Vending Unit (WVU) | | [ ] Active [ ] Defective| [ ] Yes [ ] No | IRCTC subsidized / Potable tap |
| **Ticketing** | ATVM Smart Card / QR Stalls | | [ ] Active [ ] Offline | [ ] Yes [ ] No | Rail-Madad / UPI enabled |
| **Assistance** | Station Sahayata / RPF Desk | | [ ] Staffed [ ] Vacant | [ ] Yes [ ] No | Emergency phone: _______________ |
| **Food / Tea** | IRCTC Ahaar / Jan Ahaar Stall | | [ ] Open [ ] Closed | [ ] Yes [ ] No | Packaged food / Tea counter |

---

## 6. Topological Graph Edge Measurement Sheet

Use a laser distance meter or calibrated rolling wheel. If measuring by stride, calibrate steps against 10-meter baseline:

$$\text{Distance (m)} = \text{Steps} \times \text{Average Stride Length (e.g., } 0.75\text{ m)}$$

| Edge ID | From Node | To Node | Edge Type (`walkway`, `stairs`, `fob`, `elevator`, `ramp`) | Measured Distance (m) | Step Count | Accessible? (`true`/`false`) | Key Landmark or Directional Instruction |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `edge_01` | | | | | | | |
| `edge_02` | | | | | | | |
| `edge_03` | | | | | | | |
| `edge_04` | | | | | | | |
| `edge_05` | | | | | | | |

---

## 7. Quality Assurance & Sign-Off

```
Survey Completed By (Signature): _________________________ Date: ______________
Data Entry Verified By (Developer): ______________________ Date: ______________
Validation Script Result: [ ] validate_station_data.py PASSED (0 Errors)
Assigned Dataset Status:  [ ] prototype_data   [ ] publicly_sourced   [ ] needs_verification
```
