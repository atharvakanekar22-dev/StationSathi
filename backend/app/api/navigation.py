from fastapi import APIRouter, HTTPException

from backend.app.models.schemas import RouteRequest, RouteResponse
from backend.app.services.data_repository import repository
from backend.app.services.graph_engine import NavigationEngine

router = APIRouter(prefix="/navigation", tags=["navigation"])

@router.post("/route", response_model=RouteResponse)
def calculate_route(req: RouteRequest):
    """Calculate indoor route using Dijkstra's algorithm with weighted accessibility preferences."""
    graph = repository.get_station_graph(req.station_id)
    if not graph:
        raise HTTPException(
            status_code=400,
            detail=f"Navigation graph for '{req.station_id}' is not mapped yet (Station is in basic coverage mode)."
        )

    engine = NavigationEngine(graph)
    result = engine.calculate_route(
        origin_id=req.origin_node_id,
        destination_id=req.destination_node_id,
        preference=req.preference
    )
    return result
