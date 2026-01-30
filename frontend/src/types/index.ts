export interface User {
  id: number;
  email: string;
  username?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  password2: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};
export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  due_date: string;
  created_at: string;
  updated_at: string;
  created_by: number;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  due_date: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}