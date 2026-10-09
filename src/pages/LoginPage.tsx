import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, User, Phone, ArrowRight, ShoppingBasket, Sparkles, Utensils, Clock, MapPin, ShieldCheck, LogIn, Flame, Package } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { OWNER_NAME, APP_NAME } from '@/lib/constants';

interface LoginPageProps {
  setCurrentPage?: (page: string) => void;
}

export function LoginPage({ setCurrentPage }: LoginPageProps) {
  const { profile } = useApp();
  const [success, setSuccess] = useState(false);
  const isRegistered = !!(profile?.name && profile?.phone);

  const enterApp = () => {
    if (typeof setCurrentPage === 'function') setCurrentPage('home');
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
                    {isRegistered ? `Welcome back, ${profile?.name}!` : `Welcome to ${APP_NAME}!`}
                  </p>
                  <p className="text-teal-300 text-[10px] mt-1 font-bold">Entering app...</p>
                </motion.div>
              ) : (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {isRegistered && (
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
                      <p className="text-[11px] text-teal-300 font-bold">Welcome back!</p>
                    </motion.div>
                  )}

                  {!isRegistered && (
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-teal-400" />
                      <h3 className="text-xs font-black text-teal-300 uppercase tracking-wider">Welcome to Meerut Bites</h3>
                    </div>
                  )}

                  {!isRegistered && (
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                      Browse stalls, add items to your cart, and order in seconds. You'll just need your name and phone number when confirming your order — no signup required!
                    </p>
                  )}

                  <button
                    onClick={() => {
                      setSuccess(true);
                      setTimeout(() => enterApp(), 800);
                    }}
                    className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/30"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Enter App</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
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
