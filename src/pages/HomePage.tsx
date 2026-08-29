import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  ShoppingBasket,
  Utensils, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  Flame, 
  LayoutDashboard, 
  Package, 
  Settings as SettingsIcon
} from 'lucide-react';

interface HomePageProps {
  setCurrentPage: (page: 'home' | 'stalls' | 'dashboard' | 'orders' | 'custom' | 'settings' | 'simple') => void;
}

export function HomePage({ setCurrentPage }: HomePageProps): JSX.Element {
  // Time & Delivery Rate Logic (IST: Day ₹10/km, Night ₹12/km, Open 10:00 AM to 11:30 PM)
  const getISTDetails = () => {
    try {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istDate = new Date(utc + (3600000 * 5.5));
      const totalMinutes = istDate.getHours() * 60 + istDate.getMinutes();
      
      const isClosedAfterHours = totalMinutes >= 1410 || totalMinutes < 600; // 11:30 PM to 10:00 AM
      const isDayTime = totalMinutes >= 600 && totalMinutes < 1080; // 10:00 AM to 6:00 PM

      return {
        isClosedAfterHours,
        isDayTime,
        ratePerKm: isDayTime ? 10 : 12
      };
    } catch {
      return { isClosedAfterHours: false, isDayTime: true, ratePerKm: 10 };
    }
  };

  const { isClosedAfterHours, isDayTime, ratePerKm } = getISTDetails();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 py-12 px-4 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.1),transparent_50%)]" />
        
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10 flex flex-col items-center">
          
          {/* Circular Basket Logo Box */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-300 p-1 shadow-2xl shadow-amber-500/30 flex items-center justify-center mb-2"
          >
            <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center border-2 border-amber-400 overflow-hidden">
              <ShoppingBasket className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400" />
            </div>
          </motion.div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Meerut's #1 Street Food Delivery Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Welcome, <span className="text-amber-400">Nauman Alam Khan!</span>
          </h1>

          {/* Theme Line */}
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-amber-300/90 uppercase">
            Delivering fresh at your doorstep
          </p>

          {/* Clear Operational Timings & Rates info banner */}
          <div className="w-full max-w-lg bg-slate-900/90 border border-amber-500/30 rounded-2xl p-3.5 space-y-1.5 text-center shadow-xl">
            <div className="flex items-center justify-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${isClosedAfterHours ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
              <span className="text-[11px] font-black text-white uppercase tracking-wider">
                {isClosedAfterHours ? 'Currently Closed (Open 10:00 AM to 11:30 PM)' : 'Open Now: 10:00 AM to 11:30 PM'}
              </span>
            </div>
            <p className="text-[11px] font-bold text-amber-400">
              Day delivery rate is ₹10/km and night is ₹12/km
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto pt-1">
            Your premier destination for authentic Meerut street food, customized orders, and lightning-fast delivery.
          </p>

          {/* Quick Action Hero Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setCurrentPage('stalls')}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer uppercase tracking-wider"
            >
              <Utensils className="w-4 h-4" />
              <span>Explore Stalls</span>
            </button>

            <button
              onClick={() => setCurrentPage('custom')}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-400 rounded-xl font-black text-xs flex items-center space-x-2 transition-all cursor-pointer uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4" />
              <span>Custom WhatsApp Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Hub Cards */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-amber-400 uppercase tracking-widest flex items-center space-x-2">
            <Flame className="w-4 h-4" />
            <span>Quick Ordering & Management Hub</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Custom WhatsApp Order Card */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setCurrentPage('custom')}
            className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500 transition-all shadow-xl cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Custom WhatsApp Order</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Request any custom street food dish directly with GPS location detection and UPI QR code support.
              </p>
            </div>
          </motion.div>

          {/* Simple Direct Order Form Card */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setCurrentPage('simple')}
            className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500 transition-all shadow-xl cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Simple Direct Order Form</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Type custom items manually, calculate distance-based delivery rates (₹10/km day or ₹12/km night), and add straight to cart.
              </p>
            </div>
          </motion.div>

          {/* Browse All Stalls Card */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setCurrentPage('stalls')}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all shadow-xl cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-slate-800 text-slate-300 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors">
                <Utensils className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Browse Food Stalls</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Explore local vendor menus, bestselling street snacks, snacks combos, and beverages.
              </p>
            </div>
          </motion.div>

          {/* Track Orders Card */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setCurrentPage('orders')}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all shadow-xl cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-slate-800 text-slate-300 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors">
                <Package className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Track Active Orders</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                View real-time delivery status, order history, and live delivery updates.
              </p>
            </div>
          </motion.div>

          {/* Vendor Dashboard Card */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setCurrentPage('dashboard')}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all shadow-xl cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-slate-800 text-slate-300 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Vendor / Admin Dashboard</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Manage incoming orders, update stall menus, and monitor daily sales performance.
              </p>
            </div>
          </motion.div>

          {/* Settings Card */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setCurrentPage('settings')}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all shadow-xl cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-slate-800 text-slate-300 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors">
                <SettingsIcon className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">App Settings</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Configure profile details, saved locations, and notification preferences.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Feature Highlights Footer Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <Clock className="w-5 h-5 text-amber-400 mx-auto" />
            <h4 className="text-xs font-black text-white">Lightning Fast</h4>
            <p className="text-[10px] text-slate-400">Average delivery in 30 mins</p>
          </div>
          <div className="space-y-1">
            <ShieldCheck className="w-5 h-5 text-amber-400 mx-auto" />
            <h4 className="text-xs font-black text-white">100% Hygienic</h4>
            <p className="text-[10px] text-slate-400">Verified street food partners</p>
          </div>
          <div className="space-y-1">
            <MapPin className="w-5 h-5 text-amber-400 mx-auto" />
            <h4 className="text-xs font-black text-white">Meerut Wide</h4>
            <p className="text-[10px] text-slate-400">Cantt, Civil Lines, Saket & more</p>
          </div>
        </div>

      </div>

    </div>
  );
}

export default HomePage;