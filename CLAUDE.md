# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Job Manager application built with React + TypeScript frontend and FastAPI + Celery backend. The application allows users to create and monitor long-running asynchronous jobs with real-time progress updates.

## Architecture

### Backend (FastAPI + Celery)
- **FastAPI**: REST API server providing job management endpoints
- **Celery**: Distributed task queue for handling long-running jobs
- **Redis**: Message broker and result backend for Celery
- **Jobs**: Simulated long-running tasks that sleep for specified durations

### Frontend (React + TypeScript + Vite)
- **React 18**: UI framework with TypeScript for type safety
- **Vite**: Fast build tool and development server
- **Axios**: HTTP client for API communication
- **Real-time polling**: Updates job status every 2 seconds

## Development Setup

### Prerequisites
- Python 3.11+
- Node.js 22+
- Redis server (or use Docker Compose)

### Using Docker Compose (Recommended)
```bash
docker-compose up --build
```
This starts all services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Redis: localhost:6379

### Manual Setup

#### Backend
```bash
cd backend
pip install -r requirements.txt
# Start Redis server separately
redis-server
# Start FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# Start Celery worker (in separate terminal)
celery -A celery_app worker --loglevel=info
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI application
│   ├── celery_app.py        # Celery configuration
│   ├── tasks.py             # Celery task definitions
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── types.ts         # TypeScript type definitions
│   │   ├── api.ts           # API client functions
│   │   └── App.tsx          # Main application component
│   ├── package.json         # Node.js dependencies
│   ├── vite.config.ts       # Vite configuration
│   └── Dockerfile           # Frontend container
├── docker-compose.yml       # Multi-service orchestration
└── CLAUDE.md               # This file
```

## API Endpoints

- `GET /jobs` - List all jobs
- `POST /jobs` - Create a new job
- `GET /jobs/{job_id}` - Get specific job details
- `DELETE /jobs/{job_id}` - Delete a job
- `PUT /jobs/{job_id}/status` - Update job status (internal use)

## Key Features

- **Job Creation**: Users can create jobs with custom names and durations
- **Real-time Updates**: Job progress is updated every 2 seconds via polling
- **Progress Tracking**: Visual progress bars show job completion percentage
- **Job Management**: Users can view, monitor, and delete jobs
- **Responsive UI**: Works on desktop and mobile devices

## Development Commands

### Backend
```bash
# Run FastAPI server with auto-reload
uvicorn main:app --reload

# Run Celery worker
celery -A celery_app worker --loglevel=info

# Monitor Celery tasks
celery -A celery_app flower
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Testing

Currently no automated tests are implemented. For manual testing:
1. Start all services
2. Create jobs with different durations
3. Monitor progress updates
4. Test job deletion
5. Verify error handling

## Notes for Future Development

- Add proper error handling and validation
- Implement job cancellation functionality
- Add database persistence (currently uses in-memory storage)
- Add authentication and user management
- Implement WebSocket connections for real-time updates instead of polling
- Add comprehensive test coverage
- Add logging and monitoring