import { useState, useEffect, useRef } from 'react';
import { Lock, Delete, ShieldCheck, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import { verifyPin, setAppLock } from '@/utils/security';

interface LockScreenProps {
  onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
  }, []);

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === 4) {
        if (verifyPin(nextPin)) {
          gsap.to(containerRef.current, {
            scale: 1.05,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              setAppLock(false);
              onUnlock();
            },
          });
        } else {
          setError(true);
          gsap.fromTo(
            '.pin-dots',
            { x: -10 },
            { x: 10, repeat: 3, yoyo: true, duration: 0.08, onComplete: () => setPin('') }
          );
          setTimeout(() => setError(false), 1500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center px-4">
      <div
        ref={containerRef}
        className="w-full max-w-sm p-6 rounded-3xl bg-slate-900/90 border border-saffron-500/35 shadow-2xl text-center"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-saffron-500/20 border border-saffron-500/40 flex items-center justify-center text-saffron-400">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-black text-white mb-1">App Locked</h2>
        <p className="text-xs text-slate-400 mb-6">Enter PIN to view orders & secure session (Default PIN: 1111)</p>

        <div className="pin-dots flex justify-center gap-3 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                i < pin.length
                  ? 'bg-saffron-500 shadow-[0_0_12px_rgba(255,111,0,0.8)] scale-110'
                  : 'bg-slate-800 border border-white/10'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 text-[11px] font-bold text-red-400 flex items-center justify-center gap-1.5 animate-bounce">
            <AlertCircle className="w-3.5 h-3.5" /> Incorrect PIN. Try 1111.
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((item, idx) => {
            if (item === '') return <div key={idx} />;
            if (item === 'del') {
              return (
                <button
                  key={idx}
                  onClick={handleDelete}
                  className="h-12 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-white/5 flex items-center justify-center text-slate-300 active:scale-95 transition-all"
                >
                  <Delete className="w-5 h-5" />
                </button>
              );
            }
            return (
              <button
                key={idx}
                onClick={() => handlePress(item)}
                className="h-12 rounded-2xl bg-slate-800/80 hover:bg-saffron-600/20 border border-white/10 hover:border-saffron-500/40 text-base font-bold text-white shadow-md active:scale-95 transition-all"
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1 mt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure local encryption active
        </div>
      </div>
    </div>
  );
}