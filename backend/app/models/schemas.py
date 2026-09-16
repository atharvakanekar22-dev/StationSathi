from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Station(BaseModel):
    station_id: str
    name: str
    code: str
    network: str = "Central Railway"
    description: str
    coverage: str  # "detailed_prototype" or "basic_station_info"
    coverage_label: str
    map_type: str  # "interactive_svg" or "schematic_overview"
    platforms_count: int
    entrances: List[str]
    facilities_summary: List[str]
    verification_status: str = "prototype_data"
    is_official: bool = False
    source_method: str = "Public transit open data & local survey cross-reference"
    last_updated: str = "2025-02-15"

class Facility(BaseModel):
    facility_id: str
    station_id: str
    station_name: str
    station_code: str
    name: str
    category: str  # washroom, shoepolish, ticket_counter, elevator, stairs, fob, food_stall, drinking_water, help_desk, platform, entrance_exit
    floor_level: str
    svg_coords: Optional[Dict[str, float]] = None
    node_id: Optional[str] = None
    availability_status: str = "operational"
    verification_status: str = "prototype_data"
    is_official: bool = False
    last_updated: str = "2025-02-15"
    source_method: str = "OSM Overpass extraction & manual field survey cross-reference"
    notes: Optional[str] = None

class GraphNode(BaseModel):
    id: str
    name: str
    type: str
    x: float
    y: float
    level: str = "Ground"

class GraphEdge(BaseModel):
    id: str
    from_node: str
    to_node: str
    distance_m: float
    edge_type: str  # walkway, stairs, elevator, ramp, fob
    is_accessible: bool = True
    direction: str = "bidirectional"
    description: Optional[str] = None

class StationGraph(BaseModel):
    station_id: str
    nodes: Dict[str, GraphNode]
    edges: List[GraphEdge]

class RouteRequest(BaseModel):
    station_id: str
    origin_node_id: str
    destination_node_id: str
    preference: str = "shortest"  # shortest, avoid_stairs, prefer_elevator, accessible_route

class RouteStep(BaseModel):
    step_number: int
    instruction: str
    from_node: str
    to_node: str
    distance_m: float
    edge_type: str
    is_accessible: bool

class RouteResponse(BaseModel):
    success: bool
    station_id: str
    preference_applied: str
    explanation: str
    total_distance_m: float
    estimated_steps: int
    estimated_time_seconds: int
    is_step_free: bool
    path_node_ids: List[str]
    steps: List[RouteStep]
    warning: Optional[str] = None
    verification_status: str = "prototype_data"

class AssistantQueryRequest(BaseModel):
    query: str
    station_id: str = "dadar"
    current_node_id: Optional[str] = None

class AssistantQueryResponse(BaseModel):
    interpreted_intent: str
    category: Optional[str] = None
    target_platform: Optional[str] = None
    route_preference: Optional[str] = None
    explanation: str
    answer_text: str
    suggested_action: str
    matched_facilities: List[Facility] = []
    recommended_destination_node_id: Optional[str] = None
    recommended_origin_node_id: Optional[str] = None
    requires_current_landmark: bool = False
    verification_status: str = "prototype_data"
