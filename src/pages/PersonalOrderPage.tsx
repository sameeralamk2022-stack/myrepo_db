import React, { useState } from 'react';
import {
  ArrowLeft, Plus, Trash2, Send, CheckCircle, MapPin, Navigation,
  Store, Flag, QrCode, Clock, ShoppingBag, Utensils, Crosshair, Loader2, X
} from 'lucide-react';
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

interface PersonalOrderPageProps {
  onBack: () => void;
  onProceedToOrders: () => void;
}

export function PersonalOrderPage({ onBack, onProceedToOrders }: PersonalOrderPageProps) {
  const { addOrder, profile } = useApp();
  const [items, setItems] = useState([{ id: '1', name: '', quantity: 1, notes: '' }]);
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

  const canOrder = isWithinOperatingHours();
  const { isDayTime } = getDeliveryRate();

  const availablePayments = isDayTime
    ? [{ id: 'cod' as const, label: 'Cash on Delivery' }, { id: 'upi' as const, label: 'UPI QR Pay' }]
    : [{ id: 'upi' as const, label: 'UPI QR Pay' }];

  const addItem = () => {
    setItems(prev => [...prev, { id: String(Date.now()), name: '', quantity: 1, notes: '' }]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.length > 1 ? prev.filter(i => i.id !== id) : prev);
  };

  const updateItem = (id: string, field: 'name' | 'quantity' | 'notes', value: string | number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus({ type: 'error', msg: 'GPS is not supported on this device.' });
      return;
    }
    setDetecting(true);
    setGpsStatus({ type: '', msg: '' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const mapUrl = `https://www.google.com/maps?q=${latitude.toFixed(6)},${longitude.toFixed(6)}&z=16`;
        setDropAddress(mapUrl);
        setGpsStatus({ type: 'success', msg: `Location detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
        setDetecting(false);
      },
      (err) => {
        let msg = 'Could not detect your location. Please enter the address manually.';
        if (err.code === 1) msg = 'Permission denied. Please allow location access in your browser settings.';
        if (err.code === 2) msg = 'Position unavailable. Check your GPS or network connection.';
        if (err.code === 3) msg = 'Location request timed out. Please try again.';
        setGpsStatus({ type: 'error', msg });
        setDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSubmit = () => {
    if (!canOrder) {
      alert('Orders are only accepted between 10:00 AM and 11:00 PM.');
      return;
    }
    if (!shopName.trim()) { alert('Please enter the shop name.'); return; }
    if (!pickupAddress.trim()) { alert('Please enter the pickup address.'); return; }
    if (!dropAddress.trim()) { alert('Please enter the delivery (drop) address.'); return; }

    const validItems = items.filter(i => i.name.trim());
    if (validItems.length === 0) { alert('Please add at least one item.'); return; }

    const orderId = `MB-${Math.floor(100000 + Math.random() * 900000)}`;
    const itemsList = validItems.map(i =>
      `• ${i.name} (${i.quantity}x)${i.notes ? ` [${i.notes}]` : ''}`
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
      stallName: shopName.trim(),
      items: validItems.map(i => `${i.name} (${i.quantity}x)`).join(', '),
      total: 0,
      status: 'Preparing in Kitchen',
      time: 'Just now',
      pickupAddress: pickupAddress.trim(),
      dropAddress: dropAddress.trim(),
      landmark: landmark.trim(),
      zone: zone.trim(),
      paymentMethod: paymentLabel,
      deliveryRate: isDayTime ? '₹10/km (Day)' : '₹12/km (Night)',
      isPersonalOrder: true,
      customerName: profile?.name || 'Guest',
      customerPhone: profile?.phone || '',
    };

    addOrder(newOrder);
    setBookedOrderId(orderId);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setBookedOrderId('');
      onProceedToOrders();
    }, 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6 bg-slate-950 min-h-screen text-white">
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs font-bold text-teal-400 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="border-b border-slate-800 pb-6">
          <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
            Personal Order
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">Order from Any Shop</h2>
          <p className="text-xs text-slate-400 mt-1">
            Ordering from a shop not listed on Meerut Bites? Enter the details below and Captain DB will pick it up for you.
          </p>
        </div>

        {isSuccess ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-xl font-black text-white">Order Booked Successfully!</h3>
            <div className="inline-block px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <span className="text-xs font-black text-amber-400">Order ID: #{bookedOrderId}</span>
            </div>
            <p className="text-xs text-slate-400">Sent to Captain D via WhatsApp. Redirecting to Orders...</p>
          </div>
        ) : (
          <>
            {!canOrder && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center space-x-2 text-rose-400 text-xs">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold">Orders are closed. Captain DB accepts orders only from 10:00 AM to 11:00 PM.</span>
              </div>
            )}

            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-teal-400" />
                  Items to Order
                </h3>
                <button
                  onClick={addItem}
                  className="flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              {items.map((item, idx) => (
                <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Item {idx + 1}</span>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Item name (e.g. Veg Burger, Cold Coffee...)"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 outline-none"
                  />
                  <div className="flex gap-3">
                    <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
                      <button
                        onClick={() => updateItem(item.id, 'quantity', Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center cursor-pointer"
                      >-</button>
                      <span className="w-6 text-center text-xs font-black">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.id, 'quantity', item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center cursor-pointer"
                      >+</button>
                    </div>
                    <input
                      type="text"
                      placeholder="Notes (e.g. less sugar, extra spicy...)"
                      value={item.notes}
                      onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Shop & Location Details */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-300">Shop & Delivery Details</h3>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-teal-400" />
                  Shop Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sharma Juice Center"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-teal-500 outline-none"
                />
              </div>

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
                    <span>Open pickup in Google Maps</span>
                  </a>
                )}
              </div>

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
                    <span>Open drop in Google Maps</span>
                  </a>
                )}
              </div>

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
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 block">Payment Method</label>
              <div className="grid grid-cols-1 gap-2">
                {availablePayments.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer transition-all ${
                      paymentMethod === pm.id
                        ? 'bg-teal-500/10 border-teal-500 text-teal-400'
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
                  <span className="text-[10px] text-teal-400 font-bold block">Scan QR code using GPay/PhonePe/Paytm</span>
                </div>
              )}
            </div>

            {/* Delivery Rate & Policy */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-black text-teal-400 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Delivery Rate</span>
              </div>
              <p className="text-xs text-slate-300 font-bold">
                {isDayTime ? 'Day Rate (10 AM - 6 PM): ₹10/km' : 'Night Rate (6 PM - 11 PM): ₹12/km'}
              </p>
              <p className="text-[10px] text-slate-500">{SECURITY_DISCLAIMER}</p>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="text-center text-[11px] text-slate-400 font-bold">
                Item prices and delivery fee will be decided by Captain DB.
              </div>
              {canOrder ? (
                <button
                  onClick={handleSubmit}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch Personal Order via WhatsApp</span>
                </button>
              ) : (
                <div className="w-full py-4 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-2xl font-black text-xs text-center">
                  Ordering closed - Available 10:00 AM to 11:00 PM only
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PersonalOrderPage;
