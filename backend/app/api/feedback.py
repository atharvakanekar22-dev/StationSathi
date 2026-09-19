import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from fastapi import APIRouter, HTTPException
from backend.app.models.schemas import UserFeedbackReport, FeedbackResponse

router = APIRouter(prefix="/feedback", tags=["feedback"])

QUEUE_FILE = Path(__file__).resolve().parent.parent / "data" / "feedback_queue.json"

def _ensure_queue_file():
    if not QUEUE_FILE.exists():
        QUEUE_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(QUEUE_FILE, "w", encoding="utf-8") as f:
            json.dump([], f, indent=2)

@router.post("", response_model=FeedbackResponse)
async def submit_feedback(report: UserFeedbackReport):
    """
    Submits passenger feedback / issue reports into a moderation review queue.
    Verified station data is NEVER automatically altered by user submissions.
    """
    if not report.station_id or not report.description.strip():
        raise HTTPException(status_code=400, detail="Station ID and description are required")

    _ensure_queue_file()

    report_id = f"rep_{uuid.uuid4().hex[:8]}"
    record = {
        "report_id": report_id,
        "station_id": report.station_id.lower().strip(),
        "item_id": report.item_id,
        "issue_type": report.issue_type,
        "description": report.description.strip(),
        "timestamp": report.timestamp or datetime.now(timezone.utc).isoformat(),
        "status": "pending_review"
    }

    try:
        with open(QUEUE_FILE, "r", encoding="utf-8") as f:
            queue = json.load(f)
    except Exception:
        queue = []

    queue.append(record)

    with open(QUEUE_FILE, "w", encoding="utf-8") as f:
        json.dump(queue, f, indent=2)

    return FeedbackResponse(
        success=True,
        message="Thank you for reporting. Your feedback has been queued for verification review.",
        report_id=report_id
    )

@router.get("/queue")
async def list_feedback_queue():
    """
    Internal/developer endpoint to inspect pending feedback reports.
    """
    _ensure_queue_file()
    try:
        with open(QUEUE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []
