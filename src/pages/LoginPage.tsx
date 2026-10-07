import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, User, Phone, ArrowRight, ShoppingBasket, Sparkles, Utensils, Clock, MapPin, ShieldCheck, LogIn, UserPlus, Flame, Package } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { OWNER_NAME, APP_NAME } from '@/lib/constants';

interface LoginPageProps {
  setCurrentPage?: (page: string) => void;
}

export function LoginPage({ setCurrentPage }: LoginPageProps) {
  const { profile, setProfile } = useApp();
  const isRegistered = !!(profile?.name && profile?.phone);
  const [mode, setMode] = useState<'login' | 'register'>(isRegistered ? 'login' : 'register');
  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isRegistered) {
      setMode('login');
      setName(profile?.name || '');
      setPhone(profile?.phone || '');
    } else {
      setMode('register');
    }
  }, [isRegistered, profile?.name, profile?.phone]);

  const enterApp = () => {
    if (typeof setCurrentPage === 'function') setCurrentPage('home');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => enterApp(), 1000);
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please enter both your name and phone number.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number (at least 10 digits).');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setProfile({ name: name.trim(), phone: phone.trim() });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => enterApp(), 1200);
    }, 800);
  };

  const heroImage = 'https://images.pexels.com/photos/39025942/pexels-photo-39025942.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
  const deliveryImage = 'https://images.pexels.com/photos/39978119/pexels-photo-39978119.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

  const stats = [
    { icon: Flame, label: '26+ Stalls', color: 'text-amber-400' },
    { icon: Package, label: '15K+ Orders', color: 'text-teal-300' },
    { icon: Clock, label: '30 Min Delivery', color: 'text-amber-300' },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#005f60]">
      {/* 3D Creative Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#005f60] via-[#004849] to-[#003637]" />

        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 180, 360] }}
          transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
          className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-tr from-amber-500/30 to-orange-500/20 blur-2xl"
        />
        <motion.div
          animate={{ y: [0, 40, 0], x: [0, -25, 0], rotate: [0, -180, -360] }}
          transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut' }}
          className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-gradient-to-tr from-teal-400/30 to-emerald-500/20 blur-3xl"
        />

        {/* 3D perspective grid */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20"
          style={{
            background: 'linear-gradient(to top, rgba(245,158,11,0.15), transparent)',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'bottom',
          }}
        >
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Floating food icons - hidden on small screens */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-20 right-20 opacity-10 hidden sm:block"
        >
          <Utensils className="w-20 h-20 text-amber-400" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="absolute bottom-32 left-16 opacity-10 hidden sm:block"
        >
          <ShoppingBasket className="w-24 h-24 text-amber-400" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="absolute top-1/2 left-10 opacity-10 hidden sm:block"
        >
          <Clock className="w-16 h-16 text-teal-300" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/3 opacity-10 hidden sm:block"
        >
          <ShieldCheck className="w-16 h-16 text-amber-400" />
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-[420px] mx-auto my-auto px-2">
        {/* 3D Floating Logo - Delivery Basket Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-4"
        >
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            style={{ transformStyle: 'preserve-3d' }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-300 p-1.5 shadow-2xl shadow-amber-500/50 flex items-center justify-center mb-2"
          >
            <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center border-2 border-amber-400/50">
              <ShoppingBasket className="w-10 h-10 text-amber-400" />
            </div>
          </motion.div>
          <h1 className="text-lg font-black text-white tracking-tight mb-1">{APP_NAME}</h1>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-widest text-center">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span>Meerut's #1 Street Food Delivery</span>
          </div>
        </motion.div>

        {/* Infographic image banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-2xl overflow-hidden mb-4 shadow-2xl border border-amber-500/20"
        >
          <img src={heroImage} alt="Indian street food chaat" className="w-full h-32 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-black text-white uppercase tracking-wider">Authentic Meerut Street Food</span>
            </div>
            <div className="flex items-center gap-2">
              {stats.map((stat, idx) => {
                const StatIcon = stat.icon;
                return (
                  <div key={idx} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm border border-amber-500/20">
                    <StatIcon className={`w-2.5 h-2.5 ${stat.color}`} />
                    <span className="text-[8px] font-black text-white">{stat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-teal-500/30 shadow-2xl overflow-hidden"
        >
          {/* Header banner */}
          <div className="relative h-20 w-full overflow-hidden bg-gradient-to-r from-[#005f60] to-[#004849]">
            <img src={deliveryImage} alt="Food delivery" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="mx-auto w-fit bg-white text-[#005f60] py-1.5 px-4 rounded-lg font-black tracking-widest text-sm uppercase shadow-md">
                ORDERS FOR DELIVERY
              </div>
            </div>
            <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none">
              <path d="M0,20 C320,40 480,0 720,20 C960,40 1120,0 1440,20 L1440,40 L0,40 Z" fill="#0f172a" opacity="0.95" />
            </svg>
          </div>

          <div className="p-5 sm:p-6">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-6"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  </div>
                  <p className="text-white font-black text-xs">
                    {mode === 'register' ? `Welcome, ${name}!` : `Welcome back, ${profile?.name}!`}
                  </p>
                  <p className="text-teal-300 text-[10px] mt-1 font-bold">Entering app...</p>
                </motion.div>
              ) : mode === 'login' && isRegistered ? (
                /* === RETURNING USER: SHOW WELCOME + ENTER APP BUTTON === */
                <motion.div
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-2xl text-center"
                  >
                    <div className="flex items-center justify-center gap-2.5 mb-2">
                      <div className="w-11 h-11 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                        <User className="w-5 h-5 text-teal-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-white">{profile.name}</p>
                        <p className="text-[10px] text-teal-300 font-bold">{profile.phone}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-teal-300 font-bold">
                      Welcome back! You're already registered.
                    </p>
                  </motion.div>

                  <button
                    onClick={enterApp}
                    className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/30"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Enter App</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-1">
                    <button
                      onClick={() => setMode('register')}
                      className="text-[10px] text-teal-300 hover:text-teal-200 font-bold cursor-pointer underline underline-offset-2"
                    >
                      Not you? Register new account
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* === NEW USER: REGISTRATION FORM === */
                <motion.div
                  key="register"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <UserPlus className="w-4 h-4 text-teal-400" />
                    <h3 className="text-xs font-black text-teal-300 uppercase tracking-wider">One-Time Registration</h3>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold mb-2">
                    Enter your name and phone number once. After this, you can login with a single tap.
                  </p>

                  <form onSubmit={handleRegister} className="space-y-2.5">
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-teal-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-950 border border-teal-500/30 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-teal-400 font-bold transition-all"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-teal-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-950 border border-teal-500/30 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-teal-400 font-bold transition-all"
                        required
                      />
                    </div>

                    {error && (
                      <p className="text-red-400 text-[10px] font-bold">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !name.trim() || !phone.trim()}
                      className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer shadow-lg shadow-teal-500/30"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4" /><span>Register & Continue</span></>}
                    </button>
                  </form>

                  {isRegistered && (
                    <div className="text-center pt-1">
                      <button
                        onClick={() => setMode('login')}
                        className="text-[10px] text-teal-300 hover:text-teal-200 font-bold cursor-pointer underline underline-offset-2"
                      >
                        Back to login
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <p className="text-center text-teal-200 text-[11px] mt-4 font-bold">
          Owned & operated by {OWNER_NAME}
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
