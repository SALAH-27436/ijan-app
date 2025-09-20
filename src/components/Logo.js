// src/components/Logo.js
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => (
  <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
    {/* SVG Logo Code (الخيار 1) */}
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="#1e3c72"/>
  <path d="M12 11l-6 3 6 3 6-3-6-3zm0-4.5L18 9 12 12 6 9l6-2.5z" fill="#ffdd57" fill-opacity="0.8"/>
</svg>
    <div className="nav-logo" style={{ margin: 0, padding: 0 }}>
      IJAN
    </div>
  </Link>
);

export default Logo;