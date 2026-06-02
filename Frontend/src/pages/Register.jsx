import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getApiMessage } from '../api/axios.js';
import Message from '../components/Message.jsx';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      const response = await api.post('/auth/register', form);
      localStorage.setItem('token', response.data.token);
      setMessageType('success');
      setMessage(response.data.message || 'Registration successful');
      navigate('/dashboard');
    } catch (error) {
      setMessageType('error');
      setMessage(getApiMessage(error, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div>
          <p className="eyebrow">Create account</p>
          <h1>Register</h1>
        </div>

        <Message message={message} type={messageType} />

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="Jane Doe"
              required
            />
          </label>

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
              placeholder="At least 6 characters"
              minLength="6"
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-link">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
