import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, Send, QrCode, Clock, MapPin, Navigation, Store, Flag, CheckCircle, Crosshair, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { QR_CODE_URL, WHATSAPP_NUMBER, SECURITY_DISCLAIMER } from '@/lib/constants';

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
  return totalMinutes >= 600 && totalMinutes < 1380;
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
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, clearCart, addOrder, profile, setProfile } = useApp();
  const [shopName, setShopName] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [zone, setZone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedOrderId, setBookedOrderId] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<{ type: 'success' | 'error' | ''; msg: string }>({ type: '', msg: '' });
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  if (!isCartOpen) return null;

  const onClose = () => setIsCartOpen(false);
  const cartItems = cart;
  const canOrder = isWithinOperatingHours();
  const { isDayTime } = getDeliveryRate();

  const availablePayments = isDayTime
    ? [{ id: 'cod' as const, label: 'Cash on Delivery' }, { id: 'upi' as const, label: 'UPI QR Pay' }]
    : [{ id: 'upi' as const, label: 'UPI QR Pay' }];

  const detectLocation = () => {
    setShowLocationModal(true);
  };

  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      setGpsStatus({ type: 'error', msg: 'GPS is not supported on this device.' });
      setShowLocationModal(false);
      return;
    }
    setDetecting(true);
    setGpsStatus({ type: '', msg: '' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const mapUrl = `https://www.google.com/maps?q=${latitude.toFixed(6)},${longitude.toFixed(6)}&z=16`;
        setDropAddress(mapUrl);
        setGpsCoords({ lat: latitude, lng: longitude });
        setGpsStatus({ type: 'success', msg: `Location detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
        setDetecting(false);
        setShowLocationModal(false);
      },
      (err) => {
        let msg = 'Could not detect your location. Please enter the address manually.';
        if (err.code === 1) msg = 'Location permission denied. Tap the lock/icon in your browser address bar, select Allow for Location, then try again.';
        if (err.code === 2) msg = 'Position unavailable. Check your GPS or network connection.';
        if (err.code === 3) msg = 'Location request timed out. Please try again.';
        setGpsStatus({ type: 'error', msg });
        setDetecting(false);
        setShowLocationModal(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleWhatsAppDispatch = () => {
    if (cartItems.length === 0) return;
    if (!canOrder) {
      alert('Orders are only accepted between 10:00 AM and 11:00 PM.');
      return;
    }
    if (!profile?.name || !profile?.phone) {
      const enteredName = prompt('Enter your full name to confirm this order:');
      if (!enteredName || !enteredName.trim()) return;
      const enteredPhone = prompt('Enter your phone number (at least 10 digits):');
      if (!enteredPhone || enteredPhone.replace(/\D/g, '').length < 10) {
        alert('A valid phone number is required to confirm your order.');
        return;
      }
      setProfile({ name: enteredName.trim(), phone: enteredPhone.trim() });
      alert('Details saved! Tap "Dispatch Order via WhatsApp" again to send your order.');
      return;
    }
    if (!shopName.trim()) { alert('Please enter the shop name.'); return; }
    if (!pickupAddress.trim()) { alert('Please enter the pickup address.'); return; }
    if (!dropAddress.trim()) { alert('Please enter the delivery (drop) address.'); return; }

    const orderId = `MB-${Math.floor(100000 + Math.random() * 900000)}`;
    const itemsList = cartItems.map((i: any) =>
      `• ${i.name} (${i.quantity}x)${i.customDetails ? ` [${i.customDetails}]` : ''}`
    ).join('\n');

    const pickupMaps = mapsLink(`${shopName}, ${pickupAddress}, Meerut`);
    const dropMaps = mapsLink(`${dropAddress}, ${landmark ? landmark + ', ' : ''}${zone ? zone + ', ' : ''}Meerut`);

    const paymentLabel = paymentMethod === 'cod' ? 'COD' : 'UPI';

    const whatsappMessage = encodeURIComponent(
      `*NEW MEERUT BITES ORDER*\n` +
      `----------------------------------\n` +
      `🆔 Order ID: #${orderId}\n` +
      `👤 Customer: ${profile?.name || 'Guest'}\n` +
      `📞 Phone: ${profile?.phone || 'Not provided'}\n` +
      `📍 Zone: ${zone || 'Meerut'}\n` +
      `----------------------------------\n` +
      `🛒 *Items:*\n${itemsList}\n` +
      `💳 *Payment:* ${paymentLabel}\n` +
      `----------------------------------\n` +
      `🏪 Shop: ${shopName}\n` +
      `📍 Pickup: ${pickupAddress}\n` +
      `🗺️ Pickup Maps: ${pickupMaps}\n` +
      `📍 Drop: ${dropAddress}\n` +
      (landmark.trim() ? `🚩 Landmark: ${landmark}\n` : '') +
      `🗺️ Drop Maps: ${dropMaps}\n` +
      (gpsCoords ? `📍 GPS Coordinates: ${gpsCoords.lat.toFixed(6)}, ${gpsCoords.lng.toFixed(6)}\n` : '') +
      `----------------------------------\n` +
      `📦 *Rates:* ₹10/km (10AM-6PM) | ₹12/km (6PM-11PM)\n` +
      `⚠️ *Policy:* No illegal items.\n` +
      `----------------------------------\n` +
      `Please confirm & dispatch!`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`, '_blank');

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
      zone: zone.trim(),
      paymentMethod: paymentLabel,
      deliveryRate: isDayTime ? '₹10/km (Day)' : '₹12/km (Night)',
      customerName: profile?.name || 'Guest',
      customerPhone: profile?.phone || '',
    };

    addOrder(newOrder);
    setBookedOrderId(orderId);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      clearCart();
      setShopName('');
      setPickupAddress('');
      setDropAddress('');
      setLandmark('');
      setZone('');
      setBookedOrderId('');
      onClose();
    }, 3000);
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
            <span className="font-bold">Orders are closed. Captain DB accepts orders only from 10:00 AM to 11:00 PM.</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isSuccess ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-xl font-black text-white">Order Booked Successfully!</h3>
              <div className="inline-block px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <span className="text-xs font-black text-amber-400">Order ID: #{bookedOrderId}</span>
              </div>
              <p className="text-xs text-slate-400">Sent to Captain D via WhatsApp. Redirecting...</p>
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

                {/* Drop Address with Detect Location */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" />
                      Delivery Address (Drop Location)
                    </label>
                    <button
                      onClick={detectLocation}
                      disabled={detecting}
                      className="flex items-center gap-1 text-[10px] font-bold text-teal-400 hover:text-teal-300 cursor-pointer disabled:opacity-50"
                    >
                      {detecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Crosshair className="w-3 h-3" />}
                      <span>{detecting ? 'Detecting...' : 'Detect My Location'}</span>
                    </button>
                  </div>
                  {gpsStatus.type === 'success' && (
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[10px] text-emerald-400 font-bold">{gpsStatus.msg}</span>
                    </div>
                  )}
                  {gpsCoords && (
                    <a
                      href={`https://www.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lng}&z=18`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[10px] text-teal-400 hover:text-teal-300 font-bold cursor-pointer"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>View precise GPS location on map</span>
                    </a>
                  )}
                  {gpsStatus.type === 'error' && (
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                      <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span className="text-[10px] text-red-400 font-bold">{gpsStatus.msg}</span>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Enter your house no, street, area..."
                    value={dropAddress}
                    onChange={(e) => setDropAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-teal-500 outline-none"
                  />
                  {dropAddress.trim() && (
                    <a
                      href={mapsLink(`${dropAddress}, ${landmark ? landmark + ', ' : ''}${zone ? zone + ', ' : ''}Meerut`)}
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

                {/* Zone */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    Zone / Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Meerut Cantt, Civil Lines, Abu Lane..."
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-teal-500 outline-none"
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
                    Night orders (6 PM - 11 PM): Only UPI payment is available.
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
                  {isDayTime ? 'Day Rate (10 AM - 6 PM): ₹10/km' : 'Night Rate (6 PM - 11 PM): ₹12/km'}
                </p>
                <p className="text-[10px] text-slate-500">{SECURITY_DISCLAIMER}</p>
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
                Ordering closed - Available 10:00 AM to 11:00 PM only
              </div>
            )}
          </div>
        )}
      </div>

      {/* Location Permission Popup */}
      {showLocationModal && (
        <div className="fixed inset-0 z-[70] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => !detecting && setShowLocationModal(false)}>
          <div
            className="bg-slate-900 border border-teal-500/30 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center">
                <Crosshair className="w-7 h-7 text-teal-400" />
              </div>
              <h3 className="text-sm font-black text-white">Allow Location Access?</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                We need your location to auto-fill your delivery address and send precise GPS coordinates to the delivery captain. This helps them find you quickly.
              </p>
            </div>

            {gpsStatus.type === 'error' && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <p className="text-[10px] text-amber-400 font-bold leading-relaxed">{gpsStatus.msg}</p>
                <div className="text-[10px] text-slate-400 leading-relaxed">
                  <p className="font-bold text-slate-300 mb-1">How to re-enable:</p>
                  <p>1. Tap the lock or location icon in your browser's address bar</p>
                  <p>2. Change \"Location\" to \"Allow\"</p>
                  <p>3. Refresh the page and try again</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowLocationModal(false)}
                disabled={detecting}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={requestLocationPermission}
                disabled={detecting}
                className="flex-1 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-black cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {detecting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Detecting...</> : <><Crosshair className="w-3.5 h-3.5" /> Allow</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartDrawer;
