import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShoppingBag, Trash2, Plus, Minus, QrCode, Banknote, 
  CheckCircle2, AlertCircle, Clock, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, clearCart } = useApp() as any;
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showTimePopup, setShowTimePopup] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({ name: '', phone: '', address: '' });

  // Timing Logic: 10:00 AM to 11:30 PM
  const checkOrderTiming = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openTime = 10 * 60; // 10:00 AM
    const closeTime = 23 * 60 + 30; // 11:30 PM
    return currentMinutes >= openTime && currentMinutes <= closeTime;
  };

  // COD Availability: Closed after 6:00 PM (18:00)
  const isCodAvailable = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return currentMinutes <= 18 * 60;
  };

  const subtotal = cart.reduce((sum: number, item: any) => sum + (item.price || 150) * (item.quantity || 1), 0);
  const deliveryFee = 25;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!checkOrderTiming()) {
      setShowTimePopup(true);
      return;
    }

    if (paymentMethod === 'cod' && !isCodAvailable()) {
      alert('Cash on Delivery (COD) is closed after 6:00 PM. Please use UPI QR Code Payment.');
      return;
    }

    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setOrderPlaced(false);
      setIsCartOpen(false);
    }, 3500);
  };

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Drawer Content */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-slate-950 border-l border-slate-800 text-white flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight">Your Cart ({cart.reduce((acc: number, item: any) => acc + item.quantity, 0)})</h2>
                  <p className="text-xs text-slate-400">Meerut Bites Direct Dispatch</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Time Warning Popup Modal */}
            {showTimePopup && (
              <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 text-center">
                <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-2xl max-w-sm">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                    <Clock className="w-7 h-7 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-black text-white">Orders Are Not Accepting</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    We are currently closed. We accept orders strictly between <span className="text-amber-400 font-bold">10:00 AM and 11:30 PM</span>. Please visit us during operating hours!
                  </p>
                  <button
                    onClick={() => setShowTimePopup(false)}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs transition-all shadow-lg"
                  >
                    Got It
                  </button>
                </div>
              </div>
            )}

            {/* Success State */}
            {orderPlaced ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white">Order Placed Successfully!</h3>
                <p className="text-xs text-slate-400">Your order has been sent to the vendor via WhatsApp dispatch. Enjoy your fresh meal!</p>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-slate-500">
                      <ShoppingBag className="w-12 h-12 stroke-1" />
                      <p className="text-sm font-bold">Your cart is empty</p>
                      <p className="text-xs">Add delicious items from local Meerut stalls to start your order.</p>
                    </div>
                  ) : (
                    cart.map((item: any) => (
                      <div key={item.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {item.stall || 'Local Stall'}
                          </span>
                          <h4 className="font-bold text-xs text-white">{item.name}</h4>
                          <span className="text-xs font-bold text-amber-400">₹{item.price || 150}</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-black w-5 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer & Checkout Section */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-slate-800 bg-slate-900/80 space-y-4">
                    {/* Payment Options (Single QR Code UI) */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Payment Method</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setPaymentMethod('upi')}
                          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                            paymentMethod === 'upi' 
                              ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-lg' 
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-2">
                            <QrCode className="w-5 h-5" />
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Instant</span>
                          </div>
                          <span className="text-xs font-black">UPI QR Code</span>
                        </button>

                        <button
                          onClick={() => {
                            if (!isCodAvailable()) {
                              alert('Cash on Delivery (COD) is closed after 6:00 PM.');
                              return;
                            }
                            setPaymentMethod('cod');
                          }}
                          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                            paymentMethod === 'cod' 
                              ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-lg' 
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-2">
                            <Banknote className="w-5 h-5" />
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">COD</span>
                          </div>
                          <span className="text-xs font-black">Cash on Delivery</span>
                        </>
                      </div>

                      {/* UPI QR Display Box (Only ONE clean QR section) */}
                      {paymentMethod === 'upi' && (
                        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center space-x-4">
                          <div className="w-16 h-16 bg-white p-1.5 rounded-xl flex-shrink-0 shadow-md">
                            <img 
                              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=meerutbites@upi&pn=MeerutBites" 
                              alt="UPI QR Code"
                              className="w-full h-full object-contain" 
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-black text-white">Scan & Pay via UPI</span>
                            <p className="text-[10px] text-slate-400 leading-tight">GPay, PhonePe, Paytm, or BHIM. Instant verification.</p>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'cod' && !isCodAvailable() && (
                        <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-center space-x-2 text-rose-400 text-xs font-bold">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>COD is closed after 6:00 PM. Please use UPI.</span>
                        </div>
                      )}
                    </div>

                    {/* Bill Breakdown */}
                    <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="text-white font-bold">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery & Packaging Fee</span>
                        <span className="text-white font-bold">₹{deliveryFee}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-amber-400 pt-1 border-t border-slate-800">
                        <span>Total Amount</span>
                        <span>₹{total}</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      <span>Checkout & Dispatch to WhatsApp (₹{total})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

export default CartDrawer;