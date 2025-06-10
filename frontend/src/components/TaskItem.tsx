import type { Task } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-actions">
            <button
              onClick={() => onToggle(task.id, task.completed)}
              className={`toggle-button ${task.completed ? 'completed' : ''}`}
            >
              {task.completed ? '✅' : '⭕'}
            </button>
            <button
              onClick={() => onDelete(task.id)}
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
  );
} 