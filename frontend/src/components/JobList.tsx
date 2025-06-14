import { Job } from '../types';
import JobCard from './JobCard';
import './JobList.css';

interface JobListProps {
  jobs: Job[];
  onDelete: (jobId: string) => void;
}

export default function JobList({ jobs, onDelete }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="job-list-empty">
        <p>No jobs yet. Create your first job!</p>
      </div>
    );
  }

  const sortedJobs = [...jobs].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="job-list">
      {sortedJobs.map(job => (
        <JobCard 
          key={job.id} 
          job={job} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}