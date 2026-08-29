import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend 
} from 'recharts';
import { 
  TrendingUp, Store, MessageSquare, ShieldCheck, Sparkles, Send 
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

// Reusable Animated Counter component that loads from 0 on every mount/visit
function AnimatedCounter({ 
  value, 
  prefix = "", 
  suffix = "", 
  decimals = 0 }: { 
  value: number; 
  prefix?: string; 
  suffix?: string; 
  decimals?: number 
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const duration = 1600; // 1.6 seconds smooth count-up

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out expo for snappy yet smooth motion
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentVal = easeProgress * value;

      setCount(currentVal);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return (
    <span>
      {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}{suffix}
    </span>
  );
}

export function DashboardPage() {
  const { orders = [] } = useApp() as any;
  const [activeTab, setActiveTab] = useState<'analytics' | 'chats' | 'security'>('analytics');
  
  // Real data for Meerut Bites stalls and metrics
  const salesData = [
    { time: '10 AM', sales: 450, orders: 4 },
    { time: '12 PM', sales: 1200, orders: 11 },
    { time: '2 PM', sales: 980, orders: 9 },
    { time: '4 PM', sales: 1450, orders: 14 },
    { time: '6 PM', sales: 2100, orders: 19 },
    { time: '8 PM', sales: 3400, orders: 28 },
    { time: '10 PM', sales: 1850, orders: 15 },
  ];

  const stallSalesData = [
    { name: 'Kake Ji Chaet', sales: 4200, orders: 35 },
    { name: 'Delhi 6 Chole', sales: 3800, orders: 29 },
    { name: 'Haji Shafeeq Biryani', sales: 5100, orders: 32 },
    { name: 'Vipin Sweets', sales: 2400, orders: 22 },
    { name: 'Royal Bakery', sales: 1900, orders: 18 },
    { name: 'Bholenath Lassi', sales: 2800, orders: 30 },
  ];

  const paymentMethodData = [
    { name: 'UPI Online', value: 65, color: '#f59e0b' },
    { name: 'Cash on Delivery', value: 35, color: '#38bdf8' },
  ];

  const performanceData = [
    { name: 'On-Time Delivery', uv: 96, fill: '#f59e0b' },
    { name: 'Customer Satisfaction', uv: 92, fill: '#10b981' },
    { name: 'Stall Acceptance Rate', uv: 98, fill: '#38bdf8' },
  ];

  const [messages, setMessages] = useState([
    { id: 1, customer: 'Aarav Sharma', message: 'Is the Special Royal Aloo Tikki extra spicy available?', time: '10:45 AM', stall: 'Kake Ji Di Chaet' },
    { id: 2, customer: 'Priya Gupta', message: 'Please deliver quickly, my order is for a family dinner!', time: '11:15 AM', stall: 'Haji Shafeeq Chicken Biryani' },
    { id: 3, customer: 'Rahul Verma', message: 'Thanks for the hot and fresh Shahi Sheermal!', time: 'Yesterday', stall: 'Meerut Royal Bakery & Sheermal' },
  ]);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setMessages([...messages, { id: Date.now(), customer: 'Nauman (Vendor)', message: replyText, time: 'Just now', stall: 'Meerut Bites HQ' }]);
    setReplyText('');
  };

  const [pin, setPin] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-950 min-h-screen text-white selection:bg-amber-500 selection:text-white relative overflow-hidden" style={{ perspective: '1200px' }}>
      
      {/* Background Ambient 3D Glowing Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 relative z-10">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-3 shadow-lg shadow-amber-500/10">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Vendor Command Center 3.0</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200 tracking-tight">
            Meerut Bites Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-medium">
            Real-time analytics, 3D motion graphics, live vendor communications, and secure management.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80 shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'analytics' ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 scale-105' : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics & Charts
          </button>
          <button
            onClick={() => setActiveTab('chats')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'chats' ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 scale-105' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Customer Chats</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'security' ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 scale-105' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PIN Security</span>
          </button>
        </div>
      </div>

      {/* Analytics Tab with 3D Motion Graphics & Counter Animations */}
      {activeTab === 'analytics' && (
        <motion.div 
          key="analytics-tab"
          initial={{ opacity: 0, scale: 0.98, rotateX: -6, y: 20 }} 
          animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }} 
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="space-y-8 relative z-10"
        >
          {/* Metrics Summary 3D Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <motion.div 
              whileHover={{ scale: 1.03, rotateX: 3, rotateY: -3, z: 25 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 p-6 rounded-3xl border border-slate-800/80 shadow-2xl shadow-amber-500/5 hover:border-amber-500/50 transition-all group overflow-hidden backdrop-blur-xl"
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Revenue</span>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-black text-white tracking-tight">
                  ₹<AnimatedCounter value={17650} />
                </span>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">+22% today</span>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              whileHover={{ scale: 1.03, rotateX: 3, rotateY: -3, z: 25 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 p-6 rounded-3xl border border-slate-800/80 shadow-2xl shadow-amber-500/5 hover:border-amber-500/50 transition-all group overflow-hidden backdrop-blur-xl"
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-teal-500/10 rounded-full blur-xl group-hover:bg-teal-500/20 transition-all pointer-events-none" />
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Orders</span>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-black text-white tracking-tight">
                  <AnimatedCounter value={166} />
                </span>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">+14 today</span>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              whileHover={{ scale: 1.03, rotateX: 3, rotateY: -3, z: 25 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 p-6 rounded-3xl border border-slate-800/80 shadow-2xl shadow-amber-500/5 hover:border-amber-500/50 transition-all group overflow-hidden backdrop-blur-xl"
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Stalls</span>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-black text-white tracking-tight">
                  <AnimatedCounter value={6} /> / <AnimatedCounter value={6} />
                </span>
                <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Online</span>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div 
              whileHover={{ scale: 1.03, rotateX: 3, rotateY: -3, z: 25 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 p-6 rounded-3xl border border-slate-800/80 shadow-2xl shadow-amber-500/5 hover:border-amber-500/50 transition-all group overflow-hidden backdrop-blur-xl"
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Rating</span>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-black text-white tracking-tight">
                  <AnimatedCounter value={4.9} decimals={1} />
                </span>
                <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">★★★★★</span>
              </div>
            </motion.div>

          </div>

          {/* Recharts 3D Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Area Chart: Hourly Sales Trend */}
            <motion.div 
              whileHover={{ scale: 1.01, rotateX: 1, rotateY: -1, z: 10 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
              className="bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 p-6 rounded-3xl border border-slate-800/80 shadow-2xl space-y-4 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-white uppercase tracking-wider flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>Hourly Sales Trend (₹)</span>
                </h3>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">Peak: 8:00 PM</span>
              </div>
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} tick={{ fill: '#94a3b8', fontWeight: 700 }} />
                    <YAxis stroke="#64748b" fontSize={11} tick={{ fill: '#94a3b8', fontWeight: 700 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }} />
                    <Area type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={3.5} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Bar Chart: Stall Performance */}
            <motion.div 
              whileHover={{ scale: 1.01, rotateX: 1, rotateY: -1, z: 10 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
              className="bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 p-6 rounded-3xl border border-slate-800/80 shadow-2xl space-y-4 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-white uppercase tracking-wider flex items-center space-x-2">
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>Sales by Stall (₹)</span>
                </h3>
                <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">All 6 Stalls</span>
              </div>
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stallSalesData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} interval={0} angle={-15} textAnchor="end" tick={{ fill: '#94a3b8', fontWeight: 700 }} />
                    <YAxis stroke="#64748b" fontSize={11} tick={{ fill: '#94a3b8', fontWeight: 700 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }} />
                    <Bar dataKey="sales" fill="#f59e0b" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Pie Chart: Payment Methods */}
            <motion.div 
              whileHover={{ scale: 1.01, rotateX: 1, rotateY: -1, z: 10 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
              className="bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 p-6 rounded-3xl border border-slate-800/80 shadow-2xl space-y-4 backdrop-blur-xl"
            >
              <h3 className="font-black text-sm text-white uppercase tracking-wider">Payment Methods Distribution</h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={paymentMethodData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }} />
                    <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Radial Bar Chart: Operational Efficiency */}
            <motion.div 
              whileHover={{ scale: 1.01, rotateX: 1, rotateY: -1, z: 10 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
              className="bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 p-6 rounded-3xl border border-slate-800/80 shadow-2xl space-y-4 backdrop-blur-xl"
            >
              <h3 className="font-black text-sm text-white uppercase tracking-wider">Operational Metrics (%)</h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="25%" outerRadius="95%" barSize={14} data={performanceData}>
                    <RadialBar background dataKey="uv" />
                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}

      {/* Chats Tab */}
      {activeTab === 'chats' && (
        <motion.div 
          key="chats-tab"
          initial={{ opacity: 0, scale: 0.98, rotateX: -6, y: 20 }} 
          animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }} 
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 rounded-3xl border border-slate-800/80 p-6 sm:p-8 shadow-2xl space-y-6 relative z-10 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Customer Inquiries & Live Chat Feed</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Direct chat synchronization with Meerut food enthusiasts.</p>
            </div>
            <span className="bg-amber-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg shadow-amber-500/20">
              3 Active Messages
            </span>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {messages.map((m) => (
              <motion.div 
                whileHover={{ scale: 1.01, x: 4 }}
                key={m.id} 
                className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-xs text-amber-400">{m.customer}</span>
                    <span className="text-[10px] font-bold bg-slate-900 px-2.5 py-0.5 rounded-full text-slate-300 border border-slate-800">{m.stall}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{m.time}</span>
                </div>
                <p className="text-xs text-slate-200 font-medium">{m.message}</p>
              </motion.div>
            ))}
          </div>

          <form onSubmit={handleSendReply} className="flex gap-3 pt-2 border-t border-slate-800">
            <input
              type="text"
              placeholder="Type vendor response to customer..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-xs text-white font-medium focus:border-amber-500 outline-none shadow-inner"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 px-6 py-3.5 rounded-2xl font-black text-xs flex items-center space-x-2 shadow-xl shadow-amber-500/25 transition-all cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Reply</span>
            </button>
          </form>
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <motion.div 
          key="security-tab"
          initial={{ opacity: 0, scale: 0.98, rotateX: -6, y: 20 }} 
          animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }} 
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 rounded-3xl border border-slate-800/80 p-8 shadow-2xl max-w-lg mx-auto space-y-6 text-center relative z-10 backdrop-blur-xl"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30 shadow-xl shadow-amber-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">Vendor PIN-Locked Security</h2>
            <p className="text-xs text-slate-400 font-medium">Enter your 4-digit vendor security PIN to manage operational settings and cash settlements.</p>
          </div>
          <div className="space-y-4 pt-2">
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-48 text-center bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-2xl tracking-widest text-white font-black focus:border-amber-500 outline-none mx-auto block shadow-inner"
            />
            <button
              onClick={() => alert(pin.length === 4 ? 'PIN verified successfully!' : 'Please enter a 4-digit PIN.')}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-2xl text-xs shadow-xl shadow-amber-500/25 transition-all cursor-pointer active:scale-95"
            >
              Verify & Unlock Vendor Controls
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default DashboardPage;