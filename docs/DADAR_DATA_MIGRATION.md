# Dadar Central (DR) Station Data Migration Report

## Executive Summary

Central Railway (CR) executed a comprehensive renumbering of platforms at Dadar Station effective from **9 December 2023** (Central Railway Press Release Ref: `CR/BB/2023/12/03`). 
Prior to this date, platforms at Dadar were numbered independently between Western Railway (WR platforms 1–7) and Central Railway (CR platforms 1–8), creating severe commuter confusion.

Under the unified numbering scheme:
- Western Railway retained Platforms 1 through 7.
- Central Railway platforms were renumbered consecutively starting from Platform 8 through Platform 14.
- Crucially, **Old Platform 2 on Central Railway was officially surrendered** (discontinued as an active passenger platform, with tracks dismantled and platform space merged to widen the overcrowded Platform 8).

This document establishes the official audit, physical mapping, graph topology migration, facility alignment, scenario updates, and test updates across StationSathi.

---

## 1. Official Platform Numbering Transition

| Old CR Platform | Current CR Platform | Physical Role / Direction | Status & Infrastructure Changes |
|---|---|---|---|
| **Old 1** | **Platform 8** | Down Slow (Northbound towards Thane/Kalyan) | Retained & widened. |
| **Old 2** | **Surrendered** | Formerly Up Slow (Southbound towards CSMT) | **Surrendered by Central Railway**. Track 2 removed; platform widened into Platform 8. |
| **Old 3** | **Platform 9** | Down Fast (Northbound towards Thane/Kalyan) | Island platform with Platform 10. |
| **Old 4** | **Platform 10** | Up Fast (Southbound towards CSMT) | Equipped with elevator to Central FOB. |
| **Old 5** | **Platform 11** | Mainline / Outstation Express Terminal | Equipped with elevator to Central FOB. |
| **Old 6** | **Platform 12** | Outstation Express / Through trains | Island platform with Platform 11. |
| **Old 7** | **Platform 13** | Dadar Terminus (Terminating express rakes) | Long-distance passenger terminal. |
| **Old 8** | **Platform 14** | Dadar Terminus Outstation | Terminus platform on Eastern flank. |

*Total Active Central Railway Platforms:* **7** (Platforms 8, 9, 10, 11, 12, 13, 14).

---

## 2. Graph Node & Edge Migration

In the original prototype graph, nodes and edges erroneously modeled Old CR Platforms 1–6 (focusing on `node_pf1`, `node_pf2`, `node_pf3`, `node_pf4`, `node_pf5`).

### Node Renaming & Identity Mapping

| Old Node ID | Current Node ID | Updated Display Name & Description | Physical Level |
|---|---|---|---|
| `node_pf1` | `node_pf8` | Platform 8 (Central Slow Northbound / Main Suburban) | Platform Level |
| `node_pf2` | *Surrendered / Merged* | Converted into widened Platform 8. Kiosk moved to `node_shoepolish_pf8`. | Platform Level |
| `node_pf3` | `node_pf9` | Platform 9 (Central Fast Northbound to Thane/Kalyan) | Platform Level |
| `node_pf4` | `node_pf10` | Platform 10 (Central Fast Southbound to CSMT) | Platform Level |
| `node_pf5` | `node_pf11` | Platform 11 (Mainline & Express) | Platform Level |
| `node_stairs_pf4` | `node_stairs_pf10` | Platform 10 Stairway from Central FOB | Stairs |
| `node_elevator_pf4` | `node_elevator_pf10` | Platform 10 Accessible Elevator | FOB / Platform Level |
| `node_fob_central_span_pf4` | `node_fob_central_span_pf9_10` | Central FOB Junction (above Platform 9/10) | FOB Level 1 |
| `node_stairs_pf5` | `node_stairs_pf11` | Platform 11 Stairway from Central FOB | Stairs |
| `node_elevator_pf5` | `node_elevator_pf11` | Platform 11 Accessible Elevator | FOB / Platform Level |
| `node_fob_central_span_pf5` | `node_fob_central_span_pf11_12` | Central FOB Junction (above Platform 11/12) | FOB Level 1 |
| `node_stairs_pf2` | `node_stairs_pf8` | Platform 8 Stairway from Central FOB | Stairs |
| `node_fob_central_span_pf2` | `node_fob_central_span_pf8` | Central FOB Junction (above Platform 8) | FOB Level 1 |
| `node_shoepolish_pf2` | `node_shoepolish_pf8` | Shoe-Polishing Service (Platform 8 Mid-Section) | Platform Level |

### Edge Topology Audit

All 32 connecting edges were updated with corrected node references and verified distances:
- **`edge_e12`**: Connects `node_fob_central_span_east` $\leftrightarrow$ `node_fob_central_span_pf11_12` (45.0m, FOB deck).
- **`edge_e14`**: Connects `node_stairs_pf11` $\leftrightarrow$ `node_pf11` (18.0m, Stairs, `is_accessible=false`).
- **`edge_e16`**: Connects `node_elevator_pf11` $\leftrightarrow$ `node_pf11` (12.0m, Elevator, `is_accessible=true`).
- **`edge_e17`**: Connects `node_fob_central_span_pf11_12` $\leftrightarrow$ `node_fob_central_span_pf9_10` (50.0m, FOB deck).
- **`edge_e19`**: Connects `node_stairs_pf10` $\leftrightarrow$ `node_pf10` (18.0m, Stairs, `is_accessible=false`).
- **`edge_e21`**: Connects `node_elevator_pf10` $\leftrightarrow$ `node_pf10` (12.0m, Elevator, `is_accessible=true`).
- **`edge_e22`**: Connects `node_pf10` $\leftrightarrow$ `node_pf9` (12.0m across island platform width).
- **`edge_e23`**: Connects `node_fob_central_span_pf9_10` $\leftrightarrow$ `node_fob_central_span_pf8` (55.0m, FOB deck).
- **`edge_e25`**: Connects `node_stairs_pf8` $\leftrightarrow$ `node_pf8` (18.0m, Stairs, `is_accessible=false`).
- **`edge_e26`**: Connects `node_pf8` $\leftrightarrow$ `node_shoepolish_pf8` (25.0m walkway along Platform 8).

---

## 3. Facility Dataset Changes (`facilities_dadar.json`)

1. **`dadar_pf_10`** (replacing `dadar_pf_04`):
   - Name: "Platform 10 (Central Fast Southbound to CSMT)"
   - Note: Explicitly notes renumbering from Old Platform 4.
2. **`dadar_pf_11`** (replacing `dadar_pf_05`):
   - Name: "Platform 11 (Mainline & Express Terminal)"
   - Note: Explicitly notes renumbering from Old Platform 5.
3. **`dadar_pf_08`** (replacing `dadar_pf_01` & `dadar_pf_02`):
   - Name: "Platform 8 (Central Slow Northbound / Main Suburban)"
   - Note: Explains surrender of former Platform 2 and platform expansion.
4. **`dadar_pf_09`** (replacing `dadar_pf_03`):
   - Name: "Platform 9 (Central Fast Northbound to Thane / Kalyan)"
5. **`dadar_elevator_02`**:
   - Updated name: "Platform 10 Accessible Elevator"
   - Node ID: `node_elevator_pf10`
6. **`dadar_elevator_03`**:
   - Updated name: "Platform 11 Accessible Elevator"
   - Node ID: `node_elevator_pf11`
7. **`dadar_shoepolish_02`**:
   - Updated name: "Shoe-Polishing Stand (Platform 8 Mid-Section)"
   - Node ID: `node_shoepolish_pf8`

---

## 4. Scenario Changes

### Scenario 3: Indoor Navigation (Shortest Route)
- **Previous:** East Entrance $\rightarrow$ Old Platform 5 (`node_pf5`)
- **Current:** East Entrance $\rightarrow$ Current Platform 11 (`node_pf11`)
- **Route:** `node_entrance_east` $\rightarrow$ `node_concourse_east` $\rightarrow$ `node_stairs_fob_east` $\rightarrow$ `node_fob_central_span_east` $\rightarrow$ `node_fob_central_span_pf11_12` $\rightarrow$ `node_stairs_pf11` $\rightarrow$ `node_pf11`

### Scenario 4: Accessibility Route (Avoid Stairs / Step-Free)
- **Previous:** East Entrance $\rightarrow$ Old Platform 4 (`node_pf4`)
- **Current:** East Entrance $\rightarrow$ Current Platform 10 (`node_pf10`)
- **Route:** `node_entrance_east` $\rightarrow$ `node_concourse_east` $\rightarrow$ `node_elevator_east` $\rightarrow$ `node_fob_central_span_east` $\rightarrow$ `node_fob_central_span_pf11_12` $\rightarrow$ `node_fob_central_span_pf9_10` $\rightarrow$ `node_elevator_pf10` $\rightarrow$ `node_pf10` (100% step-free, zero stairs)

---

## 5. Test Suite Updates (`backend/tests/test_api.py`)

- Replaced old assertions on `node_pf4` and `node_pf5` with `node_pf10` and `node_pf11`.
- Added test asserting that obsolete node IDs `node_pf4` and `node_pf5` are completely absent from Dadar's graph.
- Added tests validating that NLP queries for "Platform 10" and "Platform 11 without stairs" resolve to `node_pf10` and `node_pf11`.

---

## 6. Remaining Uncertainties & Field Verification Items

1. **Exact Elevator Operating Status:** Central FOB lifts are frequently serviced. Physical survey is needed to confirm day-to-day uptime.
2. **Platform 12/13 FOB Direct Escalators:** New escalators commissioned near Dadar Terminus South FOB require on-site geo-coordinate recording.
3. **Western Railway Connectivity Nodes:** Western Railway interchange bridge gates (Platforms 1–7) are marked as boundary transition points and not currently routed beyond the footbridge junction.
