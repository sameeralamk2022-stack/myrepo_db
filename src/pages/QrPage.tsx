import { motion } from 'framer-motion';
import { QrCode, Copy, Check, Download, Share2, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { UPI_ID } from '@/lib/constants';

interface QrPageProps {
  onBack?: () => void;
}

export function QrPage({ onBack }: QrPageProps) {
  const { profile, orders } = useApp();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'upi' | 'profile' | 'orders'>('upi');
  const svgRef = useRef<HTMLDivElement>(null);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = (filename: string) => {
    const svg = svgRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 400);
      ctx.drawImage(img, 0, 0, 400, 400);
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const upiValue = `upi://pay?pa=${UPI_ID}&pn=Meerut%20Bites`;
  const profileValue = JSON.stringify({ name: profile?.name || 'Guest', phone: profile?.phone || '' });
  const latestOrder = orders[0];
  const orderValue = latestOrder ? latestOrder.id : 'No orders yet';

  const currentQR = activeTab === 'upi' ? upiValue : activeTab === 'profile' ? profileValue : orderValue;
  const currentLabel = activeTab === 'upi' ? 'UPI Payment' : activeTab === 'profile' ? 'My Profile' : 'Latest Order';
  const currentCopy = activeTab === 'upi' ? UPI_ID : activeTab === 'profile' ? (profile?.phone || '') : orderValue;

  const tabs = [
    { key: 'upi' as const, label: 'UPI Pay' },
    { key: 'profile' as const, label: 'Profile' },
    { key: 'orders' as const, label: 'Order' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-md mx-auto px-4 py-10 space-y-6">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-bold text-teal-400 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">QR Codes</h1>
            <p className="text-[10px] text-slate-400 font-bold">Scan to pay or share your info</p>
          </div>
        </div>

        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center shadow-2xl"
        >
          <p className="text-xs font-black uppercase tracking-wider text-amber-400 mb-4">{currentLabel}</p>
          <div ref={svgRef} className="flex justify-center mb-4">
            <div className="rounded-2xl bg-white p-4 shadow-2xl">
              <QRCodeSVG
                value={currentQR || ' '}
                size={220}
                level="M"
                bgColor="#ffffff"
                fgColor="#000000"
                marginSize={2}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-white font-mono text-xs break-all">{currentCopy || 'N/A'}</span>
            {currentCopy && (
              <button
                onClick={() => copyText(currentCopy)}
                className="text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => downloadQR(`meerut-bites-${activeTab}-qr.png`)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Meerut Bites QR', text: currentLabel, url: currentQR });
                } else {
                  copyText(currentQR);
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </motion.div>

        {activeTab === 'orders' && orders.length > 0 && (
          <div className="space-y-2">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">All Orders</p>
            {orders.slice(0, 5).map((order: any) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800"
              >
                <div>
                  <p className="text-white text-xs font-mono font-bold">{order.id}</p>
                  <p className="text-slate-500 text-[10px]">{order.items || 'N/A'}</p>
                </div>
                <div className="rounded-lg bg-white p-1.5">
                  <QRCodeSVG value={order.id} size={48} level="L" bgColor="#ffffff" fgColor="#000000" />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'orders' && orders.length === 0 && (
          <div className="text-center py-8 space-y-2">
            <QrCode className="w-8 h-8 text-slate-700 mx-auto" />
            <p className="text-[11px] text-slate-400 font-bold">No orders yet. Place an order to generate a QR.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default QrPage;
