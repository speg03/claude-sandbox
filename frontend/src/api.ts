import axios from 'axios';
import { Job, JobRequest } from './types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const jobAPI = {
  // Get all jobs
  getJobs: async (): Promise<Job[]> => {
    const response = await api.get('/jobs');
    return response.data;
  },

  // Get a specific job
  getJob: async (jobId: string): Promise<Job> => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  // Create a new job
  createJob: async (jobRequest: JobRequest): Promise<Job> => {
    const response = await api.post('/jobs', jobRequest);
    return response.data;
  },

  // Delete a job
  deleteJob: async (jobId: string): Promise<void> => {
    await api.delete(`/jobs/${jobId}`);
  },
};