import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation, Star, Flame } from 'lucide-react';
import type { Stall } from '@/types';
import { TiltCard } from './TiltCard';
import { isOpenNow, formatTimeRange } from '@/lib/utils';

interface StallCardProps {
  stall: Stall;
  onOrder: (stall: Stall) => void;
}

export function StallCard({ stall, onOrder }: StallCardProps) {
  const open = isOpenNow();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <TiltCard className="rounded-2xl overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/20 hover:border-saffron-500/30 transition-all duration-300 hover:shadow-xl">
        <div className="relative h-44 overflow-hidden">
          <img
            src={stall.image}
            alt={stall.name}
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-medium text-saffron-300 border border-saffron-500/30">
              {stall.type}
            </span>
            {stall.popular && (
              <span className="px-2 py-1 rounded-full bg-saffron-600/80 backdrop-blur-md text-xs font-bold text-white flex items-center gap-1">
                <Flame className="w-3 h-3" />
                Popular
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-md ${
              open
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            }`}>
              {open ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">{stall.name}</h3>
              <div className="flex items-center gap-1 text-slate-400 text-sm mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {stall.location}
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white/5 rounded-lg px-2 py-1">
              <Star className="w-3.5 h-3.5 fill-saffron-400 text-saffron-400" />
              <span className="text-white text-sm font-bold">{stall.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-slate-300 text-sm">
            <span className="text-slate-500">Specialty:</span> {stall.specialty}
          </p>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <Clock className="w-3.5 h-3.5" />
            Hours: {formatTimeRange()}
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onOrder(stall)}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-700 text-white text-sm font-semibold hover:shadow-lg hover:shadow-saffron-700/30 transition-all duration-300 active:scale-95"
            >
              Order Now
            </button>
            <a
              href={stall.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 border border-white/20 text-slate-300 hover:text-saffron-400 hover:border-saffron-500/30 hover:scale-105 transition-all duration-300 active:scale-95"
              aria-label="Get Directions"
            >
              <Navigation className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">Directions</span>
            </a>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
