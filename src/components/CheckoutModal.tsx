import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2, ShieldCheck, ShieldAlert, Banknote, Smartphone, Navigation, MapPin, Receipt, Copy, Check, Clock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '@/context/AppContext';
import { UPI_ID, DEMO_OTP, SECURITY_DISCLAIMER } from '@/lib/constants';
import {
  generateOrderId, generateDeliveryOtp, buildWhatsAppMessage, buildWhatsAppLink, isOpenNow,
  getAvailablePaymentMethods, getPaymentWindowLabel, haversineDistance,
  calculateDeliveryCharge, extractCoordsFromMapUrl, formatTimeRange,
} from '@/lib/utils';
import type { Order, PaymentMethod } from '@/types';
import { LocationPicker } from './LocationPicker';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onOrderPlaced: (order: Order) => void;
}

type Step = 'details' | 'review' | 'payment' | 'otp' | 'success';

export function CheckoutModal({ open, onClose, onOrderPlaced }: CheckoutModalProps) {
  const { cart, clearCart, profile, setProfile, userName } = useApp();
  const [step, setStep] = useState<Step>('details');
  const [name, setName] = useState(userName || profile.name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [gpsLocation, setGpsLocation] = useState('');
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [orderId, setOrderId] = useState('');
  const [deliveryOtp, setDeliveryOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const availablePayments = getAvailablePaymentMethods();
  const distance = gpsCoords ? haversineDistance(29.0452, 77.7052, gpsCoords.lat, gpsCoords.lng) : 0;
  const deliveryCharge = calculateDeliveryCharge(distance, itemsTotal);
  const grandTotal = itemsTotal + deliveryCharge;

  const canProceedDetails = name.trim() && phone.trim() && pickupAddress.trim() && deliveryAddress.trim();

  const detectGPS = () => {
    setDetectingGps(true);
    setGpsError('');
    if (!navigator.geolocation) {
      setGpsError('GPS not available on this device.');
      setDetectingGps(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const mapUrl = `https://maps.google.com/?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`;
        setGpsLocation(mapUrl);
        setGpsCoords({ lat: latitude, lng: longitude });
        setDetectingGps(false);
      },
      (err) => {
        setGpsError(err.message || 'Could not detect location.');
        setDetectingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleProceedToReview = () => {
    setProfile((prev) => ({ ...prev, name: name.trim(), phone: phone.trim() }));
    setStep('review');
  };

  const handleProceedToPayment = () => {
    if (!availablePayments.includes(paymentMethod)) {
      setPaymentMethod(availablePayments[0]);
    }
    setStep('payment');
  };

  const handleConfirmPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 800);
  };

  const handleVerifyOtp = () => {
    if (otpInput.trim() === DEMO_OTP) {
      setOtpError('');
      const id = generateOrderId();
      const otp = generateDeliveryOtp();
      setOrderId(id);
      setDeliveryOtp(otp);
      const order: Order = {
        id,
        items: cart,
        customerName: name.trim(),
        phone: phone.trim(),
        pickupAddress,
        deliveryAddress,
        landmark: landmark.trim(),
        gpsLocation: gpsLocation || 'Not provided',
        distance,
        deliveryCharge,
        itemsTotal,
        grandTotal,
        paymentMethod,
        deliveryOtp: otp,
        status: 'Requested',
        createdAt: Date.now(),
      };
      onOrderPlaced(order);
      setStep('success');
    } else {
      setOtpError('Invalid OTP. Use 1234 for demo.');
    }
  };

  const handleSendWhatsApp = () => {
    const msg = buildWhatsAppMessage({
      id: orderId,
      items: cart,
      customerName: name,
      phone,
      pickupAddress,
      deliveryAddress,
      landmark,
      gpsLocation: gpsLocation || 'Not provided',
      distance,
      deliveryCharge,
      grandTotal,
      paymentMethod,
      deliveryOtp,
    });
    window.open(buildWhatsAppLink(msg), '_blank');
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleClose = () => {
    if (step === 'success') {
      clearCart();
      setStep('details');
      setOtpInput('');
      setOrderId('');
      setDeliveryOtp('');
      setPickupAddress('');
      setDeliveryAddress('');
      setLandmark('');
      setGpsLocation('');
      setGpsCoords(null);
    }
    onClose();
  };

  const upiPayUrl = `upi://pay?pa=${UPI_ID}&pn=Meerut%20Bites&am=${grandTotal.toFixed(2)}&cu=INR`;

  const steps: Step[] = ['details', 'review', 'payment', 'otp', 'success'];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-white/10 shadow-2xl my-auto"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step indicator */}
            <div className="flex items-center gap-2 p-4 border-b border-white/10">
              {steps.map((s) => {
                const currentIdx = steps.indexOf(step);
                const thisIdx = steps.indexOf(s);
                const active = thisIdx <= currentIdx;
                return (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${active ? 'bg-saffron-500' : 'bg-white/10'}`}
                  />
                );
              })}
            </div>

            {/* Business hours check */}
            {!isOpenNow() && step !== 'success' && (
              <div className="m-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm font-medium">
                  Orders closed. Service hours: {formatTimeRange()}
                </p>
              </div>
            )}

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* STEP: DETAILS */}
              {step === 'details' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-white">Customer Details</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name *"
                      className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-saffron-500"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number *"
                      className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-saffron-500"
                    />
                  </div>

                  <LocationPicker
                    addresses={profile.addresses}
                    onAdd={(addr) => setProfile((prev) => ({ ...prev, addresses: [...prev.addresses, addr] }))}
                    onRemove={(id) => setProfile((prev) => ({ ...prev, addresses: prev.addresses.filter((a) => a.id !== id) }))}
                    selected={pickupAddress}
                    onSelect={setPickupAddress}
                    label="Pickup Address (stall location) *"
                  />

                  <LocationPicker
                    addresses={profile.addresses}
                    onAdd={(addr) => setProfile((prev) => ({ ...prev, addresses: [...prev.addresses, addr] }))}
                    onRemove={(id) => setProfile((prev) => ({ ...prev, addresses: prev.addresses.filter((a) => a.id !== id) }))}
                    selected={deliveryAddress}
                    onSelect={setDeliveryAddress}
                    label="Home Delivery Address *"
                  />

                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Landmark (e.g. near Shastri Nagar park)"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-saffron-500"
                  />

                  {/* GPS Detection */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-saffron-400" />
                      <p className="text-white text-sm font-medium">Detect My Location (GPS)</p>
                    </div>
                    <button
                      onClick={detectGPS}
                      disabled={detectingGps}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-saffron-600/20 border border-saffron-600/40 text-saffron-300 text-sm font-medium hover:bg-saffron-600/30 transition-colors active:scale-95 disabled:opacity-50"
                    >
                      {detectingGps ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Detecting...</>
                      ) : (
                        <><Navigation className="w-4 h-4" /> Detect My Location</>
                      )}
                    </button>
                    {gpsError && <p className="text-red-400 text-xs">{gpsError}</p>}
                    {gpsLocation && (
                      <div className="flex items-center gap-2 text-xs text-green-400">
                        <Check className="w-3.5 h-3.5" />
                        <span>Location detected: {gpsCoords?.lat.toFixed(4)}, {gpsCoords?.lng.toFixed(4)}</span>
                      </div>
                    )}
                    {gpsLocation && (
                      <a
                        href={gpsLocation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-saffron-400 text-xs hover:text-saffron-300"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        View on Google Maps
                      </a>
                    )}
                  </div>

                  <button
                    onClick={handleProceedToReview}
                    disabled={!canProceedDetails || !isOpenNow()}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-700 text-white font-semibold disabled:opacity-50 hover:shadow-lg hover:shadow-saffron-700/30 transition-all active:scale-95"
                  >
                    {isOpenNow() ? 'Review Order' : 'Orders Closed'}
                  </button>
                </div>
              )}

              {/* STEP: REVIEW */}
              {step === 'review' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-white">Order Review</h2>

                  {/* Items */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-2">
                    <p className="text-slate-400 text-xs font-medium">Items</p>
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-white">{item.dishName}</span>
                          <span className="text-slate-500 ml-1.5">x{item.quantity}</span>
                        </div>
                        <span className="text-white font-medium">Rs.{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Addresses */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-saffron-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-400 text-xs">Pickup</p>
                        <p className="text-white text-sm">{pickupAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-saffron-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-400 text-xs">Delivery</p>
                        <p className="text-white text-sm">{deliveryAddress}</p>
                        {landmark && <p className="text-slate-500 text-xs mt-0.5">Landmark: {landmark}</p>}
                      </div>
                    </div>
                    {gpsLocation && (
                      <div className="flex items-center gap-2">
                        <Navigation className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        <a href={gpsLocation} target="_blank" rel="noopener noreferrer" className="text-green-400 text-xs hover:text-green-300">
                          GPS Location on Google Maps
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Charges breakdown */}
                  <div className="rounded-xl bg-saffron-600/10 border border-saffron-600/30 p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Items Total</span>
                      <span className="text-white font-medium">Rs.{itemsTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">
                        Distance
                        {distance > 0 && <span className="text-slate-500 ml-1">({distance.toFixed(1)} km)</span>}
                      </span>
                      <span className="text-white font-medium">{distance > 0 ? `${distance.toFixed(1)} km` : 'GPS needed'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Delivery Charge</span>
                      <span className="text-white font-medium">
                        {deliveryCharge === 0 ? <span className="text-green-400">FREE</span> : `Rs.${deliveryCharge}`}
                      </span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between">
                      <span className="text-white font-bold">Grand Total</span>
                      <span className="text-saffron-400 font-bold text-lg">Rs.{grandTotal}</span>
                    </div>
                  </div>

                  {!gpsLocation && (
                    <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-amber-400 text-xs">
                        Tip: Go back and detect your GPS location for accurate distance and delivery charge calculation.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep('details')}
                      className="px-4 py-3 rounded-xl bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleProceedToPayment}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-700 text-white font-semibold hover:shadow-lg hover:shadow-saffron-700/30 transition-all active:scale-95"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* STEP: PAYMENT */}
              {step === 'payment' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-white">Payment Method</h2>

                  {/* Payment window info */}
                  <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-3 flex items-start gap-2">
                    <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-blue-400 text-xs">{getPaymentWindowLabel()}</p>
                  </div>

                  {/* Amount to pay */}
                  <div className="rounded-xl bg-saffron-600/10 border border-saffron-600/30 p-4 text-center">
                    <p className="text-slate-400 text-xs">Amount to Pay</p>
                    <p className="text-saffron-400 font-bold text-3xl">Rs.{grandTotal}</p>
                  </div>

                  {/* Payment options */}
                  <div className="space-y-2">
                    {availablePayments.includes('Cash') && (
                      <button
                        onClick={() => setPaymentMethod('Cash')}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all active:scale-95 ${
                          paymentMethod === 'Cash'
                            ? 'bg-saffron-600/20 border-saffron-600/50'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-saffron-500/20 flex items-center justify-center">
                          <Banknote className="w-5 h-5 text-saffron-400" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-white font-medium text-sm">Cash (Hand-to-Hand)</p>
                          <p className="text-slate-500 text-xs">Pay cash when order is delivered</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'Cash' ? 'border-saffron-500 bg-saffron-500' : 'border-slate-600'}`} />
                      </button>
                    )}

                    {availablePayments.includes('UPI') && (
                      <button
                        onClick={() => setPaymentMethod('UPI')}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all active:scale-95 ${
                          paymentMethod === 'UPI'
                            ? 'bg-saffron-600/20 border-saffron-600/50'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-white font-medium text-sm">UPI Payment</p>
                          <p className="text-slate-500 text-xs">Scan QR or pay to {UPI_ID}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'UPI' ? 'border-saffron-500 bg-saffron-500' : 'border-slate-600'}`} />
                      </button>
                    )}
                  </div>

                  {/* UPI QR Code */}
                  {paymentMethod === 'UPI' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="rounded-xl bg-white/5 border border-saffron-500/20 p-4 text-center space-y-3"
                    >
                      <p className="text-saffron-300 text-sm font-medium">Scan to pay Rs.{grandTotal}</p>
                      <div className="flex justify-center">
                        <div className="rounded-xl bg-white p-3 shadow-lg">
                          <QRCodeSVG value={upiPayUrl} size={180} level="M" bgColor="#ffffff" fgColor="#000000" />
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-white font-mono text-sm">{UPI_ID}</span>
                        <button onClick={copyUpi} className="text-saffron-400 hover:text-saffron-300">
                          {copiedUpi ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Security disclaimer */}
                  <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-3 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-red-400/80 text-xs">{SECURITY_DISCLAIMER}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep('review')}
                      className="px-4 py-3 rounded-xl bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirmPayment}
                      disabled={loading}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-700 text-white font-semibold hover:shadow-lg hover:shadow-saffron-700/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Confirm & Verify OTP</>}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP: OTP */}
              {step === 'otp' && (
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-saffron-500/20 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-8 h-8 text-saffron-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">OTP Verification</h2>
                  <p className="text-slate-400 text-sm">
                    Enter the 4-digit OTP sent to your phone.<br />
                    <span className="text-saffron-400">Demo OTP: 1234</span>
                  </p>
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="• • • •"
                    maxLength={4}
                    className="w-32 mx-auto px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center text-2xl tracking-[0.5em] placeholder-slate-600 focus:outline-none focus:border-saffron-500"
                  />
                  {otpError && <p className="text-red-400 text-sm">{otpError}</p>}
                  <button
                    onClick={handleVerifyOtp}
                    disabled={otpInput.length !== 4}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-700 text-white font-semibold disabled:opacity-50 hover:shadow-lg hover:shadow-saffron-700/30 transition-all active:scale-95"
                  >
                    Verify & Place Order
                  </button>
                </div>
              )}

              {/* STEP: SUCCESS */}
              {step === 'success' && (
                <div className="space-y-4 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto"
                  >
                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white">Order Placed!</h2>
                  <p className="text-slate-400 text-sm">Your order has been received.</p>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2">
                    <div>
                      <p className="text-slate-400 text-xs">Order ID</p>
                      <p className="text-white font-mono text-lg font-bold">{orderId}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Total Paid ({paymentMethod})</p>
                      <p className="text-saffron-400 font-bold">Rs.{grandTotal}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Delivery OTP</p>
                      <p className="text-white font-mono text-lg font-bold tracking-widest">{deliveryOtp}</p>
                    </div>
                  </div>
                  <p className="text-amber-400 text-xs bg-amber-500/10 border border-amber-500/30 rounded-lg p-2">
                    Share this OTP with the delivery person to confirm delivery. Do NOT share it before you receive your order.
                  </p>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-slate-400 text-xs">Scan to verify your order</p>
                    <div className="rounded-xl bg-white p-3 shadow-lg">
                      <QRCodeSVG value={orderId} size={120} level="M" bgColor="#ffffff" fgColor="#000000" />
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs">
                    Save this Order ID for delivery verification.
                  </p>
                  <button
                    onClick={handleSendWhatsApp}
                    className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Receipt className="w-5 h-5" />
                    Share Order on WhatsApp
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-full py-2.5 rounded-xl bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
