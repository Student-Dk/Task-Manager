import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getApiMessage } from '../api/axios.js';
import Message from '../components/Message.jsx';

const emptyTask = {
  title: '',
  description: '',
  status: 'todo'
};

const statuses = ['todo', 'in-progress', 'done'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(emptyTask);
  const [editingId, setEditingId] = useState(null);
  const [editTask, setEditTask] = useState(emptyTask);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const taskCountLabel = useMemo(() => {
    if (tasks.length === 1) {
      return '1 task';
    }

    return `${tasks.length} tasks`;
  }, [tasks.length]);

  const showMessage = (type, text) => {
    setMessageType(type);
    setMessage(text);
  };

  const fetchTasks = async () => {
    setLoading(true);

    try {
      const response = await api.get('/tasks');
      setTasks(response.data.tasks || []);
    } catch (error) {
      showMessage('error', getApiMessage(error, 'Could not load tasks'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateNewTask = (event) => {
    setNewTask((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const updateEditTask = (event) => {
    setEditTask((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const createTask = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await api.post('/tasks', newTask);
      setTasks((current) => [response.data.task, ...current]);
      setNewTask(emptyTask);
      showMessage('success', response.data.message || 'Task created');
    } catch (error) {
      showMessage('error', getApiMessage(error, 'Could not create task'));
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditTask({
      title: task.title,
      description: task.description || '',
      status: task.status
    });
    setMessage('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTask(emptyTask);
  };

  const saveTask = async (taskId) => {
    setSaving(true);

    try {
      const response = await api.put(`/tasks/${taskId}`, editTask);
      setTasks((current) =>
        current.map((task) => (task._id === taskId ? response.data.task : task))
      );
      cancelEditing();
      showMessage('success', response.data.message || 'Task updated');
    } catch (error) {
      showMessage('error', getApiMessage(error, 'Could not update task'));
    } finally {
      setSaving(false);
    }
  };

  const deleteTask = async (taskId) => {
    setSaving(true);

    try {
      const response = await api.delete(`/tasks/${taskId}`);
      setTasks((current) => current.filter((task) => task._id !== taskId));
      showMessage('success', response.data.message || 'Task deleted');
    } catch (error) {
      showMessage('error', getApiMessage(error, 'Could not delete task'));
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Task Management</p>
          <h1>Dashboard</h1>
        </div>
        <button className="secondary-button" type="button" onClick={logout}>
          Log out
        </button>
      </header>

      <section className="dashboard-grid">
        <form className="task-form" onSubmit={createTask}>
          <div>
            <h2>Add task</h2>
            <p>{taskCountLabel}</p>
          </div>

          <Message message={message} type={messageType} />

          <label>
            Title
            <input
              name="title"
              value={newTask.title}
              onChange={updateNewTask}
              placeholder="Write API documentation"
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={newTask.description}
              onChange={updateNewTask}
              placeholder="Add useful context"
              rows="4"
            />
          </label>

          <label>
            Status
            <select name="status" value={newTask.status} onChange={updateNewTask}>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Add task'}
          </button>
        </form>

        <section className="task-list" aria-label="Tasks">
          {loading ? (
            <p className="empty-state">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="empty-state">No tasks yet.</p>
          ) : (
            tasks.map((task) => (
              <article className="task-item" key={task._id}>
                {editingId === task._id ? (
                  <div className="edit-grid">
                    <input
                      name="title"
                      value={editTask.title}
                      onChange={updateEditTask}
                      required
                    />
                    <textarea
                      name="description"
                      value={editTask.description}
                      onChange={updateEditTask}
                      rows="3"
                    />
                    <select name="status" value={editTask.status} onChange={updateEditTask}>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <div className="task-actions">
                      <button type="button" onClick={() => saveTask(task._id)} disabled={saving}>
                        Save
                      </button>
                      <button className="secondary-button" type="button" onClick={cancelEditing}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="task-content">
                      <span className={`status-pill status-${task.status}`}>
                        {task.status}
                      </span>
                      <h3>{task.title}</h3>
                      {task.description ? <p>{task.description}</p> : null}
                    </div>
                    <div className="task-actions">
                      <button type="button" onClick={() => startEditing(task)}>
                        Edit
                      </button>
                      <button
                        className="danger-button"
                        type="button"
                        onClick={() => deleteTask(task._id)}
                        disabled={saving}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
