import React, { useState } from 'react';
import { Settings, Star, AlertTriangle, Send, Code, Phone, MessageCircle, User, Save, CheckCircle, LogOut, Sun, Moon, Cpu, Rocket } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DEVELOPER } from '@/lib/constants';

export function SettingsPage(): JSX.Element {
  const { profile, setProfile, logout, darkMode, setDarkMode } = useApp();
  const [name, setName] = useState(profile.name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [saved, setSaved] = useState(false);
  const [generalRating, setGeneralRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...profile, name: name.trim(), phone: phone.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const getISTStatus = () => {
    try {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istDate = new Date(utc + (3600000 * 5.5));
      const totalMinutes = istDate.getHours() * 60 + istDate.getMinutes();
      const isClosed = totalMinutes >= 1410 || totalMinutes < 360;
      return { isClosed };
    } catch {
      return { isClosed: false };
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

  const socialButtons = [
    { name: 'Instagram', color: 'from-pink-500 to-purple-500', emoji: 'IG' },
    { name: 'Facebook', color: 'from-blue-500 to-blue-600', emoji: 'FB' },
    { name: 'Twitter / X', color: 'from-slate-700 to-slate-900', emoji: 'X' },
    { name: 'YouTube', color: 'from-red-500 to-red-600', emoji: 'YT' },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 pb-20 page-transition">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" />
          <span>App Settings & Operational Rules</span>
        </h1>
        <p className="text-xs text-slate-400">Configure your profile, delivery rules, operating hours, and app feedback.</p>
      </div>

      {/* Theme Toggle Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest">Appearance</h3>
        <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2">
            {darkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <div>
              <p className="text-xs font-black text-white">{darkMode ? 'Dark Mode' : 'Light Mode'}</p>
              <p className="text-[10px] text-slate-400">Toggle between dark and light theme</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${darkMode ? 'bg-amber-500' : 'bg-slate-700'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Profile Editing Section */}
      <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
          <User className="w-4 h-4" />
          <span>Edit Your Profile</span>
        </h3>
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
            required
          />
          <p className="text-[10px] text-slate-500 mt-1">This name appears in the welcome message on the home page.</p>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
        >
          {saved ? <><CheckCircle className="w-4 h-4 text-emerald-600" /><span>Saved!</span></> : <><Save className="w-4 h-4" /><span>Save Profile Changes</span></>}
        </button>
      </form>

      {/* Operating Hours & Charges */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest">Operating Hours & Delivery Charges</h3>
        <div className="grid grid-cols-1 gap-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold block">Current Status:</span>
            <span className={`font-black ${isClosed ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isClosed ? 'Closed (After 11:30 PM)' : 'Open for Orders'}
            </span>
          </div>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
          <span className="text-amber-400 font-black block uppercase tracking-wider text-[10px]">Delivery Rate Schedule</span>
          <div className="flex justify-between text-slate-300 font-bold">
            <span>Day Rate (10:00 AM - 6:00 PM):</span>
            <span className="text-amber-400">₹10 / km</span>
          </div>
          <div className="flex justify-between text-slate-300 font-bold">
            <span>Night Rate (6:00 PM - 10:30 AM):</span>
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 flex items-center justify-center font-black text-slate-950 text-sm shadow-lg">
              <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-amber-400">
                NA
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black text-white">{DEVELOPER}</h4>
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">AI Nanotech Operations & ML Researcher</p>
              <div className="flex items-center gap-1.5 mt-1">
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
        </div>

        {/* Social Media - Coming Soon */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Social Media</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {socialButtons.map((social) => (
              <div
                key={social.name}
                className="relative p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-all cursor-default"
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

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Supabase', 'PWA'].map((tech) => (
            <span key={tech} className="text-[9px] font-bold text-slate-400 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-full">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* App Rating Form */}
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

      {/* Logout Section */}
      <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 space-y-3 shadow-xl">
        <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </h3>
        <p className="text-[11px] text-slate-400">Sign out of your account. Your saved profile and cart will be cleared from this device.</p>
        <button
          onClick={() => { logout(); window.location.reload(); }}
          className="w-full py-3 bg-rose-500 hover:bg-rose-400 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout from Meerut Bites</span>
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
