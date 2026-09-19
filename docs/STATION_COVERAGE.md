# StationSathi: Station Coverage Matrix & Expansion Roadmap

**Document Reference**: `DOC-SATHI-COV-001`  
**Version**: 2.0.0  
**Last Updated**: September 19, 2026  

---

## 1. Coverage Levels & Definitions

StationSathi defines three precise coverage tiers to ensure passenger transparency without inflating dataset claims:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COVERAGE TIERS                                  │
├──────────────────────────┬──────────────────────────┬──────────────────┤
│   detailed_prototype     │   schematic_navigation   │ basic_information│
├──────────────────────────┼──────────────────────────┼──────────────────┤
│ • Full sub-meter graph   │ • Topological routing    │ • Station facts, │
│ • Complete vertical      │   graph with nodes/edges │   platform count,│
│   circulation network    │ • Custom schematic SVG   │   major entrances│
│ • Micro-amenity mapping  │   geometry               │ • No indoor turn │
│ • Validated on-site      │ • Turn-by-turn directions│   routing        │
│ • Dadar Central (DR)     │ • CSMT, BY, GC, TNA, KYN │ • Planned Phase 2│
└──────────────────────────┴──────────────────────────┴──────────────────┘
```

---

## 2. Active Station Coverage Matrix

### 2.1 Dadar Central (DR)
- **Coverage Tier**: `detailed_prototype`
- **Map Type**: Interactive Scalable Vector Graphics (SVG) with pan/zoom.
- **Platform Scope**: 7 active Central Railway platforms (Platforms 8, 9, 10, 11, 12, 13, 14).
  - *Western Railway platforms 1–7 are physically adjacent across the west corridor.*
  - *Former CR Platform 2 was surrendered and trackbed dismantled in Dec 2023.*
- **Topological Graph**: 24 nodes, 32 edges.
- **Vertical Circulation**: 3 Foot Overbridges (North, Central, South), 3 Accessible Elevators (`node_elevator_east`, `node_elevator_pf10`, `node_elevator_pf11`), 6 staircases.
- **Facilities Mapped**: 12 facilities (Platforms 8–14, East & West Concourses, Divyangjan Washrooms, Licensed Shoe-Polish Stands, ATVMs, RPF Help Desk, IRCTC Tea Stall, Water Coolers).
- **Navigation Modes**: Shortest Route, Avoid Stairs (Step-Free via Elevators), Prefer Elevator.

---

### 2.2 Chhatrapati Shivaji Maharaj Terminus (CSMT)
- **Coverage Tier**: `schematic_navigation`
- **Map Type**: Custom Schematic 2D SVG canvas.
- **Platform Scope**: 18 platforms.
  - Platforms 1 to 7: Suburban Main Line & Harbour Line services.
  - Platforms 8 to 18: Long-distance mainline mail and express terminus.
- **Topological Graph**: 19 nodes, 19 edges.
- **Key Features**: Step-free buffer stop apron concourse connecting Walchand Hirachand Marg suburban entrance to Platforms 1, 4, 7 without stairs; Star Concourse ticketing hub; P. D'Mello outstation gate.
- **Facilities Mapped**: 11 facilities.

---

### 2.3 Byculla (BY)
- **Coverage Tier**: `schematic_navigation`
- **Map Type**: Custom Schematic 2D SVG canvas.
- **Platform Scope**: 4 suburban platforms (Platforms 1 to 4).
- **Topological Graph**: 19 nodes, 18 edges.
- **Key Features**: Historic 1853 Heritage Concourse on Dr. Babasaheb Ambedkar Road (East), Khada Parsi entrance (West), Central FOB spanning all 4 tracks.
- **Facilities Mapped**: 10 facilities (Platforms 1–4, Heritage Booking Hall, West Ticket Counter, Divyangjan Washroom, Potable Water Tap, RPF Help Desk, Station Master Office).

---

### 2.4 Ghatkopar (GC)
- **Coverage Tier**: `schematic_navigation`
- **Map Type**: Custom Schematic 2D SVG canvas.
- **Platform Scope**: 4 suburban platforms (Platforms 1 to 4).
- **Topological Graph**: 20 nodes, 21 edges.
- **Key Features**: Multimodal transfer deck connecting Mumbai Metro Line 1 directly to Railway Platform 1 via an **operational step-free elevator**; Middle FOB spanning West LBS Marg and East Pant Nagar.
- **Facilities Mapped**: 11 facilities (Platforms 1–4, Metro Line 1 Interchange Gate & Concourse, Accessible Lift, West & East Booking Counters, Commuter Washrooms, IRCTC Food Counter).

---

### 2.5 Thane (TNA)
- **Coverage Tier**: `schematic_navigation`
- **Map Type**: Custom Schematic 2D SVG canvas.
- **Platform Scope**: 10 platforms (Suburban Main Line, Trans-Harbour Line, and Outstation).
- **Topological Graph**: 23 nodes, 23 edges.
- **Key Features**: Elevated SATIS (Station Area Traffic Improvement Scheme) Bus Terminal on West side with a **direct accessible pedestrian ramp** linking onto Central FOB; West Gokhale Road and East Kopri entrances.
- **Facilities Mapped**: 11 facilities (Platforms 1–10, SATIS Bus Deck, SATIS Ramp, Central FOB, Booking Offices, Washrooms, Shoe Polish Stall, Water Kiosks).

---

### 2.6 Kalyan Junction (KYN)
- **Coverage Tier**: `schematic_navigation`
- **Map Type**: Custom Schematic 2D SVG canvas.
- **Platform Scope**: 8 platforms (Bifurcating North-East / South-East lines and terminus locals).
- **Topological Graph**: 21 nodes, 22 edges.
- **Key Features**: West Bus Depot entrance with a **ground-level accessible entrance ramp**; South FOB spanning all 8 platforms to East Kolsewadi.
- **Facilities Mapped**: 10 facilities (Platforms 1–8, West Bus Depot Gate, West Ramp, South FOB, East Kolsewadi Entrance, Ticket Counters, Divyangjan Facilities).

---

## 3. Future Roadmap & Expansion Targets

```
Phase 1 (Completed):
  Central Railway Core Hubs:
  [x] Dadar Central (DR)
  [x] CSMT
  [x] Byculla (BY)
  [x] Ghatkopar (GC)
  [x] Thane (TNA)
  [x] Kalyan Junction (KYN)

Phase 2 (Target: Q1 2027):
  Harbour Line & Core Central Interchanges:
  [ ] Kurla Junction (CLA) - Harbour / Central Line interchange (8 platforms)
  [ ] Wadala Road (VDLR) - Harbour / Wadala-King's Circle fork
  [ ] Vashi (VSH) - CIDCO commercial concourse integration
  [ ] Panvel (PNVL) - Outstation & Trans-Harbour terminal

Phase 3 (Target: Q3 2027):
  Western Railway High-Density Corridors:
  [ ] Churchgate (CCG) - 4 buffer terminus platforms
  [ ] Mumbai Central (MMCT) - 5 suburban + 5 outstation platforms
  [ ] Andheri (ADH) - 9 platforms + Metro Line 1 + Metro Line 2A interchange
  [ ] Borivali (BVI) - 10 platforms + major outstation halt
```
