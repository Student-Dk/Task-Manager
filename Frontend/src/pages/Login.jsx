import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getApiMessage } from '../api/axios.js';
import Message from '../components/Message.jsx';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/auth/login', form);
      localStorage.setItem('token', response.data.token);
      setMessageType('success');
      setMessage(response.data.message || 'Login successful');
      navigate('/dashboard');
    } catch (error) {
      setMessageType('error');
      setMessage(getApiMessage(error, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>Log in</h1>
        </div>

        <Message message={message} type={messageType} />

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              placeholder="Enter your password"
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="auth-link">
          Need an account? <Link to="/register">Register</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
