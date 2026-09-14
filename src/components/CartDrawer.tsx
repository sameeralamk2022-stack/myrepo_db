import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, Send, QrCode, Clock, MapPin, Navigation, Store, Flag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { QR_CODE_URL } from '@/lib/constants';

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

function isWithinOperatingHours() {
  const totalMinutes = getISTMinutes();
  return totalMinutes >= 600 && totalMinutes < 1410;
}

function getDeliveryRate() {
  const totalMinutes = getISTMinutes();
  const isDayTime = totalMinutes >= 600 && totalMinutes < 1080;
  return { isDayTime, ratePerKm: isDayTime ? 10 : 12 };
}

function mapsLink(addr: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
}

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, clearCart, addOrder } = useApp();
  const [shopName, setShopName] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isCartOpen) return null;

  const onClose = () => setIsCartOpen(false);
  const cartItems = cart;
  const canOrder = isWithinOperatingHours();
  const { isDayTime } = getDeliveryRate();

  const availablePayments = isDayTime
    ? [{ id: 'cod' as const, label: 'Cash on Delivery' }, { id: 'upi' as const, label: 'UPI QR Pay' }]
    : [{ id: 'upi' as const, label: 'UPI QR Pay' }];

  const handleWhatsAppDispatch = () => {
    if (cartItems.length === 0) return;
    if (!canOrder) {
      alert('Orders are only accepted between 10:00 AM and 11:30 PM.');
      return;
    }
    if (!shopName.trim()) { alert('Please enter the shop name.'); return; }
    if (!pickupAddress.trim()) { alert('Please enter the pickup address.'); return; }
    if (!dropAddress.trim()) { alert('Please enter the delivery (drop) address.'); return; }

    const orderId = `MB-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsList = cartItems.map((i: any) =>
      `• ${i.name} (${i.quantity}x) ${i.customDetails ? `[${i.customDetails}]` : ''}`
    ).join('\n');

    const pickupMaps = mapsLink(`${shopName}, ${pickupAddress}, Meerut`);
    const dropMaps = mapsLink(`${dropAddress}, ${landmark ? landmark + ', ' : ''}Meerut`);

    const whatsappMessage = encodeURIComponent(
      `🛍️ *NEW MEERUT BITES ORDER* (#${orderId})\n\n` +
      `*Shop Name:* ${shopName}\n` +
      `*Pickup Address:* ${pickupAddress}\n` +
      `*Pickup Maps:* ${pickupMaps}\n` +
      `*Drop Address:* ${dropAddress}\n` +
      (landmark.trim() ? `*Landmark:* ${landmark}\n` : '') +
      `*Drop Maps:* ${dropMaps}\n` +
      `*Delivery Rate:* ${isDayTime ? 'Day ₹10/km' : 'Night ₹12/km'}\n` +
      `*Payment Mode:* ${paymentMethod.toUpperCase()}\n\n` +
      `*Items:*\n${itemsList}\n\n` +
      `*Note:* Item prices to be decided by captain.\n\n` +
      `🕒 *Status:* Dispatched to Kitchen`
    );

    window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank');

    const newOrder = {
      id: orderId,
      shopName: shopName.trim(),
      stallName: cartItems[0]?.stallName || shopName.trim(),
      items: cartItems.map((i: any) => `${i.name} (${i.quantity}x)`).join(', '),
      total: 0,
      status: 'Preparing in Kitchen',
      time: 'Just now',
      pickupAddress: pickupAddress.trim(),
      dropAddress: dropAddress.trim(),
      landmark: landmark.trim(),
      paymentMethod: paymentMethod.toUpperCase(),
      deliveryRate: isDayTime ? '₹10/km (Day)' : '₹12/km (Night)',
    };

    addOrder(newOrder);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      clearCart();
      setShopName('');
      setPickupAddress('');
      setDropAddress('');
      setLandmark('');
      onClose();
    }, 2000);
  };

  const autoFillFromCart = () => {
    if (cartItems.length > 0) {
      const first = cartItems[0];
      if (first.stallName && !shopName) setShopName(first.stallName);
      if (first.stallLocation && !pickupAddress) setPickupAddress(first.stallLocation);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">

        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black text-white">Your Cart Drawer</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!canOrder && (
          <div className="mx-6 mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center space-x-2 text-rose-400 text-xs">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="font-bold">Orders are closed. Captain DB accepts orders only from 10:00 AM to 11:30 PM.</span>
          </div>
        )}

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
              {/* Cart Items */}
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-black uppercase text-slate-400">Selected Items ({cartItems.length})</span>
                <button onClick={clearCart} className="text-xs text-red-400 hover:underline flex items-center space-x-1 cursor-pointer">
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              </div>

              {cartItems.map((item: any, idx: number) => (
                <div key={`${item.id}-${item.customDetails}-${idx}`} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-slate-900" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">{item.stallName}</span>
                    <h4 className="text-xs font-black text-white truncate">{item.name}</h4>
                    {item.customDetails && <span className="text-[10px] text-slate-400 block">{item.customDetails}</span>}
                    <span className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider">Price decided by captain</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center cursor-pointer">-</button>
                    <span className="w-5 text-center text-xs font-black">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center cursor-pointer">+</button>
                  </div>
                </div>
              ))}

              {/* Shop & Location Details */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-300">Shop & Delivery Details</span>
                  {cartItems[0]?.stallName && (
                    <button
                      onClick={autoFillFromCart}
                      className="text-[10px] text-teal-400 hover:text-teal-300 font-bold cursor-pointer"
                    >
                      Auto-fill from cart
                    </button>
                  )}
                </div>

                {/* Shop Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-amber-400" />
                    Shop Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shri Gopal Chaat Bhandar"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                </div>

                {/* Pickup Address */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    Pickup Address (Shop Location)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter shop address, area in Meerut..."
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                  {pickupAddress.trim() && (
                    <a
                      href={mapsLink(`${shopName}, ${pickupAddress}, Meerut`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[11px] text-teal-400 hover:text-teal-300 font-bold cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Open pickup location in Google Maps</span>
                    </a>
                  )}
                </div>

                {/* Drop Address */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    Delivery Address (Drop Location)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your house no, street, area..."
                    value={dropAddress}
                    onChange={(e) => setDropAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-teal-500 outline-none"
                  />
                  {dropAddress.trim() && (
                    <a
                      href={mapsLink(`${dropAddress}, ${landmark ? landmark + ', ' : ''}Meerut`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[11px] text-teal-400 hover:text-teal-300 font-bold cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Open drop location in Google Maps</span>
                    </a>
                  )}
                </div>

                {/* Landmark */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                    <Flag className="w-3.5 h-3.5 text-amber-400" />
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near Begum Bridge, opposite City Mall..."
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300 block">Payment Method</label>
                <div className="grid grid-cols-1 gap-2">
                  {availablePayments.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer transition-all ${
                        paymentMethod === pm.id
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {pm.id === 'upi' ? <QrCode className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                      <span>{pm.label}</span>
                    </button>
                  ))}
                </div>

                {!isDayTime && (
                  <p className="text-[10px] text-amber-400/80 font-bold">
                    Night orders (6 PM - 10 AM): Only UPI payment is available.
                  </p>
                )}
                {isDayTime && (
                  <p className="text-[10px] text-slate-500 font-bold">
                    Day orders (10 AM - 6 PM): Both COD and UPI are available.
                  </p>
                )}

                {paymentMethod === 'upi' && (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-2">
                    <div className="w-36 h-36 bg-white rounded-xl mx-auto p-2 flex items-center justify-center">
                      <img src={QR_CODE_URL} alt="UPI QR Code" className="w-full h-full rounded-lg" />
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold block">Scan QR code using GPay/PhonePe/Paytm</span>
                  </div>
                )}
              </div>

              {/* Delivery Rate */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-black text-amber-400 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Delivery Rate</span>
                </div>
                <p className="text-xs text-slate-300 font-bold">
                  {isDayTime ? 'Day Rate (10 AM - 6 PM): ₹10/km' : 'Night Rate (6 PM - 10 AM): ₹12/km'}
                </p>
                <p className="text-[10px] text-slate-500">Final delivery charge calculated by captain based on distance.</p>
              </div>
            </>
          )}
        </div>

        {cartItems.length > 0 && !isSuccess && (
          <div className="p-6 border-t border-slate-800 space-y-4 bg-slate-900">
            <div className="text-center text-[11px] text-slate-400 font-bold">
              Item prices and delivery fee will be decided by Captain DB.
            </div>

            {canOrder ? (
              <button
                onClick={handleWhatsAppDispatch}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Order via WhatsApp</span>
              </button>
            ) : (
              <div className="w-full py-4 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-2xl font-black text-xs text-center">
                Ordering closed - Available 10:00 AM to 11:30 PM only
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
