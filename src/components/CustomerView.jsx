import React, { useState } from 'react';
import { 
  Sparkles, Coffee, CupSoda, GlassWater, Utensils, IceCream, Flame, 
  Search, BellRing, ShoppingBag, Globe, Star, Plus, Zap, Heart, Home, User, LayoutGrid,
  CreditCard, X, CheckCircle2,
  Mail, Lock, Eye, EyeOff, UserPlus, LogIn, Phone
} from 'lucide-react';
import { CATEGORIES, MENU_ITEMS, LANGUAGES } from '../data/menuData';

export default function CustomerView({ 
  tableNumber, 
  setTableNumber, 
  lang, 
  setLang, 
  langDict, 
  cartCount, 
  onOpenCart, 
  onOpenItemModal, 
  onCallStaff, 
  activeOrder,
  onOpenTracker 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMobileTab, setActiveMobileTab] = useState('home');
  const [showAccountModal, setShowAccountModal] = useState(false);
  // Auth form state
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setAuthSuccess(true);
      setTimeout(() => {
        setShowAccountModal(false);
        setAuthSuccess(false);
      }, 1800);
    }, 1500);
  };

  // Icon mapping
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles size={16} />;
      case 'Flame': return <Flame size={16} />;
      case 'Coffee': return <Coffee size={16} />;
      case 'CupSoda': return <CupSoda size={16} />;
      case 'GlassWater': return <GlassWater size={16} />;
      case 'Utensils': return <Utensils size={16} />;
      case 'IceCream': return <IceCream size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  // Filter items
  const filteredItems = MENU_ITEMS.filter((item) => {
    const itemName = lang === 'km' && item.nameKm ? item.nameKm : item.name;
    const itemDesc = lang === 'km' && item.descriptionKm ? item.descriptionKm : item.description;

    const matchesSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          itemDesc.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === 'specials') return matchesSearch && item.isSpecial;
    return matchesSearch && item.category === selectedCategory;
  });

  const aiRecommendations = MENU_ITEMS.filter(i => i.isSpecial).slice(0, 3);

  const handleMobileTabClick = (tabId) => {
    setActiveMobileTab(tabId);
    if (tabId === 'home') {
      setSelectedCategory('all');
    } else if (tabId === 'favorites') {
      setSelectedCategory('specials');
    } else if (tabId === 'cart') {
      onOpenCart();
    } else if (tabId === 'account') {
      setShowAccountModal(true);
    }
  };



  return (
    <div className="min-h-screen pb-32 md:pb-24 text-gray-100 bg-[#090a10] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,255,255,0.15),rgba(255,255,255,0))] font-['Kantumruy_Pro','Inter',sans-serif]">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/10 px-3 md:px-8 py-2.5 flex items-center justify-between gap-2.5">
        
        {/* Left Section: Logo + Table Selector + Call Waiter Bell */}
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">

          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.4)] text-black">
              <Zap size={18} className="fill-black" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-extrabold text-base tracking-wider text-white leading-tight">
                Cyber<span className="text-cyan-400">Café</span>
              </h1>
              <p className="text-[9px] text-gray-400 tracking-widest uppercase leading-tight">Smart QR Menu</p>
            </div>
          </div>

          {/* Table Display Pill (read-only) */}
          <div className="flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/40 rounded-full px-2.5 py-1.5 text-xs font-bold text-cyan-300 shadow-[0_0_8px_rgba(0,255,255,0.12)] flex-shrink-0">
            <span className="text-gray-400 text-[11px] font-normal">{langDict.table || 'Table'}:</span>
            <span className="text-cyan-300 font-extrabold">#{tableNumber}</span>
          </div>

          {/* ✨ Premium Call Waiter Bell Button */}
          <button
            onClick={onCallStaff}
            className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-600/70 to-fuchsia-600/70 border border-fuchsia-400/50 text-white font-bold text-xs active:scale-95 transition-all hover:from-violet-500/80 hover:to-fuchsia-500/80 shadow-[0_0_14px_rgba(192,38,211,0.35)] hover:shadow-[0_0_22px_rgba(192,38,211,0.55)] flex-shrink-0"
            title="Ring for service"
          >
            {/* Ripple ring animation */}
            <span className="absolute inset-0 rounded-full border border-fuchsia-400/50 scale-100 group-hover:scale-125 group-hover:opacity-0 transition-all duration-500" />
            <BellRing size={14} className="text-fuchsia-200 group-hover:rotate-12 transition-transform duration-200" />
            <span className="hidden sm:inline tracking-wide">{langDict.callStaff || 'Ring for Service'}</span>
          </button>

        </div>

        {/* Right Section: Language + Track Order + Cart */}
        <div className="flex items-center gap-2">
          
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2.5 py-1.5 text-xs">
            <Globe size={13} className="text-cyan-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer text-xs"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-[#0e0f17] text-white">
                  {l.tag}
                </option>
              ))}
            </select>
          </div>

          {/* Order Tracker Badge button */}
          {activeOrder && (
            <button
              onClick={onOpenTracker}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold animate-pulse hover:bg-pink-500/30 transition-all"
            >
              <Sparkles size={13} />
              <span>{langDict.orderStatus || 'Track Order'}</span>
            </button>
          )}

          {/* Desktop Cart Button */}
          <button
            onClick={onOpenCart}
            className="hidden md:flex relative cyber-btn-primary py-1.5 px-3.5 items-center gap-2 text-xs"
          >
            <ShoppingBag size={15} />
            <span>{langDict.cart || 'Cart'}</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-pink-500 text-white font-bold flex items-center justify-center text-[10px] shadow-lg">
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-4 md:pt-6 space-y-6 md:space-y-8">
        
        {/* Banner: AI Barista Recommendations */}
        <section className="relative overflow-hidden rounded-3xl glass-panel border border-cyan-500/30 p-5 md:p-8 bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-pink-950/40">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-[11px] font-bold tracking-wider">
                <Sparkles size={13} className="text-pink-400" />
                {langDict.aiBarista || 'AI Barista Recommendation'}
              </div>
              <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-wide">
                {lang === 'km' ? `រៀបចំសម្រាប់ តុលេខ #${tableNumber}` : `Crafted for Your Table #${tableNumber}`}
              </h2>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                {lang === 'km' 
                  ? 'ភេសជ្ជៈកាហ្វេត្រជាក់ ប៊ឺហ្គឺ និងការ៉េមរសជាតិឆ្ងាញ់សម្រាប់តុរបស់អ្នក។' 
                  : 'Handpicked artisanal cold brews, meals, and matcha gelato tailored for your coffee breaks.'}
              </p>
            </div>

            {/* Quick Promo Cards */}
            <div className="flex gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
              {aiRecommendations.map((recItem) => (
                <div 
                  key={recItem.id}
                  onClick={() => onOpenItemModal(recItem)}
                  className="flex-shrink-0 w-32 md:w-36 glass-card p-2 rounded-2xl cursor-pointer hover:border-cyan-400 transition-all border border-white/10 active:scale-95"
                >
                  <img src={recItem.image} alt={recItem.name} className="w-full h-20 md:h-24 rounded-xl object-cover mb-2" />
                  <h4 className="font-bold text-xs text-white truncate">
                    {lang === 'km' && recItem.nameKm ? recItem.nameKm : recItem.name}
                  </h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-cyan-400 font-extrabold text-xs">${recItem.price.toFixed(2)}</span>
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      {recItem.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Search & Category Filter Bar */}
        <section className="space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={langDict.searchPlaceholder || 'Search coffee, teas, burgers, ice cream...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-2xl py-2.5 md:py-3 pl-10 pr-4 text-xs md:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 shadow-inner"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 py-2 px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-[0_0_12px_rgba(0,255,255,0.4)]'
                        : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {getCategoryIcon(cat.icon)}
                    <span>{lang === 'km' ? cat.labelKm : cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Menu Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base md:text-lg font-bold text-white tracking-wide">
              {selectedCategory.toUpperCase()} MENU <span className="text-gray-500 text-xs">({filteredItems.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 md:gap-6">
            {filteredItems.map((item) => {
              const displayName = lang === 'km' && item.nameKm ? item.nameKm : item.name;
              const displayDesc = lang === 'km' && item.descriptionKm ? item.descriptionKm : item.description;

              return (
                <div
                  key={item.id}
                  className="glass-card rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group active:scale-[0.99]"
                >
                  {/* Image & Badges */}
                  <div className="relative h-36 md:h-48 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={displayName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f17] via-transparent to-transparent opacity-85" />

                    {/* Special Badge */}
                    {item.isSpecial && (
                      <span className="absolute top-2.5 left-2.5 bg-pink-500/90 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-pink-400 shadow-md">
                        {lang === 'km' ? 'ពិសេស' : 'Special'}
                      </span>
                    )}

                    {/* Rating */}
                    <span className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 border border-white/10">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      {item.rating}
                    </span>

                    <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
                      <span className="text-[10px] text-gray-300 font-medium bg-black/60 px-1.5 py-0.5 rounded-md border border-white/10">
                        {item.calories} kcal
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 md:p-5 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-xs md:text-base line-clamp-1 group-hover:text-cyan-300 transition-colors">
                        {displayName}
                      </h4>
                      <p className="text-[11px] md:text-xs text-gray-400 line-clamp-2 leading-tight">
                        {displayDesc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-2">
                      <div>
                        <span className="text-sm md:text-lg font-extrabold text-cyan-400">${item.price.toFixed(2)}</span>
                      </div>

                      <button
                        onClick={() => onOpenItemModal(item)}
                        className="fb-btn-primary py-1.5 px-3 md:py-2 md:px-4 text-xs font-bold flex items-center gap-1"
                      >
                        <Plus size={14} />
                        <span>{langDict.customize || 'Add'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* FLOATING MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden floating-bottom-nav">
        
        {/* Tab 1: Home / Menu */}
        {activeMobileTab === 'home' ? (
          <button className="floating-pill-active">
            <Home size={18} className="fill-white" />
            <span className="text-xs tracking-wide">Home</span>
          </button>
        ) : (
          <button 
            onClick={() => handleMobileTabClick('home')}
            className="floating-pill-inactive"
            title="Home Menu"
          >
            <Home size={20} />
          </button>
        )}

        {/* Tab 2: Favorites / Specials */}
        {activeMobileTab === 'favorites' ? (
          <button className="floating-pill-active">
            <Heart size={18} className="fill-white" />
            <span className="text-xs tracking-wide">Specials</span>
          </button>
        ) : (
          <button 
            onClick={() => handleMobileTabClick('favorites')}
            className="floating-pill-inactive"
            title="Favorites & Specials"
          >
            <Heart size={20} />
          </button>
        )}

        {/* Tab 3: Cart / Grid */}
        {activeMobileTab === 'cart' ? (
          <button className="floating-pill-active">
            <LayoutGrid size={18} className="fill-white" />
            <span className="text-xs tracking-wide">Cart ({cartCount})</span>
          </button>
        ) : (
          <button 
            onClick={() => handleMobileTabClick('cart')}
            className="floating-pill-inactive relative"
            title="Cart & Orders"
          >
            <LayoutGrid size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff0844] text-white text-[9px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        )}

        {/* Tab 4: Account / Card */}
        {activeMobileTab === 'account' ? (
          <button className="floating-pill-active" style={{background: 'linear-gradient(135deg,#7c3aed,#db2777)'}}>
            <CreditCard size={18} className="fill-white" />
            <span className="text-xs tracking-wide">Account</span>
          </button>
        ) : (
          <button
            onClick={() => handleMobileTabClick('account')}
            className="floating-pill-inactive"
            title="My Account & Card"
          >
            <CreditCard size={20} />
          </button>
        )}

      </div>


      {/* ── ACCOUNT / AUTH MODAL ──────────────────────── */}
      {showAccountModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center" onClick={() => { setShowAccountModal(false); setAuthSuccess(false); }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm mx-4 mb-6 rounded-3xl border border-white/10 bg-[#0c0d18]/97 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,255,255,0.08)] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Ambient glow top */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full bg-gradient-to-r from-cyan-500/20 to-pink-500/20 blur-3xl pointer-events-none" />

            {/* Close */}
            <button
              onClick={() => { setShowAccountModal(false); setAuthSuccess(false); }}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={16} />
            </button>

            <div className="p-6 pt-7">

              {authSuccess ? (
                /* ── Success State ── */
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center mb-2">
                    <CheckCircle2 size={36} className="text-green-400" />
                  </div>
                  <p className="text-white font-extrabold text-lg">{authMode === 'login' ? 'Welcome back!' : 'Account created!'}</p>
                  <p className="text-gray-400 text-xs text-center">You are now signed in to CyberCafé.</p>
                </div>
              ) : (
                <>
                  {/* Logo + Title */}
                  <div className="flex flex-col items-center gap-2 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                      <Zap size={22} className="fill-black text-black" />
                    </div>
                    <h2 className="text-white font-extrabold text-xl tracking-tight">
                      {authMode === 'login' ? 'Sign In' : 'Create Account'}
                    </h2>
                    <p className="text-gray-500 text-xs">
                      {authMode === 'login' ? 'Welcome back to CyberCafé' : 'Join CyberCafé today'}
                    </p>
                  </div>

                  {/* Toggle Tabs */}
                  <div className="flex rounded-2xl bg-white/5 border border-white/8 p-1 mb-5">
                    <button
                      onClick={() => setAuthMode('login')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        authMode === 'login'
                          ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-[0_0_12px_rgba(0,255,255,0.3)]'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setAuthMode('signup')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        authMode === 'signup'
                          ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-[0_0_12px_rgba(236,72,153,0.3)]'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleAuthSubmit} className="space-y-3">

                    {/* Name field – signup only */}
                    {authMode === 'signup' && (
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={authName}
                          onChange={e => setAuthName(e.target.value)}
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-400/60 focus:bg-white/8 transition-all"
                        />
                      </div>
                    )}

                    {/* Phone – signup only */}
                    {authMode === 'signup' && (
                      <div className="relative">
                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={authPhone}
                          onChange={e => setAuthPhone(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-400/60 focus:bg-white/8 transition-all"
                        />
                      </div>
                    )}

                    {/* Email */}
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={authEmail}
                        onChange={e => setAuthEmail(e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/60 focus:bg-white/8 transition-all"
                      />
                    </div>

                    {/* Password */}
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={authPassword}
                        onChange={e => setAuthPassword(e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/60 focus:bg-white/8 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    {/* Forgot password – login only */}
                    {authMode === 'login' && (
                      <div className="text-right">
                        <button type="button" className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors">
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={authLoading}
                      className={`w-full py-3 rounded-2xl font-extrabold text-sm transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 mt-1 ${
                        authMode === 'login'
                          ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_28px_rgba(0,255,255,0.45)]'
                          : 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_28px_rgba(236,72,153,0.45)]'
                      }`}
                    >
                      {authLoading ? (
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : authMode === 'login' ? (
                        <><LogIn size={15} /> Sign In</>
                      ) : (
                        <><UserPlus size={15} /> Create Account</>
                      )}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 py-1">
                      <div className="flex-1 h-px bg-white/8" />
                      <span className="text-[10px] text-gray-600">or continue with</span>
                      <div className="flex-1 h-px bg-white/8" />
                    </div>

                    {/* Google / Social */}
                    <button
                      type="button"
                      className="w-full py-2.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      Continue with Google
                    </button>

                  </form>

                  {/* Switch mode */}
                  <p className="text-center text-[11px] text-gray-500 mt-4">
                    {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button
                      onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                      className={`font-bold ${ authMode === 'login' ? 'text-pink-400 hover:text-pink-300' : 'text-cyan-400 hover:text-cyan-300' } transition-colors`}
                    >
                      {authMode === 'login' ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
