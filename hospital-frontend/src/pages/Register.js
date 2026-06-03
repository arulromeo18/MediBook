import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', age:'' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await authAPI.register({ ...form, age: Number(form.age) || undefined });
      const { token, ...user } = res.data;
      login(user, token);
      navigate('/doctors');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="auth-logo">✚</div>
          <h2>Create Account</h2>
          <p>Join MediBook and book appointments online</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" name="name" placeholder="John Doe"
              value={form.name} onChange={handle} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input className="form-control" name="age" type="number" placeholder="28"
                value={form.age} onChange={handle} min="1" max="120" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input className="form-control" name="phone" placeholder="9876543210"
                value={form.phone} onChange={handle} />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" name="password" placeholder="Min. 6 characters"
              value={form.password} onChange={handle} required />
          </div>
          <button className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
