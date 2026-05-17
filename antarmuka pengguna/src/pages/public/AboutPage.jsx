import React from 'react';
import { useSiteContent } from '../../hooks/useSiteContent';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

export default function AboutPage() {
  const { content, loading } = useSiteContent();
  const about   = content?.about   || {};
  const contact = content?.contact || {};

  if (loading) return <div className="page-loading"><div className="page-loading-spinner" /><p>Memuat...</p></div>;

  return (
    <div className="public-page">
      <Navbar />

      <div className="page-hero-sm">
        <span className="section-tag">Tentang Kami</span>
        <h1>{about.aboutTitle || 'Tentang Kedai Kami'}</h1>
        <p>Mengenal lebih dekat cerita di balik secangkir kopi kami.</p>
      </div>

      <section className="section">
        <div className="section-inner about-full-inner">
          <div className="about-full-img-wrap">
            {about.aboutImage
              ? <img src={about.aboutImage} alt="Tentang Kami" className="about-full-img" />
              : <div className="about-full-placeholder">☕</div>
            }
          </div>
          <div className="about-full-text">
            <p className="about-full-desc">{about.aboutDescription}</p>

            <div className="about-vm-grid">
              <div className="about-vm-card">
                <div className="about-vm-icon">🎯</div>
                <h3>Misi</h3>
                <p>{about.aboutMission}</p>
              </div>
              <div className="about-vm-card">
                <div className="about-vm-icon">🌟</div>
                <h3>Visi</h3>
                <p>{about.aboutVision}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">Nilai Kami</span>
            <h2 className="section-title">Yang Membuat Kami Berbeda</h2>
          </div>
          <div className="values-grid">
            {[
              { icon: '🌱', title: 'Bahan Lokal',    desc: 'Kami menggunakan biji kopi pilihan dari petani lokal terbaik Indonesia.' },
              { icon: '❤️', title: 'Penuh Kasih',    desc: 'Setiap cangkir diseduh dengan perhatian dan dedikasi penuh.' },
              { icon: '♻️', title: 'Ramah Lingkungan', desc: 'Kami berkomitmen untuk operasional yang berkelanjutan dan ramah lingkungan.' },
              { icon: '👨‍👩‍👧', title: 'Komunitas',      desc: 'Kedai kami adalah ruang berkumpul yang hangat untuk semua kalangan.' },
            ].map(v => (
              <div key={v.title} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
