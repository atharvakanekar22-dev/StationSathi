from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Station(BaseModel):
    station_id: str
    name: str
    code: str
    network: str = "Central Railway"
    railway_zone: str = "Central Railway"
    division: str = "Mumbai"
    station_type: Optional[str] = None
    description: str
    coverage: str  # "detailed_prototype" or "schematic_navigation"
    coverage_label: str
    map_type: str = "interactive_svg"
    map_accuracy: str = "schematic"  # surveyed, publicly_sourced, schematic, prototype
    platforms_count: int
    platform_information: Optional[str] = None
    entrances: List[str]
    exits: Optional[List[str]] = None
    facilities_summary: List[str]
    confidence_level: Optional[str] = "medium"  # high, medium, low
    verification_status: str = "prototype_data"
    is_official: bool = False
    source_method: str = "Public transit open data & local survey cross-reference"
    source_reference: Optional[str] = None
    source_access_date: Optional[str] = None
    last_updated: str = "2026-09-19"

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
    confidence_level: Optional[str] = "medium"  # high, medium, low
    verification_status: str = "prototype_data"
    is_official: bool = False
    last_updated: str = "2026-09-19"
    source_method: str = "OSM Overpass extraction & manual field survey cross-reference"
    source_reference: Optional[str] = None
    source_access_date: Optional[str] = None
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
    distance_value: Optional[float] = None
    distance_unit: Optional[str] = "meters"
    distance_type: Optional[str] = "estimated"  # measured, estimated, schematic
    distance_source: Optional[str] = None
    distance_confidence: Optional[str] = "medium"  # high, medium, low
    edge_type: str  # walkway, stairs, elevator, ramp, fob, subway
    is_accessible: bool = True
    accessibility_status: Optional[str] = "step_free"  # step_free, stair_access, elevator_assisted, ramp_assisted
    connection_type: Optional[str] = None
    has_stairs: Optional[bool] = False
    has_elevator: Optional[bool] = False
    level_change: Optional[str] = "none"
    direction: str = "bidirectional"
    description: Optional[str] = None
    verification_status: Optional[str] = "prototype_data"

class StationGraph(BaseModel):
    station_id: str
    verification_status: Optional[str] = "prototype_data"
    source_method: Optional[str] = None
    source_reference: Optional[str] = None
    source_access_date: Optional[str] = None
    last_updated: Optional[str] = None
    is_official: Optional[bool] = False
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

class UserFeedbackReport(BaseModel):
    station_id: str
    item_id: Optional[str] = None
    issue_type: str  # facility_unavailable, facility_moved, platform_incorrect, entrance_exit_changed, accessibility_incorrect, other
    description: str
    timestamp: Optional[str] = None

class FeedbackResponse(BaseModel):
    success: bool
    message: str
    report_id: str
