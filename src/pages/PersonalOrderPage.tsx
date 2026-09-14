import React, { useState } from 'react';
import {
  ArrowLeft, Plus, Trash2, Send, CheckCircle, MapPin, Navigation,
  Store, Flag, QrCode, Clock, ShoppingBag, Utensils, LocateFixed, Loader2
} from 'lucide-react';
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

interface PersonalOrderPageProps {
  onBack: () => void;
  onProceedToOrders: () => void;
}

export function PersonalOrderPage({ onBack, onProceedToOrders }: PersonalOrderPageProps) {
  const { addOrder } = useApp();
  const [items, setItems] = useState([{ id: '1', name: '', quantity: 1, notes: '' }]);
  const [shopName, setShopName] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState<'pickup' | 'drop' | null>(null);

  const detectCurrentLocation = (target: 'pickup' | 'drop') => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(target);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=\({latitude}&lon=\){longitude}`
          );
          const data = await res.json();
          const fetchedAddress = data.display_name || `\({latitude},\){longitude}`;

          if (target === 'pickup') {
            setPickupAddress(fetchedAddress);
          } else {
            setDropAddress(fetchedAddress);
          }
        } catch {
          alert('Failed to retrieve address details. Please try again or type manually.');
        } finally {
          setIsDetectingLocation(null);
        }
      },
      (error) => {
        setIsDetectingLocation(null);
        alert(`Location permission denied or unavailable: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

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

  const handleSubmit = () => {
    if (!canOrder) {
      alert('Orders are only accepted between 10:00 AM and 11:30 PM.');
      return;
    }
    if (!shopName.trim()) { alert('Please enter the shop name.'); return; }
    if (!pickupAddress.trim()) { alert('Please enter the pickup address.'); return; }
    if (!dropAddress.trim()) { alert('Please enter the delivery (drop) address.'); return; }

    const validItems = items.filter(i => i.name.trim());
    if (validItems.length === 0) { alert('Please add at least one item.'); return; }

    const orderId = `MB-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsList = validItems.map(i =>
      `• \({i.name} (\){i.quantity}x)\({i.notes ? ` [\){i.notes}]` : ''}`
    ).join('\n');

    const pickupMaps = mapsLink(`\({shopName},\){pickupAddress}, Meerut`);
    const dropMaps = mapsLink(`\({dropAddress},\){landmark ? landmark + ', ' : ''}Meerut`);

    const whatsappMessage = encodeURIComponent(
      `🛍️ *NEW PERSONAL ORDER* (#${orderId})\n\n` +
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
      stallName: shopName.trim(),
      items: validItems.map(i => `\({i.name} (\){i.quantity}x)`).join(', '),
      total: 0,
      status: 'Preparing in Kitchen',
      time: 'Just now',
      pickupAddress: pickupAddress.trim(),
      dropAddress: dropAddress.trim(),
      landmark: landmark.trim(),
      paymentMethod: paymentMethod.toUpperCase(),
      deliveryRate: isDayTime ? '₹10/km (Day)' : '₹12/km (Night)',
      isPersonalOrder: true,
    };

    addOrder(newOrder);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onProceedToOrders();
    }, 2000);
  };

  return (