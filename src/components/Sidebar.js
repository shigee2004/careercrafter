// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside style={{
      ...styles.aside,
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
    }}>
      <button onClick={onClose} style={styles.closeBtn}>×</button>
      <ul style={styles.ul}>
        <li><Link to="/my-posts" style={styles.link}>My Posts</Link></li>
        <li><Link to="/profile"  style={styles.link}>Profile</Link></li>
        <li><Link to="/resume"   style={styles.link}>Resume</Link></li>
        <li><Link to="/settings" style={styles.link}>Settings</Link></li>
      </ul>
    </aside>
  );
}

const SIDEBAR_WIDTH = 220;
const styles = {
  aside: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: '100vh',
    background: '#0d47a1',
    color: '#fff',
    padding: '2rem 1rem',
    boxSizing: 'border-box',
    transition: 'transform 0.3s ease-out',
    zIndex: 999
  },
  closeBtn: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    color: '#fff',
    cursor: 'pointer'
  },
  ul: {
    listStyle: 'none',
    padding: 0,
    marginTop: '2rem'
  },
  link: {
    display: 'block',
    color: '#fff',
    textDecoration: 'none',
    padding: '0.75rem 0',
    fontFamily: 'Segoe UI, sans-serif'
  }
};




