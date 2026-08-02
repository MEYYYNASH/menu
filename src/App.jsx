import React, { useState } from 'react';
import CustomerView from './components/CustomerView';
import KitchenDisplayView from './components/KitchenDisplayView';
import AdminDashboardView from './components/AdminDashboardView';
import CustomizeModal from './components/CustomizeModal';
import CartDrawer from './components/CartDrawer';
import OrderStatusModal from './components/OrderStatusModal';
import { TRANSLATIONS } from './data/menuData';
import { Monitor, Utensils, LayoutDashboard, Sparkles, Bell } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('customer'); // 'customer', 'kds', 'admin'
  const [tableNumber, setTableNumber] = useState(3);
  const [lang, setLang] = useState('en'); // 'en' or 'km'

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Customization Modal state
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
        {
          item: { name: 'Matcha Latte', nameKm: 'ម៉ាត់ឆា ឡាត់តេ' },
          size: 'Medium (+0.75)',
          sugar: '50%',
          ice: 'Regular',
          toppings: ['Oat Milk (+0.75)'],
          quantity: 1,
          totalPrice: 7.00
        },
        {
          item: { name: 'Caesar Salad', nameKm: 'សាឡាត់ សេសា' },
          size: 'Standard',
          sugar: null,
          ice: null,
          toppings: [],
          quantity: 1,
          totalPrice: 8.25
        }
      ]
    }
  ]);

  // Order Tracker Modal state
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState(null);

  const langDict = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Cart actions
  const handleAddToCart = (customizedItem) => {
    setCartItems(prev => [...prev, customizedItem]);
    const itemName = lang === 'km' && customizedItem.item.nameKm ? customizedItem.item.nameKm : customizedItem.item.name;
    showToast(`Added ${itemName} to cart!`);
  };

  const handleUpdateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.cartItemId === cartItemId 
        ? { ...item, quantity: newQty, totalPrice: item.unitPrice * newQty }
        : item
    ));
  };

  const handleRemoveCartItem = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const subtotal = cartItems.reduce((acc, i) => acc + i.totalPrice, 0);
    const grandTotal = subtotal * 1.07;

    const newOrder = {
      id: String(Math.floor(1000 + Math.random() * 9000)),
      tableNumber,
      time: 'Just now',
      status: 'received',
      total: grandTotal,
      items: cartItems
    };

    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setIsCartOpen(false);
    setIsOrderTrackerOpen(true);
    showToast(`Order #${newOrder.id} placed for Table #${tableNumber}!`);
  };

  const handleCallStaff = () => {
    showToast(`Staff alerted for Table #${tableNumber}! A server is on their way.`);
  };

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
      
      {/* Top Demo Bar (Switch between Tablet View, Kitchen KDS, and Admin) */}
      <nav className="bg-[#0e0f17] border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold text-gray-300">Café QR & Tablet Mode Demo:</span>
        </div>

        <div className="flex items-center gap-2">
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

          <button
            onClick={() => setCurrentView('admin')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-bold transition-all ${
              currentView === 'admin'
                ? 'bg-pink-500 text-white shadow-[0_0_10px_rgba(255,0,255,0.4)]'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <LayoutDashboard size={14} />
            <span>Staff Admin</span>
          </button>
        </div>
      </nav>

      {/* Main Active View */}
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

      {currentView === 'kds' && (
        <KitchenDisplayView
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          langDict={langDict}
        />
      )}

      {currentView === 'admin' && (
        <AdminDashboardView
          orders={orders}
          onSelectTable={handleSelectTableFromAdmin}
          langDict={langDict}
        />
      )}

      {/* Modals & Overlays */}
      <CustomizeModal
        item={selectedItemForCustom}
        onClose={() => setSelectedItemForCustom(null)}
        onAddToCart={handleAddToCart}
        langDict={langDict}
        lang={lang}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
        tableNumber={tableNumber}
        langDict={langDict}
      />

      <OrderStatusModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        activeOrder={activeOrderForCurrentTable}
        tableNumber={tableNumber}
        onCallStaff={handleCallStaff}
        onRequestBill={() => showToast('Requesting bill for Table #' + tableNumber)}
        onCompletePayment={() => showToast('Payment completed! Thank you.')}
        langDict={langDict}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14141e99] backdrop-blur-md border border-cyan-400 text-cyan-300 px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(0,255,255,0.3)] flex items-center gap-3 animate-fadeIn text-sm font-bold">
          <Bell size={18} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
