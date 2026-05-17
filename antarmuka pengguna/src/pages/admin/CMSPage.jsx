// CMS lengkap: Dashboard, Branding, Hero, About, Kontak, Galeri, Testimoni, Menu, Orders
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ImageUploader from '../../components/common/ImageUploader';
import {
  fetchAllContent, updateSection,
  addGalleryImage, deleteGalleryImage,
  addTestimonial, updateTestimonial, deleteTestimonial,
  fetchMenus, createMenu, updateMenu, deleteMenu,
  fetchDashboardStats,
} from '../../api/contentApi';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');
const authH    = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

const DAYS = [
  { key:'monday',    label:'Senin' },{ key:'tuesday',   label:'Selasa' },
  { key:'wednesday', label:'Rabu'  },{ key:'thursday',  label:'Kamis'  },
  { key:'friday',    label:'Jumat' },{ key:'saturday',  label:'Sabtu'  },
  { key:'sunday',    label:'Minggu'},
];

const TABS = [
  { id:'dashboard',    label:'📊 Dashboard'      },
  { id:'orders',       label:'📦 Kelola Order'    },
  { id:'branding',     label:'🎨 Branding'        },
  { id:'hero',         label:'🏠 Hero'            },
  { id:'about',        label:'📖 Tentang'         },
  { id:'contact',      label:'📞 Kontak & Jam'    },
  { id:'gallery',      label:'🖼️ Galeri'          },
  { id:'testimonials', label:'⭐ Testimoni'        },
  { id:'menu',         label:'☕ Kelola Menu'      },
];

const CONTENT_TABS = ['branding','hero','about','contact'];
const EMPTY_MENU   = { name:'', description:'', price:'', category:'coffee', image:'', isAvailable:true, isFeatured:false, isPromo:false, promoPrice:'' };

const STATUS_COLORS = { pending:'#e67e22', diproses:'#2980b9', selesai:'#27ae60', dibatalkan:'#c0392b' };
const STATUS_LABELS = { pending:'⏳ Pending', diproses:'👨‍🍳 Diproses', selesai:'✅ Selesai', dibatalkan:'❌ Dibatalkan' };

// ─── HELPERS ──────────────────────────────────────────────
const Field = ({ label, value, onChange, placeholder, type='text' }) => (
  <div className="cms-field">
    <label>{label}</label>
    <input type={type} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
  </div>
);
const Textarea = ({ label, value, onChange, placeholder, rows=4 }) => (
  <div className="cms-field">
    <label>{label}</label>
    <textarea rows={rows} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
  </div>
);
const Toast = ({ msg, type }) => msg ? <div className={`toast toast--${type}`}>{msg}</div> : null;
const fmtRp = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n||0);
const fmtDate = d => new Date(d).toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});

// ─── DASHBOARD ────────────────────────────────────────────
const DashboardPanel = () => {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(()=>{
    fetchDashboardStats().then(setStats).catch(e=>setError(e.message)).finally(()=>setLoading(false));
  },[]);

  if(loading) return <div className="panel"><p className="empty">⏳ Memuat statistik...</p></div>;
  if(error)   return <div className="panel"><p className="empty" style={{color:'#c00'}}>❌ {error}</p></div>;

  const cards = [
    {label:'Total Pesanan',      value:stats.totalOrders,                  icon:'📦', color:'#2c1810'},
    {label:'Pesanan Hari Ini',   value:stats.todayOrders,                  icon:'🕐', color:'#c8956c'},
    {label:'Perlu Diproses',     value:stats.pendingOrders,                icon:'⏳', color:'#e67e22'},
    {label:'Total Menu',         value:stats.totalMenus,                   icon:'☕', color:'#27ae60'},
    {label:'Total Pelanggan',    value:stats.totalUsers,                   icon:'👥', color:'#8e44ad'},
    {label:'Pendapatan Hari Ini',value:fmtRp(stats.todayRevenue),          icon:'💰', color:'#2980b9'},
  ];

  return (
    <div className="panel">
      <h3>📊 Dashboard</h3>
      <p className="panel-desc">Ringkasan performa kedai hari ini.</p>
      <div className="dashboard-stats">
        {cards.map(s=>(
          <div key={s.label} className="stat-card" style={{borderTop:`3px solid ${s.color}`}}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="panel-group">
        <h4>Total Pendapatan (selesai)</h4>
        <div className="revenue-total">{fmtRp(stats.totalRevenue)}</div>
      </div>
      {stats.topMenus?.length>0 && (
        <div className="panel-group">
          <h4>Menu Terlaris</h4>
          <div className="top-menus">
            {stats.topMenus.map((m,i)=>(
              <div key={m._id} className="top-menu-row">
                <span className="top-rank">#{i+1}</span>
                <span className="top-name">{m.name}</span>
                <span className="top-orders">{m.totalOrders} terjual</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {stats.weeklyRevenue?.length>0 && (
        <div className="panel-group">
          <h4>Pendapatan 7 Hari Terakhir</h4>
          <div className="weekly-chart">
            {(()=>{
              const maxRev = Math.max(...stats.weeklyRevenue.map(d=>d.revenue),1);
              return stats.weeklyRevenue.map(d=>(
                <div key={d._id} className="chart-bar-wrap">
                  <div className="chart-bar-val">{fmtRp(d.revenue)}</div>
                  <div className="chart-bar" style={{height:`${Math.round((d.revenue/maxRev)*100)}px`}}/>
                  <div className="chart-bar-label">{d._id.slice(5)}</div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ORDERS PANEL ─────────────────────────────────────────
const OrdersPanel = ({ showToast }) => {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/order/admin/all?status=${filter==='all'?'':filter}&limit=50`, { headers: authH() });
      const data = await res.json();
      if(data.success) setOrders(data.data);
    } catch(e) { showToast('Gagal memuat order','error'); }
    setLoading(false);
  },[filter, showToast]);

  useEffect(()=>{ load(); },[load]);

  const deleteOrder = async (orderId, orderNumber) => {
    if (!window.confirm(`Hapus pesanan #${orderNumber}? Data tidak bisa dikembalikan.`)) return;
    try {
      const res  = await fetch(`${BASE}/order/${orderId}`, { method:'DELETE', headers: authH() });
      const data = await res.json();
      if(!data.success) throw new Error(data.message);
      showToast('🗑️ Pesanan berhasil dihapus!');
      if(selected?._id===orderId) setSelected(null);
      load();
    } catch(e) { showToast('❌ Gagal hapus: '+e.message,'error'); }
  };

  const updateStatus = async (orderId, status) => {
    setUpdating(true);
    try {
      const res  = await fetch(`${BASE}/order/${orderId}/status`, {
        method:'PUT', headers: authH(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if(!data.success) throw new Error(data.message);
      showToast(`✅ Status diupdate ke "${STATUS_LABELS[status]}"`);
      load();
      if(selected?._id===orderId) setSelected({...selected, status});
    } catch(e) { showToast('❌ Gagal update: '+e.message,'error'); }
    setUpdating(false);
  };

  const filterBtns = ['all','pending','diproses','selesai','dibatalkan'];

  return (
    <div className="panel">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4,flexWrap:'wrap',gap:8}}>
        <div>
          <h3>📦 Kelola Pesanan</h3>
          <p className="panel-desc">Monitor dan update status semua pesanan masuk.</p>
        </div>
        <button className="btn btn-secondary" onClick={load} disabled={loading}>🔄 Refresh</button>
      </div>

      {/* Filter */}
      <div className="cat-filters" style={{marginBottom:20}}>
        {filterBtns.map(f=>(
          <button key={f} className={`cat-btn ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
            {f==='all'?'Semua':STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {loading ? <p className="empty">⏳ Memuat pesanan...</p>
      : orders.length===0 ? <p className="empty">Tidak ada pesanan ditemukan.</p>
      : (
        <div style={{display:'grid',gridTemplateColumns:selected?'1fr 360px':'1fr',gap:20}}>
          {/* List */}
          <div className="order-list">
            {orders.map(o=>(
              <div
                key={o._id}
                className={`order-item ${selected?._id===o._id?'selected':''}`}
                onClick={()=>setSelected(o)}
              >
                <div className="order-item-top">
                  <div>
                    <span className="order-number-badge">#{o.orderNumber}</span>
                    <span className="order-customer">{o.customerName}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span className="order-status-badge" style={{background:STATUS_COLORS[o.status]+'22',color:STATUS_COLORS[o.status]}}>
                      {STATUS_LABELS[o.status]}
                    </span>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e)=>{e.stopPropagation();deleteOrder(o._id,o.orderNumber);}}
                      title="Hapus pesanan"
                    >🗑️</button>
                  </div>
                </div>
                <div className="order-item-meta">
                  <span>🍽️ {o.orderType}</span>
                  <span>💳 {o.paymentMethod}</span>
                  <span>{o.items?.length} item</span>
                  <span className="order-total">{fmtRp(o.totalAmount)}</span>
                  <span className="order-date">{fmtDate(o.createdAt)}</span>
                </div>
                {o.notes && <div className="order-notes">📝 {o.notes}</div>}
              </div>
            ))}
          </div>

          {/* Detail */}
          {selected && (
            <div className="order-detail">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <h4>Detail Pesanan</h4>
                <button className="btn btn-secondary btn-sm" onClick={()=>setSelected(null)}>✕</button>
              </div>

              <div className="order-detail-info">
                <div className="oinfo-row"><span>No. Pesanan</span><strong>#{selected.orderNumber}</strong></div>
                <div className="oinfo-row"><span>Pelanggan</span><strong>{selected.customerName}</strong></div>
                <div className="oinfo-row"><span>Jenis</span><strong>{selected.orderType}</strong></div>
                <div className="oinfo-row"><span>Pembayaran</span><strong>{selected.paymentMethod}</strong></div>
                <div className="oinfo-row"><span>Waktu</span><strong>{fmtDate(selected.createdAt)}</strong></div>
                {selected.deliveryAddress && <div className="oinfo-row"><span>Alamat</span><strong>{selected.deliveryAddress}</strong></div>}
                {selected.notes && <div className="oinfo-row"><span>Catatan</span><strong>{selected.notes}</strong></div>}
              </div>

              <div className="order-detail-items">
                <h5>Item Pesanan</h5>
                {selected.items?.map((item,i)=>(
                  <div key={i} className="odetail-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{fmtRp(item.subtotal)}</span>
                  </div>
                ))}
                <div className="odetail-total">
                  <strong>Total</strong>
                  <strong>{fmtRp(selected.totalAmount)}</strong>
                </div>
              </div>

              <div className="order-status-actions">
                <h5>Update Status</h5>
                <div className="status-btn-grid">
                  {['pending','diproses','selesai','dibatalkan'].map(s=>(
                    <button
                      key={s}
                      className={`status-action-btn ${selected.status===s?'current':''}`}
                      style={selected.status===s?{background:STATUS_COLORS[s],color:'#fff',borderColor:STATUS_COLORS[s]}:{}}
                      onClick={()=>updateStatus(selected._id,s)}
                      disabled={updating||selected.status===s}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              {selected.statusHistory?.length>0 && (
                <div className="order-history">
                  <h5>Riwayat Status</h5>
                  {[...selected.statusHistory].reverse().map((h,i)=>(
                    <div key={i} className="history-row">
                      <span className="history-status" style={{color:STATUS_COLORS[h.status]}}>{STATUS_LABELS[h.status]||h.status}</span>
                      <span className="history-time">{fmtDate(h.timestamp)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── BRANDING ─────────────────────────────────────────────
const BrandingPanel = ({ data, onChange }) => (
  <div className="panel">
    <h3>🎨 Branding & Logo</h3>
    <p className="panel-desc">Logo, nama, dan teks footer website.</p>
    <ImageUploader label="Logo Website" value={data.logo} onChange={v=>onChange('logo',v)} folder="general" token={getToken()}/>
    <Field label="Nama Website / Kedai" value={data.siteName} onChange={v=>onChange('siteName',v)} placeholder="Kedai Kopi Modern"/>
    <Field label="URL Favicon" value={data.favicon} onChange={v=>onChange('favicon',v)} placeholder="https://..."/>
    <Textarea label="Tagline Footer" value={data.footerTagline} onChange={v=>onChange('footerTagline',v)} rows={2}
      placeholder="Menyajikan pengalaman kopi terbaik dari biji pilihan petani lokal Indonesia."/>
  </div>
);

const HeroPanel = ({ data, onChange }) => (
  <div className="panel">
    <h3>🏠 Hero Section</h3>
    <p className="panel-desc">Bagian pertama yang dilihat pengunjung saat membuka website.</p>
    <Field label="Judul Utama" value={data.heroTitle} onChange={v=>onChange('heroTitle',v)} placeholder="Selamat Datang di Kedai Kami"/>
    <Textarea label="Subtitle / Tagline" value={data.heroSubtitle} onChange={v=>onChange('heroSubtitle',v)} rows={2} placeholder="Nikmati kopi terbaik..."/>
    <Field label="Teks Tombol CTA" value={data.heroButtonText} onChange={v=>onChange('heroButtonText',v)} placeholder="Lihat Menu"/>
    <ImageUploader label="Gambar Background Hero" value={data.heroImage} onChange={v=>onChange('heroImage',v)} folder="general" token={getToken()}/>
    <div className="panel-group">
      <h4>Teks Kecil di Atas Judul Hero</h4>
      <Field label="Teks Eyebrow (opsional)" value={data.heroEyebrow} onChange={v=>onChange('heroEyebrow',v)} placeholder="Contoh: Sejak 2018 · Pekanbaru, Riau"/>
      <p style={{fontSize:'.78rem',color:'#888',marginTop:-10,marginBottom:16}}>💡 Kosongkan untuk otomatis dari Tahun Berdiri + Kota</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 16px'}}>
        <Field label="Tahun Berdiri" value={data.foundedYear} onChange={v=>onChange('foundedYear',v)} placeholder="2018"/>
        <Field label="Kota / Lokasi" value={data.city} onChange={v=>onChange('city',v)} placeholder="Pekanbaru, Riau"/>
      </div>
    </div>
    <div className="panel-group">
      <h4>Section Menu di Homepage</h4>
      <Field label="Teks Kecil (eyebrow)" value={data.menuSectionEyebrow} onChange={v=>onChange('menuSectionEyebrow',v)} placeholder="Menu Pilihan"/>
      <Field label="Judul Section Menu" value={data.menuSectionTitle} onChange={v=>onChange('menuSectionTitle',v)} placeholder="Temukan Favorit Kamu"/>
      <Textarea label="Subjudul Section Menu" value={data.menuSectionSubtitle} onChange={v=>onChange('menuSectionSubtitle',v)} rows={2} placeholder="Dibuat dengan biji kopi pilihan..."/>
    </div>
  </div>
);

const AboutPanel = ({ data, onChange }) => (
  <div className="panel">
    <h3>📖 Tentang Kami</h3>
    <p className="panel-desc">Section yang menjelaskan cerita dan identitas kedai.</p>
    <Field label="Judul Section" value={data.aboutTitle} onChange={v=>onChange('aboutTitle',v)} placeholder="Tentang Kami"/>
    <Textarea label="Deskripsi Utama" value={data.aboutDescription} onChange={v=>onChange('aboutDescription',v)} rows={5} placeholder="Ceritakan sejarah kedai..."/>
    <Textarea label="Misi" value={data.aboutMission} onChange={v=>onChange('aboutMission',v)} rows={2} placeholder="Misi kami..."/>
    <Textarea label="Visi" value={data.aboutVision} onChange={v=>onChange('aboutVision',v)} rows={2} placeholder="Visi kami..."/>
    <ImageUploader label="Foto Tentang Kami" value={data.aboutImage} onChange={v=>onChange('aboutImage',v)} folder="general" token={getToken()}/>
    <div className="panel-group">
      <h4>Kotak Tahun (pojok kiri foto)</h4>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 16px'}}>
        <Field label="Tahun" value={data.aboutSinceYear} onChange={v=>onChange('aboutSinceYear',v)} placeholder="2018"/>
        <Field label="Teks Label" value={data.aboutSinceLabel} onChange={v=>onChange('aboutSinceLabel',v)} placeholder="Berdiri Sejak"/>
      </div>
    </div>
  </div>
);

const ContactPanel = ({ data, onChange }) => {
  const updateHours = (day,field,val) => {
    const h = {...(data.openHours||{})};
    h[day]  = {...(h[day]||{}), [field]:val};
    onChange('openHours', h);
  };
  return (
    <div className="panel">
      <h3>📞 Kontak & Jam Operasional</h3>
      <p className="panel-desc">Informasi kontak dan jam buka kedai.</p>
      <div className="panel-group">
        <h4>Informasi Kontak</h4>
        <Field label="Alamat"    value={data.address}   onChange={v=>onChange('address',v)}   placeholder="Jl. Kopi No.1"/>
        <Field label="Telepon"   value={data.phone}     onChange={v=>onChange('phone',v)}     placeholder="+62 812-xxxx"/>
        <Field label="Email"     value={data.email}     onChange={v=>onChange('email',v)}     type="email" placeholder="info@kedaikopi.com"/>
        <Field label="WhatsApp"  value={data.whatsapp}  onChange={v=>onChange('whatsapp',v)}  placeholder="6281234567890"/>
        <Field label="Instagram" value={data.instagram} onChange={v=>onChange('instagram',v)} placeholder="@kedaikopi"/>
        <Field label="Facebook"  value={data.facebook}  onChange={v=>onChange('facebook',v)}  placeholder="kedaikopi"/>
      </div>
      <div className="panel-group">
        <h4>Jam Operasional</h4>
        <div className="hours-grid">
          {DAYS.map(({key,label})=>(
            <div key={key} className="hours-row">
              <label className="day-label">{label}</label>
              <label className="toggle">
                <input type="checkbox" checked={data.openHours?.[key]?.isOpen??true} onChange={e=>updateHours(key,'isOpen',e.target.checked)}/>
                <span>{data.openHours?.[key]?.isOpen?'Buka':'Tutup'}</span>
              </label>
              {data.openHours?.[key]?.isOpen && <>
                <input type="time" value={data.openHours?.[key]?.open||'08:00'}  onChange={e=>updateHours(key,'open',e.target.value)}/>
                <span className="sep">–</span>
                <input type="time" value={data.openHours?.[key]?.close||'22:00'} onChange={e=>updateHours(key,'close',e.target.value)}/>
              </>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── GALLERY PANEL ────────────────────────────────────────
const GalleryPanel = ({ data, onRefresh, showToast }) => {
  const [url,     setUrl]     = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res  = await fetch(`${BASE}/upload/gallery`,{ method:'POST', headers:{ Authorization:`Bearer ${getToken()}` }, body:formData });
      const data = await res.json();
      if(!data.success) throw new Error(data.message);
      setUrl(data.url);
    } catch(e) {
      // fallback base64
      const reader = new FileReader();
      reader.onload = () => setUrl(reader.result);
      reader.readAsDataURL(file);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if(!url.trim()) return showToast('URL gambar wajib diisi!','error');
    setLoading(true);
    try { await addGalleryImage({url,caption}); setUrl(''); setCaption(''); onRefresh(); showToast('✅ Foto ditambahkan!'); }
    catch(e) { showToast('❌ '+e.message,'error'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Hapus foto ini?')) return;
    try { await deleteGalleryImage(id); onRefresh(); showToast('🗑️ Foto dihapus!'); }
    catch(e) { showToast('❌ '+e.message,'error'); }
  };

  return (
    <div className="panel">
      <h3>🖼️ Galeri Foto</h3>
      <p className="panel-desc">Tambah dan kelola foto-foto galeri website.</p>
      <div className="gallery-add">
        <h4>Tambah Foto Baru</h4>
        <div className="img-upload-controls">
          <input type="text" value={url} onChange={e=>setUrl(e.target.value)} placeholder="Paste URL gambar..."/>
          <span style={{color:'#aaa',fontSize:'.85rem',padding:'0 4px'}}>atau</span>
          <button type="button" className="btn btn-secondary" onClick={()=>fileRef.current.click()}>📁 Upload File</button>
          <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleFile}/>
        </div>
        {loading && <p style={{fontSize:'.82rem',color:'#888',marginTop:6}}>⏳ Mengupload...</p>}
        {url && <img src={url} alt="preview" className="img-preview"/>}
        <input type="text" value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Keterangan foto (opsional)" style={{marginTop:8,width:'100%',padding:'10px 14px',border:'1.5px solid #e0d8cf',borderRadius:8,fontFamily:'inherit',fontSize:'.9rem'}}/>
        <button className="btn btn-primary" onClick={handleAdd} disabled={loading} style={{marginTop:12}}>+ Tambah ke Galeri</button>
      </div>
      <div className="gallery-grid">
        {(data.galleryImages||[]).length===0 && <p className="empty">Belum ada foto di galeri.</p>}
        {(data.galleryImages||[]).map(img=>(
          <div key={img._id} className="gallery-item">
            <img src={img.url} alt={img.caption}/>
            <div className="gallery-item-footer">
              <span>{img.caption||'Tanpa keterangan'}</span>
              <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(img._id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── TESTIMONIALS PANEL ───────────────────────────────────
const TestimonialsPanel = ({ data, onRefresh, showToast }) => {
  const [form,   setForm]   = useState({name:'',comment:'',rating:5,avatar:''});
  const [editId, setEditId] = useState(null);
  const [loading,setLoading]= useState(false);

  const handleSubmit = async () => {
    if(!form.name||!form.comment) return showToast('Nama dan komentar wajib diisi!','error');
    setLoading(true);
    try {
      if(editId){ await updateTestimonial(editId,form); setEditId(null); }
      else { await addTestimonial(form); }
      setForm({name:'',comment:'',rating:5,avatar:''}); onRefresh(); showToast('✅ Testimoni disimpan!');
    } catch(e){ showToast('❌ '+e.message,'error'); }
    setLoading(false);
  };

  const startEdit   = t => { setEditId(t._id); setForm({name:t.name,comment:t.comment,rating:t.rating,avatar:t.avatar||''}); };
  const handleDelete= async id => { if(!window.confirm('Hapus?')) return; try { await deleteTestimonial(id); onRefresh(); showToast('🗑️ Dihapus!'); } catch(e){showToast('❌ '+e.message,'error');} };
  const toggleVis   = async t => { try { await updateTestimonial(t._id,{isVisible:!t.isVisible}); onRefresh(); } catch(e){showToast('❌ '+e.message,'error');} };

  return (
    <div className="panel">
      <h3>⭐ Testimoni Pelanggan</h3>
      <p className="panel-desc">Kelola ulasan yang tampil di website.</p>
      <div className="testimonial-form">
        <h4>{editId?'Edit Testimoni':'Tambah Testimoni Baru'}</h4>
        <Field label="Nama Pelanggan" value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Budi Santoso"/>
        <Field label="URL Foto Avatar (opsional)" value={form.avatar} onChange={v=>setForm({...form,avatar:v})} placeholder="https://..."/>
        <div className="cms-field">
          <label>Rating (1–5)</label>
          <div className="rating-input">
            {[1,2,3,4,5].map(n=>(
              <button key={n} type="button" className={`star-btn ${n<=form.rating?'active':''}`} onClick={()=>setForm({...form,rating:n})}>★</button>
            ))}
          </div>
        </div>
        <Textarea label="Komentar" value={form.comment} onChange={v=>setForm({...form,comment:v})} rows={3} placeholder="Kopinya enak..."/>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading?'Menyimpan...':editId?'💾 Update':'+ Tambah'}</button>
          {editId && <button className="btn btn-secondary" onClick={()=>{setEditId(null);setForm({name:'',comment:'',rating:5,avatar:''});}}>Batal</button>}
        </div>
      </div>
      <div className="testimonial-list">
        {(data.testimonials||[]).length===0 && <p className="empty">Belum ada testimoni.</p>}
        {(data.testimonials||[]).map(t=>(
          <div key={t._id} className={`testimonial-item ${!t.isVisible?'hidden-item':''}`}>
            <div className="testimonial-header">
              {t.avatar && <img src={t.avatar} alt={t.name} className="avatar"/>}
              <div><strong>{t.name}</strong><div className="stars">{'★'.repeat(t.rating)}{'☆'.repeat(5-t.rating)}</div></div>
              <div className="testimonial-actions">
                <button className="btn btn-sm btn-secondary" onClick={()=>toggleVis(t)}>{t.isVisible?'👁️':'🚫'}</button>
                <button className="btn btn-sm btn-secondary" onClick={()=>startEdit(t)}>✏️</button>
                <button className="btn btn-sm btn-danger"    onClick={()=>handleDelete(t._id)}>🗑️</button>
              </div>
            </div>
            <p className="testimonial-comment">{t.comment}</p>
            {!t.isVisible && <span className="hidden-badge">Disembunyikan</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── MENU PANEL ───────────────────────────────────────────
const MenuPanel = ({ showToast }) => {
  const [menus,   setMenus]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [editId,  setEditId]  = useState(null);
  const [form,    setForm]    = useState(EMPTY_MENU);
  const [search,  setSearch]  = useState('');
  const [filterCat,setFilterCat] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    try { const d = await fetchMenus(); setMenus(d); }
    catch(e){ showToast('Gagal memuat menu: '+e.message,'error'); }
    setLoading(false);
  },[showToast]);

  useEffect(()=>{ load(); },[load]);

  const startEdit = m => { setEditId(m._id); setForm({name:m.name,description:m.description,price:m.price,category:m.category,image:m.image||'',isAvailable:m.isAvailable,isFeatured:m.isFeatured,isPromo:m.isPromo,promoPrice:m.promoPrice||''}); window.scrollTo({top:0,behavior:'smooth'}); };
  const resetForm = () => { setEditId(null); setForm(EMPTY_MENU); };

  const handleSubmit = async () => {
    if(!form.name||!form.description||!form.price) return showToast('Nama, deskripsi, dan harga wajib diisi!','error');
    setSaving(true);
    try {
      const payload = {...form, price:Number(form.price), promoPrice:form.promoPrice?Number(form.promoPrice):null};
      if(editId){ await updateMenu(editId,payload); showToast('✅ Menu diupdate!'); }
      else       { await createMenu(payload);        showToast('✅ Menu ditambahkan!'); }
      resetForm(); load();
    } catch(e){ showToast('❌ Gagal: '+e.message,'error'); }
    setSaving(false);
  };

  const handleDelete = async (id,name) => {
    if(!window.confirm(`Hapus menu "${name}"?`)) return;
    try { await deleteMenu(id); showToast('🗑️ Menu dihapus!'); load(); }
    catch(e){ showToast('❌ '+e.message,'error'); }
  };

  const toggleField = async (m,field) => {
    try { await updateMenu(m._id,{[field]:!m[field]}); load(); }
    catch(e){ showToast('❌ '+e.message,'error'); }
  };

  const filtered = menus.filter(m=>{
    const mCat = filterCat==='all'||m.category===filterCat;
    const mSrc = m.name.toLowerCase().includes(search.toLowerCase());
    return mCat&&mSrc;
  });

  return (
    <div className="panel">
      <h3>☕ Kelola Menu</h3>
      <p className="panel-desc">Tambah, edit, dan kelola semua item menu kedai.</p>

      {/* Form */}
      <div className="menu-form">
        <h4>{editId?'✏️ Edit Menu':'➕ Tambah Menu Baru'}</h4>
        <div className="menu-form-grid">
          <div className="cms-field">
            <label>Nama Menu</label>
            <input type="text" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Es Kopi Susu"/>
          </div>
          <div className="cms-field">
            <label>Kategori</label>
            <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
              <option value="coffee">Coffee</option>
              <option value="non-coffee">Non-Coffee</option>
              <option value="snack">Snack</option>
            </select>
          </div>
          <div className="cms-field">
            <label>Harga (Rp)</label>
            <input type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} placeholder="25000"/>
          </div>
          {form.isPromo && (
            <div className="cms-field">
              <label>Harga Promo (Rp)</label>
              <input type="number" value={form.promoPrice} onChange={e=>setForm(f=>({...f,promoPrice:e.target.value}))} placeholder="20000"/>
            </div>
          )}
        </div>
        <div className="cms-field">
          <label>Deskripsi</label>
          <textarea rows={2} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Deskripsi singkat menu..."/>
        </div>
        <ImageUploader label="Foto Menu" value={form.image} onChange={v=>setForm(f=>({...f,image:v}))} folder="menu" token={getToken()}/>
        <div className="menu-toggles">
          {[{key:'isAvailable',label:'✅ Tersedia'},{key:'isFeatured',label:'⭐ Featured'},{key:'isPromo',label:'🏷️ Promo'}].map(({key,label})=>(
            <label key={key} className="toggle-chip">
              <input type="checkbox" checked={!!form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.checked}))}/>
              {label}
            </label>
          ))}
        </div>
        <div className="form-actions" style={{marginTop:16}}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>{saving?'⏳ Menyimpan...':editId?'💾 Update Menu':'➕ Tambah Menu'}</button>
          {editId && <button className="btn btn-secondary" onClick={resetForm}>Batal</button>}
        </div>
      </div>

      {/* Toolbar */}
      <div className="menu-toolbar">
        <input type="text" placeholder="🔍 Cari menu..." value={search} onChange={e=>setSearch(e.target.value)} className="menu-search"/>
        <div className="cat-filters">
          {[{value:'all',label:'Semua'},{value:'coffee',label:'Coffee'},{value:'non-coffee',label:'Non-Coffee'},{value:'snack',label:'Snack'}].map(c=>(
            <button key={c.value} className={`cat-btn ${filterCat===c.value?'active':''}`} onClick={()=>setFilterCat(c.value)}>{c.label}</button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? <p className="empty">⏳ Memuat menu...</p>
      : filtered.length===0 ? <p className="empty">Menu tidak ditemukan.</p>
      : (
        <div className="menu-list">
          {filtered.map(m=>(
            <div key={m._id} className={`menu-item ${!m.isAvailable?'menu-unavailable':''}`}>
              <div className="menu-item-img">
                {m.image ? <img src={m.image} alt={m.name}/> : <div className="menu-img-placeholder">☕</div>}
              </div>
              <div className="menu-item-info">
                <div className="menu-item-top">
                  <strong>{m.name}</strong>
                  <div className="menu-badges">
                    <span className={`menu-cat-badge cat-${m.category}`}>{m.category}</span>
                    {m.isFeatured && <span className="badge-tag featured">⭐</span>}
                    {m.isPromo    && <span className="badge-tag promo">Promo</span>}
                    {!m.isAvailable && <span className="badge-tag unavail">Nonaktif</span>}
                  </div>
                </div>
                <p className="menu-desc">{m.description}</p>
                <div className="menu-price-row">
                  {m.isPromo&&m.promoPrice
                    ? <><span className="price-old">{fmtRp(m.price)}</span><span className="price-promo">{fmtRp(m.promoPrice)}</span></>
                    : <span className="price-normal">{fmtRp(m.price)}</span>
                  }
                  <span className="menu-orders">{m.totalOrders} terjual</span>
                </div>
              </div>
              <div className="menu-item-actions">
                <button className="toggle-btn" onClick={()=>toggleField(m,'isAvailable')} title="Toggle tersedia">{m.isAvailable?'✅':'❌'}</button>
                <button className="toggle-btn" onClick={()=>toggleField(m,'isFeatured')}  title="Toggle featured">⭐</button>
                <button className="btn btn-secondary btn-sm" onClick={()=>startEdit(m)}>✏️ Edit</button>
                <button className="btn btn-danger btn-sm"    onClick={()=>handleDelete(m._id,m.name)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── MAIN CMS ─────────────────────────────────────────────
export default function CMSPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [content,   setContent]   = useState({});
  const [localData, setLocalData] = useState({});
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState({msg:'',type:'success'});

  const showToast = useCallback((msg,type='success') => {
    setToast({msg,type});
    setTimeout(()=>setToast({msg:'',type:'success'}),3500);
  },[]);

  const loadContent = useCallback(async () => {
    try {
      const data = await fetchAllContent();
      setContent(data);
      setLocalData(JSON.parse(JSON.stringify(data)));
    } catch(e){ showToast('Gagal memuat konten: '+e.message,'error'); }
    finally{ setLoading(false); }
  },[showToast]);

  useEffect(()=>{ loadContent(); },[loadContent]);

  const handleTabChange = tab => {
    if(CONTENT_TABS.includes(activeTab) && hasChanges){
      if(!window.confirm('Ada perubahan belum disimpan. Yakin pindah tab?')) return;
      setLocalData(JSON.parse(JSON.stringify(content)));
    }
    setActiveTab(tab);
  };

  const handleChange = (section,field,value) =>
    setLocalData(prev=>({...prev,[section]:{...prev[section],[field]:value}}));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSection(activeTab, localData[activeTab]);
      setContent(prev=>({...prev,[activeTab]:localData[activeTab]}));
      showToast('✅ Konten berhasil disimpan!');
    } catch(e){ showToast('❌ Gagal: '+e.message,'error'); }
    setSaving(false);
  };

  const makeChanger = section => (field,value) => handleChange(section,field,value);
  const hasChanges  = CONTENT_TABS.includes(activeTab) &&
    JSON.stringify(localData[activeTab])!==JSON.stringify(content[activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    window.location.href='/';
  };

  if(loading) return <div className="cms-loading">⏳ Memuat konten...</div>;

  return (
    <div className="cms-page">
      <Toast msg={toast.msg} type={toast.type}/>

      <div className="cms-header">
        <div>
          <h1>⚙️ Kelola Website</h1>
          <p>Panel CMS — Kedai Kopi Modern</p>
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          {CONTENT_TABS.includes(activeTab) && (
            <button className={`btn btn-primary btn-save ${hasChanges?'has-changes':''}`} onClick={handleSave} disabled={saving||!hasChanges}>
              {saving?'⏳ Menyimpan...':hasChanges?'💾 Simpan':'✓ Tersimpan'}
            </button>
          )}
          <a href="/" className="btn btn-secondary" target="_blank" rel="noreferrer">🌐 Lihat Website</a>
          <button className="btn btn-secondary" onClick={handleLogout}>🚪 Keluar</button>
        </div>
      </div>

      <div className="cms-layout">
        <nav className="cms-nav">
          {TABS.map(tab=>(
            <button key={tab.id} className={`cms-nav-btn ${activeTab===tab.id?'active':''}`} onClick={()=>handleTabChange(tab.id)}>
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="cms-content">
          {activeTab==='dashboard'    && <DashboardPanel/>}
          {activeTab==='orders'       && <OrdersPanel showToast={showToast}/>}
          {activeTab==='branding'     && <BrandingPanel     data={localData.branding||{}}     onChange={makeChanger('branding')}/>}
          {activeTab==='hero'         && <HeroPanel         data={localData.hero||{}}         onChange={makeChanger('hero')}/>}
          {activeTab==='about'        && <AboutPanel        data={localData.about||{}}        onChange={makeChanger('about')}/>}
          {activeTab==='contact'      && <ContactPanel      data={localData.contact||{}}      onChange={makeChanger('contact')}/>}
          {activeTab==='gallery'      && <GalleryPanel      data={content.gallery||{}}        onRefresh={loadContent} showToast={showToast}/>}
          {activeTab==='testimonials' && <TestimonialsPanel data={content.testimonials||{}}   onRefresh={loadContent} showToast={showToast}/>}
          {activeTab==='menu'         && <MenuPanel         showToast={showToast}/>}

          {CONTENT_TABS.includes(activeTab) && (
            <div className="save-bar">
              <button className={`btn btn-primary btn-save ${hasChanges?'has-changes':''}`} onClick={handleSave} disabled={saving||!hasChanges}>
                {saving?'⏳ Menyimpan...':hasChanges?'💾 Simpan Perubahan':'✓ Tidak ada perubahan'}
              </button>
              {hasChanges && <span className="unsaved-hint">⚠️ Ada perubahan belum disimpan</span>}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}