import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import './HomePage.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const DAYS_ID = {
  monday:'Senin', tuesday:'Selasa', wednesday:'Rabu', thursday:'Kamis',
  friday:'Jumat', saturday:'Sabtu', sunday:'Minggu'
};

// ─── HOOK: scroll fade-up ─────────────────────────────────
function useFadeUp() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-up');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── NAVBAR ───────────────────────────────────────────────
function Navbar({ siteName, logo }) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const { totalItems, setIsOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <a href="/" className="nav-logo">
        {logo
          ? <span style={{
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              width:42, height:42, borderRadius:10, overflow:'hidden',
              background:'#fff', boxShadow:'0 2px 12px rgba(0,0,0,0.18)',
              flexShrink:0,
            }}>
              <img src={logo} alt={siteName || 'Logo'} style={{ width:38, height:38, objectFit:'contain' }} />
            </span>
          : <span style={{fontSize:'1.6rem'}}>☕</span>
        }
        <span style={{marginLeft:10}}>{siteName || 'Kedai Kopi'}</span>
      </a>
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><a href="#menu"         onClick={(e) => { e.preventDefault(); scrollTo('menu'); }}>Menu</a></li>
        <li><a href="#about"        onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>Tentang</a></li>
        <li><a href="#gallery"      onClick={(e) => { e.preventDefault(); scrollTo('gallery'); }}>Galeri</a></li>
        <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollTo('testimonials'); }}>Ulasan</a></li>
        <li><a href="#contact"      onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>Kontak</a></li>
        <li><a href="#contact" className="nav-cta" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>Hubungi Kami</a></li>
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {totalItems > 0 && (
          <button
            onClick={() => setIsOpen(true)}
            style={{ background: '#c17f4a', color: '#fff', border: 'none', borderRadius: 20, padding: '7px 16px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit' }}
          >
            🛒 {totalItems}
          </button>
        )}
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────
function Hero({ data }) {
  const bgRef = useRef();
  useEffect(() => {
    const img = new Image();
    img.src = data.heroImage;
    img.onload = () => bgRef.current?.classList.add('loaded');
  }, [data.heroImage]);

  // Eyebrow dari CMS: pakai field heroEyebrow, fallback ke tahun + kota
  const eyebrow = data.heroEyebrow || `Sejak ${data.foundedYear || '2018'} · ${data.city || 'Pekanbaru, Riau'}`;

  return (
    <section className="hero">
      <div
        ref={bgRef}
        className="hero-bg"
        style={{ backgroundImage: `url(${data.heroImage || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400'})` }}
      />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-eyebrow">{eyebrow}</div>
        <h1 className="hero-title">
          {data.heroTitle
            ? data.heroTitle.split(' ').map((w, i) => i === 2 ? <em key={i}>{w} </em> : w + ' ')
            : <><em>Kopi Terbaik</em> untuk Hari Terbaikmu</>
          }
        </h1>
        <p className="hero-subtitle">{data.heroSubtitle}</p>
        <div className="hero-actions">
          <a href="/menu" className="btn-hero-primary">
            {data.heroButtonText || 'Lihat Menu'} →
          </a>
          <a href="#about" className="btn-hero-secondary"
            onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Cerita Kami
          </a>
        </div>
      </div>
      <div className="hero-scroll">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}

// ─── STATS BAR ────────────────────────────────────────────
function StatsBar({ menus, foundedYear }) {
  const totalMenu     = menus.length || 0;
  const tahunBerdiri  = parseInt(foundedYear) || 2018;
  const tahunBerjalan = new Date().getFullYear() - tahunBerdiri;

  const stats = [
    { num: `${totalMenu}+`,          label: 'Varian Menu' },
    { num: `${tahunBerjalan} Tahun`, label: 'Beroperasi' },
    { num: '100%',                    label: 'Kopi Lokal' },
    { num: 'Halal',                   label: 'Terjamin' },
  ];
  return (
    <div className="stats-bar">
      {stats.map((s) => (
        <div key={s.label} className="stat-item">
          <div className="stat-num">{s.num}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── MENU ─────────────────────────────────────────────────
function MenuSection({ menus, heroData, waNumber }) {
  const [active, setActive] = useState('all');
  const [added,  setAdded]  = useState({});

  const WA_NUMBER = waNumber || '6281234567890';

  const tabs = [
    { id: 'all',        label: 'Semua' },
    { id: 'coffee',     label: '☕ Coffee' },
    { id: 'non-coffee', label: '🧃 Non-Coffee' },
    { id: 'snack',      label: '🍪 Snack' },
  ];

  const available = menus.filter((m) => {
    const matchCat = active === 'all' || m.category === active;
    return matchCat && m.isAvailable;
  });

  // Re-trigger fade-up setiap kali filter berubah
  useEffect(() => {
    setTimeout(() => {
      document.querySelectorAll('.menu-card').forEach((el) => {
        el.classList.add('visible');
      });
    }, 50);
  }, [active]);

  const handleOrder = (m) => {
    const price    = m.isPromo && m.promoPrice ? m.promoPrice : m.price;
    const fmtPrice = formatRupiah(price);
    const pesan    =
      `Halo, saya ingin memesan:\n\n` +
      `☕ *${m.name}*\n` +
      `💰 ${fmtPrice}\n\n` +
      `Mohon konfirmasi ketersediaan dan total pembayaran. Terima kasih! 🙏`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`, '_blank');
    setAdded((prev) => ({ ...prev, [m._id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [m._id]: false })), 2000);
  };

  return (
    <section id="menu" className="section">
      <div className="menu-section">
        <div className="section-header fade-up">
          <div className="section-eyebrow">{heroData?.menuSectionEyebrow || 'Menu Pilihan'}</div>
          <h2 className="section-title">{heroData?.menuSectionTitle || 'Temukan'} <em>Favorit</em> Kamu</h2>
          <p className="section-subtitle">{heroData?.menuSectionSubtitle || 'Dibuat dengan biji kopi pilihan dari petani lokal terbaik Indonesia, diseduh dengan penuh cinta.'}</p>
        </div>

        <div className="menu-tabs fade-up">
          {tabs.map((t) => (
            <button key={t.id} className={`menu-tab ${active === t.id ? 'active' : ''}`} onClick={() => setActive(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {available.length === 0 && (
            <div className="menu-empty">☕ Menu sedang diperbarui, silakan kunjungi langsung kedai kami.</div>
          )}
          {available.map((m) => (
            <div key={m._id} className="menu-card"  style={{opacity:1,transform:'none'}}>
              {m.image
                ? <img src={m.image} alt={m.name} className="menu-card-img" loading="lazy" />
                : <div className="menu-card-img-placeholder">{m.category === 'coffee' ? '☕' : m.category === 'snack' ? '🍪' : '🧃'}</div>
              }
              <div className="menu-card-body">
                <div className="menu-card-cat">{m.category.replace('-', ' ')}</div>
                <div className="menu-card-name">{m.name}</div>
                <p className="menu-card-desc">{m.description}</p>
                <div className="menu-card-footer">
                  <div>
                    {m.isPromo && m.promoPrice ? (
                      <>
                        <span className="menu-price-old">{formatRupiah(m.price)}</span>
                        <span className="menu-price menu-price-promo">{formatRupiah(m.promoPrice)}</span>
                      </>
                    ) : (
                      <span className="menu-price">{formatRupiah(m.price)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleOrder(m)}
                    style={{
                      padding: '8px 16px',
                      background: added[m._id] ? '#27ae60' : '#1c0f07',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'background 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {added[m._id] ? '✓ WA Dibuka' : '+ Pesan'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <a href="/menu"
            style={{
              display: 'inline-block', padding: '12px 32px',
              border: '1.5px solid #1c0f07', color: '#1c0f07',
              borderRadius: '2px', fontSize: '0.85rem', fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none',
            }}
          >
            Lihat Semua Menu →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────
function AboutSection({ data }) {
  const sinceYear  = data.aboutSinceYear  || data.foundedYear || '2018';
  const sinceLabel = data.aboutSinceLabel || 'Berdiri Sejak';
  return (
    <section id="about" className="section section-alt">
      <div className="about-grid">
        <div className="about-img-wrap fade-up">
          <img
            src={data.aboutImage || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'}
            alt="Tentang Kami" className="about-img" loading="lazy"
          />
          <div className="about-img-accent" />
          <div className="about-since">
            <div className="about-since-year">{sinceYear}</div>
            <div className="about-since-text">{sinceLabel}</div>
          </div>
        </div>
        <div className="about-text fade-up">
          <div className="section-eyebrow">Tentang Kami</div>
          <h2 className="section-title">{data.aboutTitle || 'Cerita di Balik'} <em>Setiap Cangkir</em></h2>
          <p className="about-desc" style={{ marginTop: 20 }}>{data.aboutDescription}</p>
        </div>
      </div>
    </section>
  );
}

// ─── GALLERY ──────────────────────────────────────────────
function GallerySection({ data }) {
  const images = data.galleryImages || [];
  if (images.length === 0) return null;
  return (
    <section id="gallery" className="section">
      <div className="section-header fade-up" style={{ textAlign: 'center' }}>
        <div className="section-eyebrow">Galeri</div>
        <h2 className="section-title">{data.galleryTitle || 'Momen di'} <em>Kedai Kami</em></h2>
      </div>
      <div className="gallery-grid fade-up">
        {images.map((img) => (
          <div key={img._id} className="gallery-item">
            <img src={img.url} alt={img.caption || 'Galeri'} loading="lazy" />
            {img.caption && (
              <div className="gallery-overlay">
                <p className="gallery-caption">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
function TestimonialsSection({ data }) {
  const items = (data.testimonials || []).filter((t) => t.isVisible);
  if (items.length === 0) return null;

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) : '';

  return (
    <section id="testimonials" className="section section-alt">
      <div className="testimonials-wrap">
        <div className="section-header fade-up" style={{ textAlign: 'center' }}>
          <div className="section-eyebrow">Ulasan Pelanggan</div>
          <h2 className="section-title">{data.testimonialsTitle || 'Apa Kata'} <em>Mereka?</em></h2>
          <p className="section-subtitle" style={{ margin: '12px auto 0' }}>
            {items.length} ulasan dari pelanggan setia kami
          </p>
        </div>
        <div className="testimonials-grid">
          {items.map((t) => (
            <div key={t._id} className="testimonial-card fade-up">
              {/* Rating bintang di atas */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <div className="testimonial-stars" style={{ fontSize:'1rem', letterSpacing:2 }}>
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
                {t.createdAt && (
                  <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{fmtDate(t.createdAt)}</span>
                )}
              </div>
              <span className="testimonial-quote">"</span>
              <p className="testimonial-text">{t.comment}</p>
              <div className="testimonial-footer">
                <div className="testimonial-avatar">
                  {t.avatar
                    ? <img src={t.avatar} alt={t.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : <span style={{ fontSize:'1.3rem' }}>👤</span>
                  }
                </div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div style={{ fontSize:'0.78rem', color:'var(--brown-warm)', marginTop:2 }}>Pelanggan Setia</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────
function ContactSection({ data }) {
  const hours = data.openHours || {};
  return (
    <section id="contact" className="section">
      <div className="contact-grid">
        <div className="contact-info fade-up">
          <div className="section-eyebrow">Kontak & Lokasi</div>
          <h2 className="section-title">Temui <em>Kami</em></h2>
          <div style={{ marginTop: 32 }}>
            {data.address && (
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <div className="contact-detail-label">Alamat</div>
                  <div className="contact-detail-value">{data.address}</div>
                </div>
              </div>
            )}
            {data.phone && (
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <div className="contact-detail-label">Telepon</div>
                  <div className="contact-detail-value"><a href={`tel:${data.phone}`}>{data.phone}</a></div>
                </div>
              </div>
            )}
            {data.email && (
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <div className="contact-detail-label">Email</div>
                  <div className="contact-detail-value"><a href={`mailto:${data.email}`}>{data.email}</a></div>
                </div>
              </div>
            )}
            {data.whatsapp && (
              <div className="contact-item">
                <div className="contact-icon">💬</div>
                <div>
                  <div className="contact-detail-label">WhatsApp</div>
                  <div className="contact-detail-value">
                    <a href={`https://wa.me/${data.whatsapp}`} target="_blank" rel="noreferrer">Chat via WhatsApp →</a>
                  </div>
                </div>
              </div>
            )}
            {Object.keys(hours).length > 0 && (
              <div className="contact-item">
                <div className="contact-icon">🕐</div>
                <div style={{ flex: 1 }}>
                  <div className="contact-detail-label">Jam Buka</div>
                  <table className="hours-table">
                    <tbody>
                      {Object.entries(DAYS_ID).map(([key, label]) => {
                        const h = hours[key];
                        return (
                          <tr key={key}>
                            <td>{label}</td>
                            <td className={!h?.isOpen ? 'closed' : ''}>
                              {h?.isOpen ? `${h.open} – ${h.close}` : 'Tutup'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="social-links">
              {data.instagram && (
                <a href={`https://instagram.com/${data.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="social-link" title="Instagram">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {data.facebook && (
                <a href={`https://facebook.com/${data.facebook}`} target="_blank" rel="noreferrer" className="social-link" title="Facebook">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {data.whatsapp && (
                <a href={`https://wa.me/${data.whatsapp}`} target="_blank" rel="noreferrer" className="social-link" title="WhatsApp">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="fade-up">
          <div className="contact-map-placeholder">
            <span>📍</span>
            <p>Temukan kami di</p>
            <p className="contact-map-addr">{data.address || 'Pekanbaru, Riau'}</p>
            {data.address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(data.address)}`}
                target="_blank" rel="noreferrer"
                style={{ marginTop: 16, padding: '10px 24px', background: '#2d1a0e', color: '#fff', borderRadius: 2, fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}
              >
                Buka di Google Maps →
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── POPUP PESAN KOPI ─────────────────────────────────────
function OrderPopup({ menus, waNumber, onClose }) {
  const WA_NUMBER = waNumber || '6281234567890';
  const [selected, setSelected] = useState(null);
  const [qty,      setQty]      = useState(1);
  const [note,     setNote]     = useState('');

  const available = menus.filter(m => m.isAvailable);

  const handleSend = () => {
    if (!selected) return;
    const price  = selected.isPromo && selected.promoPrice ? selected.promoPrice : selected.price;
    const total  = formatRupiah(price * qty);
    const pesan  =
      `Halo Amanah Kopi! Saya ingin memesan:\n\n` +
      `☕ *${selected.name}* × ${qty}\n` +
      `💰 Total: ${total}\n` +
      (note ? `📝 Catatan: ${note}\n` : '') +
      `\nMohon konfirmasi ketersediaan. Terima kasih! 🙏`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`, '_blank');
    onClose();
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      {/* Overlay */}
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(28,15,7,0.65)', backdropFilter:'blur(4px)' }}/>
      {/* Modal */}
      <div style={{
        position:'relative', background:'#fff', borderRadius:14, padding:'28px 24px',
        width:'100%', maxWidth:440, maxHeight:'85vh', overflowY:'auto',
        boxShadow:'0 24px 64px rgba(28,15,7,0.25)', fontFamily:"'DM Sans',sans-serif",
      }}>
        <button onClick={onClose} style={{ position:'absolute', top:14, right:16, background:'none', border:'none', fontSize:'1.3rem', cursor:'pointer', color:'#888' }}>✕</button>
        <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.6rem', fontWeight:700, color:'#1c0f07', marginBottom:4 }}>
          ☕ Pesan Kopi
        </h3>
        <p style={{ fontSize:'.85rem', color:'#8a6a58', marginBottom:20 }}>Pilih menu dan kami siapkan via WhatsApp</p>

        {/* Pilih Menu */}
        <div style={{ marginBottom:16 }}>
          <label style={{ display:'block', fontSize:'.75rem', fontWeight:700, color:'#4a3728', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8 }}>Pilih Menu</label>
          <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:220, overflowY:'auto' }}>
            {available.map(m => {
              const price = m.isPromo && m.promoPrice ? m.promoPrice : m.price;
              const isSelected = selected?._id === m._id;
              return (
                <div key={m._id} onClick={() => setSelected(m)}
                  style={{
                    display:'flex', alignItems:'center', gap:12, padding:'10px 14px',
                    border:`2px solid ${isSelected ? '#1c0f07' : '#e8e0d5'}`,
                    borderRadius:8, cursor:'pointer', background: isSelected ? '#faf6f0' : '#fff',
                    transition:'all .15s',
                  }}>
                  <div style={{ width:44, height:44, borderRadius:6, overflow:'hidden', background:'#f0ebe4', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>
                    {m.image ? <img src={m.image} alt={m.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : '☕'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'.9rem', fontWeight:600, color:'#1c0f07', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.name}</div>
                    <div style={{ fontSize:'.78rem', color:'#c17f4a', fontWeight:600 }}>{formatRupiah(price)}</div>
                  </div>
                  {isSelected && <span style={{ fontSize:'1.1rem' }}>✅</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Jumlah */}
        {selected && (
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:'.75rem', fontWeight:700, color:'#4a3728', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8 }}>Jumlah</label>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <button onClick={() => setQty(q => Math.max(1, q-1))} style={{ width:36, height:36, border:'1.5px solid #e0d0bc', borderRadius:6, background:'#fff', cursor:'pointer', fontSize:'1.1rem', fontWeight:700 }}>−</button>
              <span style={{ fontSize:'1.1rem', fontWeight:700, minWidth:24, textAlign:'center' }}>{qty}</span>
              <button onClick={() => setQty(q => q+1)} style={{ width:36, height:36, border:'1.5px solid #e0d0bc', borderRadius:6, background:'#fff', cursor:'pointer', fontSize:'1.1rem', fontWeight:700 }}>+</button>
              <span style={{ fontSize:'.9rem', color:'#888', marginLeft:4 }}>
                = {formatRupiah((selected.isPromo && selected.promoPrice ? selected.promoPrice : selected.price) * qty)}
              </span>
            </div>
          </div>
        )}

        {/* Catatan */}
        <div style={{ marginBottom:20 }}>
          <label style={{ display:'block', fontSize:'.75rem', fontWeight:700, color:'#4a3728', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8 }}>Catatan (opsional)</label>
          <textarea rows={2} value={note} onChange={e=>setNote(e.target.value)}
            placeholder="Contoh: tanpa gula, es batu extra, dll..."
            style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #e0d0bc', borderRadius:8, fontFamily:'inherit', fontSize:'.9rem', resize:'none', background:'#faf6f0' }}/>
        </div>

        <button onClick={handleSend} disabled={!selected}
          style={{
            width:'100%', padding:'14px', background: selected ? '#25D366' : '#ccc',
            color:'#fff', border:'none', borderRadius:8, fontSize:'1rem', fontWeight:700,
            cursor: selected ? 'pointer' : 'not-allowed', fontFamily:'inherit',
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            transition:'background .2s',
          }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {selected ? `Pesan via WhatsApp` : 'Pilih menu dulu'}
        </button>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────
function Footer({ branding, contact }) {
  const tagline = branding?.footerTagline || 'Menyajikan pengalaman kopi terbaik dari biji pilihan petani lokal Indonesia.';
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            {branding?.logo
              ? <img src={branding.logo} alt={branding.siteName} style={{height:32,objectFit:'contain',marginRight:8,verticalAlign:'middle'}}/>
              : '☕'
            }
            <span> {branding?.siteName || 'Kedai Kopi Modern'}</span>
          </div>
          <p className="footer-desc">{tagline}</p>
        </div>
        <div className="footer-links">
          <h4>Menu</h4>
          <ul>
            <li><a href="/menu">Coffee</a></li>
            <li><a href="/menu">Non-Coffee</a></li>
            <li><a href="/menu">Snack</a></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Info</h4>
          <ul>
            <li><a href="#about">Tentang Kami</a></li>
            <li><a href="#gallery">Galeri</a></li>
            <li><a href="#contact">Kontak</a></li>
          </ul>
        </div>
        {contact?.whatsapp && (
          <div className="footer-links">
            <h4>Pesan Sekarang</h4>
            <ul>
              <li><a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp ↗</a></li>
              {contact.instagram && (
                <li><a href={`https://instagram.com/${contact.instagram.replace('@','')}`} target="_blank" rel="noreferrer">Instagram ↗</a></li>
              )}
            </ul>
          </div>
        )}
      </div>
      <div className="footer-bottom">
        <p className="footer-copy">© {new Date().getFullYear()} {branding?.siteName || 'Kedai Kopi Modern'}. All rights reserved.</p>
        <div className="footer-admin"><a href="/admin/cms">Admin ↗</a></div>
      </div>
    </footer>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────
export default function HomePage() {
  const [content,      setContent]      = useState(null);
  const [menus,        setMenus]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showPopup,    setShowPopup]    = useState(false);

  useFadeUp();

  useEffect(() => {
    Promise.all([
      fetch(`${API}/content`).then((r) => r.json()),
      fetch(`${API}/menu`).then((r) => r.json()),
    ])
      .then(([contentData, menuData]) => {
        if (contentData.success) {
          const raw = contentData.data;
          const map = {};
          if (Array.isArray(raw)) {
            raw.forEach((s) => { if (s.section) map[s.section] = s; });
          } else {
            Object.assign(map, raw);
          }
          setContent(map);
        }
        if (menuData.success) setMenus(menuData.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!content) return;
    setTimeout(() => {
      const els = document.querySelectorAll('.fade-up:not(.visible)');
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
      }, { threshold: 0.12 });
      els.forEach((el) => obs.observe(el));
      return () => obs.disconnect();
    }, 100);
  }, [content]);

  if (loading) return (
    <div className="page-loading"><div className="loading-cup">☕</div></div>
  );

  if (!content) return (
    <div className="page-loading">
      <p style={{ color: '#8a6a58' }}>Gagal memuat konten. Pastikan server backend berjalan.</p>
    </div>
  );

  return (
    <div>
      <Navbar siteName={content.branding?.siteName} logo={content.branding?.logo} />
      <Hero data={content.hero || {}} />
      <StatsBar menus={menus} foundedYear={content.hero?.foundedYear} />
      <MenuSection menus={menus} heroData={content.hero} waNumber={content.contact?.whatsapp} />
      <AboutSection        data={content.about   || {}} />
      <GallerySection      data={content.gallery  || {}} />
      <ContactSection      data={content.contact  || {}} />
      <Footer branding={content.branding} contact={content.contact} />

      {/* Floating tombol pesan */}
      <button
        onClick={() => setShowPopup(true)}
        style={{
          position:'fixed', bottom:28, right:28, zIndex:900,
          background:'#25D366', color:'#fff',
          border:'none', borderRadius:50, padding:'14px 22px',
          fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:'0.95rem',
          cursor:'pointer', display:'flex', alignItems:'center', gap:10,
          boxShadow:'0 6px 28px rgba(37,211,102,0.4)',
          transition:'transform .2s, box-shadow .2s',
        }}
        onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 10px 36px rgba(37,211,102,0.5)';}}
        onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 6px 28px rgba(37,211,102,0.4)';}}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Pesan Sekarang
      </button>

      {/* Popup order */}
      {showPopup && <OrderPopup menus={menus} waNumber={content.contact?.whatsapp} onClose={() => setShowPopup(false)} />}
    </div>
  );
}