import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SiteContentProvider } from './hooks/useSiteContent';
import { AuthProvider }  from './context/AuthContext';
import { CartProvider }  from './context/CartContext';
import CartDrawer        from './components/common/CartDrawer';
import HomePage     from './pages/public/HomePage';
import MenuPage     from './pages/public/MenuPage';
import CheckoutPage from './pages/public/CheckoutPage';
import OrdersPage   from './pages/public/OrdersPage';
import AuthPage     from './pages/public/AuthPage';
import CMSPage      from './pages/admin/CMSPage';
import './pages/admin/CMSPage.css';

const getUser = () => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } };

const AdminRoute = ({ children }) => {
  const user = getUser();
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const PrivateRoute = ({ children }) => {
  const user = getUser();
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

const PublicLayout = ({ children }) => (
  <>{children}<CartDrawer /></>
);

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SiteContentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/"          element={<PublicLayout><HomePage /></PublicLayout>} />
              <Route path="/menu"      element={<PublicLayout><MenuPage /></PublicLayout>} />
              <Route path="/checkout"  element={<PublicLayout><CheckoutPage /></PublicLayout>} />
              <Route path="/orders"    element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
              <Route path="/auth"      element={<AuthPage />} />
              <Route path="/admin/cms" element={<AdminRoute><CMSPage /></AdminRoute>} />
              <Route path="*"          element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </SiteContentProvider>
      </CartProvider>
    </AuthProvider>
  );
}
