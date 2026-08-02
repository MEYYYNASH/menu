import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout, tableNumber, langDict }) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const tax = subtotal * 0.07;
  const grandTotal = subtotal + tax;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-fadeIn font-['Kantumruy_Pro','Inter',sans-serif]">
      <div className="absolute inset-y-0 right-0 max-w-full flex sm:pl-10 w-full justify-end items-end sm:items-stretch">
        <div className="w-full sm:max-w-md glass-panel border-t sm:border-l border-cyan-500/30 flex flex-col justify-between shadow-2xl rounded-t-3xl sm:rounded-none max-h-[90vh] sm:max-h-full">
          
          {/* Mobile Handle Indicator */}
          <div className="sm:hidden w-12 h-1.5 bg-white/20 rounded-full mx-auto my-2.5" />

          {/* Cart Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#0e0f17]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">{langDict.cart || 'My Cart'}</h2>
                <p className="text-[11px] sm:text-xs text-gray-400">{langDict.table || 'Table'} #{tableNumber} • {cartItems.length} items</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors active:scale-90"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-12">
                <ShoppingBag size={56} className="text-gray-600 mb-4 animate-bounce" />
                <p className="text-base sm:text-lg font-semibold text-gray-300">Your cart is empty</p>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">Scan the menu and pick your favorite coffee, meals, or desserts to begin!</p>
              </div>
            ) : (
              cartItems.map((cartItem) => (
                <div 
                  key={cartItem.cartItemId}
                  className="glass-card p-3 sm:p-4 rounded-2xl border border-white/10 flex gap-3 relative overflow-hidden"
                >
                  <img 
                    src={cartItem.item.image} 
                    alt={cartItem.item.name} 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-white/10 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-white text-xs sm:text-base leading-snug">
                          {cartItem.item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(cartItem.cartItemId)}
                          className="text-gray-500 hover:text-pink-400 transition-colors p-1 active:scale-90"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      {/* Customized Details */}
                      <div className="text-[11px] text-gray-400 space-y-0.5 mt-1">
                        {cartItem.size && <div>Size: <span className="text-cyan-300">{cartItem.size}</span></div>}
                        {cartItem.sugar && <div>Sugar: <span className="text-pink-300">{cartItem.sugar}</span></div>}
                        {cartItem.ice && <div>Ice: <span className="text-cyan-300">{cartItem.ice}</span></div>}
                        {cartItem.toppings.length > 0 && (
                          <div className="text-amber-300/90">+ {cartItem.toppings.join(', ')}</div>
                        )}
                        {cartItem.notes && <div className="italic text-gray-400">"{cartItem.notes}"</div>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5">
                      <span className="font-bold text-cyan-400 text-xs sm:text-sm">${cartItem.totalPrice.toFixed(2)}</span>
                      
                      <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2 py-0.5 border border-white/10">
                        <button
                          onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white active:scale-90"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold text-white px-1">{cartItem.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white active:scale-90"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary & Checkout Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-white/10 bg-[#0a0b12] space-y-3">
              <div className="space-y-1.5 text-xs sm:text-sm text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-medium text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">VAT (7%)</span>
                  <span className="font-medium text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold pt-2 border-t border-white/10">
                  <span className="text-white">{langDict.total || 'Total'}</span>
                  <span className="text-cyan-400 text-base sm:text-lg">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full fb-btn-primary py-3 sm:py-3.5 px-5 flex items-center justify-between text-xs sm:text-sm active:scale-95"
              >
                <span>{langDict.checkout || 'Place Order'}</span>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold">${grandTotal.toFixed(2)}</span>
                  <ArrowRight size={16} />
                </div>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
