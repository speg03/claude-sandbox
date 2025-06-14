export interface Job {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  duration: number;
  progress: number;
}

export interface JobRequest {
  name: string;
  duration: number;
}