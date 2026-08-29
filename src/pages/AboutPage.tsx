import { motion } from 'framer-motion';
import { Info, MapPin, Clock, ShieldAlert, Share2, UtensilsCrossed, Instagram, Facebook, Twitter, Youtube, MessageCircle } from 'lucide-react';
import { formatTimeRange } from '@/lib/utils';
import { DEVELOPER, SOCIAL_LINKS, SECURITY_DISCLAIMER } from '@/lib/constants';
import { Footer } from '@/components/Footer';

export function AboutPage() {
  return (
    <div className="min-h-screen pt-16 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Info className="w-6 h-6 text-saffron-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">About Meerut Bites</h1>
        </div>

        {/* CAPTAIN DB service model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-saffron-700/10 to-saffron-900/10 border border-saffron-700/20 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Meerut Bites Service Model</h2>
              <p className="text-slate-400 text-sm">Meerut's dedicated street food delivery service</p>
            </div>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Meerut Bites connects you with Meerut's best street food stalls. We pick up fresh,
            hygienic food from local thelas and deliver it to your doorstep. Our network covers
            both Meerut City and Cantonment areas, bringing authentic flavors right to you.
          </p>
        </motion.div>

        {/* Coverage map */}
        <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-saffron-400" />
            <h2 className="text-lg font-bold text-white">Coverage Area</h2>
          </div>
          <div className="rounded-xl overflow-hidden border border-white/10 h-56 mb-3">
            <iframe
              title="Meerut Coverage"
              src="https://www.openstreetmap.org/export/embed.html?bbox=77.60%2C29.00%2C77.80%2C29.10&layer=mapnik&marker=29.0452%2C77.7052"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <p className="text-white text-sm font-medium">Meerut City</p>
              <p className="text-slate-500 text-xs">Sadar Bazaar, Abu Lane, Suraj Kund, Begum Bridge</p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <p className="text-white text-sm font-medium">Cantt Limits</p>
              <p className="text-slate-500 text-xs">Shaheeper Gate, Lal Kurti, Cantt Area</p>
            </div>
          </div>
        </div>

        {/* Service hours */}
        <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-saffron-400" />
            <h2 className="text-lg font-bold text-white">Service Hours</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-xl bg-saffron-600/10 border border-saffron-600/30 p-4 text-center">
              <p className="text-saffron-300 text-2xl font-bold">{formatTimeRange()}</p>
              <p className="text-slate-400 text-sm mt-1">Daily - Sharp timing</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-3">
            Orders are only accepted during service hours. Outside these hours, you can still
            browse stalls and plan your next order.
          </p>
        </div>

        {/* Social media */}
        <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="w-5 h-5 text-saffron-400" />
            <h2 className="text-lg font-bold text-white">Social Media</h2>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { url: SOCIAL_LINKS.instagram, icon: Instagram, label: 'Instagram' },
              { url: SOCIAL_LINKS.facebook, icon: Facebook, label: 'Facebook' },
              { url: SOCIAL_LINKS.twitter, icon: Twitter, label: 'Twitter' },
              { url: SOCIAL_LINKS.youtube, icon: Youtube, label: 'YouTube' },
              { url: SOCIAL_LINKS.whatsapp, icon: MessageCircle, label: 'WhatsApp' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-saffron-400 hover:border-saffron-500/30 hover:scale-110 transition-all duration-300"
              >
                <s.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-2xl bg-red-500/5 border border-red-500/20 p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-bold text-white">Security & Disclaimer</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            {SECURITY_DISCLAIMER}
          </p>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-slate-500 text-sm">Developed by {DEVELOPER}</p>
        </div>
        <Footer />
      </div>
    </div>
  );
}
