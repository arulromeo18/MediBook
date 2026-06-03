import React, { useState, useEffect } from 'react';
import { doctorAPI, appointmentAPI } from '../services/api';
import './BookingModal.css';

function formatTime(t) {
  if (!t) return t;
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2,'0')} ${ampm}`;
}

// Minimum date = today
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function BookingModal({ doctor, user, onClose, onSuccess }) {
  const [form, setForm] = useState({
    patientName:  user?.name  || '',
    patientEmail: user?.email || '',
    patientPhone: '',
    patientAge:   '',
    healthIssue:  '',
    appointmentDate: '',
    appointmentTime: '',
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots]     = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [error, setError]                   = useState('');
  const [errors, setErrors]                 = useState({});

  // Fetch available slots when date changes
  useEffect(() => {
    if (!form.appointmentDate) { setAvailableSlots([]); return; }
    setLoadingSlots(true);
    setForm(f => ({ ...f, appointmentTime: '' }));
    doctorAPI.getAvailableSlots(doctor.id, form.appointmentDate)
      .then(r => setAvailableSlots(r.data || []))
      .catch(() => setAvailableSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [form.appointmentDate, doctor.id]);

  const handle = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.patientName.trim())  errs.patientName  = 'Name is required';
    if (!form.patientEmail.trim()) errs.patientEmail = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(form.patientEmail)) errs.patientEmail = 'Valid email required';
    if (!form.patientPhone.trim()) errs.patientPhone = 'Phone is required';
    if (!form.patientAge)          errs.patientAge   = 'Age is required';
    if (!form.healthIssue.trim())  errs.healthIssue  = 'Health issue is required';
    if (!form.appointmentDate)     errs.appointmentDate = 'Please select a date';
    if (!form.appointmentTime)     errs.appointmentTime = 'Please select a time slot';
    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setError('');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        patientAge: Number(form.patientAge),
        doctorId:   doctor.id,
        hospitalId: doctor.hospitalId,
      };
      const res = await appointmentAPI.book(payload);
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Book Appointment</h2>
            <p style={{color:'var(--text-secondary)', fontSize:14, marginTop:2}}>
              Dr. {doctor.name} · {doctor.specialization}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            {/* Patient Info */}
            <div className="booking-section-title">Patient Information</div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Full Name *</label>
                <input className={`form-control ${errors.patientName ? 'input-error' : ''}`}
                  name="patientName" value={form.patientName} onChange={handle}
                  placeholder="Patient full name" />
                {errors.patientName && <span className="field-error">{errors.patientName}</span>}
              </div>
              <div className="form-group">
                <label>Age *</label>
                <input className={`form-control ${errors.patientAge ? 'input-error' : ''}`}
                  name="patientAge" type="number" value={form.patientAge} onChange={handle}
                  placeholder="Age" min="1" max="120" />
                {errors.patientAge && <span className="field-error">{errors.patientAge}</span>}
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Email Address *</label>
                <input className={`form-control ${errors.patientEmail ? 'input-error' : ''}`}
                  name="patientEmail" type="email" value={form.patientEmail} onChange={handle}
                  placeholder="email@example.com" />
                {errors.patientEmail && <span className="field-error">{errors.patientEmail}</span>}
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input className={`form-control ${errors.patientPhone ? 'input-error' : ''}`}
                  name="patientPhone" value={form.patientPhone} onChange={handle}
                  placeholder="9876543210" />
                {errors.patientPhone && <span className="field-error">{errors.patientPhone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Health Issue / Description *</label>
              <textarea className={`form-control ${errors.healthIssue ? 'input-error' : ''}`}
                name="healthIssue" value={form.healthIssue} onChange={handle}
                placeholder="Briefly describe your health concern…" rows={3} />
              {errors.healthIssue && <span className="field-error">{errors.healthIssue}</span>}
            </div>

            {/* Appointment */}
            <div className="booking-section-title">Appointment Details</div>

            <div className="form-group">
              <label>Appointment Date *</label>
              <input className={`form-control ${errors.appointmentDate ? 'input-error' : ''}`}
                name="appointmentDate" type="date" value={form.appointmentDate}
                min={todayStr()} onChange={handle} />
              {errors.appointmentDate && <span className="field-error">{errors.appointmentDate}</span>}
            </div>

            {form.appointmentDate && (
              <div className="form-group">
                <label>Available Time Slots *</label>
                {loadingSlots ? (
                  <div className="slots-loading">
                    <span className="spinner spinner-dark" /> Loading available slots…
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="alert alert-info">No available slots for this date. Please choose another date.</div>
                ) : (
                  <div className="slots-picker">
                    {availableSlots.map(slot => (
                      <button
                        type="button"
                        key={slot}
                        className={`slot-btn ${form.appointmentTime === slot ? 'slot-selected' : ''}`}
                        onClick={() => { setForm(f => ({ ...f, appointmentTime: slot })); setErrors(er => ({ ...er, appointmentTime: '' })); }}
                      >
                        {formatTime(slot)}
                      </button>
                    ))}
                  </div>
                )}
                {errors.appointmentTime && <span className="field-error">{errors.appointmentTime}</span>}
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? <><span className="spinner" /> Booking…</> : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
