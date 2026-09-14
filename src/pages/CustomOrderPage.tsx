import React, { useState } from 'react';
import { ArrowLeft, Flame, Plus, Minus, ShoppingBag, CheckCircle, MapPin } from 'lucide-react';

interface CustomOrderPageProps {
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

export function CustomOrderPage({ stall, onBack, onAddToCart }: CustomOrderPageProps) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [spiceLevels, setSpiceLevels] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);

  const handleQty = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const handleAddCustomToCart = () => {
    let addedCount = 0;
    Object.entries(quantities).forEach(([id, qty]) => {
      if (qty > 0) {
        const item = stall.items.find((i) => i.id === id);
        if (item) {
          const spice = spiceLevels[id] || 'Medium';
          onAddToCart({ ...item, stallName: stall.name }, qty, `Spice: ${spice}`);
          addedCount += qty;
        }
      }
    });

    if (addedCount > 0) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onBack();
      }, 1500);
    }
  };

  const totalAmount = Object.entries(quantities).reduce((sum, [id, qty]) => {
    const item = stall.items.find(i => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 bg-slate-950 min-h-screen text-white">
      <button 
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Stalls</span>
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Custom Order Suite
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">{stall.name}</h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center">
              <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1" />
              {stall.location} • <span className="text-amber-400 ml-1 font-bold">{stall.timing}</span>
            </p>
          </div>
        </div>

        {success ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-xl font-black text-white">Added to Cart Successfully!</h3>
            <p className="text-xs text-slate-400">Your customized items have been added to your cart drawer.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-300">Customize & Select Items</h3>
              {stall.items.map((item) => {
                const qty = quantities[item.id] || 0;
                const spice = spiceLevels[item.id] || 'Medium';

                return (
                  <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-slate-900 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-black text-white">{item.name}</h4>
                        <p className="text-xs text-slate-400">{item.description}</p>
                        <span className="text-xs font-black text-amber-400 mt-1 inline-block">₹{item.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
                      <div className="flex items-center space-x-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <select 
                          value={spice}
                          onChange={(e) => setSpiceLevels(prev => ({ ...prev, [item.id]: e.target.value }))}
                          className="bg-transparent text-xs text-white outline-none cursor-pointer"
                        >
                          <option value="Mild" className="bg-slate-900">Mild Spice</option>
                          <option value="Medium" className="bg-slate-900">Medium Spice</option>
                          <option value="Extra Spicy" className="bg-slate-900">Extra Spicy</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
                        <button onClick={() => handleQty(item.id, -1)} className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer">-</button>
                        <span className="w-6 text-center text-xs font-black text-white">{qty}</span>
                        <button onClick={() => handleQty(item.id, 1)} className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center cursor-pointer">+</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Total Custom Amount</span>
                <p className="text-xl font-black text-amber-400">₹{totalAmount}</p>
              </div>
              <button
                onClick={handleAddCustomToCart}
                disabled={totalAmount === 0}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-2xl font-black text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}