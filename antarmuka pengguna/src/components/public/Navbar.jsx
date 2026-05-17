import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteContent } from '../../hooks/useSiteContent';

export default function Navbar() {
  const { content } = useSiteContent();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const location = useLocation();

  const branding = content?.branding || {};
  const siteName = branding.siteName || 'Kedai Kopi';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const links = [
    { to: '/',       label: 'Beranda' },
    { to: '/menu',   label: 'Menu' },
    { to: '/about',  label: 'Tentang' },
    { to: '/kontak', label: 'Kontak' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          {branding.logo
            ? <img src={branding.logo} alt={siteName} className="navbar-logo" />
            : <span className="navbar-brand-text">☕ {siteName}</span>
          }
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`navbar-link ${location.pathname === l.to ? 'active' : ''}`}
            >{l.label}</Link>
          ))}
          <Link to="/menu" className="navbar-cta">Pesan Sekarang</Link>
        </div>

        <button className="navbar-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
