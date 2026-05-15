import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((menu, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === menu._id);
      if (existing) return prev.map((i) => i._id === menu._id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...menu, qty }];
    });
  }, []);

  const removeItem = useCallback((id) => setItems((prev) => prev.filter((i) => i._id !== id)), []);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return removeItem(id);
    setItems((prev) => prev.map((i) => i._id === id ? { ...i, qty } : i));
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems  = items.reduce((s, i) => s + i.qty, 0);
  const totalAmount = items.reduce((s, i) => {
    const price = i.isPromo && i.promoPrice ? i.promoPrice : i.price;
    return s + price * i.qty;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalAmount, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
