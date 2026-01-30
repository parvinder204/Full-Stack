import api from './api';
import { Task, TaskFormData, PaginatedResponse } from '../types';

const normalizeStatus = (status: string) => {
  if (status === 'Pending') return 'pending';
  if (status === 'In Progress') return 'in_progress';
  if (status === 'Completed') return 'completed';
  return status;
};

export const taskService = {
  async getTasks(page = 1, status?: string): Promise<PaginatedResponse<Task>> {
    const params: Record<string, string | number> = { page };

    if (status && status !== 'All') {
      params.status = normalizeStatus(status);
    }

    const response = await api.get('/tasks/', { params });
    return response.data;
  },

  async getTask(id: number): Promise<Task> {
    const response = await api.get(`/tasks/${id}/`);
    return response.data;
  },

  async createTask(taskData: TaskFormData): Promise<Task> {
    const payload = {
      ...taskData,
      status: normalizeStatus(taskData.status),
    };

    const response = await api.post('/tasks/', payload);
    return response.data;
  },

  async updateTask(
    id: number,
    taskData: Partial<TaskFormData>
  ): Promise<Task> {
    const payload = {
      ...taskData,
      status: taskData.status
        ? normalizeStatus(taskData.status)
        : undefined,
    };

    const response = await api.put(`/tasks/${id}/`, payload);
    return response.data;
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}/`);
  },
};
