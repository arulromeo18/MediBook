import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hospitalAPI, doctorAPI } from '../services/api';
import './Home.css';

const SPECIALIZATIONS = [
  'Cardiology','Gynecology','Neurology','Orthopedics','Dermatology',
  'Pediatrics','ENT','Ophthalmology','Psychiatry','Urology',
  'Gastroenterology','Pulmonology','Oncology','Endocrinology','General Medicine'
];

const SPEC_ICONS = {
  Cardiology:'❤️', Gynecology:'🌸', Neurology:'🧠', Orthopedics:'🦴',
  Dermatology:'🧴', Pediatrics:'👶', ENT:'👂', Ophthalmology:'👁️',
  Psychiatry:'💬', Urology:'🩺', Gastroenterology:'🔬', Pulmonology:'🫁',
  Oncology:'🎗️', Endocrinology:'⚗️', 'General Medicine':'🏥'
};

export default function Home() {
  const [stats, setStats]       = useState({ hospitals: 0, doctors: 0 });
  const [searchQ, setSearchQ]   = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([hospitalAPI.getAll(), doctorAPI.getAll()])
      .then(([h, d]) => setStats({ hospitals: h.data.length, doctors: d.data.length }))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) navigate(`/doctors?search=${encodeURIComponent(searchQ.trim())}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tagline">Trusted Healthcare at Your Fingertips</p>
          <h1 className="hero-title">Book Your Doctor<br />Appointment Online</h1>
          <p className="hero-sub">Find the right specialist, choose your time, and get a confirmed token — instantly.</p>

          <form className="hero-search" onSubmit={handleSearch}>
            <span className="hero-search-icon">🔍</span>
            <input
              className="hero-search-input"
              placeholder="Search by doctor name, hospital, or city…"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          <div className="hero-stats">
            <div className="stat"><strong>{stats.doctors}+</strong><span>Doctors</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>{stats.hospitals}+</strong><span>Hospitals</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>15+</strong><span>Specializations</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-float card-1">
            <span>🏥</span><span>Apollo Hospital</span>
          </div>
          <div className="hero-blob" />
          <div className="hero-card-float card-2">
            <span>✅</span><span>Slot Confirmed</span>
          </div>
          <div className="hero-card-float card-3">
            <span>🎟️</span><span>Token #7</span>
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="section">
        <div className="page-container">
          <div className="section-header">
            <h2>Browse by Specialization</h2>
            <p>Find the right specialist for your health needs</p>
          </div>
          <div className="spec-grid">
            {SPECIALIZATIONS.map(s => (
              <Link
                key={s}
                to={`/doctors?specialization=${encodeURIComponent(s)}`}
                className="spec-card"
              >
                <span className="spec-icon">{SPEC_ICONS[s]}</span>
                <span className="spec-name">{s}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section section-alt">
        <div className="page-container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Book an appointment in three simple steps</p>
          </div>
          <div className="steps-grid">
            {[
              { n:'1', icon:'🔍', title:'Search Doctor', desc:'Find a doctor by name, hospital, city, or specialization.' },
              { n:'2', icon:'📅', title:'Choose Slot',   desc:'Pick an available date and time from the doctor\'s schedule.' },
              { n:'3', icon:'🎟️', title:'Get Token',    desc:'Receive your daily token number and appointment confirmation.' },
            ].map(s => (
              <div key={s.n} className="step-card card">
                <div className="step-number">{s.n}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="cta-center">
            <Link to="/doctors" className="btn btn-primary">Find a Doctor →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
