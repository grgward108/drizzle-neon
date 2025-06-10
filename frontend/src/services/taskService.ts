import type { Task } from '../types/Task';
import { validateTask, validateTaskArray } from '../types/Task';
import { API_CONFIG } from '../config/api';

const { BASE_URL, ENDPOINTS, HEADERS } = API_CONFIG;

export class TaskService {
  static async getAllTasks(): Promise<Task[]> {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.TASKS}`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const data = await response.json();
    
    // 🔒 VALIDATE - Throws error if wrong shape!
    return validateTaskArray(data.tasks);
  }

  static async createTask(task: { title: string; description: string }): Promise<Task> {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.TASKS}`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(task),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    
    const data = await response.json();
    // 🔒 VALIDATE - Throws error if wrong shape!
    return validateTask(data);
  }

  static async updateTask(
    id: number, 
    updates: { title: string; description: string | null; completed: boolean }
  ): Promise<Task> {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.TASKS}/${id}`, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    
    const data = await response.json();
    // 🔒 VALIDATE - Throws error if wrong shape!
    return validateTask(data);
  }

  static async deleteTask(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.TASKS}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  }
} 