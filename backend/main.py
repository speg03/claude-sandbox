from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uuid
from datetime import datetime
import asyncio

from celery_app import celery_app

app = FastAPI(title="Job Manager API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory job storage (in production, use a database)
jobs: Dict[str, Dict[str, Any]] = {}

class JobRequest(BaseModel):
    name: str
    duration: int = 10  # seconds

class JobResponse(BaseModel):
    id: str
    name: str
    status: str
    created_at: str
    completed_at: Optional[str] = None
    duration: int
    progress: int = 0

@app.get("/")
async def root():
    return {"message": "Job Manager API"}

@app.post("/jobs", response_model=JobResponse)
async def create_job(job_request: JobRequest):
    job_id = str(uuid.uuid4())
    created_at = datetime.now().isoformat()
    
    # Store job info
    jobs[job_id] = {
        "id": job_id,
        "name": job_request.name,
        "status": "pending",
        "created_at": created_at,
        "completed_at": None,
        "duration": job_request.duration,
        "progress": 0
    }
    
    # Start the job asynchronously
    celery_app.send_task("tasks.long_running_job", args=[job_id, job_request.duration])
    
    return JobResponse(**jobs[job_id])

@app.get("/jobs", response_model=list[JobResponse])
async def get_jobs():
    return [JobResponse(**job) for job in jobs.values()]

@app.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job(job_id: str):
    if job_id not in jobs:
        return JSONResponse(status_code=404, content={"detail": "Job not found"})
    
    return JobResponse(**jobs[job_id])

@app.delete("/jobs/{job_id}")
async def delete_job(job_id: str):
    if job_id not in jobs:
        return JSONResponse(status_code=404, content={"detail": "Job not found"})
    
    # In a real implementation, you would also cancel the Celery task
    del jobs[job_id]
    return {"message": "Job deleted"}

# Internal endpoint for Celery to update job status
@app.put("/jobs/{job_id}/status")
async def update_job_status(job_id: str, status: str, progress: int = 0, completed_at: Optional[str] = None):
    if job_id in jobs:
        jobs[job_id]["status"] = status
        jobs[job_id]["progress"] = progress
        if completed_at:
            jobs[job_id]["completed_at"] = completed_at
    return {"message": "Status updated"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)