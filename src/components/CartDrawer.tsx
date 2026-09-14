import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, Send, QrCode, AlertCircle, Clock } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stallName: string;
  customDetails?: string;
  image: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: any) => void;
}

export function CartDrawer({ isOpen, onClose, cartItems, onUpdateQty, onClearCart, onOrderPlaced }: CartDrawerProps) {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [showUpiQr, setShowUpiQr] = useState(false);
  const [address, setAddress] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 25 : 0;
  const total = subtotal + deliveryFee;

  // Operating hours check (10:00 AM to 11:30 PM)
  const currentHour = new Date().getHours();
  const isOperatingHours = currentHour >= 10 && currentHour < 23.5;

  const handleWhatsAppDispatch = () => {
    if (cartItems.length === 0) return;
    if (!address.trim()) {
      alert('Please enter your delivery address.');
      return;
    }

    const orderId = `MB-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsList = cartItems.map(i => `• ${i.name} (${i.quantity}x) - ₹${i.price * i.quantity} ${i.customDetails ? `[${i.customDetails}]` : ''}`).join('\n');
    
    const whatsappMessage = encodeURIComponent(
      `🛍️ *NEW MEERUT BITES ORDER* (#${orderId})\n\n` +
      `*Delivery Address:* ${address}\n` +
      `*Payment Mode:* ${paymentMethod.toUpperCase()}\n\n` +
      `*Items:*\n${itemsList}\n\n` +
      `*Subtotal:* ₹${subtotal}\n` +
      `*Delivery Fee:* ₹${deliveryFee}\n` +
      `*Total Amount:* ₹${total}\n\n` +
      `🕒 *Status:* Dispatched to Kitchen`
    );

    // Open WhatsApp vendor dispatch
    window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank');

    const newOrder = {
      id: orderId,
      stallName: cartItems[0]?.stallName || 'Meerut Bites Partner Stall',
      items: cartItems.map(i => `${i.name} (${i.quantity}x)`).join(', '),
      total: total,
      status: 'Preparing in Kitchen',
      time: 'Just now'
    };

    onOrderPlaced(newOrder);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClearCart();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black text-white">Your Cart Drawer</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Operating Hours Alert */}
        {!isOperatingHours && (
          <div className="mx-6 mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center space-x-2 text-amber-400 text-xs">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>Note: Standard operating hours are 10:00 AM – 11:30 PM.</span>
          </div>
        )}

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isSuccess ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <Send className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-xl font-black text-white">Dispatched to WhatsApp!</h3>
              <p className="text-xs text-slate-400">Your order has been sent successfully.</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="py-24 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-sm font-bold text-slate-400">Your cart is currently empty.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-black uppercase text-slate-400">Selected Items ({cartItems.length})</span>
                <button onClick={onClearCart} className="text-xs text-red-400 hover:underline flex items-center space-x-1 cursor-pointer">
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              </div>

              {cartItems.map((item) => (
                <div key={`${item.id}-${item.customDetails}`} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-slate-900" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">{item.stallName}</span>
                    <h4 className="text-xs font-black text-white truncate">{item.name}</h4>
                    {item.customDetails && <span className="text-[10px] text-slate-400 block">{item.customDetails}</span>}
                    <span className="text-xs font-bold text-amber-400">₹{item.price}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1">
                    <button onClick={() => onUpdateQty(item.id, item.quantity - 1)} className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center cursor-pointer">-</button>
                    <span className="w-5 text-center text-xs font-black">{item.quantity}</span>
                    <button onClick={() => onUpdateQty(item.id, item.quantity + 1)} className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center cursor-pointer">+</button>
                  </div>
                </div>
              ))}

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300 block">Delivery Address in Meerut</label>
                <input
                  type="text"
                  placeholder="Enter house no, street, landmark..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300 block">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setPaymentMethod('upi'); setShowUpiQr(true); }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer ${paymentMethod === 'upi' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>UPI QR Pay</span>
                  </button>
                  <button
                    onClick={() => { setPaymentMethod('cod'); setShowUpiQr(false); }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer ${paymentMethod === 'cod' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Cash on Delivery</span>
                  </button>
                </div>

                {showUpiQr && (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-2">
                    <div className="w-32 h-32 bg-white rounded-xl mx-auto p-2 flex items-center justify-center">
                      <QrCode className="w-28 h-28 text-slate-950" />
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold block">Scan QR code using GPay/PhonePe/Paytm</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer / Summary */}
        {cartItems.length > 0 && !isSuccess && (
          <div className="p-6 border-t border-slate-800 space-y-4 bg-slate-900">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-bold text-white">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery & Handling</span>
                <span className="font-bold text-white">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-800">
                <span className="text-white">Total Amount</span>
                <span className="text-amber-400">₹{total}</span>
              </div>
            </div>

            <button
              onClick={handleWhatsAppDispatch}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Order via WhatsApp</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}