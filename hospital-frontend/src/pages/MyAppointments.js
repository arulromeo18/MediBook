import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../services/api';
import './MyAppointments.css';

function formatTime(t) {
  if (!t) return t;
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${m.toString().padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

function StatusBadge({ status }) {
  const cls = { PENDING:'pending', CONFIRMED:'confirmed', COMPLETED:'completed', CANCELLED:'cancelled' };
  return <span className={`badge badge-${cls[status] || 'pending'}`}>{status}</span>;
}

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [cancelling, setCancelling]     = useState(null);
  const [filter, setFilter]             = useState('ALL');
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    appointmentAPI.getMine()
      .then(r => setAppointments(r.data || []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const cancelAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    setCancelling(id);
    try {
      await appointmentAPI.cancel(id);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
    } catch {
      alert('Failed to cancel. Please try again.');
    } finally {
      setCancelling(null);
    }
  };

  const FILTERS = ['ALL','PENDING','CONFIRMED','COMPLETED','CANCELLED'];
  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'ALL' ? appointments.length : appointments.filter(a => a.status === f).length;
    return acc;
  }, {});

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Appointments</h1>
        <p>Manage and track all your hospital appointments</p>
      </div>

      {/* Filter tabs */}
      <div className="appt-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f} {counts[f] > 0 && <span className="filter-count">{counts[f]}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="appt-loading">
          {[1,2,3].map(i => <div key={i} className="appt-skeleton" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>{filter === 'ALL' ? 'No appointments yet' : `No ${filter.toLowerCase()} appointments`}</h3>
          <p>Book an appointment with one of our doctors</p>
          <button className="btn btn-primary" style={{marginTop:16}} onClick={() => navigate('/doctors')}>
            Find a Doctor
          </button>
        </div>
      ) : (
        <div className="appt-list">
          {filtered.map(appt => (
            <div key={appt.id} className="appt-card card">
              <div className="appt-token">
                <span className="token-label-sm">Token</span>
                <span className="token-num-sm">{appt.tokenNumber}</span>
              </div>

              <div className="appt-info">
                <div className="appt-doctor">
                  <h3>Dr. {appt.doctorName}</h3>
                  <span className="spec-tag-sm">{appt.doctorSpecialization}</span>
                </div>
                <div className="appt-details">
                  {appt.hospitalName && (
                    <span><span>🏥</span> {appt.hospitalName}{appt.hospitalCity ? `, ${appt.hospitalCity}` : ''}</span>
                  )}
                  <span><span>📅</span> {appt.appointmentDate}</span>
                  <span><span>🕐</span> {formatTime(appt.appointmentTime)}</span>
                  <span><span>🩺</span> {appt.healthIssue}</span>
                </div>
              </div>

              <div className="appt-right">
                <StatusBadge status={appt.status} />
                {(appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => cancelAppointment(appt.id)}
                    disabled={cancelling === appt.id}
                  >
                    {cancelling === appt.id ? <span className="spinner" /> : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
