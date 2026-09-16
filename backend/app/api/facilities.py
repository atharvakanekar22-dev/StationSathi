from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query

from backend.app.models.schemas import Facility
from backend.app.services.data_repository import repository

router = APIRouter(prefix="/stations/{station_id}/facilities", tags=["facilities"])

@router.get("", response_model=List[Facility])
def list_facilities(
    station_id: str,
    category: Optional[str] = Query(None, description="Filter by category (e.g. washroom, shoepolish, ticket_counter)"),
    search: Optional[str] = Query(None, description="Text search across facility name and notes")
):
    """List station facilities with category and text search filtering."""
    station = repository.get_station_by_id(station_id)
    if not station:
        raise HTTPException(status_code=404, detail=f"Station '{station_id}' not found.")
    return repository.get_facilities_by_station(station_id, category=category, search=search)

@router.get("/{facility_id}", response_model=Facility)
def get_facility(station_id: str, facility_id: str):
    """Retrieve details and verification status for a specific facility."""
    fac = repository.get_facility_by_id(station_id, facility_id)
    if not fac:
        raise HTTPException(status_code=404, detail=f"Facility '{facility_id}' not found at station '{station_id}'.")
    return fac
