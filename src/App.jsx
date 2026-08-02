import React, { useState, useEffect, useRef } from 'react';
import CustomerView from './components/CustomerView';
import KitchenDisplayView from './components/KitchenDisplayView';
import AdminDashboardView from './components/AdminDashboardView';
import CustomizeModal from './components/CustomizeModal';
import CartDrawer from './components/CartDrawer';
import OrderStatusModal from './components/OrderStatusModal';
import { TRANSLATIONS } from './data/menuData';
import {
  Monitor, Utensils, LayoutDashboard, Bell, BellRing,
  Mail, Lock, Eye, EyeOff, X, ShieldCheck, ChefHat, LogOut, AlertCircle,
  CheckCheck, Clock, Package, Sparkles
} from 'lucide-react';

const ADMIN_EMAIL = 'penhbormey011427809@gmail.com';
const ADMIN_PASSWORD = 'admin1234';

export default function App() {
  const [currentView, setCurrentView] = useState('customer');
  const [tableNumber, setTableNumber] = useState(3);
  const [lang, setLang] = useState('en');

  // Admin auth
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminRole, setAdminRole] = useState(null);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifPermission, setNotifPermission] = useState('default');
  const notifPanelRef = useRef(null);
  const bellRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Request browser notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(p => setNotifPermission(p));
      }
    }
  }, []);

  // Close notif panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notifPanelRef.current && !notifPanelRef.current.contains(e.target) &&
        bellRef.current && !bellRef.current.contains(e.target)
      ) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cart
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItemForCustom, setSelectedItemForCustom] = useState(null);

  // Orders
  const [orders, setOrders] = useState([
    {
      id: '8841', tableNumber: 3, time: 'Just now', status: 'received', total: 15.25,
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

  // Push a new in-app + browser notification
  const pushNotification = (order) => {
    const itemSummary = order.items.map(i => `${i.quantity}× ${i.item.name}`).join(', ');
    const newNotif = {
      id: Date.now(),
      orderId: order.id,
      tableNumber: order.tableNumber,
      total: order.total,
      summary: itemSummary,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Browser push notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`🔔 New Order — Table #${order.tableNumber}`, {
        body: `Order #${order.id} • $${order.total.toFixed(2)}\n${itemSummary}`,
        icon: '/menu/favicon.svg',
        badge: '/menu/favicon.svg',
        tag: `order-${order.id}`,
        requireInteraction: true,
      });
    }

    // Play a subtle beep using Web Audio API
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch (_) {}
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const clearNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  // ── Admin auth ────────────────────────────────────────
  const handleAdminButtonClick = () => {
    if (isAdminAuthenticated) { setShowRolePicker(true); }
    else { setShowAdminLogin(true); setAdminEmail(''); setAdminPassword(''); setAdminLoginError(''); }
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
      // Request browser notification permission when admin logs in
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(p => setNotifPermission(p));
      }
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
    setShowNotifPanel(false);
    showToast('Signed out of admin panel.');
  };

  // ── Cart & Orders ─────────────────────────────────────
  const handleAddToCart = (item) => {
    setCartItems(prev => [...prev, item]);
    const name = lang === 'km' && item.item.nameKm ? item.item.nameKm : item.item.name;
    showToast(`Added ${name} to cart!`);
  };

  const handleUpdateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) { handleRemoveCartItem(cartItemId); return; }
    setCartItems(prev => prev.map(i => i.cartItemId === cartItemId ? { ...i, quantity: newQty, totalPrice: i.unitPrice * newQty } : i));
  };

  const handleRemoveCartItem = (cartItemId) => setCartItems(prev => prev.filter(i => i.cartItemId !== cartItemId));

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    const subtotal = cartItems.reduce((acc, i) => acc + i.totalPrice, 0);
    const newOrder = {
      id: String(Math.floor(1000 + Math.random() * 9000)),
      tableNumber, time: 'Just now', status: 'received',
      total: subtotal * 1.07, items: cartItems
    };
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setIsCartOpen(false);
    setIsOrderTrackerOpen(true);
    showToast(`Order #${newOrder.id} placed for Table #${tableNumber}!`);

    // 🔔 Send notification to staff/admin
    pushNotification(newOrder);
  };

  const handleCallStaff = () => {
    showToast(`Staff alerted for Table #${tableNumber}!`);
    // Also create a "call" notification
    const callNotif = {
      id: Date.now(),
      orderId: null,
      tableNumber,
      total: null,
      summary: `Table #${tableNumber} is calling for assistance.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      isCall: true,
    };
    setNotifications(prev => [callNotif, ...prev]);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`🔔 Table #${tableNumber} needs assistance!`, {
        body: 'A customer is calling for a waiter.',
        icon: '/menu/favicon.svg',
        requireInteraction: true,
      });
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order #${orderId} → ${newStatus.toUpperCase()}`);
  };

  const handleSelectTableFromAdmin = (tblNum) => {
    setTableNumber(tblNum);
    setCurrentView('customer');
    showToast(`Switched to Tablet View for Table #${tblNum}`);
  };

  const activeOrderForCurrentTable = orders.find(o => o.tableNumber === tableNumber && o.status !== 'delivered') || orders[0];

  return (
    <div className="min-h-screen bg-[#090a10] text-gray-100 font-['Kantumruy_Pro','Inter',sans-serif] selection:bg-cyan-500 selection:text-black">

      {/* ── Top Nav ───────────────────────────────────────── */}
      <nav className="bg-[#0e0f17] border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs relative z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold text-gray-300 hidden sm:inline">Café QR &amp; Tablet Mode:</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tablet View */}
          <button onClick={() => setCurrentView('customer')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-bold transition-all ${currentView === 'customer' ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,255,255,0.4)]' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
            <Monitor size={14} /><span>Tablet View (Table #{tableNumber})</span>
          </button>

          {/* KDS — admin only */}
          {isAdminAuthenticated && (
            <button onClick={() => setCurrentView('kds')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-bold transition-all ${currentView === 'kds' ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,255,255,0.4)]' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
              <Utensils size={14} /><span>Kitchen Display (KDS)</span>
            </button>
          )}

          {/* Staff Admin */}
          <button onClick={handleAdminButtonClick}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-bold transition-all ${currentView === 'admin' || currentView === 'kds' ? 'bg-pink-500 text-white shadow-[0_0_10px_rgba(255,0,255,0.4)]' : isAdminAuthenticated ? 'bg-violet-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
            <LayoutDashboard size={14} /><span>Staff Admin</span>
            {isAdminAuthenticated && <ShieldCheck size={12} className="text-green-300" />}
          </button>

          {/* 🔔 Notification Bell — admin only */}
          {isAdminAuthenticated && (
            <button
              ref={bellRef}
              onClick={() => { setShowNotifPanel(p => !p); if (unreadCount > 0) markAllRead(); }}
              className={`relative flex items-center justify-center w-8 h-8 rounded-lg transition-all ${unreadCount > 0 ? 'bg-amber-500/20 border border-amber-400/40 text-amber-300 animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white border border-transparent'}`}
              title="Order Notifications"
            >
              {unreadCount > 0 ? <BellRing size={15} /> : <Bell size={15} />}
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center shadow-[0_0_6px_rgba(239,68,68,0.8)]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Logout */}
          {isAdminAuthenticated && (
            <button onClick={handleAdminLogout} title="Sign out"
              className="flex items-center gap-1 py-1.5 px-2 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all font-bold">
              <LogOut size={13} />
            </button>
          )}
        </div>

        {/* ── Notification Panel ─────────────────────────── */}
        {showNotifPanel && isAdminAuthenticated && (
          <div
            ref={notifPanelRef}
            className="absolute top-full right-4 mt-2 w-80 rounded-2xl border border-white/10 bg-[#0e0f1a]/98 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-white/3">
              <div className="flex items-center gap-2">
                <BellRing size={14} className="text-amber-400" />
                <span className="text-white font-extrabold text-sm">Notifications</span>
                {notifications.length > 0 && (
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button onClick={markAllRead} className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                    Mark all read
                  </button>
                )}
                <button onClick={() => setNotifications([])} className="text-[10px] text-gray-500 hover:text-gray-300 font-semibold transition-colors">
                  Clear all
                </button>
              </div>
            </div>

            {/* Notification list */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-gray-600">
                  <Bell size={28} />
                  <p className="text-xs">No notifications yet</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`relative flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/4 transition-all ${!n.read ? 'bg-amber-500/5' : ''}`}
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 ${n.isCall ? 'bg-fuchsia-500/20 border border-fuchsia-400/30' : 'bg-cyan-500/15 border border-cyan-400/25'}`}>
                      {n.isCall
                        ? <BellRing size={14} className="text-fuchsia-400" />
                        : <Package size={14} className="text-cyan-400" />
                      }
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-white font-bold text-xs">
                          {n.isCall ? `Table #${n.tableNumber} — Needs Help` : `New Order #${n.orderId}`}
                        </p>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />}
                      </div>
                      <p className="text-gray-400 text-[11px] line-clamp-2 leading-relaxed">{n.summary}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={10} className="text-gray-600" />
                        <span className="text-[10px] text-gray-600">{n.time}</span>
                        {n.total && (
                          <span className="text-[10px] text-cyan-400 font-bold">${n.total.toFixed(2)}</span>
                        )}
                        {n.tableNumber && !n.isCall && (
                          <span className="text-[10px] text-gray-500">Table #{n.tableNumber}</span>
                        )}
                      </div>
                    </div>

                    {/* Dismiss */}
                    <button onClick={() => clearNotif(n.id)} className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-600 hover:text-gray-300 transition-all mt-0.5">
                      <X size={11} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer action */}
            {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-white/8">
                <button
                  onClick={() => { setShowNotifPanel(false); setCurrentView(adminRole === 'staff' ? 'kds' : 'admin'); }}
                  className="w-full py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCheck size={13} /> View in {adminRole === 'staff' ? 'Kitchen Display' : 'Admin Dashboard'}
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* ── Main Views ─────────────────────────────────────── */}
      {currentView === 'customer' && (
        <CustomerView tableNumber={tableNumber} setTableNumber={setTableNumber} lang={lang} setLang={setLang} langDict={langDict}
          cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)} onOpenCart={() => setIsCartOpen(true)}
          onOpenItemModal={(item) => setSelectedItemForCustom(item)} onCallStaff={handleCallStaff}
          activeOrder={activeOrderForCurrentTable} onOpenTracker={() => setIsOrderTrackerOpen(true)} />
      )}
      {currentView === 'kds' && isAdminAuthenticated && (
        <KitchenDisplayView orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} langDict={langDict} />
      )}
      {currentView === 'admin' && isAdminAuthenticated && (
        <AdminDashboardView orders={orders} onSelectTable={handleSelectTableFromAdmin} langDict={langDict} />
      )}

      {/* Modals */}
      <CustomizeModal item={selectedItemForCustom} onClose={() => setSelectedItemForCustom(null)} onAddToCart={handleAddToCart} langDict={langDict} lang={lang} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveCartItem} onCheckout={handleCheckout} tableNumber={tableNumber} langDict={langDict} />
      <OrderStatusModal isOpen={isOrderTrackerOpen} onClose={() => setIsOrderTrackerOpen(false)} activeOrder={activeOrderForCurrentTable} tableNumber={tableNumber} onCallStaff={handleCallStaff} onRequestBill={() => showToast('Requesting bill for Table #' + tableNumber)} onCompletePayment={() => showToast('Payment completed! Thank you.')} langDict={langDict} />

      {/* ── Admin Login Modal ───────────────────────────────── */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={() => setShowAdminLogin(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div className="relative w-full max-w-sm mx-4 rounded-3xl border border-white/10 bg-[#0c0d18] shadow-[0_0_80px_rgba(139,92,246,0.15)] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />
            <button onClick={() => setShowAdminLogin(false)} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"><X size={16} /></button>
            <div className="p-7 pt-8">
              <div className="flex flex-col items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.4)]">
                  <ShieldCheck size={26} className="text-white" />
                </div>
                <div className="text-center">
                  <h2 className="text-white font-extrabold text-xl">Admin Access</h2>
                  <p className="text-gray-500 text-xs mt-1">Restricted to authorized staff only</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-400/20 rounded-2xl px-3 py-2.5 mb-5">
                <ShieldCheck size={14} className="text-violet-400 flex-shrink-0" />
                <p className="text-[11px] text-violet-300">Admin credentials required to access staff features.</p>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-3">
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="email" placeholder="Admin email" value={adminEmail} onChange={e => { setAdminEmail(e.target.value); setAdminLoginError(''); }} required className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-400/60 transition-all" />
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type={showAdminPassword ? 'text' : 'password'} placeholder="Password" value={adminPassword} onChange={e => { setAdminPassword(e.target.value); setAdminLoginError(''); }} required className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-400/60 transition-all" />
                  <button type="button" onClick={() => setShowAdminPassword(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                    {showAdminPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {adminLoginError && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-400/25 rounded-2xl px-3 py-2.5">
                    <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                    <p className="text-[11px] text-red-300">{adminLoginError}</p>
                  </div>
                )}
                <button type="submit" disabled={adminLoginLoading}
                  className="w-full py-3 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-[0_0_20px_rgba(139,92,246,0.35)] disabled:opacity-60 active:scale-95 transition-all flex items-center justify-center gap-2 mt-1">
                  {adminLoginLoading
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><ShieldCheck size={15} /> Sign In as Admin</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Role Picker Modal ───────────────────────────────── */}
      {showRolePicker && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={() => setShowRolePicker(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div className="relative w-full max-w-sm mx-4 rounded-3xl border border-white/10 bg-[#0c0d18] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />
            <button onClick={() => setShowRolePicker(false)} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"><X size={16} /></button>
            <div className="p-7 pt-8">
              <div className="flex flex-col items-center gap-2 mb-6">
                <ShieldCheck size={28} className="text-violet-400" />
                <h2 className="text-white font-extrabold text-xl">Welcome, Admin</h2>
                <p className="text-gray-500 text-xs text-center">Select your role to continue</p>
                <p className="text-[11px] text-violet-400 font-medium">{ADMIN_EMAIL}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleSelectRole('staff')}
                  className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 hover:bg-cyan-500/15 hover:border-cyan-400/50 transition-all active:scale-95">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center group-hover:shadow-[0_0_16px_rgba(0,255,255,0.3)] transition-all">
                    <ChefHat size={24} className="text-cyan-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-extrabold text-sm">Staff</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">Kitchen Display</p>
                  </div>
                </button>
                <button onClick={() => handleSelectRole('admin')}
                  className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-pink-400/20 bg-pink-500/5 hover:bg-pink-500/15 hover:border-pink-400/50 transition-all active:scale-95">
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
        <div className="fixed bottom-6 right-6 z-50 bg-[#14141e99] backdrop-blur-md border border-cyan-400 text-cyan-300 px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(0,255,255,0.3)] flex items-center gap-3 text-sm font-bold">
          <Bell size={18} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
