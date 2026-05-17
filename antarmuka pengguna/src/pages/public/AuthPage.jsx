import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthPage.css';

export default function AuthPage() {
  const [mode,     setMode]     = useState('login'); // 'login' | 'register'
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'register') {
        if (!name.trim()) return setError('Nama wajib diisi.');
        if (password.length < 6) return setError('Password minimal 6 karakter.');
        if (password !== confirm) return setError('Password dan konfirmasi tidak cocok.');
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card">
        <Link to="/" className="auth-back">← Kembali ke Website</Link>
        <div className="auth-logo">☕</div>
        <h1 className="auth-title">{mode === 'login' ? 'Selamat Datang' : 'Buat Akun'}</h1>
        <p className="auth-sub">{mode === 'login' ? 'Login untuk melakukan pesanan' : 'Daftar untuk pengalaman lebih baik'}</p>

        <div className="auth-tabs">
          <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Login</button>
          <button className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError(''); }}>Daftar</button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="auth-field">
              <label>Nama Lengkap</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Budi Santoso" required />
            </div>
          )}
          <div className="auth-field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" required />
          </div>
          {mode === 'register' && (
            <div className="auth-field">
              <label>Konfirmasi Password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Ulangi password" required />
            </div>
          )}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Memproses...' : mode === 'login' ? 'Masuk →' : 'Buat Akun →'}
          </button>
        </form>

        {mode === 'login' && (
          <p className="auth-hint">Belum punya akun? <button onClick={() => setMode('register')} className="auth-link">Daftar sekarang</button></p>
        )}
      </div>
    </div>
  );
}
