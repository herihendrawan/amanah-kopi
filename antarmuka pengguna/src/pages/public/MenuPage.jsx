import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './MenuPage.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const CATS = [
  { id: 'all',        label: 'Semua',      icon: '🍽️' },
  { id: 'coffee',     label: 'Coffee',     icon: '☕' },
  { id: 'non-coffee', label: 'Non-Coffee', icon: '🧃' },
  { id: 'snack',      label: 'Snack',      icon: '🍪' },
];

export default function MenuPage() {
  const [menus,    setMenus]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [active,   setActive]   = useState('all');
  const [search,   setSearch]   = useState('');
  const [added,    setAdded]    = useState({});
  const { addItem, totalItems, setIsOpen } = useCart();

  useEffect(() => {
    fetch(`${API}/menu`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setMenus(d.data); })
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, []);

  const filtered = menus.filter((m) => {
    const matchCat    = active === 'all' || m.category === active;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && m.isAvailable;
  });

  const handleAdd = (menu) => {
    addItem(menu);
    setAdded((prev) => ({ ...prev, [menu._id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [menu._id]: false })), 1200);
  };

  return (
    <div className="menu-page">
      {/* Header */}
      <div className="menu-page-header">
        <div className="menu-page-header-bg" />
        <div className="menu-page-header-content">
          <Link to="/" className="menu-back">← Kembali</Link>
          <h1 className="menu-page-title">Menu <em>Kami</em></h1>
          <p className="menu-page-sub">Pilihan terbaik dari dapur kami, dibuat dengan cinta</p>
        </div>
        {totalItems > 0 && (
          <button className="cart-fab" onClick={() => setIsOpen(true)}>
            🛒 <span className="cart-fab-badge">{totalItems}</span>
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="menu-page-toolbar">
        <div className="menu-page-cats">
          {CATS.map((c) => (
            <button key={c.id} className={`menu-cat-pill ${active === c.id ? 'active' : ''}`} onClick={() => setActive(c.id)}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
        <div className="menu-search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="menu-search-input"
            placeholder="Cari menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
      </div>

      {/* Grid */}
      <div className="menu-page-grid-wrap">
        {loading ? (
          <div className="menu-page-loading">☕ Memuat menu...</div>
        ) : filtered.length === 0 ? (
          <div className="menu-page-empty">
            <div style={{ fontSize: '3rem' }}>🔍</div>
            <p>Menu tidak ditemukan.</p>
            <button onClick={() => { setSearch(''); setActive('all'); }} className="menu-cat-pill active" style={{ marginTop: 12 }}>
              Lihat Semua
            </button>
          </div>
        ) : (
          <div className="menu-page-grid">
            {filtered.map((m) => {
              const price = m.isPromo && m.promoPrice ? m.promoPrice : m.price;
              const isAdded = added[m._id];
              return (
                <div key={m._id} className="menu-page-card">
                  <div className="menu-page-card-img">
                    {m.image
                      ? <img src={m.image} alt={m.name} loading="lazy" />
                      : <div className="menu-page-card-placeholder">{m.category === 'coffee' ? '☕' : m.category === 'snack' ? '🍪' : '🧃'}</div>
                    }
                    {m.isPromo && <span className="menu-promo-tag">Promo</span>}
                    {m.isFeatured && !m.isPromo && <span className="menu-featured-tag">⭐</span>}
                  </div>
                  <div className="menu-page-card-body">
                    <div className="menu-page-card-cat">{m.category.replace('-', ' ')}</div>
                    <h3 className="menu-page-card-name">{m.name}</h3>
                    <p className="menu-page-card-desc">{m.description}</p>
                    <div className="menu-page-card-footer">
                      <div className="menu-page-price">
                        {m.isPromo && m.promoPrice && (
                          <span className="price-strike">{formatRupiah(m.price)}</span>
                        )}
                        <span className={m.isPromo && m.promoPrice ? 'price-promo' : 'price-normal'}>
                          {formatRupiah(price)}
                        </span>
                      </div>
                      <button
                        className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
                        onClick={() => handleAdd(m)}
                      >
                        {isAdded ? '✓ Ditambahkan' : '+ Pesan'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
