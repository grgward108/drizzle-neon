import './App.css'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import { useTasks } from './hooks/useTasks'

function App() {
  const { tasks, loading, error, createTask, toggleTask, deleteTask } = useTasks();

  if (loading) {
    return (
      <div className="app">
        <div className="container">
          <h1>🎯 Task Manager</h1>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="container">
          <h1>🎯 Task Manager</h1>
          <p className="error">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <h1>🎯 Task Manager</h1>
        
        <TaskForm onTaskCreate={createTask} />
        <TaskList 
          tasks={tasks} 
          onToggle={toggleTask} 
          onDelete={deleteTask} 
        />
      </div>
    </div>
  )
}

export default App
