import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './OrdersPage.css';

const BASE     = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const fmtRp    = n  => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
const fmtDate  = d  => new Date(d).toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});

const STATUS_COLOR = { pending:'#e67e22', diproses:'#2980b9', selesai:'#27ae60', dibatalkan:'#c0392b' };
const STATUS_LABEL = { pending:'⏳ Menunggu', diproses:'👨‍🍳 Diproses', selesai:'✅ Selesai', dibatalkan:'❌ Dibatalkan' };
const STATUS_STEPS = [
  { key:'pending',    label:'Diterima',  icon:'📋' },
  { key:'diproses',   label:'Diproses',  icon:'👨‍🍳' },
  { key:'selesai',    label:'Selesai',   icon:'✅' },
];

export default function OrdersPage() {
  const { user, token } = useAuth();
  const navigate        = useNavigate();
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    fetch(`${BASE}/order/my`, { headers: { Authorization:`Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if(d.success) setOrders(d.data); })
      .finally(() => setLoading(false));
  }, [user, token, navigate]);

  return (
    <div className="orders-page">
      <div className="orders-header">
        <Link to="/" className="orders-back">← Kembali</Link>
        <h1 className="orders-title">Riwayat <em>Pesanan</em></h1>
        <p className="orders-sub">Halo, <strong>{user?.name}</strong>! Berikut riwayat pesananmu.</p>
      </div>

      <div className="orders-body">
        {loading ? (
          <div className="orders-empty"><div className="orders-empty-icon">⏳</div><p>Memuat pesanan...</p></div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">🛒</div>
            <h3>Belum Ada Pesanan</h3>
            <p>Yuk mulai pesan menu favoritmu!</p>
            <Link to="/menu" className="orders-cta">Lihat Menu →</Link>
          </div>
        ) : (
          <div className="orders-layout">
            {/* List */}
            <div className="orders-list">
              {orders.map(o => (
                <div
                  key={o._id}
                  className={`order-card ${selected?._id===o._id?'active':''}`}
                  onClick={() => setSelected(o)}
                >
                  <div className="order-card-top">
                    <div>
                      <div className="order-card-num">#{o.orderNumber}</div>
                      <div className="order-card-date">{fmtDate(o.createdAt)}</div>
                    </div>
                    <span className="order-card-status" style={{background:STATUS_COLOR[o.status]+'20',color:STATUS_COLOR[o.status]}}>
                      {STATUS_LABEL[o.status]}
                    </span>
                  </div>
                  <div className="order-card-items">
                    {o.items?.slice(0,2).map((item,i) => (
                      <span key={i} className="order-card-item-chip">{item.name} ×{item.quantity}</span>
                    ))}
                    {o.items?.length > 2 && <span className="order-card-item-chip more">+{o.items.length-2} lagi</span>}
                  </div>
                  <div className="order-card-footer">
                    <span className="order-card-type">{o.orderType==='dine-in'?'🪑 Dine In':o.orderType==='takeaway'?'🥡 Takeaway':'🛵 Delivery'}</span>
                    <span className="order-card-total">{fmtRp(o.totalAmount)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail */}
            {selected && (
              <div className="order-detail-card">
                <div className="odc-header">
                  <div>
                    <div className="odc-num">#{selected.orderNumber}</div>
                    <div className="odc-date">{fmtDate(selected.createdAt)}</div>
                  </div>
                  <button className="odc-close" onClick={()=>setSelected(null)}>✕</button>
                </div>

                {/* Progress */}
                {selected.status !== 'dibatalkan' && (
                  <div className="odc-progress">
                    {STATUS_STEPS.map((s,i) => {
                      const statuses = ['pending','diproses','selesai'];
                      const curIdx   = statuses.indexOf(selected.status);
                      const done     = i <= curIdx;
                      const current  = i === curIdx;
                      return (
                        <div key={s.key} className={`odc-step ${done?'done':''} ${current?'current':''}`}>
                          <div className="odc-step-icon">{s.icon}</div>
                          <div className="odc-step-label">{s.label}</div>
                          {i < STATUS_STEPS.length-1 && <div className="odc-step-line"/>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {selected.status === 'dibatalkan' && (
                  <div className="odc-cancelled">❌ Pesanan ini telah dibatalkan.</div>
                )}

                {/* Info */}
                <div className="odc-info">
                  <div className="odc-info-row"><span>Jenis</span><strong>{selected.orderType}</strong></div>
                  <div className="odc-info-row"><span>Pembayaran</span><strong>{selected.paymentMethod}</strong></div>
                  <div className="odc-info-row"><span>Status Bayar</span><strong style={{color:selected.paymentStatus==='paid'?'#27ae60':'#e67e22'}}>{selected.paymentStatus==='paid'?'✅ Lunas':'⏳ Belum Lunas'}</strong></div>
                  {selected.deliveryAddress && <div className="odc-info-row"><span>Alamat</span><strong>{selected.deliveryAddress}</strong></div>}
                  {selected.notes && <div className="odc-info-row"><span>Catatan</span><strong>{selected.notes}</strong></div>}
                </div>

                {/* Items */}
                <div className="odc-items">
                  <h4>Item Pesanan</h4>
                  {selected.items?.map((item,i) => (
                    <div key={i} className="odc-item">
                      <span>{item.name} <span className="odc-item-qty">×{item.quantity}</span></span>
                      <span>{fmtRp(item.subtotal)}</span>
                    </div>
                  ))}
                  <div className="odc-total">
                    <strong>Total</strong>
                    <strong>{fmtRp(selected.totalAmount)}</strong>
                  </div>
                </div>

                <Link to="/menu" className="odc-reorder">🔄 Pesan Lagi</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
