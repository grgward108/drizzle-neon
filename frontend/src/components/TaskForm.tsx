import { useState } from 'react';

interface TaskFormProps {
  onTaskCreate: (task: { title: string; description: string }) => Promise<void>;
}

export default function TaskForm({ onTaskCreate }: TaskFormProps) {
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setLoading(true);
    try {
      await onTaskCreate(newTask);
      setNewTask({ title: '', description: '' });
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
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
  );
} 