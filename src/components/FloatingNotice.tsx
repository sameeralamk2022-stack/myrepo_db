import { useState } from 'react';
import { CreditCard, X } from 'lucide-react';

export function FloatingNotice() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 right-4 z-40 max-w-xs sm:max-w-sm bg-slate-900/95 border border-amber-500/40 rounded-xl p-3 shadow-2xl backdrop-blur-md text-white text-xs">
      <div className="flex items-start gap-2">
        <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
          <CreditCard size={16} />
        </div>
        <div className="flex-1 pr-4">
          <p className="font-bold text-amber-400">Payment: Prepaid Online Only</p>
          <p className="text-slate-300 mt-0.5">
            Full payment required via UPI/Card before order confirmation. No cash or postpaid orders allowed.
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}