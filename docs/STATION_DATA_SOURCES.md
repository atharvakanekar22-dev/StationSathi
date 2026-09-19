# StationSathi: Station Data Source Register & Provenance Catalog

**Document Reference**: `DOC-SATHI-SRC-001`  
**Version**: 2.0.0  
**Last Updated**: September 19, 2026  
**Status**: Authoritative Reference  

---

## 1. Governance & Provenance Policy

StationSathi adheres to a strict **Ground-Truth Data Policy**:
1. **No Hallucination**: AI/LLMs are never permitted to invent station amenities, platform numbers, or accessibility connections.
2. **Provenance Traceability**: Every facility record and station graph in StationSathi contains explicit provenance metadata (`source_method`, `source_reference`, `source_access_date`, `verification_status`).
3. **Transparent Authority Disclaimer**: StationSathi is an independent academic and open-source civic demonstration prototype. It is **not** officially authorized or endorsed by Indian Railways, Central Railway, or the Ministry of Railways.

---

## 2. Comprehensive Source Register

| Source ID | Source Name | Issuing Entity | Reference / Identifier | Access Date | Stations Covered | Confidence | Data Extracted |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| **SRC-CR-01** | Official Platform Renumbering Press Release | Central Railway (CPRO Chhatrapati Shivaji Maharaj Terminus) | PR Ref: `CR/BB/2023/12/03` (Dec 9, 2023) | 2026-09-19 | Dadar (DR) | High | Central Railway Dadar platforms renumbered from 1–6 to 8–14. Former CR Platform 2 surrendered and dismantled. |
| **SRC-CR-02** | Mumbai Division Station Master Directory | Central Railway, Mumbai Division | CR/BB/Comml/StnDir/2024 | 2026-09-19 | CSMT, Byculla, Dadar, Ghatkopar, Thane, Kalyan | High | Platform counts, divisional boundaries, station classification, official station codes. |
| **SRC-OSM-01** | OpenStreetMap Overpass Station Relations | OpenStreetMap Contributors (ODbL) | OSM Relation ID `1058223` (Dadar Junction) | 2026-09-19 | Dadar | Medium | Station perimeter, boundary polylines, major road entrances (Swami Gyan Jivandas Marg, Senapati Bapat Marg). |
| **SRC-OSM-02** | OpenStreetMap Overpass CSMT Layout | OpenStreetMap Contributors (ODbL) | OSM Relation ID `1959779` (CSMT Terminus) | 2026-09-19 | CSMT | Medium | Buffer stop terminus layout, Walchand Hirachand Marg suburban entrance, Star concourse footprint, P. D'Mello gate. |
| **SRC-OSM-03** | OpenStreetMap Byculla Heritage Dataset | OpenStreetMap Contributors (ODbL) | OSM Node ID `245642845` | 2026-09-19 | Byculla | Medium | Heritage entrance building coordinates, Dr. Ambedkar Road gate, Khada Parsi west entrance, Central FOB span. |
| **SRC-OSM-04** | OpenStreetMap Ghatkopar Interchange | OpenStreetMap Contributors (ODbL) | OSM Relation ID `2168532` & Metro Line 1 deck | 2026-09-19 | Ghatkopar | Medium | Middle FOB geometry, Railway-to-Metro skywalk, West LBS Marg entrance, East Pant Nagar entrance. |
| **SRC-OSM-05** | OpenStreetMap Thane Station & SATIS | OpenStreetMap Contributors (ODbL) | OSM Relation ID `1409971` & SATIS structure | 2026-09-19 | Thane | Medium | SATIS elevated bus deck polygon, connecting ramp geometry, West Gokhale Road entrance, East Kopri entrance. |
| **SRC-OSM-06** | OpenStreetMap Kalyan Junction Layout | OpenStreetMap Contributors (ODbL) | OSM Relation ID `1410129` | 2026-09-19 | Kalyan | Medium | West Bus Depot concourse, South FOB span across tracks 1–8, East Kolsewadi gate. |
| **SRC-ORM-01** | OpenRailwayMap Track Alignment Layer | OpenRailwayMap (ODbL / CC-BY-SA) | `railway=rail`, `railway=platform` tags | 2026-09-19 | All 6 Stations | High | Railway track centerlines, switch points, stub buffers (CSMT), island platform separations. |
| **SRC-MMOPL-01** | Mumbai Metro One Multimodal Guide | Mumbai Metro One Pvt Ltd (MMOPL) | Ghatkopar Station Interchange Guide (2024) | 2026-09-19 | Ghatkopar | High | Direct fare-gate transfer deck, passenger elevator connecting Metro concourse to CR Platform 1. |
| **SRC-TMC-01** | SATIS Project Architectural Brief | Thane Municipal Corporation (TMC) / MMRDA | SATIS Elevated Bus Deck Station Plan | 2026-09-19 | Thane | High | Accessible pedestrian ramp connection between elevated bus deck and railway Central FOB. |
| **SRC-SURVEY-01** | StationSathi Physical Concourse Audits | StationSathi Student Research Group | Concourse Audit Reports DR-01, DR-02 | 2025/2026 | Dadar | High | Vertical clearance of Central FOB elevators, shoe-polishing kiosk locations on Platform 8, Divyangjan washroom verification. |

---

## 3. Verification Levels & Taxonomy

StationSathi implements a tripartite verification taxonomy visible to users via UI badges:

```
┌─────────────────────────────────────────────────────────────┐
│                   VERIFICATION TAXONOMY                     │
├──────────────────────┬──────────────────────┬───────────────┤
│   prototype_data     │   publicly_sourced   │   needs_      │
│                      │                      │ verification  │
├──────────────────────┼──────────────────────┼───────────────┤
│ • Validated through  │ • Derived from open  │ • Identified  │
│   physical concourse │   transit registers, │   in partial  │
│   survey & official  │   OSM nodes, and     │   sources but │
│   railway notices.   │   official timetables│   unverified  │
│ • Highest indoor     │ • Schematic accuracy │   on site.    │
│   fidelity.          │ • General guidance   │ • Caution     │
│ • Used for Dadar DR  │ • Used for CSMT, BY, │   flagged to  │
│                      │   GC, TNA, KYN       │   commuters   │
└──────────────────────┴──────────────────────┴───────────────┘
```

---

## 4. Platform Numbering Rationalization Case Study: Dadar (DR)

Commuters in Mumbai frequently experience disorientation at Dadar due to dual-zone operations. The following table formalizes the mapping applied across StationSathi:

| Historic Label | Current Official Designation (Dec 2023–Present) | Operating Zone | Primary Function | StationSathi Node ID |
| :--- | :--- | :---: | :--- | :--- |
| Old WR PF 1–7 | WR Platforms 1 to 7 | Western Railway | Churchgate–Virar suburban corridor | *(WR boundary - outside CR scope)* |
| Old CR PF 1 | **Platform 8** | Central Railway | Suburban Slow Northbound (Thane/Kalyan) | `node_pf8` |
| Old CR PF 2 | **Surrendered** | Central Railway | Trackbed dismantled; absorbed to widen PF 8 | *(Discontinued - do not route)* |
| Old CR PF 3 | **Platform 9** | Central Railway | Suburban Fast Northbound (Kalyan/Karjat) | `node_pf9` |
| Old CR PF 4 | **Platform 10** | Central Railway | Suburban Fast Southbound (Byculla/CSMT) | `node_pf10` |
| Old CR PF 5 | **Platform 11** | Central Railway | 24-Coach Long-Distance Outstation Express | `node_pf11` |
| Old CR PF 6 | **Platform 12** | Central Railway | Outstation Terminus & Express Arrivals | `node_pf12_14` |
| Old CR PF 7 | **Platform 13** | Central Railway | Outstation Terminus (Sainagar/Pune) | `node_pf12_14` |
| Old CR PF 8 | **Platform 14** | Central Railway | Outstation Terminus & Mail Trains | `node_pf12_14` |

---

## 5. Maintenance & Revision Workflow

1. **Quarterly Schedule Audit**: At the start of every railway timetable revision (typically July/October), datasets are cross-checked against Indian Railways NTES updates.
2. **Automated Schema Validation**: Any change to JSON records must execute `python backend/scripts/validate_station_data.py`. Builds are blocked if orphaned nodes, broken edges, or obsolete platform strings are detected.
3. **Crowdsourced Discrepancy Reporting**: Commuters can flag broken facilities or out-of-service elevators, queueing a field survey verification task.
