import React, { useState } from 'react';
import { Settings, Star, AlertTriangle, Send, Code, Phone, MessageCircle } from 'lucide-react';

export function SettingsPage(): JSX.Element {
  const [generalRating, setGeneralRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState('');

  const getISTStatus = () => {
    try {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istDate = new Date(utc + (3600000 * 5.5));
      const totalMinutes = istDate.getHours() * 60 + istDate.getMinutes();
      
      const isClosed = totalMinutes >= 1410 || totalMinutes < 360;
      const isDay = totalMinutes >= 600 && totalMinutes < 1080;
      return { isClosed, isDay };
    } catch {
      return { isClosed: false, isDay: true };
    }
  };

  const { isClosed } = getISTStatus();

  const handleSendRatingToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const captainNumber = '919568358120';
    const message = encodeURIComponent(
      `⭐ *APP RATING & FEEDBACK - MEERUT BITES* ⭐\n\n` +
      `🌟 *Rating:* ${generalRating} / 5 Stars\n` +
      `💬 *Feedback:* ${feedbackText || 'No additional comments'}\n\n` +
      `_Sent from Meerut Bites Settings Panel_`
    );
    window.open(`https://wa.me/${captainNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 pb-20">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" />
          <span>App Settings & Operational Rules</span>
        </h1>
        <p className="text-xs text-slate-400">Configure delivery rules, operating hours, and app feedback.</p>
      </div>

      {/* Operating Hours & Charges */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest">Operating Hours & Delivery Charges</h3>
        <div className="grid grid-cols-1 gap-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold block">Current Status:</span>
            <span className={`font-black ${isClosed ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isClosed ? '🔴 Closed (After 11:30 PM)' : '🟢 Open for Orders'}
            </span>
          </div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
          <span className="text-amber-400 font-black block uppercase tracking-wider text-[10px]">Delivery Rate Schedule</span>
          <div className="flex justify-between text-slate-300 font-bold">
            <span>☀️ Day Rate (10:00 AM - 6:00 PM):</span>
            <span className="text-amber-400">₹10 / km</span>
          </div>
          <div className="flex justify-between text-slate-300 font-bold">
            <span>🌙 Night Rate (6:00 PM - 10:30 AM):</span>
            <span className="text-amber-400">₹12 / km</span>
          </div>
        </div>
      </div>

      {/* Captain Contact Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span>Captain Contact</span>
        </h3>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm shadow-inner border border-amber-500/30">
              DB
            </div>
            <div>
              <h4 className="text-xs font-black text-white">Danish Begh</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Operations Captain</p>
              <p className="text-[10px] font-mono font-bold text-amber-400 mt-0.5">+91 95683 58120</p>
            </div>
          </div>
          <a
            href="https://wa.me/919568358120?text=Hi%20Danish,%20I%20have%20a%20query%20regarding%20my%20Meerut%20Bites%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg cursor-pointer shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat with Captain</span>
          </a>
        </div>
      </div>

      {/* Developer Information Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
          <Code className="w-4 h-4" />
          <span>Developer Information</span>
        </h3>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 flex items-center justify-center font-black text-slate-950 text-sm shadow-lg">
              NA
            </div>
            <div>
              <h4 className="text-xs font-black text-white">Nauman Alam Khan</h4>
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">AI NANOTECH OPERATIONS AND MACHINE LEARNING RESEARCHER</p>
            </div>
          </div>
        </div>
      </div>

      {/* App Rating Form sent to Captain WhatsApp */}
      <form onSubmit={handleSendRatingToWhatsApp} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest">Rate Meerut Bites App (Send to Captain)</h3>
        
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setGeneralRating(star)}
              className={`p-1 transition-all cursor-pointer ${generalRating >= star ? 'text-amber-400 scale-110' : 'text-slate-600'}`}
            >
              <Star className="w-6 h-6 fill-current" />
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Write your feedback for the captain..."
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
        />

        <button
          type="submit"
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Send Rating to Captain WhatsApp</span>
        </button>
      </form>

      {/* Legal Disclaimer */}
      <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 space-y-2 text-center">
        <div className="flex items-center justify-center space-x-1.5 text-rose-400 text-xs font-black uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>Mandatory Legal Disclaimer</span>
        </div>
        <p className="text-xs text-slate-300 font-bold leading-relaxed">
          Illegal items are not delivered at any cost anytime. All orders are subject to captain verification and strict local guidelines.
        </p>
      </div>
    </div>
  );
}

export default SettingsPage;