// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const SIDEBAR_WIDTH = 220;

export default function Sidebar({ isOpen, onClose, role }) {
  // slide in/out
  const transform = isOpen ? 'translateX(0)' : `translateX(-${SIDEBAR_WIDTH}px)`;

  return (
    <aside style={{ 
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
      transform,
      zIndex: 900
    }}>
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          background: 'transparent',
          border: 'none',
          fontSize: '1.5rem',
          color: '#fff',
          cursor: 'pointer'
        }}
      >×</button>

      <nav style={{ marginTop: '3rem' }}>
        {(role === 'employer' ? [
          { to: '/employer/post',   label: 'Post Job Listing' },
          { to: '/employer/manage', label: 'Manage Job Listings' },
          
          { to: '/employer/apps',   label: 'View Applications' },
        ] : [
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/profile',   label: 'My Profile' },
          { to: '/resume',    label: 'My Resume' },
          
        ]).map(link => (
          <Link 
            key={link.to}
            to={link.to}
            style={{
              display: 'block',
              color: '#fff',
              textDecoration: 'none',
              padding: '0.75rem 0',
              fontFamily: 'Segoe UI, sans-serif'
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}





