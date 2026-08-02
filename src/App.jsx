import React, { useState } from 'react';
import CustomerView from './components/CustomerView';
import KitchenDisplayView from './components/KitchenDisplayView';
import AdminDashboardView from './components/AdminDashboardView';
import CustomizeModal from './components/CustomizeModal';
import CartDrawer from './components/CartDrawer';
import OrderStatusModal from './components/OrderStatusModal';
import { TRANSLATIONS } from './data/menuData';
import {
  Monitor, Utensils, LayoutDashboard, Sparkles, Bell,
  Mail, Lock, Eye, EyeOff, X, ShieldCheck, ChefHat, LogOut, AlertCircle
} from 'lucide-react';

const ADMIN_EMAIL = 'penhbormey011427809@gmail.com';
const ADMIN_PASSWORD = 'admin1234'; // simple demo password

export default function App() {
  const [currentView, setCurrentView] = useState('customer'); // 'customer', 'kds', 'admin'
  const [tableNumber, setTableNumber] = useState(3);
  const [lang, setLang] = useState('en');

  // Admin auth state
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminRole, setAdminRole] = useState(null); // 'staff' | 'admin'

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItemForCustom, setSelectedItemForCustom] = useState(null);

  // Orders state
  const [orders, setOrders] = useState([
    {
      id: '8841',
      tableNumber: 3,
      time: 'Just now',
      status: 'received',
      total: 15.25,
      items: [
        { item: { name: 'Matcha Latte', nameKm: 'ម៉ាត់ឆា ឡាត់តេ' }, size: 'Medium (+0.75)', sugar: '50%', ice: 'Regular', toppings: ['Oat Milk (+0.75)'], quantity: 1, totalPrice: 7.00 },
        { item: { name: 'Caesar Salad', nameKm: 'សាឡាត់ សេសា' }, size: 'Standard', sugar: null, ice: null, toppings: [], quantity: 1, totalPrice: 8.25 }
      ]
    }
  ]);

  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const langDict = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Admin Login ────────────────────────────────────────
  const handleAdminButtonClick = () => {
    if (isAdminAuthenticated) {
      setShowRolePicker(true);
    } else {
      setShowAdminLogin(true);
      setAdminEmail('');
      setAdminPassword('');
      setAdminLoginError('');
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAdminLoginError('');
    setAdminLoginLoading(true);
    setTimeout(() => {
      setAdminLoginLoading(false);
      if (adminEmail.trim().toLowerCase() !== ADMIN_EMAIL) {
        setAdminLoginError('Access denied. This email is not authorized.');
        return;
      }
      if (adminPassword !== ADMIN_PASSWORD) {
        setAdminLoginError('Incorrect password. Please try again.');
        return;
      }
      setIsAdminAuthenticated(true);
      setShowAdminLogin(false);
      setShowRolePicker(true);
    }, 1200);
  };

  const handleSelectRole = (role) => {
    setAdminRole(role);
    setShowRolePicker(false);
    setCurrentView(role === 'staff' ? 'kds' : 'admin');
    showToast(role === 'staff' ? 'Entered Staff / Kitchen Display mode' : 'Entered Admin Dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminRole(null);
    setCurrentView('customer');
    setShowRolePicker(false);
    showToast('Signed out of admin panel.');
  };

  // ── Cart & Orders ──────────────────────────────────────
  const handleAddToCart = (customizedItem) => {
    setCartItems(prev => [...prev, customizedItem]);
    const itemName = lang === 'km' && customizedItem.item.nameKm ? customizedItem.item.nameKm : customizedItem.item.name;
    showToast(`Added ${itemName} to cart!`);
  };

  const handleUpdateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) { handleRemoveCartItem(cartItemId); return; }
    setCartItems(prev => prev.map(item =>
      item.cartItemId === cartItemId ? { ...item, quantity: newQty, totalPrice: item.unitPrice * newQty } : item
    ));
  };

  const handleRemoveCartItem = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    const subtotal = cartItems.reduce((acc, i) => acc + i.totalPrice, 0);
    const newOrder = {
      id: String(Math.floor(1000 + Math.random() * 9000)),
      tableNumber,
      time: 'Just now',
      status: 'received',
      total: subtotal * 1.07,
      items: cartItems
    };
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setIsCartOpen(false);
    setIsOrderTrackerOpen(true);
    showToast(`Order #${newOrder.id} placed for Table #${tableNumber}!`);
  };

  const handleCallStaff = () => showToast(`Staff alerted for Table #${tableNumber}! A server is on their way.`);
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order #${orderId} updated to ${newStatus.toUpperCase()}`);
  };
  const handleSelectTableFromAdmin = (tblNum) => {
    setTableNumber(tblNum);
    setCurrentView('customer');
    showToast(`Switched to Tablet View for Table #${tblNum}`);
  };

  const activeOrderForCurrentTable = orders.find(o => o.tableNumber === tableNumber && o.status !== 'delivered') || orders[0];

  return (
    <div className="min-h-screen bg-[#090a10] text-gray-100 font-['Kantumruy_Pro','Inter',sans-serif] selection:bg-cyan-500 selection:text-black">

      {/* ── Top Demo Nav Bar ───────────────────────────────── */}
      <nav className="bg-[#0e0f17] border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold text-gray-300 hidden sm:inline">Café QR &amp; Tablet Mode Demo:</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tablet View */}
          <button
            onClick={() => setCurrentView('customer')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-bold transition-all ${
              currentView === 'customer'
                ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,255,255,0.4)]'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Monitor size={14} />
            <span>Tablet View (Table #{tableNumber})</span>
          </button>

          {/* Kitchen Display — only visible to authenticated admin */}
          {isAdminAuthenticated && (
            <button
              onClick={() => setCurrentView('kds')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-bold transition-all ${
                currentView === 'kds'
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,255,255,0.4)]'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Utensils size={14} />
              <span>Kitchen Display (KDS)</span>
            </button>
          )}

          {/* Staff Admin button — gate to login */}
          <button
            onClick={handleAdminButtonClick}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-bold transition-all ${
              currentView === 'admin' || currentView === 'kds'
                ? 'bg-pink-500 text-white shadow-[0_0_10px_rgba(255,0,255,0.4)]'
                : isAdminAuthenticated
                  ? 'bg-violet-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]'
                  : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <LayoutDashboard size={14} />
            <span>Staff Admin</span>
            {isAdminAuthenticated && <ShieldCheck size={12} className="text-green-300" />}
          </button>

          {/* Logout — only when admin is in */}
          {isAdminAuthenticated && (
            <button
              onClick={handleAdminLogout}
              title="Sign out of admin"
              className="flex items-center gap-1 py-1.5 px-2 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all font-bold"
            >
              <LogOut size={13} />
            </button>
          )}
        </div>
      </nav>

      {/* ── Main Views ─────────────────────────────────────── */}
      {currentView === 'customer' && (
        <CustomerView
          tableNumber={tableNumber}
          setTableNumber={setTableNumber}
          lang={lang}
          setLang={setLang}
          langDict={langDict}
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenItemModal={(item) => setSelectedItemForCustom(item)}
          onCallStaff={handleCallStaff}
          activeOrder={activeOrderForCurrentTable}
          onOpenTracker={() => setIsOrderTrackerOpen(true)}
        />
      )}

      {currentView === 'kds' && isAdminAuthenticated && (
        <KitchenDisplayView
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          langDict={langDict}
        />
      )}

      {currentView === 'admin' && isAdminAuthenticated && (
        <AdminDashboardView
          orders={orders}
          onSelectTable={handleSelectTableFromAdmin}
          langDict={langDict}
        />
      )}

      {/* Modals */}
      <CustomizeModal item={selectedItemForCustom} onClose={() => setSelectedItemForCustom(null)} onAddToCart={handleAddToCart} langDict={langDict} lang={lang} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveCartItem} onCheckout={handleCheckout} tableNumber={tableNumber} langDict={langDict} />
      <OrderStatusModal isOpen={isOrderTrackerOpen} onClose={() => setIsOrderTrackerOpen(false)} activeOrder={activeOrderForCurrentTable} tableNumber={tableNumber} onCallStaff={handleCallStaff} onRequestBill={() => showToast('Requesting bill for Table #' + tableNumber)} onCompletePayment={() => showToast('Payment completed! Thank you.')} langDict={langDict} />

      {/* ── Admin Login Modal ──────────────────────────────── */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={() => setShowAdminLogin(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div
            className="relative w-full max-w-sm mx-4 rounded-3xl border border-white/10 bg-[#0c0d18] shadow-[0_0_80px_rgba(139,92,246,0.15)] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Glow header */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />

            <button onClick={() => setShowAdminLogin(false)} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
              <X size={16} />
            </button>

            <div className="p-7 pt-8">
              {/* Icon + title */}
              <div className="flex flex-col items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.4)]">
                  <ShieldCheck size={26} className="text-white" />
                </div>
                <div className="text-center">
                  <h2 className="text-white font-extrabold text-xl">Admin Access</h2>
                  <p className="text-gray-500 text-xs mt-1">Restricted to authorized staff only</p>
                </div>
              </div>

              {/* Authorized email hint */}
              <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-400/20 rounded-2xl px-3 py-2.5 mb-5">
                <ShieldCheck size={14} className="text-violet-400 flex-shrink-0" />
                <p className="text-[11px] text-violet-300">Only <span className="font-bold text-white">{ADMIN_EMAIL}</span> is authorized.</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-3">
                {/* Email */}
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Admin email"
                    value={adminEmail}
                    onChange={e => { setAdminEmail(e.target.value); setAdminLoginError(''); }}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-400/60 transition-all"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={adminPassword}
                    onChange={e => { setAdminPassword(e.target.value); setAdminLoginError(''); }}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-400/60 transition-all"
                  />
                  <button type="button" onClick={() => setShowAdminPassword(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                    {showAdminPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Error */}
                {adminLoginError && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-400/25 rounded-2xl px-3 py-2.5">
                    <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                    <p className="text-[11px] text-red-300">{adminLoginError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={adminLoginLoading}
                  className="w-full py-3 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_28px_rgba(139,92,246,0.5)] disabled:opacity-60 active:scale-95 transition-all flex items-center justify-center gap-2 mt-1"
                >
                  {adminLoginLoading
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><ShieldCheck size={15} /> Sign In as Admin</>
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Role Picker Modal ──────────────────────────────── */}
      {showRolePicker && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={() => setShowRolePicker(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div
            className="relative w-full max-w-sm mx-4 rounded-3xl border border-white/10 bg-[#0c0d18] shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

            <button onClick={() => setShowRolePicker(false)} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
              <X size={16} />
            </button>

            <div className="p-7 pt-8">
              <div className="flex flex-col items-center gap-2 mb-6">
                <ShieldCheck size={28} className="text-violet-400" />
                <h2 className="text-white font-extrabold text-xl">Welcome, Admin</h2>
                <p className="text-gray-500 text-xs text-center">Select your role to continue</p>
                <p className="text-[11px] text-violet-400 font-medium">{ADMIN_EMAIL}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Staff / KDS */}
                <button
                  onClick={() => handleSelectRole('staff')}
                  className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 hover:bg-cyan-500/15 hover:border-cyan-400/50 transition-all active:scale-95"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center group-hover:shadow-[0_0_16px_rgba(0,255,255,0.3)] transition-all">
                    <ChefHat size={24} className="text-cyan-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-extrabold text-sm">Staff</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">Kitchen Display</p>
                  </div>
                </button>

                {/* Admin Dashboard */}
                <button
                  onClick={() => handleSelectRole('admin')}
                  className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-pink-400/20 bg-pink-500/5 hover:bg-pink-500/15 hover:border-pink-400/50 transition-all active:scale-95"
                >
                  <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center group-hover:shadow-[0_0_16px_rgba(236,72,153,0.3)] transition-all">
                    <LayoutDashboard size={24} className="text-pink-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-extrabold text-sm">Admin</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">Full Dashboard</p>
                  </div>
                </button>
              </div>

              <button onClick={handleAdminLogout} className="w-full mt-4 py-2.5 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-bold hover:bg-red-500/15 transition-all flex items-center justify-center gap-2 active:scale-95">
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14141e99] backdrop-blur-md border border-cyan-400 text-cyan-300 px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(0,255,255,0.3)] flex items-center gap-3 animate-fadeIn text-sm font-bold">
          <Bell size={18} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
