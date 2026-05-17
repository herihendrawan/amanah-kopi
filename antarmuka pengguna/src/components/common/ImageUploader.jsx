// Komponen upload gambar: dua mode — file lokal + URL
// Props: value, onChange(url), folder, token
import React, { useRef, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const FOLDER_MAP = {
  menu:    'menu',
  gallery: 'gallery',
  general: 'general',
};

export default function ImageUploader({ value, onChange, folder = 'general', token, label = 'Foto' }) {
  const fileRef  = useRef();
  const [mode,   setMode]    = useState('url');   // 'url' | 'file'
  const [preview, setPreview] = useState(value || '');
  const [urlInput, setUrlInput] = useState(value || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUrlChange = (e) => {
    setUrlInput(e.target.value);
    setPreview(e.target.value);
    onChange(e.target.value);
    setError('');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran
    if (file.size > 8 * 1024 * 1024) {
      setError('Ukuran file maksimal 8MB.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const endpoint = FOLDER_MAP[folder] || 'general';
      const res = await fetch(`${API}/upload/${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      setPreview(data.url);
      setUrlInput(data.url);
      onChange(data.url);
    } catch (err) {
      // Fallback: gunakan base64 lokal jika Cloudinary belum dikonfigurasi
      const reader = new FileReader();
      reader.onload = () => {
        const b64 = reader.result;
        setPreview(b64);
        setUrlInput(b64);
        onChange(b64);
      };
      reader.readAsDataURL(file);
      setError('ℹ️ Cloudinary belum dikonfigurasi — gambar disimpan lokal (base64). Atur CLOUDINARY_* di .env untuk upload ke cloud.');
    }
    setUploading(false);
  };

  const s = {
    wrap:   { marginBottom: 18 },
    label:  { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#4a3728', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 },
    tabs:   { display: 'flex', gap: 0, marginBottom: 10, border: '1.5px solid #e0d8cf', borderRadius: 8, overflow: 'hidden' },
    tab:    (active) => ({ flex: 1, padding: '7px 0', border: 'none', background: active ? '#2c1810' : '#fafaf8', color: active ? '#fff' : '#666', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s' }),
    input:  { width: '100%', padding: '10px 14px', border: '1.5px solid #e0d8cf', borderRadius: 8, fontSize: '0.9rem', background: '#fafaf8', fontFamily: 'inherit' },
    fileBtn:{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '32px 16px', border: '2px dashed #d0c8bf', borderRadius: 8, background: '#fafaf8', cursor: 'pointer', fontSize: '0.9rem', color: '#888', transition: 'all .15s' },
    preview:{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, border: '1.5px solid #e0d8cf', marginTop: 8 },
    err:    { marginTop: 6, fontSize: '0.78rem', color: '#c07000', background: '#fff8ec', padding: '6px 10px', borderRadius: 6, border: '1px solid #f5d88a' },
  };

  return (
    <div style={s.wrap}>
      {label && <label style={s.label}>{label}</label>}
      <div style={s.tabs}>
        <button type="button" style={s.tab(mode === 'url')}  onClick={() => setMode('url')}>🔗 Dari URL</button>
        <button type="button" style={s.tab(mode === 'file')} onClick={() => setMode('file')}>📁 Upload File</button>
      </div>

      {mode === 'url' ? (
        <input
          style={s.input}
          type="text"
          value={urlInput}
          onChange={handleUrlChange}
          placeholder="https://example.com/gambar.jpg"
        />
      ) : (
        <div style={s.fileBtn} onClick={() => fileRef.current.click()}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          {uploading
            ? <span>⏳ Mengupload...</span>
            : <span>🖼️ Klik untuk pilih gambar (JPG, PNG, WebP, maks. 8MB)</span>
          }
        </div>
      )}

      {preview && <img src={preview} alt="preview" style={s.preview} onError={() => setPreview('')} />}
      {error   && <div style={s.err}>{error}</div>}
    </div>
  );
}
