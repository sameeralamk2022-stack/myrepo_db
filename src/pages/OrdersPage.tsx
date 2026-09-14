import React from 'react';
import { Clock, CheckCircle2, Package, MapPin, Navigation } from 'lucide-react';
import { useApp } from '@/context/AppContext';

function getISTMinutes() {
  try {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istDate = new Date(utc + (3600000 * 5.5));
    return istDate.getHours() * 60 + istDate.getMinutes();
  } catch {
    return 600;
  }
}

function getDeliveryRate() {
  const totalMinutes = getISTMinutes();
  const isDayTime = totalMinutes >= 600 && totalMinutes < 1080;
  return { isDayTime, ratePerKm: isDayTime ? 10 : 12 };
}

interface OrdersPageProps {
  onNavigateStalls?: () => void;
}

export function OrdersPage({ onNavigateStalls }: OrdersPageProps) {
  const { orders } = useApp();
  const { isDayTime, ratePerKm } = getDeliveryRate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 bg-slate-950 min-h-screen text-white">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black tracking-tight">Active & Past Orders</h1>
        <p className="text-xs text-slate-400 mt-1">Track your live street food dispatches in real time.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider">
          <MapPin className="w-4 h-4" />
          <span>Current Delivery Rate</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-xl border text-center ${isDayTime ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-950 border-slate-800'}`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Day (10 AM - 6 PM)</p>
            <p className={`text-lg font-black ${isDayTime ? 'text-amber-400' : 'text-slate-600'}`}>₹10/km</p>
          </div>
          <div className={`p-3 rounded-xl border text-center ${!isDayTime ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-950 border-slate-800'}`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Night (6 PM - 10 AM)</p>
            <p className={`text-lg font-black ${!isDayTime ? 'text-amber-400' : 'text-slate-600'}`}>₹12/km</p>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 font-bold">Currently active: {isDayTime ? 'Day Rate ₹10/km' : 'Night Rate ₹12/km'} - Final price decided by Captain DB.</p>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <Package className="w-12 h-12 text-slate-700 mx-auto" />
          <p className="text-xs text-slate-400">No active orders right now.</p>
          {onNavigateStalls && (
            <button onClick={onNavigateStalls} className="px-5 py-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold text-xs cursor-pointer">
              Order Something Delicious
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {order.id}
                </span>
                <span className="text-xs text-slate-400 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-amber-400" /> {order.time}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">{order.stallName}</h3>
                <p className="text-xs text-slate-300">{order.items}</p>
                {order.address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 font-bold cursor-pointer mt-1"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>{order.address} - Open in Google Maps</span>
                  </a>
                )}
                {order.deliveryRate && (
                  <p className="text-[11px] text-amber-400/80 font-bold mt-1">Delivery Rate: {order.deliveryRate}</p>
                )}
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{order.status}</span>
                </div>
                <span className="text-xs font-bold text-amber-400">Price decided by captain</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
