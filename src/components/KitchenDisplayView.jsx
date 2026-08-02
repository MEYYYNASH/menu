import React from 'react';
import { UtensilsCrossed, Clock, CheckCircle2, AlertTriangle, Sparkles, Filter } from 'lucide-react';

export default function KitchenDisplayView({ orders, onUpdateOrderStatus, langDict }) {
  const activeOrders = orders.filter(o => o.status !== 'delivered');
  const completedOrders = orders.filter(o => o.status === 'delivered');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'received':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-1 rounded-full font-bold animate-pulse">NEW ORDER</span>;
      case 'preparing':
        return <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-2.5 py-1 rounded-full font-bold">PREPARING</span>;
      case 'ready':
        return <span className="bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs px-2.5 py-1 rounded-full font-bold animate-bounce">READY TO SERVE</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#090a10] text-gray-100 p-6 space-y-6">
      
      {/* KDS Header */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-300">
            <UtensilsCrossed size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-wide flex items-center gap-2">
              {langDict.kdsTitle || 'Kitchen Display System (KDS)'}
            </h1>
            <p className="text-xs text-gray-400">Live order queue for Barista & Kitchen Chef</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span>Active Tickets: <strong className="text-white text-sm">{activeOrders.length}</strong></span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Completed Today: <strong className="text-white text-sm">{completedOrders.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Active Orders Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <Clock size={18} className="text-cyan-400" />
          Active Orders Queue ({activeOrders.length})
        </h2>

        {activeOrders.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center text-gray-500 space-y-3">
            <Sparkles size={48} className="mx-auto text-gray-600" />
            <h3 className="text-xl font-bold text-gray-300">All Kitchen Orders Clear!</h3>
            <p className="text-xs text-gray-500">New table QR orders will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOrders.map((order) => (
              <div 
                key={order.id}
                className={`glass-panel rounded-3xl border overflow-hidden flex flex-col justify-between transition-all ${
                  order.status === 'received' ? 'border-amber-500/50 shadow-[0_0_20px_rgba(255,183,3,0.15)]' :
                  order.status === 'preparing' ? 'border-cyan-500/50' : 'border-pink-500/50 shadow-[0_0_20px_rgba(255,0,255,0.15)]'
                }`}
              >
                {/* Ticket Header */}
                <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-cyan-400">Table #{order.tableNumber}</span>
                    <p className="text-[10px] text-gray-400">Order #{order.id} • {order.time || '2 mins ago'}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Items List */}
                <div className="p-5 space-y-3 flex-1 overflow-y-auto max-h-64">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm text-white">
                          <strong className="text-cyan-400 mr-2">{it.quantity}x</strong> {it.item.name}
                        </span>
                        <span className="text-xs text-gray-400">{it.size}</span>
                      </div>
                      
                      {/* Options */}
                      <div className="text-xs text-amber-300/90 pl-6 space-y-0.5">
                        {it.sugar && <div>Sugar: {it.sugar}</div>}
                        {it.ice && <div>Ice: {it.ice}</div>}
                        {it.toppings.length > 0 && <div>Addons: {it.toppings.join(', ')}</div>}
                        {it.notes && <div className="text-pink-300 italic">Note: "{it.notes}"</div>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-[#0c0d14] border-t border-white/10 flex gap-2">
                  {order.status === 'received' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                      className="w-full cyber-btn-primary py-2.5 text-xs font-bold"
                    >
                      Start Preparing
                    </button>
                  )}

                  {order.status === 'preparing' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                      className="w-full cyber-btn-secondary py-2.5 text-xs font-bold"
                    >
                      Mark Ready
                    </button>
                  )}

                  {order.status === 'ready' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-2.5 rounded-full text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={16} />
                      <span>Served to Table</span>
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
