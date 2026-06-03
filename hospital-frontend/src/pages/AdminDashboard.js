import React, { useState, useEffect } from 'react';
import { adminAPI, appointmentAPI, doctorAPI, hospitalAPI } from '../services/api';
import './AdminDashboard.css';

function formatTime(t) {
  if (!t) return t;
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${m.toString().padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

function StatusBadge({ status }) {
  const cls = { PENDING:'pending', CONFIRMED:'confirmed', COMPLETED:'completed', CANCELLED:'cancelled' };
  return <span className={`badge badge-${cls[status] || 'pending'}`}>{status}</span>;
}

export default function AdminDashboard() {
  const [stats, setStats]         = useState({});
  const [appointments, setAppts]  = useState([]);
  const [doctors, setDoctors]     = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [tab, setTab]             = useState('overview');
  const [loading, setLoading]     = useState(true);
  const [updating, setUpdating]   = useState(null);
  const [apptFilter, setApptFilter] = useState('ALL');

  const load = async () => {
    setLoading(true);
    try {
      const [s, a, d, h] = await Promise.all([
        adminAPI.dashboard(),
        appointmentAPI.getAll(),
        doctorAPI.getAll(),
        hospitalAPI.getAll(),
      ]);
      setStats(s.data || {});
      setAppts(a.data || []);
      setDoctors(d.data || []);
      setHospitals(h.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await appointmentAPI.updateStatus(id, status);
      setAppts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch { alert('Failed to update status'); }
    finally { setUpdating(null); }
  };

  const deleteAppt = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await appointmentAPI.delete(id);
      setAppts(prev => prev.filter(a => a.id !== id));
    } catch { alert('Failed to delete'); }
  };

  const filteredAppts = apptFilter === 'ALL' ? appointments
    : appointments.filter(a => a.status === apptFilter);

  const STAT_CARDS = [
    { key:'totalHospitals',     label:'Hospitals',     icon:'🏥', color:'#0f4c81' },
    { key:'totalDoctors',       label:'Doctors',       icon:'👨‍⚕️', color:'#00b894' },
    { key:'totalPatients',      label:'Patients',      icon:'👥', color:'#6c5ce7' },
    { key:'totalAppointments',  label:'Appointments',  icon:'📋', color:'#e17055' },
    { key:'pendingAppointments',label:'Pending',       icon:'⏳', color:'#fdcb6e' },
    { key:'confirmedAppointments',label:'Confirmed',   icon:'✅', color:'#00b894' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage hospitals, doctors, and appointments</p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {['overview','appointments','doctors','hospitals'].map(t => (
          <button key={t} className={`admin-tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-loading">Loading…</div>
      ) : (
        <>
          {/* Overview */}
          {tab === 'overview' && (
            <div>
              <div className="stats-grid">
                {STAT_CARDS.map(sc => (
                  <div key={sc.key} className="stat-card card">
                    <div className="stat-icon" style={{ background: sc.color + '18', color: sc.color }}>{sc.icon}</div>
                    <div className="stat-info">
                      <span className="stat-value">{stats[sc.key] ?? 0}</span>
                      <span className="stat-label">{sc.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent appointments */}
              <div className="card admin-section">
                <h3>Recent Appointments</h3>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Token</th><th>Patient</th><th>Doctor</th>
                        <th>Date</th><th>Time</th><th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0,10).map(a => (
                        <tr key={a.id}>
                          <td><strong>#{a.tokenNumber}</strong></td>
                          <td>
                            <div>{a.patientName}</div>
                            <small style={{color:'var(--text-muted)'}}>{a.patientEmail}</small>
                          </td>
                          <td>
                            <div>Dr. {a.doctorName}</div>
                            <small style={{color:'var(--text-muted)'}}>{a.doctorSpecialization}</small>
                          </td>
                          <td>{a.appointmentDate}</td>
                          <td>{formatTime(a.appointmentTime)}</td>
                          <td><StatusBadge status={a.status} /></td>
                          <td>
                            <StatusActions a={a} updating={updating} onUpdate={updateStatus} onDelete={deleteAppt} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* All Appointments */}
          {tab === 'appointments' && (
            <div className="card admin-section">
              <div className="section-top">
                <h3>All Appointments ({appointments.length})</h3>
                <div className="appt-filter-row">
                  {['ALL','PENDING','CONFIRMED','COMPLETED','CANCELLED'].map(f => (
                    <button
                      key={f}
                      className={`filter-tab-sm ${apptFilter===f?'active':''}`}
                      onClick={() => setApptFilter(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Token</th><th>Patient</th><th>Doctor</th><th>Hospital</th>
                      <th>Date</th><th>Time</th><th>Health Issue</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppts.map(a => (
                      <tr key={a.id}>
                        <td><strong>#{a.tokenNumber}</strong></td>
                        <td>
                          <div>{a.patientName}</div>
                          <small style={{color:'var(--text-muted)'}}>{a.patientEmail}</small>
                          <small style={{color:'var(--text-muted)', display:'block'}}>Age: {a.patientAge} · {a.patientPhone}</small>
                        </td>
                        <td>Dr. {a.doctorName}<br/><small style={{color:'var(--text-muted)'}}>{a.doctorSpecialization}</small></td>
                        <td>{a.hospitalName}<br/><small style={{color:'var(--text-muted)'}}>{a.hospitalCity}</small></td>
                        <td>{a.appointmentDate}</td>
                        <td>{formatTime(a.appointmentTime)}</td>
                        <td style={{maxWidth:160, wordBreak:'break-word'}}>{a.healthIssue}</td>
                        <td><StatusBadge status={a.status} /></td>
                        <td>
                          <StatusActions a={a} updating={updating} onUpdate={updateStatus} onDelete={deleteAppt} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Doctors */}
          {tab === 'doctors' && (
            <div className="card admin-section">
              <h3>Doctors ({doctors.length})</h3>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Name</th><th>Specialization</th><th>Hospital</th><th>City</th><th>Exp</th><th>Working Hours</th></tr>
                  </thead>
                  <tbody>
                    {doctors.map(d => (
                      <tr key={d.id}>
                        <td><strong>Dr. {d.name}</strong></td>
                        <td>{d.specialization}</td>
                        <td>{d.hospitalName || '—'}</td>
                        <td>{d.hospitalCity || '—'}</td>
                        <td>{d.experience} yrs</td>
                        <td>{d.workingHours || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Hospitals */}
          {tab === 'hospitals' && (
            <div className="card admin-section">
              <h3>Hospitals ({hospitals.length})</h3>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Hospital Name</th><th>City</th></tr>
                  </thead>
                  <tbody>
                    {hospitals.map(h => (
                      <tr key={h.id}>
                        <td><strong>🏥 {h.name}</strong></td>
                        <td>📍 {h.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatusActions({ a, updating, onUpdate, onDelete }) {
  const canConfirm  = a.status === 'PENDING';
  const canComplete = a.status === 'CONFIRMED';
  const canCancel   = a.status === 'PENDING' || a.status === 'CONFIRMED';
  return (
    <div className="action-btns">
      {canConfirm  && <button className="btn-action confirm"  onClick={() => onUpdate(a.id,'CONFIRMED')}  disabled={updating===a.id}>Confirm</button>}
      {canComplete && <button className="btn-action complete" onClick={() => onUpdate(a.id,'COMPLETED')}  disabled={updating===a.id}>Complete</button>}
      {canCancel   && <button className="btn-action cancel"   onClick={() => onUpdate(a.id,'CANCELLED')}  disabled={updating===a.id}>Cancel</button>}
      <button className="btn-action delete" onClick={() => onDelete(a.id)}>Delete</button>
    </div>
  );
}
