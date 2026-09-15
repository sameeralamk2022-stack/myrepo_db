import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, User, Phone, ArrowRight, ShoppingBasket, Sparkles, Utensils, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { OWNER_NAME } from '@/lib/constants';

interface LoginPageProps {
  setCurrentPage?: (page: string) => void;
}

export function LoginPage({ setCurrentPage }: LoginPageProps) {
  const { profile, setProfile } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [returningUser, setReturningUser] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mb_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name && parsed.phone) {
          setReturningUser(true);
          setName(parsed.name);
          setPhone(parsed.phone);
        }
      }
    } catch {}
  }, []);

  const handleLogin = (e: React.FormEvent) => {
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
      setTimeout(() => {
        if (typeof setCurrentPage === 'function') setCurrentPage('home');
      }, 1200);
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-[#005f60]">
      {/* 3D Creative Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#005f60] via-[#004849] to-[#003637]" />

        {/* Floating 3D orbs */}
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
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 30, ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400/20 to-amber-500/10 blur-xl"
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

        {/* Floating food icons */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-20 right-20 opacity-10"
        >
          <Utensils className="w-20 h-20 text-amber-400" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="absolute bottom-32 left-16 opacity-10"
        >
          <ShoppingBasket className="w-24 h-24 text-amber-400" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="absolute top-1/2 left-10 opacity-10"
        >
          <Clock className="w-16 h-16 text-teal-300" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/3 opacity-10"
        >
          <MapPin className="w-14 h-14 text-teal-300" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/3 opacity-10"
        >
          <ShieldCheck className="w-18 h-18 text-amber-400" />
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-[380px] mx-auto my-auto">
        {/* 3D Floating Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-4"
        >
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            style={{ transformStyle: 'preserve-3d' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-300 p-1 shadow-2xl shadow-amber-500/40 flex items-center justify-center mb-2"
          >
            <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center border border-amber-400/50">
              <ShoppingBasket className="w-8 h-8 text-amber-400" />
            </div>
          </motion.div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>Meerut's #1 Street Food Delivery</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-teal-500/30 shadow-2xl overflow-hidden"
        >
          {/* Header banner */}
          <div className="relative h-28 w-full overflow-hidden bg-gradient-to-r from-[#005f60] to-[#004849]">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-teal-200 font-serif italic text-xs tracking-wide">We are taking</p>
              <div className="mx-auto w-fit bg-white text-[#005f60] py-1.5 px-4 rounded-lg font-black tracking-widest text-sm uppercase shadow-md mt-1">
                ORDERS
              </div>
              <p className="text-teal-200 text-[10px] font-medium uppercase tracking-widest mt-1">for DELIVERY</p>
            </div>
            {/* Decorative wave */}
            <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none">
              <path d="M0,20 C320,40 480,0 720,20 C960,40 1120,0 1440,20 L1440,40 L0,40 Z" fill="#0f172a" opacity="0.95" />
            </svg>
          </div>

          <div className="p-6">
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
                  <p className="text-white font-black text-xs">Welcome, {name}!</p>
                  <p className="text-teal-300 text-[10px] mt-1 font-bold">Redirecting to home...</p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {returningUser && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 bg-teal-500/10 border border-teal-500/30 rounded-xl text-center mb-2"
                    >
                      <p className="text-[10px] text-teal-300 font-bold">
                        Welcome back, {name}! Your details are saved. Tap Continue to order.
                      </p>
                    </motion.div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-2.5">
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-teal-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-teal-500/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-400 font-bold transition-all"
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
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-teal-500/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-400 font-bold transition-all"
                        required
                      />
                    </div>

                    {error && (
                      <p className="text-red-400 text-[10px] font-bold">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !name.trim() || !phone.trim()}
                      className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-teal-500/30"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Continue</span><ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </form>

                  <p className="text-center text-teal-300 text-[10px] font-bold pt-1">
                    {returningUser
                      ? 'Your details are saved on this device. You can change them later in Settings.'
                      : 'Enter your details to start ordering. You can change them later in Settings.'}
                  </p>
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
