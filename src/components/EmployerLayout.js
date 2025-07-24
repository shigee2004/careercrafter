// src/components/EmployerLayout.jsx
import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const SIDEBAR_WIDTH = 220;

export default function EmployerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex' }}>
      {/* fixed sidebar on the left */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role="employer"          // only shows the 3 employer links
      />

      <div style={{ flexGrow: 1 }}>
        {/* fixed top nav */}
        <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />

        {/* main content, pushed down by 60px and over by sidebar width */}
        <main
          style={{
            marginTop: 60,            // push down below navbar
            marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
            transition: 'margin-left 0.3s ease-out',
            padding: '2rem',
            minHeight: `calc(100vh - 60px)`,
            background: '#f5f7fa'
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
