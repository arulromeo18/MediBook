import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { searchAPI } from '../services/api';
import './Navbar.css';

function debounce(fn, ms) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery]           = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDrop, setShowDrop]     = useState(false);
  const [searching, setSearching]   = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setShowDrop(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const fetchSuggestions = useCallback(
    debounce(async (q) => {
      if (!q || q.length < 1) { setSuggestions([]); setShowDrop(false); return; }
      setSearching(true);
      try {
        const res = await searchAPI.suggestions(q);
        setSuggestions(res.data || []);
        setShowDrop(true);
      } catch { setSuggestions([]); }
      finally { setSearching(false); }
    }, 280),
    []
  );

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    fetchSuggestions(val);
  };

  const handleSuggestionClick = (s) => {
    setShowDrop(false);
    setQuery('');
    if (s.navigateTo) navigate(s.navigateTo);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowDrop(false);
    navigate(`/doctors?search=${encodeURIComponent(query.trim())}`);
    setQuery('');
  };

  const typeIcon = (type) => {
    switch(type) {
      case 'DOCTOR': return '👨‍⚕️';
      case 'HOSPITAL': return '🏥';
      case 'CITY': return '📍';
      case 'SPECIALIZATION': return '🔬';
      default: return '🔍';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">✚</span>
          <span className="brand-text">MediBook</span>
        </Link>

        {/* Search bar */}
        <div className="navbar-search" ref={dropRef}>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search doctors, hospitals, cities…"
              value={query}
              onChange={handleInput}
              onFocus={() => suggestions.length > 0 && setShowDrop(true)}
              autoComplete="off"
            />
            {searching && <span className="search-spinner" />}
          </form>

          {showDrop && suggestions.length > 0 && (
            <div className="search-dropdown">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  className="suggestion-item"
                  onMouseDown={() => handleSuggestionClick(s)}
                >
                  <span className="suggestion-icon">{typeIcon(s.type)}</span>
                  <span className="suggestion-content">
                    <span className="suggestion-label">{s.label}</span>
                    {s.subLabel && <span className="suggestion-sub">{s.subLabel}</span>}
                  </span>
                  <span className={`suggestion-type type-${s.type?.toLowerCase()}`}>{s.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="menu">
          <span /><span /><span />
        </button>

        {/* Nav links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/doctors" className="nav-link">Find Doctors</Link>

          {user ? (
            <>
              {isAdmin() && <Link to="/admin" className="nav-link">Admin</Link>}
              <Link to="/appointments" className="nav-link">My Appointments</Link>
              <div className="nav-user">
                <span className="user-name">{user.name?.split(' ')[0]}</span>
                <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login"    className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
