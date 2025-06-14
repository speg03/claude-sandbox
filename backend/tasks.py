import time
import requests
from datetime import datetime
from celery_app import celery_app

@celery_app.task(bind=True)
def long_running_job(self, job_id: str, duration: int):
    """
    Simulate a long-running job with progress updates
    """
    try:
        # Update job status to running
        update_job_status(job_id, "running", 0)
        
        # Simulate work with progress updates
        for i in range(duration):
            time.sleep(1)  # Sleep for 1 second
            progress = int((i + 1) / duration * 100)
            
            # Update progress
            update_job_status(job_id, "running", progress)
            
            # Update task state for Celery monitoring
            self.update_state(
                state="PROGRESS",
                meta={"current": i + 1, "total": duration, "progress": progress}
            )
        
        # Mark job as completed
        completed_at = datetime.now().isoformat()
        update_job_status(job_id, "completed", 100, completed_at)
        
        return {"status": "completed", "result": f"Job {job_id} completed successfully"}
        
    except Exception as exc:
        # Mark job as failed
        update_job_status(job_id, "failed", 0)
        self.update_state(
            state="FAILURE",
            meta={"error": str(exc)}
        )
        raise exc

def update_job_status(job_id: str, status: str, progress: int, completed_at: str = None):
    """
    Update job status in the FastAPI application
    """
    try:
        url = f"http://localhost:8000/jobs/{job_id}/status"
        params = {"status": status, "progress": progress}
        if completed_at:
            params["completed_at"] = completed_at
        
        response = requests.put(url, params=params)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Failed to update job status: {e}")