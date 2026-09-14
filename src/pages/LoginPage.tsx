import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, User, Phone, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { OWNER_NAME } from '@/lib/constants';

interface LoginPageProps {
  setCurrentPage?: (page: string) => void;
}

export function LoginPage({ setCurrentPage }: LoginPageProps) {
  const { setProfile } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-x-hidden bg-[#005f60]">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#005f60] via-[#004849] to-[#003637]" />

      <div className="relative z-10 w-full max-w-[360px] mx-auto my-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-teal-500/30 shadow-2xl overflow-hidden"
        >
          <div className="relative h-40 w-full overflow-hidden">
            <img
              src="https://images.pexels.com/photos/39025942/pexels-photo-39025942.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Indian street food chaat"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <p className="text-teal-200 font-serif italic text-xs tracking-wide">We are taking</p>
              <div className="mx-auto w-fit bg-white text-[#005f60] py-1.5 px-4 rounded-lg font-black tracking-widest text-sm uppercase shadow-md mt-1">
                ORDERS
              </div>
              <p className="text-teal-200 text-[10px] font-medium uppercase tracking-widest mt-1">for DELIVERY</p>
            </div>
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
                  <form onSubmit={handleLogin} className="space-y-2.5">
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-teal-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-teal-500/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-400 font-bold"
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
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-teal-500/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-400 font-bold"
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
                    Enter your details to start ordering. You can change them later in Settings.
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
