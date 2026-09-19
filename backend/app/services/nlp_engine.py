import re
from typing import Optional, List, Dict, Any

from backend.app.models.schemas import (
    AssistantQueryRequest, AssistantQueryResponse, Facility
)
from backend.app.services.data_repository import StationRepository
from backend.app.services.graph_engine import NavigationEngine

class DomainNLPEngine:
    def __init__(self, repository: StationRepository):
        self.repository = repository

    def interpret_query(self, req: AssistantQueryRequest) -> AssistantQueryResponse:
        q = req.query.lower().strip()
        station_id = req.station_id.lower()
        current_node_id = req.current_node_id

        # 1. Identify Station if explicitly mentioned in query
        if "dadar" in q:
            station_id = "dadar"
        elif "csmt" in q:
            station_id = "csmt"
        elif "byculla" in q:
            station_id = "byculla"
        elif "ghatkopar" in q:
            station_id = "ghatkopar"
        elif "thane" in q:
            station_id = "thane"
        elif "kalyan" in q:
            station_id = "kalyan"

        station_obj = self.repository.get_station_by_id(station_id)
        station_name = station_obj.name if station_obj else station_id.title()
        graph = self.repository.get_station_graph(station_id)

        # Helper to find default entrance node for this station
        default_origin = None
        if graph:
            for nid, node in graph.nodes.items():
                if node.type == "entrance":
                    default_origin = nid
                    break
        if not default_origin:
            default_origin = "node_entrance_east"

        # Check if origin was stated in text (e.g. "I am at East Entrance")
        detected_origin = None
        if graph:
            for nid, node in graph.nodes.items():
                if node.name.lower() in q or (node.type == "entrance" and any(part in q for part in node.name.lower().split() if len(part) > 4)):
                    detected_origin = nid
                    break

        if "east entrance" in q or "east concourse" in q or "east gate" in q:
            if graph and "node_entrance_east" in graph.nodes:
                detected_origin = "node_entrance_east"
            elif graph and f"node_{station_id}_gate_east" in graph.nodes:
                detected_origin = f"node_{station_id}_gate_east"
            elif graph and f"node_{station_id}_entrance_east" in graph.nodes:
                detected_origin = f"node_{station_id}_entrance_east"
        elif "west entrance" in q or "west concourse" in q or "west gate" in q:
            if graph and "node_entrance_west" in graph.nodes:
                detected_origin = "node_entrance_west"
            elif graph and f"node_{station_id}_gate_west" in graph.nodes:
                detected_origin = f"node_{station_id}_gate_west"
            elif graph and f"node_{station_id}_entrance_west" in graph.nodes:
                detected_origin = f"node_{station_id}_entrance_west"

        active_origin = current_node_id or detected_origin

        # Check for avoid stairs / elevator preference
        avoid_stairs = any(phrase in q for phrase in [
            "without stairs", "without using stairs", "avoid stairs", "no stairs",
            "avoiding stairs", "wheelchair", "accessible", "lift only", "step free", "step-free"
        ])
        prefer_elevator = "elevator" in q or "lift" in q

        # 2. Check for Platform destination
        word_numbers = {
            "one": "1", "two": "2", "three": "3", "four": "4", "five": "5",
            "six": "6", "seven": "7", "eight": "8", "nine": "9", "ten": "10",
            "eleven": "11", "twelve": "12", "thirteen": "13", "fourteen": "14",
            "fifteen": "15", "sixteen": "16", "seventeen": "17", "eighteen": "18"
        }
        platform_pattern = r'platform\s*([0-9]+|' + '|'.join(word_numbers.keys()) + r')\b'
        platform_match = re.search(platform_pattern, q)
        target_platform_num = None
        if platform_match:
            raw_val = platform_match.group(1)
            target_platform_num = word_numbers.get(raw_val, raw_val)

        # 3. Detect Categories
        category = None
        if any(w in q for w in ["shoe", "polish", "shine", "cobbler"]):
            category = "shoepolish"
        elif any(w in q for w in ["washroom", "toilet", "restroom", "lavatory", "loo", "urinal"]):
            category = "washroom"
        elif any(w in q for w in ["ticket", "booking", "atvm", "pass", "uts"]):
            category = "ticket_counter"
        elif any(w in q for w in ["food", "snack", "canteen", "tea", "coffee", "ahaar", "eat"]):
            category = "food_stall"
        elif any(w in q for w in ["water", "drinking", "potable", "tap"]):
            category = "drinking_water"
        elif any(w in q for w in ["help", "rpf", "police", "sahayata", "enquiry", "lost"]):
            category = "help_desk"
        elif any(w in q for w in ["elevator", "lift"]):
            category = "elevator"
        elif any(w in q for w in ["entrance", "entry", "exit", "gate"]):
            category = "entrance_exit"

        # Check if query is route planning to a platform
        if target_platform_num:
            # Find matching platform node in graph
            destination_node_id = None
            candidate_node_ids = [
                f"node_pf{target_platform_num}",
                f"node_{station_id}_pf{target_platform_num}"
            ]
            if graph:
                for cid in candidate_node_ids:
                    if cid in graph.nodes:
                        destination_node_id = cid
                        break
                if not destination_node_id:
                    for nid, node in graph.nodes.items():
                        if node.type == "platform" and f"platform {target_platform_num}" in node.name.lower():
                            destination_node_id = nid
                            break

            # Check matching facility
            pf_facilities = self.repository.get_facilities_by_station(station_id, category="platform")
            matched = [f for f in pf_facilities if destination_node_id and f.node_id == destination_node_id]
            if not matched:
                matched = [
                    f for f in pf_facilities
                    if f"platform {target_platform_num}" in f.name.lower() or (f.notes and f"platform {target_platform_num}" in f.notes.lower())
                ]

            if not destination_node_id and matched and matched[0].node_id:
                destination_node_id = matched[0].node_id

            if not destination_node_id:
                return AssistantQueryResponse(
                    interpreted_intent="route_planning",
                    category="platform",
                    target_platform=f"Platform {target_platform_num}",
                    explanation=f"Platform {target_platform_num} is not currently mapped at {station_name}.",
                    answer_text=f"The requested platform (Platform {target_platform_num}) is not currently mapped in StationSathi for {station_name}.",
                    suggested_action="show_facilities",
                    matched_facilities=[],
                    recommended_destination_node_id=None,
                    recommended_origin_node_id=active_origin or default_origin,
                    requires_current_landmark=False,
                    verification_status="prototype_data"
                )

            preference = "avoid_stairs" if avoid_stairs else ("prefer_elevator" if prefer_elevator else "shortest")
            origin_to_use = active_origin or default_origin

            explanation = (
                f"Detected route query to Platform {target_platform_num} at {station_name} with "
                f"{'stair avoidance constraint' if avoid_stairs else 'standard routing'}."
            )

            answer_text = (
                f"Calculated navigation route to Platform {target_platform_num} at {station_name}. "
                f"{'Stairs avoided via accessible elevator/ramp.' if avoid_stairs else 'Shortest walkable path calculated.'}"
            )

            return AssistantQueryResponse(
                interpreted_intent="accessibility_route" if avoid_stairs else "route_planning",
                category="platform",
                target_platform=f"Platform {target_platform_num}",
                route_preference=preference,
                explanation=explanation,
                answer_text=answer_text,
                suggested_action="calculate_route",
                matched_facilities=matched,
                recommended_destination_node_id=destination_node_id,
                recommended_origin_node_id=origin_to_use,
                requires_current_landmark=(active_origin is None),
                verification_status="prototype_data"
            )

        # If Category Detected
        if category:
            matched_facilities = self.repository.get_facilities_by_station(station_id, category=category)

            if not matched_facilities:
                return AssistantQueryResponse(
                    interpreted_intent="facility_search",
                    category=category,
                    explanation=f"No {category.replace('_', ' ')} facilities are mapped for {station_name}.",
                    answer_text=f"The requested facility is not currently mapped in StationSathi for {station_name}.",
                    suggested_action="show_facilities",
                    matched_facilities=[],
                    recommended_destination_node_id=None,
                    recommended_origin_node_id=active_origin or default_origin,
                    requires_current_landmark=False,
                    verification_status="prototype_data"
                )

            # Rule: Do not claim nearest unless current landmark is available!
            if "near" in q or "nearest" in q or "closest" in q:
                if not active_origin:
                    return AssistantQueryResponse(
                        interpreted_intent="facility_search",
                        category=category,
                        explanation=f"Found {len(matched_facilities)} {category.replace('_', ' ')} facility record(s). Distance ranking requires your current landmark.",
                        answer_text=(
                            f"Mapped {len(matched_facilities)} {category.replace('_', ' ')} location(s) at {station_name}. "
                            "Please select your current landmark above to calculate exact walking distance and step-by-step directions."
                        ),
                        suggested_action="select_landmark",
                        matched_facilities=matched_facilities,
                        recommended_destination_node_id=matched_facilities[0].node_id if matched_facilities else None,
                        recommended_origin_node_id=default_origin,
                        requires_current_landmark=True,
                        verification_status=matched_facilities[0].verification_status if matched_facilities else "prototype_data"
                    )
                else:
                    # We have current landmark: calculate distances using graph
                    best_facility = None
                    best_distance = float('inf')

                    if graph:
                        engine = NavigationEngine(graph)
                        for fac in matched_facilities:
                            if fac.node_id:
                                route = engine.calculate_route(active_origin, fac.node_id, preference="shortest")
                                if route.success and route.total_distance_m < best_distance:
                                    best_distance = route.total_distance_m
                                    best_facility = fac

                    if best_facility:
                        return AssistantQueryResponse(
                            interpreted_intent="nearest_facility",
                            category=category,
                            explanation=f"Identified nearest {category.replace('_', ' ')}: {best_facility.name} ({int(best_distance)}m away).",
                            answer_text=(
                                f"The nearest {category.replace('_', ' ')} from your location is {best_facility.name}, "
                                f"approximately {int(best_distance)}m away."
                            ),
                            suggested_action="calculate_route",
                            matched_facilities=[best_facility],
                            recommended_destination_node_id=best_facility.node_id,
                            recommended_origin_node_id=active_origin,
                            requires_current_landmark=False,
                            verification_status=best_facility.verification_status
                        )

            # General facility query without explicit "nearest" or with active origin
            dest_node = matched_facilities[0].node_id if matched_facilities else None
            return AssistantQueryResponse(
                interpreted_intent="facility_search",
                category=category,
                explanation=f"Found {len(matched_facilities)} {category.replace('_', ' ')} location(s) in {station_name}.",
                answer_text=f"Found {len(matched_facilities)} mapped {category.replace('_', ' ')} facility record(s) at {station_name}.",
                suggested_action="show_facilities",
                matched_facilities=matched_facilities,
                recommended_destination_node_id=dest_node,
                recommended_origin_node_id=active_origin or default_origin,
                requires_current_landmark=False,
                verification_status=matched_facilities[0].verification_status if matched_facilities else "prototype_data"
            )

        # General fallback search
        all_facs = self.repository.get_facilities_by_station(station_id, search=q)
        if all_facs:
            return AssistantQueryResponse(
                interpreted_intent="facility_search",
                category="general",
                explanation=f"Keyword match query found {len(all_facs)} result(s).",
                answer_text=f"Showing {len(all_facs)} matching location(s) for '{req.query}' at {station_name}.",
                suggested_action="show_facilities",
                matched_facilities=all_facs,
                recommended_destination_node_id=all_facs[0].node_id if all_facs else None,
                recommended_origin_node_id=active_origin or default_origin,
                requires_current_landmark=False,
                verification_status="prototype_data"
            )

        # Default help
        return AssistantQueryResponse(
            interpreted_intent="station_information",
            category=None,
            explanation="Unrecognized query. Showing available facility categories.",
            answer_text=(
                f"StationSathi provides indoor facility navigation for {station_name}. "
                "You can search for washrooms, shoe-polishing stands, ticket counters, drinking water, elevators, or platforms."
            ),
            suggested_action="show_facilities",
            matched_facilities=[],
            recommended_destination_node_id=None,
            recommended_origin_node_id=active_origin or default_origin,
            requires_current_landmark=False,
            verification_status="prototype_data"
        )
