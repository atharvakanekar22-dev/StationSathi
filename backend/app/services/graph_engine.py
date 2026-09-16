import heapq
from typing import Dict, List, Optional, Tuple, Set
from backend.app.models.schemas import (
    StationGraph, GraphNode, GraphEdge, RouteResponse, RouteStep
)

class NavigationEngine:
    def __init__(self, graph: StationGraph):
        self.graph = graph
        self.nodes = graph.nodes
        self.adjacency: Dict[str, List[GraphEdge]] = {nid: [] for nid in self.nodes}
        self._build_adjacency()

    def _build_adjacency(self):
        for edge in self.graph.edges:
            if edge.from_node in self.adjacency and edge.to_node in self.adjacency:
                self.adjacency[edge.from_node].append(edge)
                if edge.direction == "bidirectional":
                    # Create reverse edge for traversal
                    rev_edge = GraphEdge(
                        id=f"{edge.id}_rev",
                        from_node=edge.to_node,
                        to_node=edge.from_node,
                        distance_m=edge.distance_m,
                        edge_type=edge.edge_type,
                        is_accessible=edge.is_accessible,
                        direction=edge.direction,
                        description=edge.description
                    )
                    self.adjacency[edge.to_node].append(rev_edge)

    def calculate_route(
        self, origin_id: str, destination_id: str, preference: str = "shortest"
    ) -> RouteResponse:
        if origin_id not in self.nodes or destination_id not in self.nodes:
            return RouteResponse(
                success=False,
                station_id=self.graph.station_id,
                preference_applied=preference,
                explanation="Origin or destination landmark was not found in the station map.",
                total_distance_m=0.0,
                estimated_steps=0,
                estimated_time_seconds=0,
                is_step_free=False,
                path_node_ids=[],
                steps=[],
                warning="Invalid landmark selection."
            )

        if origin_id == destination_id:
            origin_node = self.nodes[origin_id]
            return RouteResponse(
                success=True,
                station_id=self.graph.station_id,
                preference_applied=preference,
                explanation="You are already at the selected destination.",
                total_distance_m=0.0,
                estimated_steps=0,
                estimated_time_seconds=0,
                is_step_free=True,
                path_node_ids=[origin_id],
                steps=[
                    RouteStep(
                        step_number=1,
                        instruction=f"You are currently at {origin_node.name}.",
                        from_node=origin_id,
                        to_node=origin_id,
                        distance_m=0.0,
                        edge_type="walkway",
                        is_accessible=True
                    )
                ]
            )

        # Dijkstra priority queue: (cumulative_cost, current_node_id, path_edges)
        pq: List[Tuple[float, str, List[GraphEdge]]] = [(0.0, origin_id, [])]
        best_costs: Dict[str, float] = {origin_id: 0.0}

        visited: Set[str] = set()

        shortest_path_edges: Optional[List[GraphEdge]] = None

        while pq:
            current_cost, u, path_edges = heapq.heappop(pq)

            if u in visited:
                continue
            visited.add(u)

            if u == destination_id:
                shortest_path_edges = path_edges
                break

            for edge in self.adjacency.get(u, []):
                v = edge.to_node

                # Apply edge constraints based on preference
                edge_weight = self._compute_edge_weight(edge, preference)
                if edge_weight is None:
                    # Edge disallowed (e.g. stairs on avoid_stairs / accessible_route)
                    continue

                new_cost = current_cost + edge_weight

                if v not in best_costs or new_cost < best_costs[v]:
                    best_costs[v] = new_cost
                    heapq.heappush(pq, (new_cost, v, path_edges + [edge]))

        if shortest_path_edges is None:
            if preference in ["avoid_stairs", "accessible_route"]:
                explanation = "No mapped accessible route is currently available for this destination."
            else:
                explanation = "No walkable route found between the selected locations."

            return RouteResponse(
                success=False,
                station_id=self.graph.station_id,
                preference_applied=preference,
                explanation=explanation,
                total_distance_m=0.0,
                estimated_steps=0,
                estimated_time_seconds=0,
                is_step_free=False,
                path_node_ids=[],
                steps=[],
                warning="Route unavailable under chosen constraints."
            )

        # Construct path and directions
        return self._format_route_response(
            origin_id, destination_id, shortest_path_edges, preference
        )

    def _compute_edge_weight(self, edge: GraphEdge, preference: str) -> Optional[float]:
        # Weighted cost model
        dist = edge.distance_m

        if preference == "avoid_stairs":
            if edge.edge_type == "stairs" or not edge.is_accessible:
                return None  # Strictly disallow stairs
            if edge.edge_type == "elevator":
                return dist * 0.9  # Prefer elevator
            return dist

        elif preference == "accessible_route":
            if not edge.is_accessible or edge.edge_type == "stairs":
                return None  # Strictly disallow non-accessible routes
            if edge.edge_type == "elevator":
                return dist * 0.9
            return dist

        elif preference == "prefer_elevator":
            if edge.edge_type == "stairs":
                return dist * 5.0 + 50.0  # Heavily penalize stairs
            if edge.edge_type == "elevator":
                return dist * 0.7  # Strongly favor elevator
            return dist

        else:  # "shortest"
            # Standard distance
            return dist

    def _format_route_response(
        self, origin_id: str, destination_id: str, path_edges: List[GraphEdge], preference: str
    ) -> RouteResponse:
        node_ids = [origin_id]
        total_physical_dist = 0.0
        is_step_free = True
        elevator_count = 0
        steps: List[RouteStep] = []

        step_counter = 1
        origin_node = self.nodes[origin_id]
        dest_node = self.nodes[destination_id]

        steps.append(
            RouteStep(
                step_number=step_counter,
                instruction=f"Start at {origin_node.name} ({origin_node.level}).",
                from_node=origin_id,
                to_node=origin_id,
                distance_m=0.0,
                edge_type="walkway",
                is_accessible=True
            )
        )

        for edge in path_edges:
            step_counter += 1
            node_ids.append(edge.to_node)
            total_physical_dist += edge.distance_m

            if edge.edge_type == "stairs" or not edge.is_accessible:
                is_step_free = False
            if edge.edge_type == "elevator":
                elevator_count += 1

            to_node_name = self.nodes[edge.to_node].name
            instruction = edge.description or f"Proceed to {to_node_name}."

            steps.append(
                RouteStep(
                    step_number=step_counter,
                    instruction=f"{instruction} (approx. {int(edge.distance_m)}m)",
                    from_node=edge.from_node,
                    to_node=edge.to_node,
                    distance_m=edge.distance_m,
                    edge_type=edge.edge_type,
                    is_accessible=edge.is_accessible
                )
            )

        step_counter += 1
        steps.append(
            RouteStep(
                step_number=step_counter,
                instruction=f"Arrive at destination: {dest_node.name}.",
                from_node=destination_id,
                to_node=destination_id,
                distance_m=0.0,
                edge_type="walkway",
                is_accessible=True
            )
        )

        estimated_steps = int(round(total_physical_dist / 0.75))
        # Walking pace: ~1.1 m/s + 25s per elevator
        estimated_seconds = int(round((total_physical_dist / 1.1) + (elevator_count * 25)))

        if preference == "avoid_stairs":
            explanation = "Route calculated avoiding all staircases using accessible elevators and level concourses."
        elif preference == "accessible_route":
            explanation = "Step-free accessible route prioritized for passengers with mobility devices or heavy luggage."
        elif preference == "prefer_elevator":
            explanation = "Elevator-preferred route calculated via Central Foot Overbridge lift."
        else:
            explanation = f"Shortest direct indoor route calculated via Dijkstra's algorithm ({int(total_physical_dist)}m)."

        return RouteResponse(
            success=True,
            station_id=self.graph.station_id,
            preference_applied=preference,
            explanation=explanation,
            total_distance_m=round(total_physical_dist, 1),
            estimated_steps=estimated_steps,
            estimated_time_seconds=estimated_seconds,
            is_step_free=is_step_free,
            path_node_ids=node_ids,
            steps=steps,
            verification_status="prototype_data"
        )
