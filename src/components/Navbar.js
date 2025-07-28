// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';

export default function Navbar({
  onMenuClick,   // optional
  darkMode,    
  toggleTheme
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');  
    localStorage.removeItem('role');    // <-- CLEAR ROLE ON LOGOUT
    navigate('/login', { replace: true });  // force redirect, disables "back"
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        {onMenuClick && (
          <button onClick={onMenuClick} style={styles.menuBtn}>
            <FiMenu size={24} />
          </button>
        )}
        <Link to="/dashboard" style={styles.logo}>
          CareerCrafter
        </Link>
      </div>

      <div style={styles.actions}>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Log Out
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',         // pin it
    top: 0,                    // to the very top
    left: 0,
    right: 0,
    height: '60px',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 1100,              // sit above everything
    boxSizing: 'border-box'
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  menuBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    marginRight: '1rem',
  },
  logo: {
    textDecoration: 'none',
    color: '#1976d2',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    fontFamily: 'Segoe UI, sans-serif'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  iconBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#1976d2',
    padding: '0.25rem'
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #1976d2',
    color: '#1976d2',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'Segoe UI, sans-serif',
  }
};







