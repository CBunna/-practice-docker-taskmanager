import React, { useState, useEffect } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use environment variable for API base URL
  const API_BASE = import.meta.env.REACT_APP_API_URL || 
    (import.meta.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5002/api');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE}/tasks`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again.');
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      setError(null);
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask.trim() }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const task = await response.json();
      setTasks([task, ...tasks]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedTask = await response.json();
      setTasks(tasks.map(task => 
        task.id === id ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`${API_BASE}/tasks/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div>Loading tasks...</div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
          <button 
            onClick={fetchTasks}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              backgroundColor: '#721c24',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      <form onSubmit={addTask} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          style={{
            padding: '10px',
            width: '70%',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
          maxLength={255}
        />
        <button
          type="submit"
          disabled={!newTask.trim()}
          style={{
            padding: '10px 20px',
            marginLeft: '10px',
            backgroundColor: newTask.trim() ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: newTask.trim() ? 'pointer' : 'not-allowed',
            fontSize: '16px'
          }}
        >
          Add Task
        </button>
      </form>

      <div>
        {tasks.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666',
            fontSize: '18px'
          }}>
            <p>No tasks yet. Add one above!</p>
          </div>
        ) : (
          <div>
            <p style={{ color: '#666', marginBottom: '15px' }}>
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} • {' '}
              {tasks.filter(t => t.completed).length} completed
            </p>
            {tasks.map(task => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  margin: '8px 0',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: '1px solid #e9ecef'
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id, task.completed)}
                  style={{ 
                    marginRight: '12px',
                    transform: 'scale(1.2)'
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    fontSize: '16px',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#6c757d' : '#333',
                    opacity: task.completed ? 0.7 : 1
                  }}
                >
                  {task.title}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: '#6c757d',
                  marginRight: '10px'
                }}>
                  {new Date(task.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskList;