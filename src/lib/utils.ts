import { BUSINESS_HOURS, WHATSAPP_NUMBER, UPI_ONLY_START_HOUR, DELIVERY_BASE_CHARGE, DELIVERY_PER_KM, DELIVERY_FREE_THRESHOLD, DELIVERY_MIN_CHARGE, DELIVERY_MAX_CHARGE } from './constants';
import type { PaymentMethod } from '@/types';

export function generateOrderId(): string {
  const now = new Date();
  const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `MB-${ts}-${rand}`;
}

export function generateDeliveryOtp(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function isOpenNow(): boolean {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const start = BUSINESS_HOURS.start * 60 + BUSINESS_HOURS.startMinute;
  const end = BUSINESS_HOURS.end * 60 + BUSINESS_HOURS.endMinute;
  return current >= start && current <= end;
}

export function formatTimeRange(): string {
  return `${formatHour(BUSINESS_HOURS.start, BUSINESS_HOURS.startMinute)} - ${formatHour(BUSINESS_HOURS.end, BUSINESS_HOURS.endMinute)}`;
}

function formatHour(h: number, m: number): string {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

export function getAvailablePaymentMethods(): PaymentMethod[] {
  const now = new Date();
  const hour = now.getHours();
  if (hour >= UPI_ONLY_START_HOUR) {
    return ['UPI'];
  }
  return ['Cash', 'UPI'];
}

export function isCashAvailable(): boolean {
  return getAvailablePaymentMethods().includes('Cash');
}

export function isUpiAvailable(): boolean {
  return getAvailablePaymentMethods().includes('UPI');
}

export function getPaymentWindowLabel(): string {
  const now = new Date();
  const hour = now.getHours();
  if (hour >= UPI_ONLY_START_HOUR) {
    return `After 7 PM: UPI only`;
  }
  return `10 AM – 7 PM: Cash or UPI · 7 PM – 11 PM: UPI only`;
}

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateDeliveryCharge(distanceKm: number, itemsTotal: number): number {
  if (itemsTotal >= DELIVERY_FREE_THRESHOLD) return 0;
  const charge = DELIVERY_BASE_CHARGE + distanceKm * DELIVERY_PER_KM;
  return Math.round(Math.min(Math.max(charge, DELIVERY_MIN_CHARGE), DELIVERY_MAX_CHARGE));
}

export function extractCoordsFromMapUrl(url: string): { lat: number; lng: number } | null {
  const match = url.match(/q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (match) {
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  }
  return null;
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function buildWhatsAppMessage(order: {
  id: string;
  items: { dishName: string; quantity: number; price: number }[];
  customerName: string;
  phone: string;
  pickupAddress: string;
  deliveryAddress: string;
  landmark: string;
  gpsLocation: string;
  distance: number;
  deliveryCharge: number;
  grandTotal: number;
  paymentMethod: string;
  deliveryOtp?: string;
}): string {
  const itemsStr = order.items.map((i) => `${i.dishName} x${i.quantity} = Rs.${i.price * i.quantity}`).join('\n  ');
  return `*NEW ORDER #${order.id}*
*Items:*
  ${itemsStr}
*Items Total:* Rs.${order.items.reduce((s, i) => s + i.price * i.quantity, 0)}
*Distance:* ${order.distance.toFixed(1)} km
*Delivery Charge:* Rs.${order.deliveryCharge}
*Grand Total:* Rs.${order.grandTotal}
*Payment:* ${order.paymentMethod}
*Delivery OTP:* ${order.deliveryOtp || 'N/A'}

*Customer:* ${order.customerName} (${order.phone})
*Pickup:* ${order.pickupAddress}
*Delivery:* ${order.deliveryAddress}
*Landmark:* ${order.landmark || 'N/A'}
*GPS:* ${order.gpsLocation || 'Not provided'}`;
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
