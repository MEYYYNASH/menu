import React, { useState } from 'react';
import { X, Plus, Minus, AlertCircle, Check } from 'lucide-react';

export default function CustomizeModal({ item, onClose, onAddToCart, langDict, lang }) {
  if (!item) return null;

  const customizable = item.customizable || { sizes: ['Standard'], sugar: true, ice: true, toppings: [] };

  const [selectedSize, setSelectedSize] = useState(customizable.sizes[0] || 'Standard');
  const [sugarLevel, setSugarLevel] = useState('100%');
  const [iceLevel, setIceLevel] = useState('Regular');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  const displayName = lang === 'km' && item.nameKm ? item.nameKm : item.name;
  const displayDesc = lang === 'km' && item.descriptionKm ? item.descriptionKm : item.description;

  const getSizeExtraPrice = (sizeStr) => {
    const match = sizeStr.match(/\(\+?\$?([0-9.]+)\)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const getToppingExtraPrice = (toppingStr) => {
    const match = toppingStr.match(/\(\+?\$?([0-9.]+)\)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const calculateUnitPrice = () => {
    let unit = item.price;
    unit += getSizeExtraPrice(selectedSize);
    selectedToppings.forEach(top => {
      unit += getToppingExtraPrice(top);
    });
    return unit;
  };

  const unitPrice = calculateUnitPrice();
  const totalPrice = unitPrice * quantity;

  const toggleTopping = (topping) => {
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(selectedToppings.filter(t => t !== topping));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleAdd = () => {
    onAddToCart({
      cartItemId: `${item.id}-${Date.now()}`,
      item,
      size: selectedSize,
      sugar: customizable.sugar ? sugarLevel : null,
      ice: customizable.ice ? iceLevel : null,
      toppings: selectedToppings,
      notes,
      quantity,
      unitPrice,
      totalPrice
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-['Kantumruy_Pro','Inter',sans-serif]">
      <div className="relative w-full max-w-lg glass-panel rounded-t-3xl sm:rounded-3xl overflow-hidden border-t sm:border border-cyan-500/30 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Mobile Pull Handle Indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-white/20 rounded-full mx-auto my-2" />

        {/* Header */}
        <div className="relative h-40 sm:h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a10] via-black/40 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:text-cyan-400 hover:bg-black transition-all active:scale-95"
          >
            <X size={18} />
          </button>
          
          <div className="absolute bottom-3 left-5 right-5">
            <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 mb-1">
              {item.aiTag || item.category.toUpperCase()}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">{displayName}</h2>
            <p className="text-xs text-gray-300 line-clamp-1">{displayDesc}</p>
          </div>
        </div>

        {/* Content Options */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-gray-200">
          
          {/* Allergens warning */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="flex items-center gap-2 text-xs bg-amber-500/10 border border-amber-500/30 text-amber-300 p-2.5 rounded-xl">
              <AlertCircle size={16} />
              <span>Contains Allergens: <strong>{item.allergens.join(', ')}</strong></span>
            </div>
          )}

          {/* Size Selector */}
          {customizable.sizes && customizable.sizes.length > 1 && (
            <div>
              <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">Select Size</label>
              <div className="grid grid-cols-2 gap-2">
                {customizable.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                      selectedSize === sz
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sugar Level */}
          {customizable.sugar && (
            <div>
              <label className="block text-xs font-semibold text-pink-400 uppercase tracking-wider mb-2">Sugar Level</label>
              <div className="grid grid-cols-5 gap-1.5">
                {['0%', '25%', '50%', '75%', '100%'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSugarLevel(lvl)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all active:scale-95 ${
                      sugarLevel === lvl
                        ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-[0_0_8px_rgba(255,0,255,0.3)]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ice Level */}
          {customizable.ice && (
            <div>
              <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">Ice Level</label>
              <div className="grid grid-cols-4 gap-1.5">
                {['No Ice', 'Less Ice', 'Regular', 'Extra Ice'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setIceLevel(lvl)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all active:scale-95 ${
                      iceLevel === lvl
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(0,255,255,0.3)]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Toppings & Addons */}
          {customizable.toppings && customizable.toppings.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Add-ons & Toppings</label>
              <div className="space-y-2">
                {customizable.toppings.map((top) => {
                  const isChecked = selectedToppings.includes(top);
                  return (
                    <button
                      key={top}
                      onClick={() => toggleTopping(top)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm transition-all active:scale-[0.99] ${
                        isChecked
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(255,183,3,0.2)]'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <span>{top}</span>
                      <span className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs ${
                        isChecked ? 'bg-amber-400 text-black font-bold border-amber-400' : 'border-white/30'
                      }`}>
                        {isChecked ? <Check size={14} className="text-black font-bold" /> : '+'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Special Request</label>
            <input
              type="text"
              placeholder="e.g. Extra hot, less sauce, allergies..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Footer Actions - Facebook Style Touch Buttons */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0c0d14] flex items-center justify-between gap-3">
          {/* Quantity selector */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full py-1.5 px-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-cyan-500 hover:text-black transition-colors active:scale-90"
            >
              <Minus size={14} />
            </button>
            <span className="font-bold text-white min-w-[18px] text-center text-xs">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-cyan-500 hover:text-black transition-colors active:scale-90"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to Cart Facebook Button */}
          <button
            onClick={handleAdd}
            className="flex-1 fb-btn-primary py-3 px-5 text-xs sm:text-sm flex items-center justify-between active:scale-95"
          >
            <span>{langDict.addToCart || 'Add to Cart'}</span>
            <span className="font-extrabold text-sm sm:text-base">${totalPrice.toFixed(2)}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
