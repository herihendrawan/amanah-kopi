import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './CheckoutPage.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const STATUS_STEPS = [
  { key: 'pending',    label: 'Menunggu',    icon: '⏳' },
  { key: 'diproses',   label: 'Diproses',    icon: '👨‍🍳' },
  { key: 'selesai',    label: 'Selesai',     icon: '✅' },
];

export default function CheckoutPage() {
  const { items, totalAmount, clearCart, updateQty, removeItem } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName:    user?.name || '',
    orderType:       'dine-in',
    deliveryAddress: '',
    paymentMethod:   'cash',
    notes:           '',
  });
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');
  const [orderSuccess,  setOrderSuccess]  = useState(null);

  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleOrder = async () => {
    if (!user) return navigate('/auth');
    if (items.length === 0) return setError('Keranjang masih kosong.');
    if (!form.customerName.trim()) return setError('Nama wajib diisi.');
    if (form.orderType === 'delivery' && !form.deliveryAddress.trim()) return setError('Alamat pengiriman wajib diisi.');

    setLoading(true); setError('');
    try {
      const payload = {
        customerName:    form.customerName,
        orderType:       form.orderType,
        deliveryAddress: form.deliveryAddress,
        paymentMethod:   form.paymentMethod,
        notes:           form.notes,
        items: items.map((i) => ({ menuId: i._id, quantity: i.qty })),
      };

      const res  = await fetch(`${API}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || data.errors?.[0]?.msg);

      clearCart();
      setOrderSuccess(data.data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // ─── ORDER SUCCESS STATE ───────────────────────────────
  if (orderSuccess) {
    const statusIdx = STATUS_STEPS.findIndex((s) => s.key === orderSuccess.status);
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <div className="success-icon">☕</div>
          <h2>Pesanan Berhasil!</h2>
          <p className="success-sub">Terima kasih, <strong>{orderSuccess.customerName}</strong>!</p>
          <div className="order-number">#{orderSuccess.orderNumber || orderSuccess._id.slice(-6).toUpperCase()}</div>

          <div className="order-status-track">
            {STATUS_STEPS.map((s, i) => (
              <div key={s.key} className={`status-step ${i <= statusIdx ? 'done' : ''} ${i === statusIdx ? 'current' : ''}`}>
                <div className="step-icon">{s.icon}</div>
                <div className="step-label">{s.label}</div>
                {i < STATUS_STEPS.length - 1 && <div className="step-line" />}
              </div>
            ))}
          </div>

          <div className="order-items-summary">
            {orderSuccess.items?.map((item) => (
              <div key={item._id} className="order-item-row">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatRupiah(item.subtotal)}</span>
              </div>
            ))}
            <div className="order-total-row">
              <strong>Total</strong>
              <strong>{formatRupiah(orderSuccess.totalAmount)}</strong>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/menu" className="btn-checkout-primary">Pesan Lagi</Link>
            <Link to="/" className="btn-checkout-secondary">Kembali ke Beranda</Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── EMPTY CART ───────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🛒</div>
          <h3>Keranjang Kosong</h3>
          <p>Yuk tambahkan menu favorit kamu!</p>
          <Link to="/menu" className="btn-checkout-primary" style={{ display: 'inline-block', marginTop: 20 }}>
            Lihat Menu →
          </Link>
        </div>
      </div>
    );
  }

  // ─── MAIN CHECKOUT ────────────────────────────────────
  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <Link to="/menu" className="co-back">← Kembali ke Menu</Link>
        <h1 className="co-title">Konfirmasi <em>Pesanan</em></h1>
      </div>

      <div className="checkout-layout">
        {/* LEFT: Form */}
        <div className="checkout-form-section">
          <div className="co-section">
            <h3>Detail Pelanggan</h3>
            <div className="co-field">
              <label>Nama</label>
              <input type="text" value={form.customerName} onChange={(e) => handleChange('customerName', e.target.value)} placeholder="Nama pemesan" />
            </div>
          </div>

          <div className="co-section">
            <h3>Jenis Pesanan</h3>
            <div className="co-order-types">
              {[
                { val: 'dine-in',  label: '🪑 Makan di Tempat' },
                { val: 'takeaway', label: '🥡 Bawa Pulang' },
                { val: 'delivery', label: '🛵 Delivery' },
              ].map(({ val, label }) => (
                <label key={val} className={`co-type-card ${form.orderType === val ? 'active' : ''}`}>
                  <input type="radio" name="orderType" value={val} checked={form.orderType === val} onChange={() => handleChange('orderType', val)} style={{ display: 'none' }} />
                  {label}
                </label>
              ))}
            </div>
            {form.orderType === 'delivery' && (
              <div className="co-field" style={{ marginTop: 16 }}>
                <label>Alamat Pengiriman</label>
                <textarea rows={3} value={form.deliveryAddress} onChange={(e) => handleChange('deliveryAddress', e.target.value)} placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan..." />
              </div>
            )}
          </div>

          <div className="co-section">
            <h3>Pembayaran</h3>
            <div className="co-payment-opts">
              {[
                { val: 'cash',     label: '💵 Tunai' },
                { val: 'transfer', label: '🏦 Transfer Bank' },
                { val: 'qris',     label: '📱 QRIS' },
              ].map(({ val, label }) => (
                <label key={val} className={`co-pay-card ${form.paymentMethod === val ? 'active' : ''}`}>
                  <input type="radio" name="paymentMethod" value={val} checked={form.paymentMethod === val} onChange={() => handleChange('paymentMethod', val)} style={{ display: 'none' }} />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="co-section">
            <h3>Catatan (opsional)</h3>
            <div className="co-field">
              <textarea rows={2} value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder="Misal: tanpa gula, es batu extra, dll..." />
            </div>
          </div>
        </div>

        {/* RIGHT: Cart Summary */}
        <div className="checkout-summary">
          <h3>Ringkasan Pesanan</h3>
          <div className="co-items">
            {items.map((item) => {
              const price = item.isPromo && item.promoPrice ? item.promoPrice : item.price;
              return (
                <div key={item._id} className="co-item">
                  <div className="co-item-img">
                    {item.image ? <img src={item.image} alt={item.name} /> : <span>{item.category === 'coffee' ? '☕' : '🍽️'}</span>}
                  </div>
                  <div className="co-item-info">
                    <div className="co-item-name">{item.name}</div>
                    <div className="co-item-price">{formatRupiah(price)}</div>
                  </div>
                  <div className="co-item-qty">
                    <button onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                  </div>
                  <button className="co-item-remove" onClick={() => removeItem(item._id)}>✕</button>
                </div>
              );
            })}
          </div>

          <div className="co-total">
            <div className="co-total-row">
              <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} item)</span>
              <span>{formatRupiah(totalAmount)}</span>
            </div>
            {form.orderType === 'delivery' && (
              <div className="co-total-row">
                <span>Ongkos kirim</span>
                <span>Hubungi kami</span>
              </div>
            )}
            <div className="co-total-row total">
              <strong>Total</strong>
              <strong>{formatRupiah(totalAmount)}</strong>
            </div>
          </div>

          {!user && (
            <div className="co-login-warn">
              ⚠️ <Link to="/auth">Login</Link> terlebih dahulu untuk melanjutkan pesanan.
            </div>
          )}

          {error && <div className="co-error">{error}</div>}

          <button className="co-submit-btn" onClick={handleOrder} disabled={loading || !user}>
            {loading ? '⏳ Memproses...' : user ? `Pesan Sekarang · ${formatRupiah(totalAmount)}` : 'Login untuk Memesan'}
          </button>
          {!user && <Link to="/auth" className="co-auth-link">→ Login / Daftar</Link>}
        </div>
      </div>
    </div>
  );
}
