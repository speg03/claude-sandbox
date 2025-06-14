import { Job } from '../types';
import ProgressBar from './ProgressBar';
import './JobCard.css';

interface JobCardProps {
  job: Job;
  onDelete: (jobId: string) => void;
}

export default function JobCard({ job, onDelete }: JobCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'running': return '#007bff';
      case 'completed': return '#28a745';
      case 'failed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getDuration = () => {
    if (job.status === 'completed' && job.completed_at) {
      const start = new Date(job.created_at);
      const end = new Date(job.completed_at);
      const actualDuration = Math.round((end.getTime() - start.getTime()) / 1000);
      return `${actualDuration}s (expected: ${job.duration}s)`;
    }
    return `${job.duration}s`;
  };

  return (
    <div className="job-card">
      <div className="job-header">
        <h3 className="job-name">{job.name}</h3>
        <div className="job-actions">
          <span 
            className="job-status" 
            style={{ backgroundColor: getStatusColor(job.status) }}
          >
            {job.status.toUpperCase()}
          </span>
          <button 
            onClick={() => onDelete(job.id)}
            className="delete-button"
            title="Delete job"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="job-details">
        <div className="job-info">
          <span><strong>ID:</strong> {job.id.slice(0, 8)}...</span>
          <span><strong>Duration:</strong> {getDuration()}</span>
          <span><strong>Created:</strong> {formatDate(job.created_at)}</span>
          {job.completed_at && (
            <span><strong>Completed:</strong> {formatDate(job.completed_at)}</span>
          )}
        </div>
        
        {(job.status === 'running' || job.status === 'completed') && (
          <div className="progress-section">
            <ProgressBar progress={job.progress} />
            <span className="progress-text">{job.progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}