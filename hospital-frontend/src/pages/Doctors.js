import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { doctorAPI, hospitalAPI } from '../services/api';
import './Doctors.css';

const SPECIALIZATIONS = [
  'All','Cardiology','Gynecology','Neurology','Orthopedics','Dermatology',
  'Pediatrics','ENT','Ophthalmology','Psychiatry','Urology',
  'Gastroenterology','Pulmonology','Oncology','Endocrinology','General Medicine'
];

const EXP_ICONS = { Cardiology:'❤️', Gynecology:'🌸', Neurology:'🧠', Orthopedics:'🦴',
  Dermatology:'🧴', Pediatrics:'👶', ENT:'👂', Ophthalmology:'👁️', Psychiatry:'💬',
  Urology:'🩺', Gastroenterology:'🔬', Pulmonology:'🫁', Oncology:'🎗️',
  Endocrinology:'⚗️', 'General Medicine':'🏥' };

export default function Doctors() {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors]   = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [hospitals, setHospitals] = useState({});
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState(searchParams.get('search') || '');
  const [spec, setSpec]         = useState(searchParams.get('specialization') || 'All');
  const [city, setCity]         = useState(searchParams.get('city') || '');
  const [cities, setCities]     = useState([]);

  useEffect(() => {
    Promise.all([doctorAPI.getAll(), hospitalAPI.getAll()])
      .then(([dr, hr]) => {
        const hospMap = {};
        hr.data.forEach(h => { hospMap[h.id] = h; });
        setHospitals(hospMap);
        setDoctors(dr.data);
        const uniqueCities = [...new Set(hr.data.map(h => h.city))].sort();
        setCities(uniqueCities);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...doctors];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.name?.toLowerCase().includes(q) ||
        d.specialization?.toLowerCase().includes(q) ||
        hospitals[d.hospitalId]?.name?.toLowerCase().includes(q) ||
        hospitals[d.hospitalId]?.city?.toLowerCase().includes(q)
      );
    }
    if (spec && spec !== 'All') {
      result = result.filter(d => d.specialization?.toLowerCase() === spec.toLowerCase());
    }
    if (city) {
      result = result.filter(d => hospitals[d.hospitalId]?.city?.toLowerCase() === city.toLowerCase());
    }
    setFiltered(result);
  }, [doctors, search, spec, city, hospitals]);

  const clearFilters = () => { setSearch(''); setSpec('All'); setCity(''); };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Find a Doctor</h1>
        <p>Search from {doctors.length} doctors across multiple hospitals</p>
      </div>

      {/* Filters */}
      <div className="filters-bar card">
        <div className="filter-search">
          <span>🔍</span>
          <input
            className="filter-input"
            placeholder="Search by name, hospital, city…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={spec} onChange={e => setSpec(e.target.value)}>
          {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="filter-select" value={city} onChange={e => setCity(e.target.value)}>
          <option value="">All Cities</option>
          {cities.map(c => <option key={c}>{c}</option>)}
        </select>
        {(search || spec !== 'All' || city) && (
          <button className="btn btn-outline btn-sm" onClick={clearFilters}>Clear</button>
        )}
      </div>

      {/* Results info */}
      {!loading && (
        <p className="results-info">
          Showing <strong>{filtered.length}</strong> doctor{filtered.length !== 1 ? 's' : ''}
          {spec !== 'All' ? ` in ${spec}` : ''}
          {city ? ` · ${city}` : ''}
        </p>
      )}

      {/* Doctor cards */}
      {loading ? (
        <div className="loading-grid">
          {[1,2,3,4,5,6].map(i => <div key={i} className="doctor-skeleton" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">👨‍⚕️</div>
          <h3>No doctors found</h3>
          <p>Try adjusting your search filters</p>
          <button className="btn btn-outline" style={{marginTop:16}} onClick={clearFilters}>Clear Filters</button>
        </div>
      ) : (
        <div className="doctors-grid">
          {filtered.map(doc => {
            const hosp = hospitals[doc.hospitalId];
            return (
              <Link key={doc.id} to={`/doctors/${doc.id}`} className="doctor-card card">
                <div className="doctor-card-header">
                  <div className="doctor-avatar">
                    {EXP_ICONS[doc.specialization] || '👨‍⚕️'}
                  </div>
                  <div className="doctor-info">
                    <h3>Dr. {doc.name}</h3>
                    <span className="spec-tag">{doc.specialization}</span>
                  </div>
                </div>
                <div className="doctor-card-body">
                  {hosp && (
                    <div className="doctor-detail">
                      <span>🏥</span>
                      <span>{hosp.name}</span>
                    </div>
                  )}
                  {hosp && (
                    <div className="doctor-detail">
                      <span>📍</span>
                      <span>{hosp.city}</span>
                    </div>
                  )}
                  <div className="doctor-detail">
                    <span>⏱️</span>
                    <span>{doc.experience} years experience</span>
                  </div>
                  {doc.workingHours && (
                    <div className="doctor-detail">
                      <span>🕐</span>
                      <span>{doc.workingHours}</span>
                    </div>
                  )}
                </div>
                <div className="doctor-card-footer">
                  <span className="available-tag">Available</span>
                  <span className="book-link">Book Now →</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
