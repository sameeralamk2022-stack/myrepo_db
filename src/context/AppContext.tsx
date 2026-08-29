import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppContextType {
  cart: any[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  orders: any[];
  addOrder: (order: any) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
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

  // Orders are NOT saved to localStorage or persisted as per your instruction
  const [orders, setOrders] = useState<any[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('mb_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => (i.id && i.id === item.id) || (i.cartKey && i.cartKey === item.cartKey));
      if (existing) {
        return prev.map(i => 
          ((i.id && i.id === item.id) || (i.cartKey && i.cartKey === item.cartKey)) 
            ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) } 
            : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (identifier: string | number) => {
    setCart(prev => prev.filter(i => i.id !== identifier && i.cartKey !== identifier));
  };

  const updateQuantity = (identifier: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(identifier);
      return;
    }
    setCart(prev => prev.map(i => (i.id === identifier || i.cartKey === identifier) ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  // Empty handler to prevent saving orders permanently
  const addOrder = (order: any) => {
    // Orders are dispatched directly to WhatsApp and cleared immediately, not stored.
    setOrders([]);
  };

  return (
    <AppContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      orders,
      addOrder,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppProvider;