import React, { useState } from 'react';
import { ArrowLeft, Zap, CheckCircle, MapPin } from 'lucide-react';

interface SimpleOrderPageProps {
  stall: {
    name: string;
    location: string;
    timing: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      description: string;
      image: string;
    }>;
  };
  onBack: () => void;
  onAddToCart: (item: any, quantity: number, customDetails: string) => void;
}

export function SimpleOrderPage({ stall, onBack, onAddToCart }: SimpleOrderPageProps) {
  const [selectedItem, setSelectedItem] = useState(stall.items[0]);
  const [success, setSuccess] = useState(false);

  const handleQuickAdd = () => {
    onAddToCart({ ...selectedItem, stallName: stall.name }, 1, 'Quick Order');
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onBack();
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 bg-slate-950 min-h-screen text-white">
      <button 
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Stalls</span>
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1 w-fit">
              <Zap className="w-3 h-3" /> Quick 1-Tap Checkout
            </span>
            <h2 className="text-2xl font-black text-white mt-2">{stall.name}</h2>
            <p className="text-xs text-slate-400 flex items-center mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1" /> {stall.location}
            </p>
          </div>
        </div>

        {success ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-7 h-7 animate-bounce" />
            </div>
            <h3 className="text-lg font-black text-white">Added to Cart!</h3>
            <p className="text-xs text-slate-400">Item successfully added for quick dispatch.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300">Choose Signature Item</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stall.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                      selectedItem.id === item.id 
                        ? 'bg-amber-500/10 border-amber-500 text-white' 
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-black text-white">{item.name}</h4>
                      <span className="text-xs font-bold text-amber-400">₹{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Selected Item Price</span>
                <p className="text-xl font-black text-amber-400">₹{selectedItem.price}</p>
              </div>
              <button
                onClick={handleQuickAdd}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-black text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Add to Cart & Checkout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}