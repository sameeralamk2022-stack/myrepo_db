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
  Settings as SettingsIcon,
  Star,
  TrendingUp,
  Zap,
  Heart,
  Award,
  Code,
  Cpu,
  Rocket,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DEVELOPER } from '@/lib/constants';

interface HomePageProps {
  setCurrentPage: (page: 'home' | 'stalls' | 'dashboard' | 'orders' | 'custom' | 'settings' | 'simple' | 'personal') => void;
}

export function HomePage({ setCurrentPage }: HomePageProps): JSX.Element {
  const { profile } = useApp();
  const displayName = profile.name || 'Guest';

  const getISTDetails = () => {
    try {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istDate = new Date(utc + (3600000 * 5.5));
      const totalMinutes = istDate.getHours() * 60 + istDate.getMinutes();
      const isClosedAfterHours = totalMinutes >= 1410 || totalMinutes < 600;
      const isDayTime = totalMinutes >= 600 && totalMinutes < 1080;
      return { isClosedAfterHours, isDayTime, ratePerKm: isDayTime ? 10 : 12 };
    } catch {
      return { isClosedAfterHours: false, isDayTime: true, ratePerKm: 10 };
    }
  };

  const { isClosedAfterHours, isDayTime } = getISTDetails();

  const foodCategories = [
    { name: 'Chaat & Snacks', image: 'https://images.pexels.com/photos/39025942/pexels-photo-39025942.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', desc: 'Golgappa, bhalla, samosa & more', icon: Flame },
    { name: 'Meals & Thali', image: 'https://images.pexels.com/photos/29148133/pexels-photo-29148133.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', desc: 'Complete meals delivered hot', icon: Utensils },
    { name: 'Biryani & Rice', image: 'https://images.pexels.com/photos/28909537/pexels-photo-28909537.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', desc: 'Aromatic biryani, pulao & rice bowls', icon: ShoppingBasket },
    { name: 'Samosa & Fried', image: 'https://images.pexels.com/photos/36170557/pexels-photo-36170557.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', desc: 'Crispy hot samosas & fried snacks', icon: Zap },
  ];

  const navCards = [
    { id: 'personal', title: 'Personal Order', desc: 'Order from any shop in Meerut — Captain DB picks it up for you', icon: Sparkles, accent: 'amber' },
    { id: 'stalls', title: 'Browse Food Stalls', desc: 'Explore local vendor menus, bestsellers, combos & beverages', icon: Utensils, accent: 'teal' },
    { id: 'orders', title: 'Track Active Orders', desc: 'View real-time delivery status, order history & live updates', icon: Package, accent: 'emerald' },
    { id: 'dashboard', title: 'Vendor Dashboard', desc: 'Manage incoming orders, update stall menus & monitor sales', icon: LayoutDashboard, accent: 'blue' },
    { id: 'settings', title: 'App Settings', desc: 'Configure profile, saved locations & notification preferences', icon: SettingsIcon, accent: 'slate' },
  ];

  const accentColors: Record<string, string> = {
    amber: 'bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 border-amber-500/30',
    teal: 'bg-teal-500/20 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 border-teal-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-slate-950 border-blue-500/30',
    slate: 'bg-slate-700/50 text-slate-300 group-hover:bg-slate-600 group-hover:text-white border-slate-600/30',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 page-transition">

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 py-12 px-4 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.08),transparent_50%)]" />

        {/* Animated floating particles */}
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-10 left-10 w-2 h-2 rounded-full bg-amber-400/40 blur-sm"
        />
        <motion.div
          animate={{ y: [0, 15, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 1 }}
          className="absolute top-20 right-20 w-3 h-3 rounded-full bg-teal-400/30 blur-sm"
        />
        <motion.div
          animate={{ y: [0, -12, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-amber-400/30 blur-sm"
        />

        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10 flex flex-col items-center">

          {/* 3D Floating Logo */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-300 p-1 shadow-2xl shadow-amber-500/30 flex items-center justify-center mb-2"
          >
            <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center border-2 border-amber-400 overflow-hidden">
              <ShoppingBasket className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Meerut's #1 Street Food Delivery Hub</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-white"
          >
            Welcome, <span className="text-amber-400">{displayName}!</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs sm:text-sm font-semibold tracking-wide text-amber-300/90 uppercase"
          >
            Delivering fresh at your doorstep
          </motion.p>

          {/* Status banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-lg bg-slate-900/90 border border-amber-500/30 rounded-2xl p-3.5 space-y-1.5 text-center shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${isClosedAfterHours ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
              <span className="text-[11px] font-black text-white uppercase tracking-wider">
                {isClosedAfterHours ? 'Currently Closed (Open 10:00 AM to 11:30 PM)' : 'Open Now: 10:00 AM to 11:30 PM'}
              </span>
            </div>
            <p className="text-[11px] font-bold text-amber-400">
              Day delivery rate is ₹10/km and night is ₹12/km
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto pt-1"
          >
            Your premier destination for authentic Meerut street food, customized orders, and lightning-fast delivery.
          </motion.p>

          {/* Quick Action Hero Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('stalls')}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer uppercase tracking-wider"
            >
              <Utensils className="w-4 h-4" />
              <span>Explore Stalls</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('personal')}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-400 rounded-xl font-black text-xs flex items-center space-x-2 transition-all cursor-pointer uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4" />
              <span>Personal Order</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Food Category Cards - Zomato/Swiggy Style */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-amber-400 uppercase tracking-widest flex items-center space-x-2">
            <Flame className="w-4 h-4" />
            <span>What's Craving Today?</span>
          </h2>
          <button
            onClick={() => setCurrentPage('stalls')}
            className="text-[11px] font-bold text-teal-400 hover:text-teal-300 cursor-pointer flex items-center gap-1"
          >
            <span>See All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {foodCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentPage('stalls')}
                className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-xl border border-slate-800 hover:border-amber-500/50 transition-all card-glow"
              >
                <div className="aspect-[4/3] relative">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-slate-950/80 backdrop-blur-sm flex items-center justify-center border border-amber-500/30">
                    <Icon className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 space-y-0.5">
                  <h3 className="text-xs font-black text-white">{cat.name}</h3>
                  <p className="text-[10px] text-slate-300 font-medium truncate">{cat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation Hub Cards */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-amber-400 uppercase tracking-widest flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Quick Ordering & Management</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {navCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + idx * 0.08 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentPage(card.id as any)}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all shadow-xl cursor-pointer group space-y-3 card-glow"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl border transition-colors ${accentColors[card.accent]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">{card.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">{card.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Highlights Footer Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="text-xs font-black text-white">Lightning Fast</h4>
            <p className="text-[10px] text-slate-400">Average delivery in 30 mins</p>
          </div>
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="text-xs font-black text-white">100% Hygienic</h4>
            <p className="text-[10px] text-slate-400">Verified street food partners</p>
          </div>
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
              <MapPin className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="text-xs font-black text-white">Meerut Wide</h4>
            <p className="text-[10px] text-slate-400">Cantt, Civil Lines, Saket & more</p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
            <Star className="w-3 h-3 text-amber-400" />
            <span>4.8 Rating</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
            <Heart className="w-3 h-3 text-rose-400" />
            <span>15,000+ Orders Served</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
            <Award className="w-3 h-3 text-teal-400" />
            <span>Meerut's Trusted Delivery</span>
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-500/5 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Code className="w-4 h-4 text-slate-950" />
              </div>
              <h2 className="text-sm font-black text-amber-400 uppercase tracking-widest">Developer Section</h2>
            </div>

            {/* Developer profile card */}
            <div className="flex items-center gap-4 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 flex-shrink-0">
                <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center font-black text-amber-400 text-lg">
                  NA
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-white">{DEVELOPER}</h3>
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wide mt-0.5">AI Nanotech Operations & ML Researcher</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                    <Cpu className="w-2.5 h-2.5" />
                    <span>AI/ML</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <Rocket className="w-2.5 h-2.5" />
                    <span>Full Stack</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Social Media Buttons - Coming Soon */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Connect with us</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { name: 'Instagram', color: 'from-pink-500 to-purple-500', emoji: 'IG' },
                  { name: 'Facebook', color: 'from-blue-500 to-blue-600', emoji: 'FB' },
                  { name: 'Twitter / X', color: 'from-slate-700 to-slate-900', emoji: 'X' },
                  { name: 'YouTube', color: 'from-red-500 to-red-600', emoji: 'YT' },
                ].map((social) => (
                  <div
                    key={social.name}
                    className="relative group p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition-all cursor-default"
                  >
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${social.color} flex items-center justify-center text-white font-black text-[10px] mb-1.5`}>
                      {social.emoji}
                    </div>
                    <p className="text-[10px] font-bold text-slate-300">{social.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-[8px] font-bold text-amber-400 uppercase tracking-wider">Coming Soon</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech stack badge */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Supabase', 'PWA'].map((tech) => (
                <span key={tech} className="text-[9px] font-bold text-slate-400 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HomePage;
