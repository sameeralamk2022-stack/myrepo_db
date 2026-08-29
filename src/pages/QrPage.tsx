import { motion } from 'framer-motion';
import { QrCode, Copy, Check, Download, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Footer } from '@/components/Footer';
import { UPI_ID } from '@/lib/constants';

export function QrPage() {
  const { profile, orders } = useApp();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'upi' | 'profile' | 'orders'>('upi');
  const svgRef = useRef<HTMLDivElement>(null);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = (value: string, filename: string) => {
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
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const upiValue = `upi://pay?pa=${UPI_ID}&pn=Meerut%20Bites`;
  const profileValue = JSON.stringify({ name: profile.name, phone: profile.phone, email: profile.googleEmail });
  const latestOrder = orders[0];
  const orderValue = latestOrder ? latestOrder.id : 'No orders yet';

  const currentQR = activeTab === 'upi' ? upiValue : activeTab === 'profile' ? profileValue : orderValue;
  const currentLabel = activeTab === 'upi' ? 'UPI Payment' : activeTab === 'profile' ? 'My Profile' : 'Latest Order';
  const currentCopy = activeTab === 'upi' ? UPI_ID : activeTab === 'profile' ? profile.phone : orderValue;

  return (
    <div className="min-h-screen pt-16 pb-24 md:pb-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-2 mb-6">
          <QrCode className="w-6 h-6 text-saffron-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">QR Codes</h1>
        </div>

        {/* Tab selector */}
        <div className="flex gap-2 mb-6">
          {([
            { key: 'upi', label: 'UPI Pay' },
            { key: 'profile', label: 'Profile' },
            { key: 'orders', label: 'Order' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                activeTab === tab.key
                  ? 'bg-saffron-600 text-white shadow-lg shadow-saffron-700/30'
                  : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
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
          className="rounded-2xl bg-slate-900/60 border border-white/10 p-8 text-center"
        >
          <p className="text-slate-400 text-sm mb-4">{currentLabel}</p>
          <div ref={svgRef} className="flex justify-center mb-4">
            <div className="rounded-2xl bg-white p-4 shadow-2xl">
              <QRCodeSVG
                value={currentQR}
                size={220}
                level="M"
                bgColor="#ffffff"
                fgColor="#000000"
                includeMargin={true}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-white font-mono text-sm break-all">{currentCopy}</span>
            <button
              onClick={() => copyText(currentCopy)}
              className="text-saffron-400 hover:text-saffron-300"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => downloadQR(currentQR, `meerut-bites-${activeTab}-qr.png`)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-700 text-white font-semibold active:scale-95 transition-all"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Meerut Bites QR', text: currentLabel, url: currentQR });
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-medium hover:bg-white/10 active:scale-95 transition-all"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </motion.div>

        {activeTab === 'orders' && orders.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-slate-500 text-xs">All Orders</p>
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div>
                  <p className="text-white text-sm font-mono">{order.id}</p>
                  <p className="text-slate-500 text-xs">{order.items.length} items - {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="rounded-lg bg-white p-1.5">
                  <QRCodeSVG value={order.id} size={48} level="L" bgColor="#ffffff" fgColor="#000000" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
