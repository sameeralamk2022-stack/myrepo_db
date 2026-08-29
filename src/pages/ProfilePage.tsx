import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Lock, Unlock, LogIn, Plus, Trash2, Loader2, Package, Star, QrCode, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Footer } from '@/components/Footer';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { PROFILE_PIN, APP_NAME } from '@/lib/constants';
import type { Address } from '@/types';

export function ProfilePage() {
  const { profile, setProfile, orders } = useApp();
  const [locked, setLocked] = useLocalStorage<boolean>('mb_profile_locked', false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinAction, setPinAction] = useState<'lock' | 'unlock'>('unlock');
  const [googleModal, setGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [editName, setEditName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrText, setNewAddrText] = useState('');

  const handlePinSubmit = () => {
    if (pinInput === PROFILE_PIN) {
      setPinError('');
      setLocked(pinAction === 'lock');
      setShowPinModal(false);
      setPinInput('');
    } else {
      setPinError('Wrong PIN. Use 1111 for demo.');
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setProfile((prev) => ({ ...prev, googleEmail: 'user@gmail.com' }));
      setGoogleModal(false);
      setGoogleLoading(false);
    }, 1500);
  };

  const addAddress = () => {
    if (newAddrLabel.trim() && newAddrText.trim()) {
      const addr: Address = {
        id: `addr_${Date.now()}`,
        label: newAddrLabel.trim(),
        text: newAddrText.trim(),
      };
      setProfile((prev) => ({ ...prev, addresses: [...prev.addresses, addr] }));
      setNewAddrLabel('');
      setNewAddrText('');
    }
  };

  const totalOrders = orders.length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
  const avgRating = orders.filter((o) => o.rating).length > 0
    ? (orders.reduce((sum, o) => sum + (o.rating || 0), 0) / orders.filter((o) => o.rating).length).toFixed(1)
    : '—';

  return (
    <div className="min-h-screen pt-16 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-6 h-6 text-saffron-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">My Profile</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Orders', value: totalOrders, icon: Package, color: 'text-saffron-400' },
            { label: 'Delivered', value: deliveredCount, icon: Star, color: 'text-green-400' },
            { label: 'Rating', value: avgRating, icon: Star, color: 'text-amber-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-slate-900/60 border border-white/10 p-4 text-center"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-white tabular-nums">{stat.value}</p>
              <p className="text-slate-500 text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Profile card */}
        <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-saffron-400" />
              <h2 className="text-lg font-bold text-white">Personal Info</h2>
            </div>
            <button
              onClick={() => {
                setPinAction(locked ? 'unlock' : 'lock');
                setShowPinModal(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                locked
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-green-500/10 text-green-400 border border-green-500/30'
              }`}
            >
              {locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              {locked ? 'Locked' : 'Unlocked'}
            </button>
          </div>

          <div className={`space-y-3 ${locked ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <label className="text-slate-500 text-xs">Name</label>
              {editName ? (
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-saffron-500"
                  />
                  <button
                    onClick={() => {
                      setProfile((prev) => ({ ...prev, name: tempName.trim() }));
                      setEditName(false);
                    }}
                    className="px-3 py-2 rounded-lg bg-saffron-600 text-white text-sm"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p className="text-white font-medium mt-0.5 flex items-center justify-between">
                  {profile.name || 'Not set'}
                  <button
                    onClick={() => { setTempName(profile.name); setEditName(true); }}
                    className="text-saffron-400 text-xs hover:text-saffron-300"
                  >
                    Edit
                  </button>
                </p>
              )}
            </div>

            <div>
              <label className="text-slate-500 text-xs">Phone</label>
              <p className="text-white font-medium mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                {profile.phone || 'Not set'}
              </p>
            </div>

            <div>
              <label className="text-slate-500 text-xs">Google Account</label>
              {profile.googleEmail ? (
                <p className="text-white font-medium mt-0.5">{profile.googleEmail}</p>
              ) : (
                <button
                  onClick={() => setGoogleModal(true)}
                  className="mt-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign in with Google
                </button>
              )}
            </div>

            <div>
              <label className="text-slate-500 text-xs">Saved Addresses</label>
              <div className="space-y-2 mt-1">
                {profile.addresses.map((addr) => (
                  <div key={addr.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <MapPin className="w-4 h-4 text-saffron-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{addr.label}</p>
                      <p className="text-slate-500 text-xs">{addr.text}</p>
                    </div>
                    <button
                      onClick={() => setProfile((prev) => ({ ...prev, addresses: prev.addresses.filter((a) => a.id !== addr.id) }))}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAddrLabel}
                    onChange={(e) => setNewAddrLabel(e.target.value)}
                    placeholder="Label"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-saffron-500"
                  />
                  <input
                    type="text"
                    value={newAddrText}
                    onChange={(e) => setNewAddrText(e.target.value)}
                    placeholder="Address"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-saffron-500"
                  />
                  <button onClick={addAddress} className="px-3 py-2 rounded-lg bg-saffron-600 text-white">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order history */}
        <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-5 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Order History</h2>
          {orders.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">No orders yet.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-saffron-500/30 transition-colors"
                >
                  <div>
                    <p className="text-white text-sm font-mono">{order.id}</p>
                    <p className="text-slate-500 text-xs">OTP: {order.deliveryOtp}</p>
                    <p className="text-slate-500 text-xs">{order.items.length} items - {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <OrderStatusBadge status={order.status} />
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/qr"
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-medium hover:bg-white/10 transition-colors active:scale-95"
          >
            <QrCode className="w-5 h-5" />
            My QR Codes
          </Link>
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-medium hover:bg-white/10 transition-colors active:scale-95"
          >
            <Package className="w-5 h-5" />
            All Orders
          </Link>
        </div>
      </div>

      {/* PIN modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/10 p-6 text-center">
            <Lock className="w-10 h-10 text-saffron-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-white mb-1">
              {pinAction === 'lock' ? 'Lock Profile' : 'Unlock Profile'}
            </h2>
            <p className="text-slate-400 text-sm mb-4">Enter PIN (Demo: 1111)</p>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="• • • •"
              maxLength={4}
              className="w-32 mx-auto px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center text-2xl tracking-[0.5em] placeholder-slate-600 focus:outline-none focus:border-saffron-500 mb-3"
            />
            {pinError && <p className="text-red-400 text-sm mb-3">{pinError}</p>}
            <div className="flex gap-2">
              <button onClick={() => setShowPinModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-300 text-sm">
                Cancel
              </button>
              <button onClick={handlePinSubmit} className="flex-1 py-2.5 rounded-xl bg-saffron-600 text-white text-sm font-semibold">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google login modal */}
      {googleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/10 p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-7 h-7">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white mb-1">Sign in with Google</h2>
            <p className="text-slate-400 text-xs mb-4">Demo login - auto sign-in as User</p>
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-slate-800 font-semibold hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-70 mb-2"
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
            <button onClick={() => setGoogleModal(false)} className="w-full py-2.5 rounded-xl bg-white/5 text-slate-300 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
