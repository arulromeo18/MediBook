import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorAPI, appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import './DoctorDetail.css';

export default function DoctorDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctor, setDoctor]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [booked, setBooked]         = useState(null);  // successful booking response

  useEffect(() => {
    doctorAPI.getById(id)
      .then(r => setDoctor(r.data))
      .catch(() => navigate('/doctors'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <div className="page-container"><div className="detail-skeleton" /></div>
  );
  if (!doctor) return null;

  const SPEC_ICONS = { Cardiology:'❤️', Gynecology:'🌸', Neurology:'🧠', Orthopedics:'🦴',
    Dermatology:'🧴', Pediatrics:'👶', ENT:'👂', Ophthalmology:'👁️', Psychiatry:'💬',
    Urology:'🩺', Gastroenterology:'🔬', Pulmonology:'🫁', Oncology:'🎗️',
    Endocrinology:'⚗️', 'General Medicine':'🏥' };

  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-layout">
        {/* Left panel */}
        <div className="detail-sidebar">
          <div className="card detail-profile">
            <div className="detail-avatar">
              <span>{SPEC_ICONS[doctor.specialization] || '👨‍⚕️'}</span>
            </div>
            <h1>Dr. {doctor.name}</h1>
            <span className="spec-tag">{doctor.specialization}</span>

            <div className="detail-stats">
              <div className="dstat"><strong>{doctor.experience}</strong><span>Years Exp.</span></div>
              {doctor.availableTimeSlots && (
                <div className="dstat"><strong>{doctor.availableTimeSlots.length}</strong><span>Slots/Day</span></div>
              )}
            </div>

            {doctor.hospitalName && (
              <div className="detail-hosp">
                <span>🏥</span>
                <div>
                  <strong>{doctor.hospitalName}</strong>
                  <span>{doctor.hospitalCity}</span>
                </div>
              </div>
            )}

            {doctor.workingHours && (
              <div className="detail-hours">
                <span>🕐</span>
                <span>{doctor.workingHours}</span>
              </div>
            )}

            <button
              className="btn btn-primary book-btn"
              onClick={() => {
                if (!user) { navigate('/login'); return; }
                setShowModal(true);
              }}
            >
              Book Appointment
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="detail-main">
          {doctor.availableDays?.length > 0 && (
            <div className="card detail-section">
              <h3>Available Days</h3>
              <div className="days-list">
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
                  <span
                    key={day}
                    className={`day-chip ${doctor.availableDays.includes(day) ? 'day-active' : 'day-off'}`}
                  >
                    {day.slice(0,3)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {doctor.availableTimeSlots?.length > 0 && (
            <div className="card detail-section">
              <h3>Time Slots</h3>
              <div className="slots-grid">
                {doctor.availableTimeSlots.map(slot => (
                  <span key={slot} className="slot-chip">{formatTime(slot)}</span>
                ))}
              </div>
            </div>
          )}

          <div className="card detail-section">
            <h3>Specialization</h3>
            <p style={{color:'var(--text-secondary)', lineHeight:1.7}}>
              {doctor.name} specializes in {doctor.specialization} with {doctor.experience} years of clinical experience.
              {doctor.hospitalName ? ` Currently practicing at ${doctor.hospitalName}, ${doctor.hospitalCity}.` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Booking success */}
      {booked && (
        <div className="modal-overlay" onClick={() => setBooked(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Appointment Confirmed! 🎉</h2>
              <button className="modal-close" onClick={() => setBooked(null)}>✕</button>
            </div>
            <div className="modal-body" style={{textAlign:'center'}}>
              <div className="token-badge">
                <span className="token-label">Your Token Number</span>
                <span className="token-number">{booked.tokenNumber}</span>
                <span className="token-label">{booked.appointmentDate}</span>
              </div>
              <div className="booked-details">
                <p><strong>Doctor:</strong> Dr. {doctor.name}</p>
                <p><strong>Hospital:</strong> {booked.hospitalName}</p>
                <p><strong>Date:</strong> {booked.appointmentDate}</p>
                <p><strong>Time:</strong> {formatTime(booked.appointmentTime)}</p>
                <p><strong>Status:</strong> <span className="badge badge-pending">PENDING</span></p>
              </div>
              <div style={{display:'flex', gap:12, justifyContent:'center', marginTop:20}}>
                <button className="btn btn-outline" onClick={() => { setBooked(null); navigate('/appointments'); }}>
                  View My Appointments
                </button>
                <button className="btn btn-primary" onClick={() => setBooked(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <BookingModal
          doctor={doctor}
          user={user}
          onClose={() => setShowModal(false)}
          onSuccess={(appt) => { setShowModal(false); setBooked(appt); }}
        />
      )}
    </div>
  );
}

function formatTime(t) {
  if (!t) return t;
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${m.toString().padStart(2,'0')} ${ampm}`;
}
