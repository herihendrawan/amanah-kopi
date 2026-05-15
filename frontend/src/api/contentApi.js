const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');
const authH    = () => ({ 'Content-Type':'application/json', Authorization:`Bearer ${getToken()}` });

// ─── CONTENT ──────────────────────────────────────────────
export const fetchAllContent = async () => {
  const res  = await fetch(`${BASE}/content`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  // Normalise: bisa array atau object
  const raw = data.data;
  if (Array.isArray(raw)) {
    const map = {};
    raw.forEach(s => { if (s.section) map[s.section] = s; });
    return map;
  }
  return raw;
};

export const updateSection = async (section, payload) => {
  const res  = await fetch(`${BASE}/content/${section}`, { method:'PUT', headers:authH(), body:JSON.stringify(payload) });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

// Gallery
export const addGalleryImage   = async ({ url, caption }) => {
  const res  = await fetch(`${BASE}/content/gallery/images`, { method:'POST', headers:authH(), body:JSON.stringify({ url, caption }) });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
export const deleteGalleryImage = async (id) => {
  const res  = await fetch(`${BASE}/content/gallery/images/${id}`, { method:'DELETE', headers:authH() });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

// Testimonials
export const addTestimonial    = async (payload) => {
  const res  = await fetch(`${BASE}/content/testimonials/items`, { method:'POST', headers:authH(), body:JSON.stringify(payload) });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
export const updateTestimonial = async (id, payload) => {
  const res  = await fetch(`${BASE}/content/testimonials/items/${id}`, { method:'PUT', headers:authH(), body:JSON.stringify(payload) });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
export const deleteTestimonial = async (id) => {
  const res  = await fetch(`${BASE}/content/testimonials/items/${id}`, { method:'DELETE', headers:authH() });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

// ─── MENU ─────────────────────────────────────────────────
export const fetchMenus  = async (params={}) => {
  const q    = new URLSearchParams(params).toString();
  const res  = await fetch(`${BASE}/menu${q?'?'+q:''}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
export const createMenu  = async (payload) => {
  const res  = await fetch(`${BASE}/menu`, { method:'POST', headers:authH(), body:JSON.stringify(payload) });
  const data = await res.json();
  if (!data.success) throw new Error(data.message||JSON.stringify(data.errors));
  return data.data;
};
export const updateMenu  = async (id, payload) => {
  const res  = await fetch(`${BASE}/menu/${id}`, { method:'PUT', headers:authH(), body:JSON.stringify(payload) });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
export const deleteMenu  = async (id) => {
  const res  = await fetch(`${BASE}/menu/${id}`, { method:'DELETE', headers:authH() });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

// ─── DASHBOARD ────────────────────────────────────────────
export const fetchDashboardStats = async () => {
  const res  = await fetch(`${BASE}/admin/stats`, { headers:authH() });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
