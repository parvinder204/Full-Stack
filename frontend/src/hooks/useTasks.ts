import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { Task, TaskFormData } from '../types';

const PAGE_SIZE = 6; 

export const useTasks = (initialStatus: string = 'All') => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);

  const fetchTasks = useCallback(
    async (page: number = 1, status: string = statusFilter) => {
      try {
        setLoading(true);
        setError(null);

        const response = await taskService.getTasks(page, status);

        setTasks(response.results);
        setTotalPages(Math.ceil(response.count / PAGE_SIZE));
        setCurrentPage(page);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    },
    [statusFilter]
  );

  useEffect(() => {
    fetchTasks(1, statusFilter);
  }, [statusFilter, fetchTasks]);

  const createTask = async (taskData: TaskFormData): Promise<void> => {
    try {
      setError(null);
      await taskService.createTask(taskData);
      await fetchTasks(currentPage, statusFilter);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (
    id: number,
    taskData: Partial<TaskFormData>
  ): Promise<void> => {
    try {
      setError(null);
      await taskService.updateTask(id, taskData);
      await fetchTasks(currentPage, statusFilter);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    try {
      setError(null);
      await taskService.deleteTask(id);
      await fetchTasks(currentPage, statusFilter);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete task');
      throw err;
    }
  };

  const filterByStatus = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  return {
    tasks,
    loading,
    error,
    currentPage,
    totalPages,
    statusFilter,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
    filterByStatus,
  };
};
