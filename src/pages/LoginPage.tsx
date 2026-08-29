import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { OWNER_NAME } from '@/lib/constants';

interface LoginPageProps {
  setCurrentPage?: (page: string) => void;
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function LoginPage({ setCurrentPage }: LoginPageProps) {
  const context = useApp() as Record<string, any>;
  const setProfile = context.setProfile;
  const setUserName = context.setUserName;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const googleEmail = 'intellectaalam@gmail.com';
      const googleName = 'Nauman Alam Khan';
      
      const updatedProfile = { name: googleName, phone: '+919568358120', googleEmail };
      if (typeof setProfile === 'function') setProfile(updatedProfile);
      if (typeof setUserName === 'function') setUserName(googleName);
      localStorage.setItem('mb_profile', JSON.stringify(updatedProfile));

      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        if (typeof setCurrentPage === 'function') setCurrentPage('home');
      }, 1200);
    }, 1200);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const namePart = email.split('@')[0] || 'User';
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      
      const updatedProfile = { name: formattedName, phone: '+919568358120', googleEmail: email };
      if (typeof setProfile === 'function') setProfile(updatedProfile);
      if (typeof setUserName === 'function') setUserName(formattedName);
      localStorage.setItem('mb_profile', JSON.stringify(updatedProfile));

      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        if (typeof setCurrentPage === 'function') setCurrentPage('home');
      }, 1200);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-x-hidden bg-[#005f60]">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#005f60] via-[#004849] to-[#003637]" />

      <div className="relative z-10 w-full max-w-[340px] mx-auto my-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-teal-500/30 p-6 shadow-2xl"
        >
          {/* Reference Poster Header Style */}
          <div className="flex flex-col items-center mb-5 text-center">
            <p className="text-teal-200 font-serif italic text-xs tracking-wide">We are taking</p>
            
            <div className="my-2 w-full bg-white text-[#005f60] py-2 px-3 rounded-lg font-black tracking-widest text-sm uppercase shadow-md relative flex items-center justify-center">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-5 border-t-transparent border-r-[8px] border-r-white border-b-5 border-b-transparent" />
              <span>ORDERS</span>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-5 border-t-transparent border-l-[8px] border-l-white border-b-5 border-b-transparent" />
            </div>

            <p className="text-teal-200 text-[10px] font-medium uppercase tracking-widest mb-0.5">for</p>
            <h1 className="text-lg font-black text-white tracking-wider uppercase font-sans">DELIVERY</h1>
          </div>

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
                <p className="text-white font-black text-xs">Login Successful!</p>
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
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-70 text-xs shadow-md cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-900" /> : <GoogleIcon className="w-4 h-4" />}
                  <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
                </button>

                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-teal-400 text-[10px] font-bold uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-2.5">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-teal-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-teal-500/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-400 font-bold"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-teal-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-950 border border-teal-500/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-400 font-bold"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !email.trim() || !password.trim()}
                    className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-teal-500/30"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                <p className="text-center text-teal-200 text-[11px] font-bold pt-1">
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="text-amber-400 hover:text-amber-300 font-black cursor-pointer underline"
                  >
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-center text-teal-200 text-[11px] mt-4 font-bold">
          Owned & operated by {OWNER_NAME}
        </p>
      </div>
    </div>
  );
}

export default LoginPage;