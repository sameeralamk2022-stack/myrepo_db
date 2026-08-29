import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { APP_NAME } from '@/lib/constants';

export function NameModal() {
  const { userName, setUserName, profile, setProfile } = useApp();
  const [name, setName] = useState('');
  const [open, setOpen] = useState(!userName);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setUserName(name.trim());
      setProfile((prev) => ({ ...prev, name: name.trim() }));
      setOpen(false);
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      const fakeName = 'User';
      const fakeEmail = 'user@gmail.com';
      setUserName(fakeName);
      setProfile((prev) => ({ ...prev, name: fakeName, googleEmail: fakeEmail }));
      setGoogleLoading(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-8 shadow-2xl"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center mb-4 shadow-lg shadow-saffron-700/30">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Welcome to {APP_NAME}</h2>
              <p className="text-slate-400 text-sm">What should we call you?</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-saffron-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-700 text-white font-semibold disabled:opacity-50 hover:shadow-lg hover:shadow-saffron-700/30 transition-all active:scale-95"
              >
                Let's Go
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-slate-500 text-xs">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-slate-800 font-semibold hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-70"
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {googleLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
