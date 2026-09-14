import React, { createContext, useContext, useState, useEffect } from 'react';

interface Profile {
  name: string;
  phone: string;
  googleEmail?: string;
}

interface AppContextType {
  cart: any[];
  addToCart: (item: any, quantity?: number, customDetails?: string) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  orders: any[];
  addOrder: (order: any) => void;
  clearOrders: () => void;
  deleteOrder: (id: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  profile: Profile;
  setProfile: (profile: Profile | ((prev: Profile) => Profile)) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const saved = localStorage.getItem('mb_profile');
      return saved ? JSON.parse(saved) : { name: '', phone: '' };
    } catch {
      return { name: '', phone: '' };
    }
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mb_darkMode');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try { localStorage.setItem('mb_cart', JSON.stringify(cart)); } catch {}
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem('mb_profile', JSON.stringify(profile)); } catch {}
  }, [profile]);

  useEffect(() => {
    try { localStorage.setItem('mb_darkMode', JSON.stringify(darkMode)); } catch {}
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [darkMode]);

  const addToCart = (item: any, quantity?: number, customDetails?: string) => {
    setCart(prev => {
      const existing = prev.find(i => (i.id && i.id === item.id) || (i.cartKey && i.cartKey === item.cartKey));
      if (existing) {
        return prev.map(i =>
          ((i.id && i.id === item.id) || (i.cartKey && i.cartKey === item.cartKey))
            ? { ...i, quantity: (i.quantity || 1) + (quantity || 1) }
            : i
        );
      }
      return [...prev, { ...item, quantity: quantity || 1, customDetails: customDetails || '' }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (identifier: string | number) => {
    setCart(prev => prev.filter(i => i.id !== identifier && i.cartKey !== identifier));
  };

  const updateQuantity = (identifier: string | number, quantity: number) => {
    if (quantity <= 0) { removeFromCart(identifier); return; }
    setCart(prev => prev.map(i => (i.id === identifier || i.cartKey === identifier) ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);
  const addOrder = (order: any) => setOrders(prev => [...prev, order]);
  const clearOrders = () => setOrders([]);
  const deleteOrder = (id: string) => setOrders(prev => prev.filter(o => o.id !== id));

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      orders, addOrder, clearOrders, deleteOrder,
      isCartOpen, setIsCartOpen,
      profile, setProfile,
      darkMode, setDarkMode,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}

export default AppProvider;
