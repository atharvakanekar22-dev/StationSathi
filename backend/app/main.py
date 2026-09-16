import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.stations import router as stations_router
from backend.app.api.facilities import router as facilities_router
from backend.app.api.navigation import router as navigation_router
from backend.app.api.assistant import router as assistant_router

app = FastAPI(
    title="StationSathi API",
    description="Intelligent Railway Station Assistant for Mumbai Central Railway - Backend Services",
    version="1.0.0"
)

# Enable CORS for local development and demonstration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stations_router, prefix="/api")
app.include_router(facilities_router, prefix="/api")
app.include_router(navigation_router, prefix="/api")
app.include_router(assistant_router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "StationSathi Backend",
        "version": "1.0.0",
        "environment": "prototype_demonstration",
        "authoritative": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
