export type StallCategory = 'North Indian' | 'Street Food' | 'Chinese' | 'Bakery';

export interface Stall {
  id: string;
  name: string;
  category: StallCategory;
  location: string;
  specialty: string;
  type: 'Street Thela';
  image: string;
  mapUrl: string;
  rating: number;
  popular: boolean;
}

export interface CartItem {
  id: string;
  stallId: string;
  stallName: string;
  dishName: string;
  quantity: number;
  price: number;
  instructions: string;
  isNonVeg: boolean;
}

export type OrderStatus =
  | 'Requested'
  | 'Accepted'
  | 'Picked Up'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'Cash' | 'UPI';

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  phone: string;
  pickupAddress: string;
  deliveryAddress: string;
  landmark: string;
  gpsLocation: string;
  distance: number;
  deliveryCharge: number;
  itemsTotal: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  deliveryOtp: string;
  status: OrderStatus;
  createdAt: number;
  rating?: number;
  feedback?: string;
}

export interface Address {
  id: string;
  label: string;
  text: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  addresses: Address[];
  pin: string | null;
  googleEmail: string | null;
}
