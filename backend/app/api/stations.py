from typing import List
from fastapi import APIRouter, HTTPException

from backend.app.models.schemas import Station, StationGraph
from backend.app.services.data_repository import repository

router = APIRouter(prefix="/stations", tags=["stations"])

@router.get("", response_model=List[Station])
def list_stations():
    """Returns all 6 stations with explicit coverage statuses."""
    return repository.get_all_stations()

@router.get("/{station_id}", response_model=Station)
def get_station(station_id: str):
    """Retrieve metadata and coverage for a specific station."""
    station = repository.get_station_by_id(station_id)
    if not station:
        raise HTTPException(status_code=404, detail=f"Station '{station_id}' not found.")
    return station

@router.get("/{station_id}/graph", response_model=StationGraph)
def get_station_graph(station_id: str):
    """Returns the walkable station graph for detailed prototype stations."""
    graph = repository.get_station_graph(station_id)
    if not graph:
        raise HTTPException(
            status_code=404,
            detail=f"Station graph for '{station_id}' is not available (coverage level is basic)."
        )
    return graph
