import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Edit3, Trash2, Plus, X, Loader2, Check } from 'lucide-react';
import type { Address } from '@/types';

interface LocationPickerProps {
  addresses: Address[];
  onAdd: (addr: Address) => void;
  onRemove: (id: string) => void;
  selected: string;
  onSelect: (text: string) => void;
  label: string;
}

export function LocationPicker({ addresses, onAdd, onRemove, selected, onSelect, label }: LocationPickerProps) {
  const [manualOpen, setManualOpen] = useState(false);
  const [manualAddr, setManualAddr] = useState('');
  const [manualLabel, setManualLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gpsResult, setGpsResult] = useState<{ url: string; lat: number; lng: number } | null>(null);

  const detectGPS = () => {
    setLoading(true);
    setError('');
    setGpsResult(null);
    if (!navigator.geolocation) {
      setError('GPS not available on this device.');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const mapUrl = `https://www.google.com/maps?q=${latitude.toFixed(6)},${longitude.toFixed(6)}&z=16`;
        setGpsResult({ url: mapUrl, lat: latitude, lng: longitude });
        const newAddr: Address = {
          id: `addr_${Date.now()}`,
          label: 'GPS Location',
          text: mapUrl,
        };
        onAdd(newAddr);
        onSelect(mapUrl);
        setLoading(false);
      },
      (err) => {
        let msg = err.message || 'Could not detect location.';
        if (err.code === 1) msg = 'Permission denied. Please allow location access in your browser settings.';
        if (err.code === 2) msg = 'Position unavailable. Check your GPS or network connection.';
        if (err.code === 3) msg = 'Location request timed out. Please try again.';
        setError(msg);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const addManual = () => {
    if (manualAddr.trim()) {
      const newAddr: Address = {
        id: `addr_${Date.now()}`,
        label: manualLabel.trim() || 'Manual',
        text: manualAddr.trim(),
      };
      onAdd(newAddr);
      onSelect(manualAddr.trim());
      setManualAddr('');
      setManualLabel('');
      setManualOpen(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-300">{label}</label>

      {/* GPS detect button - prominent */}
      <button
        type="button"
        onClick={detectGPS}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-saffron-600/20 border border-saffron-600/40 text-saffron-300 text-sm font-bold hover:bg-saffron-600/30 transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Detecting your location...</>
        ) : (
          <><Navigation className="w-4 h-4" /> Detect My Current Location</>
        )}
      </button>

      {/* GPS result box - shows the URL that can be clicked */}
      {gpsResult && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-emerald-400">Location detected!</p>
            <a
              href={gpsResult.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal-400 hover:text-teal-300 underline truncate block"
            >
              {gpsResult.lat.toFixed(4)}, {gpsResult.lng.toFixed(4)} — Open in Google Maps
            </a>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-red-400 text-xs font-medium">{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setManualOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 transition-colors active:scale-95"
      >
        <Plus className="w-4 h-4" />
        Add Address Manually
      </button>

      {addresses.length > 0 && (
        <div className="space-y-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                selected === addr.text
                  ? 'bg-saffron-600/10 border-saffron-600/40'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(addr.text)}
                className="flex items-center gap-2 flex-1 text-left"
              >
                <MapPin className="w-4 h-4 text-saffron-400 shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium">{addr.label}</p>
                  {addr.text.startsWith('http') ? (
                    <a
                      href={addr.text}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-green-400 hover:text-green-300 underline"
                    >
                      View on Google Maps
                    </a>
                  ) : (
                    <p className="text-xs text-slate-400">{addr.text}</p>
                  )}
                </div>
              </button>
              <button
                type="button"
                onClick={() => onRemove(addr.id)}
                className="text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="text"
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        placeholder="Or type your address here"
        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-saffron-500 transition-colors"
      />

      <AnimatePresence>
        {manualOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            <input
              type="text"
              value={manualLabel}
              onChange={(e) => setManualLabel(e.target.value)}
              placeholder="Label (e.g. Home, Work)"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-saffron-500"
            />
            <textarea
              value={manualAddr}
              onChange={(e) => setManualAddr(e.target.value)}
              placeholder="Full address"
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-saffron-500 resize-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addManual}
                className="flex-1 py-2 rounded-lg bg-saffron-600 text-white text-sm font-medium hover:bg-saffron-700 active:scale-95 transition-all"
              >
                Save Address
              </button>
              <button
                type="button"
                onClick={() => setManualOpen(false)}
                className="px-3 py-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
