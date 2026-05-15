import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function CartDrawer() {
  const { items, totalAmount, totalItems, isOpen, setIsOpen, updateQty, removeItem } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000, backdropFilter: 'blur(2px)' }}
      />
      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 380,
        background: '#fff', zIndex: 1001, display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,.15)', fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1.5px solid #e8e0d5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: '#1c0f07' }}>
            🛒 Keranjang ({totalItems})
          </h3>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#888', padding: 4 }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#8a6a58' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🛒</div>
              <p>Keranjang masih kosong</p>
              <button onClick={() => setIsOpen(false)} style={{ marginTop: 16, padding: '8px 20px', background: '#1c0f07', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit', fontSize: '.85rem', fontWeight: 600 }}>
                Pilih Menu
              </button>
            </div>
          ) : (
            items.map((item) => {
              const price = item.isPromo && item.promoPrice ? item.promoPrice : item.price;
              return (
                <div key={item._id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14, padding: '12px', background: '#faf6f0', borderRadius: 8, border: '1px solid #e8e0d5' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 6, overflow: 'hidden', background: '#e8e0d5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                    {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '☕'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '.88rem', fontWeight: 500, color: '#1c0f07', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize: '.8rem', color: '#c17f4a', fontWeight: 600, marginTop: 2 }}>{formatRupiah(price)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button onClick={() => updateQty(item._id, item.qty - 1)} style={{ width: 26, height: 26, border: '1.5px solid #e0d0bc', borderRadius: 4, background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ fontSize: '.9rem', fontWeight: 600, minWidth: 18, textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)} style={{ width: 26, height: 26, border: '1.5px solid #e0d0bc', borderRadius: 4, background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                  <button onClick={() => removeItem(item._id)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '.85rem', padding: 2 }}>✕</button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '16px 24px 24px', borderTop: '1.5px solid #e8e0d5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: '.9rem', color: '#666' }}>Total</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 700, color: '#1c0f07' }}>{formatRupiah(totalAmount)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setIsOpen(false)}
              style={{ display: 'block', width: '100%', padding: 13, background: '#1c0f07', color: '#fff', textAlign: 'center', borderRadius: 6, fontWeight: 600, fontSize: '.92rem', textDecoration: 'none', fontFamily: 'inherit', transition: 'background .2s' }}
              onMouseEnter={(e) => e.target.style.background = '#c17f4a'}
              onMouseLeave={(e) => e.target.style.background = '#1c0f07'}
            >
              Checkout · {formatRupiah(totalAmount)} →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
