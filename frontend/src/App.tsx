import { useState, useEffect } from 'react';
import { Job, JobRequest } from './types';
import { jobAPI } from './api';
import JobList from './components/JobList';
import JobForm from './components/JobForm';
import './App.css';

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setError(null);
      const jobsData = await jobAPI.getJobs();
      setJobs(jobsData);
    } catch (err) {
      setError('Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    }
  };

  const handleCreateJob = async (jobRequest: JobRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newJob = await jobAPI.createJob(jobRequest);
      setJobs(prev => [...prev, newJob]);
    } catch (err) {
      setError('Failed to create job');
      console.error('Error creating job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      setError(null);
      await jobAPI.deleteJob(jobId);
      setJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err) {
      setError('Failed to delete job');
      console.error('Error deleting job:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
    
    // Poll for job updates every 2 seconds
    const interval = setInterval(fetchJobs, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <h1>Job Manager</h1>
      
      {error && (
        <div className="error">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      <div className="app-content">
        <div className="job-form-section">
          <h2>Create New Job</h2>
          <JobForm onSubmit={handleCreateJob} loading={loading} />
        </div>
        
        <div className="job-list-section">
          <div className="job-list-header">
            <h2>Jobs</h2>
            <button onClick={fetchJobs} className="refresh-button">
              Refresh
            </button>
          </div>
          <JobList jobs={jobs} onDelete={handleDeleteJob} />
        </div>
      </div>
    </div>
  );
}

export default App;