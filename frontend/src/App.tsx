import { useState, useEffect } from 'react'
import './App.css'

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
}

const API_BASE = 'http://localhost:3000/api';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE}/tasks`);
      const data = await response.json();
      setTasks(data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      
      if (response.ok) {
        setNewTask({ title: '', description: '' });
        fetchTasks(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id: number, completed: boolean) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          completed: !completed,
        }),
      });
      
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
      });
      
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🎯 Task Manager</h1>
        
        {/* Add Task Form */}
        <form onSubmit={createTask} className="task-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Task title..."
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="task-input"
            />
            <textarea
              placeholder="Description (optional)..."
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="task-textarea"
              rows={2}
            />
          </div>
          <button type="submit" disabled={loading || !newTask.title.trim()} className="add-button">
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </form>

        {/* Task List */}
        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Add one above! ��</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div className="task-content">
                  <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    <div className="task-actions">
                      <button
                        onClick={() => toggleTask(task.id, task.completed)}
                        className={`toggle-button ${task.completed ? 'completed' : ''}`}
                      >
                        {task.completed ? '✅' : '⭕'}
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="delete-button"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  <div className="task-meta">
                    <small>Created: {new Date(task.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
