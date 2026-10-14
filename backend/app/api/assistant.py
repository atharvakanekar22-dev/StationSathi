from fastapi import APIRouter

from app.models.schemas import AssistantQueryRequest, AssistantQueryResponse
from app.services.data_repository import repository
from app.services.nlp_engine import DomainNLPEngine

router = APIRouter(prefix="/assistant", tags=["assistant"])

nlp_engine = DomainNLPEngine(repository)

@router.post("/query", response_model=AssistantQueryResponse)
def query_assistant(req: AssistantQueryRequest):
    """Domain-specific natural-language query interpreter with deterministic fallback."""
    return nlp_engine.interpret_query(req)
