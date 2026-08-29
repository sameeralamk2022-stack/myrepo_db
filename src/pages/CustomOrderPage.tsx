import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, CheckCircle, Flame, Sliders, Utensils, Star, MapPin } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function CustomOrderPage({ stall, onBack }: { stall: any; onBack: () => void }) {
  const { addToCart, setIsCartOpen } = useApp() as any;
  const [selectedItem, setSelectedItem] = useState(stall.items[0]);
  const [spiceLevel, setSpiceLevel] = useState('Medium Spicy');
  const [portionSize, setPortionSize] = useState('Standard');
  const [customNotes, setCustomNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleCustomAddToCart = () => {
    const customItemData = {
      id: `${selectedItem.id}-custom-${Date.now()}`,
      name: `${selectedItem.name} (${portionSize}, ${spiceLevel})`,
      price: selectedItem.price || 150,
      stall: stall.name,
      customNotes: customNotes || 'No special instructions',
      quantity: 1
    };

    addToCart(customItemData);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setIsCartOpen(true);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 bg-slate-950 min-h-screen text-white">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Stalls</span>
        </button>
        <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
          Custom Order Portal
        </span>
      </div>

      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 p-4 rounded-2xl text-xs font-bold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Custom order added to cart! Opening cart drawer...</span>
        </motion.div>
      )}

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-2xl">
        <img src={stall.image} alt={stall.name} className="w-24 h-24 rounded-2xl object-cover border border-slate-700 shadow-xl" />
        <div className="space-y-1 text-center sm:text-left">
          <h1 className="text-2xl font-black text-white">{stall.name}</h1>
          <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start">
            <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1" />
            {stall.location} • <Star className="w-3 h-3 text-amber-400 ml-2 mr-0.5 fill-current" /> {stall.rating}
          </p>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
          <Sliders className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-black text-white">Configure Your Custom Dish</h2>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase">Select Item</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stall.items.map((item: any) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedItem.id === item.id ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div>
                  <span className="font-bold text-xs block text-white">{item.name}</span>
                  <span className="text-xs text-amber-400 font-black">₹{item.price || 150}</span>
                </div>
                <Utensils className="w-4 h-4 text-amber-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Spice Level</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['Mild', 'Medium Spicy', 'Extra Spicy'].map((level) => (
              <button
                key={level}
                onClick={() => setSpiceLevel(level)}
                className={`py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  spiceLevel === level ? 'bg-amber-500 text-slate-950 font-black border-amber-500 shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase">Portion Size</label>
          <div className="grid grid-cols-3 gap-3">
            {['Half Plate', 'Standard', 'Family Mega Pack'].map((size) => (
              <button
                key={size}
                onClick={() => setPortionSize(size)}
                className={`py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  portionSize === size ? 'bg-amber-500 text-slate-950 font-black border-amber-500 shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase">Special Instructions / Notes</label>
          <textarea
            rows={3}
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="e.g., Extra onion, make it extra crispy..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none"
          />
        </div>

        <button
          onClick={handleCustomAddToCart}
          className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 shadow-xl cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add Custom Order to Cart (₹{selectedItem.price || 150})</span>
        </button>
      </div>
    </div>
  );
}

export default CustomOrderPage;