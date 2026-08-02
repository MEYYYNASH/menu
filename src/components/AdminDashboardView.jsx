import React, { useState } from 'react';
import { 
  LayoutDashboard, QrCode, DollarSign, TrendingUp, Users, Coffee, 
  CheckCircle2, Bell, ExternalLink, ShieldCheck, Search
} from 'lucide-react';
import { MENU_ITEMS } from '../data/menuData';

export default function AdminDashboardView({ orders, onSelectTable, langDict }) {
  const [activeTab, setActiveTab] = useState('tables'); // 'tables', 'qr', 'analytics', 'menu'
  const [soldOutIds, setSoldOutIds] = useState(['c8']); // Example sold out Affogato
  const [searchMenu, setSearchMenu] = useState('');

  // 20 Tables state mock
  const tableStatuses = Array.from({ length: 20 }, (_, idx) => {
    const tableNum = idx + 1;
    const order = orders.find(o => o.tableNumber === tableNum && o.status !== 'delivered');
    if (tableNum === 3 || tableNum === 7) return { num: tableNum, status: 'calling', order };
    if (order) return { num: tableNum, status: 'occupied', order };
    if (tableNum === 12) return { num: tableNum, status: 'bill', order };
    return { num: tableNum, status: 'free', order: null };
  });

  const toggleSoldOut = (id) => {
    if (soldOutIds.includes(id)) {
      setSoldOutIds(soldOutIds.filter(i => i !== id));
    } else {
      setSoldOutIds([...soldOutIds, id]);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a10] text-gray-100 p-6 space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-pink-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-pink-500/20 border border-pink-400 text-pink-300">
            <LayoutDashboard size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-wide flex items-center gap-2">
              {langDict.adminTitle || 'Staff & Table Admin Dashboard'}
            </h1>
            <p className="text-xs text-gray-400">Manage 20-Table QR ordering, live status & inventory</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl text-xs">
          {[
            { id: 'tables', label: 'Table Matrix (20)' },
            { id: 'qr', label: 'QR Generator' },
            { id: 'analytics', label: 'Sales Analytics' },
            { id: 'menu', label: 'Menu Stock' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-3.5 rounded-xl font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-pink-500/30 border border-pink-400 text-pink-200 shadow-[0_0_10px_rgba(255,0,255,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: 20-TABLE MATRIX */}
      {activeTab === 'tables' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-wide">
              Live Table Grid (Tables 1–20)
            </h2>
            
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Free</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-cyan-500" /> Ordering</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" /> Staff Alert</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-pink-500" /> Request Bill</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {tableStatuses.map((t) => (
              <div
                key={t.num}
                onClick={() => onSelectTable(t.num)}
                className={`glass-card p-5 rounded-3xl border cursor-pointer flex flex-col justify-between h-40 transition-all ${
                  t.status === 'calling' ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(255,183,3,0.3)] animate-pulse' :
                  t.status === 'bill' ? 'border-pink-400 bg-pink-500/10 shadow-[0_0_15px_rgba(255,0,255,0.3)]' :
                  t.status === 'occupied' ? 'border-cyan-400 bg-cyan-500/10' :
                  'border-white/10 hover:border-emerald-400/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl font-extrabold text-white">#{t.num}</span>
                  {t.status === 'calling' && <Bell size={18} className="text-amber-400 animate-bounce" />}
                  {t.status === 'bill' && <DollarSign size={18} className="text-pink-400" />}
                  {t.status === 'occupied' && <Coffee size={18} className="text-cyan-400" />}
                  {t.status === 'free' && <CheckCircle2 size={18} className="text-emerald-400/60" />}
                </div>

                <div>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                    t.status === 'calling' ? 'bg-amber-500/20 border-amber-400 text-amber-300' :
                    t.status === 'bill' ? 'bg-pink-500/20 border-pink-400 text-pink-300' :
                    t.status === 'occupied' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' :
                    'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  }`}>
                    {t.status === 'calling' ? 'Needs Waiter' :
                     t.status === 'bill' ? 'Bill Requested' :
                     t.status === 'occupied' ? 'Active Order' : 'Available'}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-2">Tap to view tablet view</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: QR CODE GENERATOR */}
      {activeTab === 'qr' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-wide">
              Printable QR Code Matrix (Tables 1–20)
            </h2>
            <p className="text-xs text-gray-400">Scan to open menu at <span className="text-cyan-400 font-semibold">meyyynash.github.io/menu/</span></p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 20 }, (_, idx) => idx + 1).map((tNum) => {
              const tableUrl = `https://meyyynash.github.io/menu/?table=${tNum}`;
              return (
                <div key={tNum} className="glass-panel p-5 rounded-3xl border border-cyan-500/30 text-center space-y-3">
                  <div className="bg-white p-3 rounded-2xl inline-block border border-gray-200">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(tableUrl)}`} 
                      alt={`Table ${tNum} QR`}
                      className="w-32 h-32"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">Table #{tNum}</h3>
                    <p className="text-[10px] text-cyan-300 truncate">{tableUrl}</p>
                  </div>
                  <button
                    onClick={() => onSelectTable(tNum)}
                    className="w-full cyber-btn-primary py-2 text-xs flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink size={14} />
                    <span>Simulate Scan</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SALES ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-2">
              <span className="text-xs text-gray-400">Today's Total Sales</span>
              <h3 className="text-3xl font-extrabold text-cyan-400">$1,482.50</h3>
              <p className="text-[10px] text-emerald-400">↑ 18% vs yesterday</p>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-pink-500/30 space-y-2">
              <span className="text-xs text-gray-400">Total Orders Placed</span>
              <h3 className="text-3xl font-extrabold text-pink-400">142</h3>
              <p className="text-[10px] text-gray-400">Average ticket $10.44</p>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-2">
              <span className="text-xs text-gray-400">Top Selling Beverage</span>
              <h3 className="text-2xl font-extrabold text-amber-300">Matcha Latte</h3>
              <p className="text-[10px] text-gray-400">38 cups ordered</p>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
              <span className="text-xs text-gray-400">Customer Satisfaction</span>
              <h3 className="text-3xl font-extrabold text-emerald-400">4.9 ★</h3>
              <p className="text-[10px] text-gray-400">Based on 98 table ratings</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MENU INVENTORY */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-wide">
              Live Stock & Availability Manager
            </h2>
            <input
              type="text"
              placeholder="Filter items..."
              value={searchMenu}
              onChange={(e) => setSearchMenu(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {MENU_ITEMS.filter(i => i.name.toLowerCase().includes(searchMenu.toLowerCase())).map((item) => {
              const isOut = soldOutIds.includes(item.id);
              return (
                <div key={item.id} className="glass-card p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-3">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-white">{item.name}</h4>
                    <span className="text-xs text-cyan-400">${item.price.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => toggleSoldOut(item.id)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      isOut
                        ? 'bg-red-500/20 border border-red-500 text-red-400'
                        : 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
                    }`}
                  >
                    {isOut ? 'Sold Out' : 'Available'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
