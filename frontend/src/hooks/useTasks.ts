import { useState, useEffect } from 'react';
import { TaskService } from '../services/taskService';
import type { Task } from '../types/Task';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (taskData: { title: string; description: string }) => Promise<void>;
  toggleTask: (id: number, completed: boolean) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await TaskService.getAllTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (taskData: { title: string; description: string }) => {
    try {
      await TaskService.createTask(taskData);
      await fetchTasks(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      console.error('Failed to create task:', err);
    }
  };

  // Toggle task completion
  const toggleTask = async (id: number, completed: boolean) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      await TaskService.updateTask(id, {
        title: task.title,
        description: task.description,
        completed: !completed,
      });
      
      await fetchTasks(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      console.error('Failed to update task:', err);
    }
  };

  // Delete a task
  const deleteTask = async (id: number) => {
    try {
      await TaskService.deleteTask(id);
      await fetchTasks(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      console.error('Failed to delete task:', err);
    }
  };

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask,
    toggleTask,
    deleteTask,
    refetch: fetchTasks,
  };
} 