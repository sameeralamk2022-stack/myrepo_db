import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, ShieldCheck, Package } from 'lucide-react';
import { Order } from '@/types';

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order] = useState<Order | null>(() => {
    try {
      const savedOrders = localStorage.getItem('mb_orders');
      if (savedOrders) {
        const parsed: Order[] = JSON.parse(savedOrders);
        return parsed.find((o) => o.id === orderId) || null;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  if (!order) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <Package className="w-16 h-16 text-slate-600 mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-white mb-2">Order Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">We couldn't locate order #{orderId}.</p>
        <button
          onClick={() => navigate('/orders')}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-xl transition"
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
              {order.status}
            </span>
            <h1 className="text-xl font-bold text-white mt-2">Order #{order.id}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Grand Total</span>
            <span className="text-2xl font-black text-amber-400">₹{order.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <MapPin className="w-4 h-4 text-amber-400" /> Delivery Address
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">{order.deliveryAddress}</p>
            {order.landmark && <p className="text-xs text-slate-500">Landmark: {order.landmark}</p>}
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Phone className="w-4 h-4 text-amber-400" /> Contact & Info
            </div>
            <p className="text-slate-400 text-xs">Customer: <span className="text-white font-medium">{order.customerName}</span></p>
            <p className="text-slate-400 text-xs">Phone: <span className="text-white font-medium">{order.phone}</span></p>
            <p className="text-slate-400 text-xs">Payment: <span className="text-white font-medium">{order.paymentMethod}</span></p>
          </div>
        </div>

        {order.deliveryOtp && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <div>
                <p className="text-xs text-amber-300/80 font-medium">Delivery Verification OTP</p>
                <p className="text-lg font-mono font-bold tracking-widest text-amber-400">{order.deliveryOtp}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Ordered Items</h3>
          <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold text-white">{item.dishName}</p>
                  <p className="text-xs text-slate-400">Stall: {item.stallName} • Qty: {item.quantity}</p>
                  {item.instructions && (
                    <p className="text-xs text-amber-400/80 italic mt-0.5">Note: {item.instructions}</p>
                  )}
                </div>
                <span className="font-bold text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Items Total</span>
            <span className="text-white font-medium">₹{order.itemsTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Delivery Charge</span>
            <span className="text-white font-medium">₹{order.deliveryCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-white border-t border-slate-800 pt-2 mt-2">
            <span>Grand Total</span>
            <span className="text-amber-400">₹{order.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}