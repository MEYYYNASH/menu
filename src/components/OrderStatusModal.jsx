import React, { useState } from 'react';
import { 
  X, CheckCircle2, Clock, UtensilsCrossed, Bell, CreditCard, QrCode, 
  DollarSign, Star, Sparkles, Send, Check, Coffee, Zap, Utensils
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderStatusModal({ isOpen, onClose, activeOrder, tableNumber, onCallStaff, onRequestBill, onCompletePayment, langDict }) {
  if (!isOpen) return null;

  const [paymentStep, setPaymentStep] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('qr');
  const [feedbackStep, setFeedbackStep] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const steps = [
    { status: 'received', label: 'Order Received', desc: 'Sent to Kitchen', icon: Clock },
    { status: 'preparing', label: 'Preparing', desc: 'Chef & Barista at work', icon: UtensilsCrossed },
    { status: 'ready', label: 'Order Ready', desc: 'Server bringing to table', icon: Sparkles },
    { status: 'delivered', label: 'Served & Enjoy!', desc: 'Bon appétit', icon: CheckCircle2 },
  ];

  const currentStatusIndex = steps.findIndex(s => s.status === (activeOrder?.status || 'received'));

  const handlePayNow = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setPaymentStep(false);
    setFeedbackStep(true);
    if (onCompletePayment) onCompletePayment();
  };

  const handleFeedbackSubmit = () => {
    setFeedbackSubmitted(true);
    setTimeout(() => {
      onClose();
      setFeedbackStep(false);
      setFeedbackSubmitted(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-['Kantumruy_Pro','Inter',sans-serif]">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl p-6 text-white space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-cyan-400 tracking-wide flex items-center gap-2">
              <Sparkles size={20} className="text-pink-400" />
              {langDict.orderStatus || 'Live Order Tracker'}
            </h2>
            <p className="text-xs text-gray-400">{langDict.table || 'Table'} #{tableNumber} • Order #{activeOrder?.id || '8842'}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* FEEDBACK STEP */}
        {feedbackStep ? (
          <div className="py-6 text-center space-y-6 animate-fadeIn">
            {feedbackSubmitted ? (
              <div className="space-y-3 py-8">
                <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 border border-cyan-400 rounded-full flex items-center justify-center mx-auto text-3xl">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white">Thank You!</h3>
                <p className="text-sm text-gray-300">Your feedback helps us make Cyber Café even better!</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">{langDict.feedbackTitle || 'How was your experience?'}</h3>
                  <p className="text-xs text-gray-400">Rate your food, drinks & service speed</p>
                </div>

                {/* Rating Stars */}
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-2 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star 
                        size={32} 
                        fill={star <= rating ? '#ffb703' : 'transparent'} 
                        color={star <= rating ? '#ffb703' : '#666'} 
                      />
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 justify-center text-xs">
                  {[
                    { label: 'Great Coffee', icon: Coffee },
                    { label: 'Fast Service', icon: Zap },
                    { label: 'Delicious Food', icon: Utensils },
                    { label: 'Sleek Vibe', icon: Sparkles },
                  ].map((tag) => (
                    <span key={tag.label} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 flex items-center gap-1.5">
                      <tag.icon size={13} className="text-cyan-400" />
                      <span>{tag.label}</span>
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleFeedbackSubmit}
                  className="w-full cyber-btn-primary py-3 flex items-center justify-center gap-2 text-sm"
                >
                  <Send size={16} />
                  <span>{langDict.submitFeedback || 'Submit Rating'}</span>
                </button>
              </>
            )}
          </div>
        ) : paymentStep ? (
          /* PAYMENT STEP */
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Select Payment Method</h3>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'qr', label: langDict.qrPayment || 'QR Code', icon: QrCode, color: 'text-cyan-400 border-cyan-400' },
                { id: 'card', label: langDict.card || 'Card', icon: CreditCard, color: 'text-pink-400 border-pink-400' },
                { id: 'cash', label: langDict.cash || 'Cash', icon: DollarSign, color: 'text-amber-400 border-amber-400' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedPaymentMethod(m.id)}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                    selectedPaymentMethod === m.id
                      ? `bg-white/10 ${m.color} shadow-lg scale-105`
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <m.icon size={24} />
                  <span className="text-xs font-semibold">{m.label}</span>
                </button>
              ))}
            </div>

            {selectedPaymentMethod === 'qr' && (
              <div className="bg-white/5 border border-cyan-500/30 p-4 rounded-2xl text-center space-y-3">
                <div className="w-40 h-40 bg-white p-2 mx-auto rounded-xl flex items-center justify-center">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://yourcafe.com/pay/table/3" 
                    alt="Payment QR"
                    className="w-full h-full" 
                  />
                </div>
                <p className="text-xs text-cyan-300">Scan with any Mobile Banking App or Bakong QR</p>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center text-sm font-bold border-t border-white/10">
              <span className="text-gray-300">Total Amount Due</span>
              <span className="text-cyan-400 text-xl">${(activeOrder?.total || 18.50).toFixed(2)}</span>
            </div>

            <button
              onClick={handlePayNow}
              className="w-full cyber-btn-primary py-3.5 text-base flex items-center justify-center gap-2"
            >
              <span>Confirm & Pay ${(activeOrder?.total || 18.50).toFixed(2)}</span>
            </button>
          </div>
        ) : (
          /* REGULAR TRACKER STEP */
          <>
            {/* Step Timeline */}
            <div className="space-y-4 py-2">
              {steps.map((step, idx) => {
                const StepIcon = step.icon;
                const isCompleted = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;

                return (
                  <div key={step.status} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border transition-all ${
                      isCurrent
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,255,255,0.5)] animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-gray-600'
                    }`}>
                      <StepIcon size={18} />
                    </div>

                    <div className="flex-1">
                      <h4 className={`text-sm font-bold ${isCompleted ? 'text-white' : 'text-gray-500'}`}>
                        {step.label}
                      </h4>
                      <p className="text-xs text-gray-400">{step.desc}</p>
                    </div>

                    {isCurrent && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 font-semibold animate-bounce">
                        In Progress
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Ordered Items Summary */}
            {activeOrder && activeOrder.items && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Your Order Items</h4>
                <div className="space-y-1 text-xs text-gray-300 max-h-28 overflow-y-auto">
                  {activeOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.quantity}x {it.item.name}</span>
                      <span className="font-semibold text-cyan-400">${it.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={onCallStaff}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all"
              >
                <Bell size={16} className="text-amber-400" />
                <span>{langDict.callStaff || 'Call Staff'}</span>
              </button>

              <button
                onClick={() => setPaymentStep(true)}
                className="cyber-btn-secondary py-3 px-4 text-xs font-bold flex items-center justify-center gap-2"
              >
                <CreditCard size={16} />
                <span>{langDict.requestBill || 'Request Bill'}</span>
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
