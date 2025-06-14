# Job Manager

A full-stack web application for managing and monitoring long-running asynchronous jobs.

## Features

- Create and manage asynchronous jobs
- Real-time progress tracking with visual progress bars
- Job status monitoring (pending, running, completed, failed)
- Responsive web interface
- RESTful API backend

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: FastAPI + Python
- **Task Queue**: Celery + Redis
- **Containerization**: Docker + Docker Compose

## Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd job-manager
```

2. Start all services:
```bash
docker-compose up --build
```

3. Open your browser and navigate to:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Setup

#### Prerequisites
- Python 3.11+
- Node.js 22+
- Redis server

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Start Redis (if not using Docker)
redis-server

# Start FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Start Celery worker (in a separate terminal)
celery -A celery_app worker --loglevel=info
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Usage

1. **Create a Job**: Enter a job name and duration (in seconds), then click "Create Job"
2. **Monitor Progress**: Watch real-time progress updates with visual progress bars
3. **View Job Details**: See job status, creation time, duration, and completion time
4. **Delete Jobs**: Remove completed or unwanted jobs

## API Endpoints

- `GET /jobs` - List all jobs
- `POST /jobs` - Create a new job
- `GET /jobs/{job_id}` - Get specific job details  
- `DELETE /jobs/{job_id}` - Delete a job

## Architecture

The application follows a microservices architecture:

- **Frontend**: React SPA that polls the backend API for job updates
- **FastAPI Backend**: REST API server handling job management
- **Celery Workers**: Execute long-running tasks asynchronously
- **Redis**: Message broker and result backend for Celery

## Development

See [CLAUDE.md](./CLAUDE.md) for detailed development instructions and architecture information.

## Future Enhancements

- Job cancellation functionality
- Database persistence
- User authentication
- WebSocket real-time updates
- Advanced job scheduling
- Job result storage and retrieval