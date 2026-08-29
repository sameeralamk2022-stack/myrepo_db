import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

interface OrdersPageProps {
  orders: any[];
  onNavigateStalls: () => void;
}

export function OrdersPage({ orders, onNavigateStalls }: OrdersPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 bg-slate-950 min-h-screen text-white">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black tracking-tight">Active & Past Orders</h1>
        <p className="text-xs text-slate-400 mt-1">Track your live street food dispatches in real time.</p>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <p className="text-xs text-slate-400">No active orders right now.</p>
          <button onClick={onNavigateStalls} className="px-5 py-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold text-xs cursor-pointer">
            Order Something Delicious
          </button>
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
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{order.status}</span>
                </div>
                <span className="text-sm font-black text-amber-400">₹{order.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}