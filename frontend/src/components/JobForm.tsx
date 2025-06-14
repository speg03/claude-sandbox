import { useState, FormEvent } from 'react';
import { JobRequest } from '../types';
import './JobForm.css';

interface JobFormProps {
  onSubmit: (job: JobRequest) => void;
  loading: boolean;
}

export default function JobForm({ onSubmit, loading }: JobFormProps) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(10);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ name: name.trim(), duration });
      setName('');
      setDuration(10);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
      <div className="form-group">
        <label htmlFor="name">Job Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter job name"
          required
          disabled={loading}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="duration">Duration (seconds):</label>
        <input
          type="number"
          id="duration"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          min="1"
          max="300"
          required
          disabled={loading}
        />
      </div>
      
      <button type="submit" disabled={loading || !name.trim()}>
        {loading ? 'Creating...' : 'Create Job'}
      </button>
    </form>
  );
}