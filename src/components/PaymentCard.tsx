import React from 'react';
import { QrCode, AlertCircle, Wallet } from 'lucide-react';

interface PaymentCardProps {
  selectedMethod: string;
  setSelectedMethod: (method: 'cod' | 'upi') => void;
}

export function PaymentCard({ selectedMethod, setSelectedMethod }: PaymentCardProps): JSX.Element {
  // IST Time Logic
  const getISTTimeDetails = () => {
    try {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istDate = new Date(utc + (3600000 * 5.5));
      const totalMinutes = istDate.getHours() * 60 + istDate.getMinutes();
      
      // 10:00 AM = 600 mins, 6:00 PM = 1080 mins
      const isCodAllowed = totalMinutes >= 600 && totalMinutes < 1080;
      return { isCodAllowed };
    } catch {
      return { isCodAllowed: true };
    }
  };

  const { isCodAllowed } = getISTTimeDetails();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
        <Wallet className="w-4 h-4" />
        <span>Select Payment Method</span>
      </h3>

      <div className="space-y-3">
        {/* COD Option */}
        <div className={`p-4 rounded-xl border transition-all ${!isCodAllowed ? 'bg-slate-950/50 border-slate-800 opacity-60 cursor-not-allowed' : 'bg-slate-950 border-slate-800 hover:border-amber-500/50 cursor-pointer'}`}>
          <label className={`flex items-center justify-between ${!isCodAllowed ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={selectedMethod === 'cod'}
                onChange={() => isCodAllowed && setSelectedMethod('cod')}
                disabled={!isCodAllowed}
                className="w-4 h-4 accent-amber-500"
              />
              <div>
                <span className="text-xs font-black text-white block">Cash on Delivery (COD)</span>
                <span className="text-[10px] text-slate-400">Pay cash upon delivery at your doorstep</span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-slate-300">COD</span>
          </label>

          {!isCodAllowed && (
            <div className="mt-2 text-[11px] text-rose-400 font-bold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>COD is closed after 6:00 p.m. Please use UPI.</span>
            </div>
          )}
        </div>

        {/* UPI QR Option & Static QR Code Box */}
        <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/40 space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={selectedMethod === 'upi'}
                onChange={() => setSelectedMethod('upi')}
                className="w-4 h-4 accent-amber-500"
              />
              <div>
                <span className="text-xs font-black text-white block">UPI QR Code Payment</span>
                <span className="text-[10px] text-amber-400">Scan & pay instantly via GPay, PhonePe, Paytm</span>
              </div>
            </div>
            <QrCode className="w-5 h-5 text-amber-400" />
          </label>

          {/* Static QR Code statically placed within the card section */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col items-center space-y-2">
            <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-lg border-2 border-amber-400 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-lg flex flex-col items-center justify-center text-center p-2 text-white">
                <QrCode className="w-12 h-12 text-amber-400 mb-1" />
                <span className="text-[9px] font-mono font-bold text-amber-300">UPI QR CODE</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold text-center">
              Scan this static QR code using any UPI app to complete your payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentCard;