import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Hand,
  Utensils,
  Package,
  Truck,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  SprayCan,
  Thermometer,
} from 'lucide-react';

interface DisclaimerPageProps {
  setCurrentPage: (page: string) => void;
}

export function DisclaimerPage({ setCurrentPage }: DisclaimerPageProps): JSX.Element {
  const hygieneSteps = [
    { icon: Hand, title: 'Hand Washing', desc: 'All food handlers wash hands with soap every 30 minutes and wear gloves during preparation.' },
    { icon: SprayCan, title: 'Surface Sanitization', desc: 'All cooking surfaces, utensils, and equipment are sanitized before and after every order.' },
    { icon: Utensils, title: 'Fresh Preparation', desc: 'Every dish is prepared fresh after you order. Nothing is pre-cooked or reheated from storage.' },
    { icon: Thermometer, title: 'Temperature Control', desc: 'Hot food is kept above 60°C and cold food below 4°C during the entire preparation process.' },
    { icon: Package, title: 'Sealed Packaging', desc: 'All orders are packed in food-grade, sealed containers to prevent contamination during transit.' },
    { icon: Truck, title: 'Safe Delivery', desc: 'Delivery partners use insulated bags and follow no-contact delivery protocols.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 page-transition">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 py-10 px-4 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.12),transparent_50%)]" />
        <div className="max-w-3xl mx-auto text-center space-y-3 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 p-1 shadow-2xl shadow-teal-500/30 flex items-center justify-center mx-auto mb-2"
          >
            <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center border border-teal-400/50">
              <ShieldCheck className="w-8 h-8 text-teal-400" />
            </div>
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Hygiene & Safety Standards</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            At Meerut Bites, your health and safety come first. Every order follows our strict 6-step hygiene protocol.
          </p>
        </div>
      </div>

      {/* Hygiene Steps */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        <h2 className="text-sm font-black text-teal-400 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Our 6-Step Hygiene Process</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {hygieneSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 transition-all shadow-xl space-y-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-teal-400/60">STEP {idx + 1}</span>
                    </div>
                    <h3 className="text-sm font-black text-white">{step.title}</h3>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-slate-900 to-emerald-500/10 border border-teal-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center"
        >
          <div className="space-y-1">
            <CheckCircle2 className="w-5 h-5 text-teal-400 mx-auto" />
            <h4 className="text-xs font-black text-white">FSSAI Certified</h4>
            <p className="text-[10px] text-slate-400">All partner stalls registered</p>
          </div>
          <div className="space-y-1">
            <CheckCircle2 className="w-5 h-5 text-teal-400 mx-auto" />
            <h4 className="text-xs font-black text-white">Regular Inspections</h4>
            <p className="text-[10px] text-slate-400">Monthly hygiene audits</p>
          </div>
          <div className="space-y-1">
            <CheckCircle2 className="w-5 h-5 text-teal-400 mx-auto" />
            <h4 className="text-xs font-black text-white">Vaccinated Staff</h4>
            <p className="text-[10px] text-slate-400">All handlers vaccinated</p>
          </div>
        </motion.div>

        {/* Legal Disclaimer */}
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Legal Disclaimer</span>
          </div>
          <p className="text-xs text-slate-300 font-bold leading-relaxed">
            Illegal items are not delivered at any cost anytime. All orders are subject to captain verification and strict local guidelines. Meerut Bites reserves the right to refuse any order that violates our policies. Prices and availability are subject to change without notice.
          </p>
        </div>

        {/* Back button */}
        <button
          onClick={() => setCurrentPage('home')}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 text-slate-300 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
}

export default DisclaimerPage;
