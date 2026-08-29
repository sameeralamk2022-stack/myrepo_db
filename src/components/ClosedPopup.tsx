import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import { formatTimeRange } from '@/lib/utils';
import { WHATSAPP_AUTO_REPLY } from '@/lib/constants';

interface ClosedPopupProps {
  open: boolean;
  onClose: () => void;
}

export function ClosedPopup({ open, onClose }: ClosedPopupProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-red-500/30 p-8 text-center shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">We're Closed Right Now</h2>
            <p className="text-red-400 font-medium mb-1">
              Please order between 10 AM - 11:30 PM
            </p>
            <p className="text-slate-400 text-sm mt-4">
              {WHATSAPP_AUTO_REPLY}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
