import React, { useState } from 'react';
import { useSiteContent } from '../../hooks/useSiteContent';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

const DAYS_ID = { monday:'Senin', tuesday:'Selasa', wednesday:'Rabu', thursday:'Kamis', friday:'Jumat', saturday:'Sabtu', sunday:'Minggu' };
const DAY_ORDER = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

export default function KontakPage() {
  const { content, loading } = useSiteContent();
  const c = content?.contact || {};
  const [form, setForm]   = useState({ name: '', phone: '', message: '' });
  const [sent, setSent]   = useState(false);

  if (loading) return <div className="page-loading"><div className="page-loading-spinner" /><p>Memuat...</p></div>;

  const handleWA = (e) => {
    e.preventDefault();
    if (!c.whatsapp) return alert('Nomor WhatsApp belum diatur.');
    const text = encodeURIComponent(`Halo, saya ${form.name} (${form.phone}).\n\n${form.message}`);
    window.open(`https://wa.me/${c.whatsapp}?text=${text}`, '_blank');
    setSent(true);
  };

  const today = DAY_ORDER[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  return (
    <div className="public-page">
      <Navbar />

      <div className="page-hero-sm">
        <span className="section-tag">Kontak</span>
        <h1>Hubungi Kami</h1>
        <p>Kami siap membantu Anda. Jangan ragu untuk menghubungi kami.</p>
      </div>

      <section className="section">
        <div className="section-inner kontak-inner">

          {/* INFO */}
          <div className="kontak-info">
            <h2>Informasi Kontak</h2>
            <div className="kontak-cards">
              {c.address && (
                <div className="kontak-card">
                  <div className="kontak-icon">📍</div>
                  <div><strong>Alamat</strong><p>{c.address}</p></div>
                </div>
              )}
              {c.phone && (
                <div className="kontak-card">
                  <div className="kontak-icon">📞</div>
                  <div><strong>Telepon</strong><p><a href={`tel:${c.phone}`}>{c.phone}</a></p></div>
                </div>
              )}
              {c.email && (
                <div className="kontak-card">
                  <div className="kontak-icon">✉️</div>
                  <div><strong>Email</strong><p><a href={`mailto:${c.email}`}>{c.email}</a></p></div>
                </div>
              )}
              {c.whatsapp && (
                <div className="kontak-card">
                  <div className="kontak-icon">💬</div>
                  <div><strong>WhatsApp</strong><p><a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noreferrer">Chat Sekarang</a></p></div>
                </div>
              )}
              {c.instagram && (
                <div className="kontak-card">
                  <div className="kontak-icon">📸</div>
                  <div><strong>Instagram</strong><p><a href={`https://instagram.com/${c.instagram?.replace('@','')}`} target="_blank" rel="noreferrer">{c.instagram}</a></p></div>
                </div>
              )}
            </div>

            {/* JAM BUKA */}
            {c.openHours && (
              <div className="jam-buka">
                <h3>Jam Operasional</h3>
                <div className="jam-list">
                  {DAY_ORDER.map(day => {
                    const h = c.openHours[day];
                    if (!h) return null;
                    const isToday = day === today;
                    return (
                      <div key={day} className={`jam-row ${isToday ? 'jam-today' : ''}`}>
                        <span className="jam-day">{DAYS_ID[day]}{isToday && <span className="jam-today-badge">Hari ini</span>}</span>
                        <span className="jam-time">
                          {h.isOpen ? `${h.open} – ${h.close}` : <span className="jam-closed">Tutup</span>}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* FORM */}
          <div className="kontak-form-wrap">
            <h2>Kirim Pesan</h2>
            <p className="kontak-form-sub">Pesan akan dikirim via WhatsApp langsung ke kami.</p>
            {sent ? (
              <div className="kontak-success">
                <div className="kontak-success-icon">✅</div>
                <h3>Pesan Terkirim!</h3>
                <p>WhatsApp telah terbuka. Terima kasih sudah menghubungi kami.</p>
                <button className="btn-outline" onClick={() => { setSent(false); setForm({ name:'', phone:'', message:'' }); }}>Kirim Pesan Lagi</button>
              </div>
            ) : (
              <form className="kontak-form" onSubmit={handleWA}>
                <div className="kontak-field">
                  <label>Nama Lengkap</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Budi Santoso" />
                </div>
                <div className="kontak-field">
                  <label>Nomor Telepon</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+62 812-xxxx-xxxx" />
                </div>
                <div className="kontak-field">
                  <label>Pesan</label>
                  <textarea rows={5} required value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Tulis pesan atau pertanyaan Anda..." />
                </div>
                <button type="submit" className="btn-hero-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  💬 Kirim via WhatsApp
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
