import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { WhatsAppChatWidget } from '@/components/WhatsAppChatWidget';
import { HomePage } from '@/pages/HomePage';
import { StallsPage } from '@/pages/StallsPage';
import { PersonalOrderPage } from '@/pages/PersonalOrderPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { LoginPage } from '@/pages/LoginPage';
import { DisclaimerPage } from '@/pages/DisclaimerPage';
import { PaymentCard } from '@/components/PaymentCard';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-slate-950 text-red-400 min-h-screen flex flex-col items-center justify-center font-mono text-xs">
          <div className="max-w-xl p-6 rounded-2xl bg-slate-900 border border-red-500/30 space-y-4 shadow-2xl">
            <h2 className="text-sm font-bold text-red-300 uppercase tracking-wider">Runtime Crash Detected</h2>
            <p className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200 overflow-auto">
              {this.state.error?.toString()}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-all cursor-pointer"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { profile } = useApp();
  const isLoggedIn = !!(profile?.name && profile?.phone);
  const [currentPage, setCurrentPage] = useState<string>(isLoggedIn ? 'home' : 'login');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cod' | 'upi'>('upi');

  useEffect(() => {
    if (!isLoggedIn && currentPage !== 'login') {
      setCurrentPage('login');
    }
  }, [isLoggedIn, currentPage]);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      {currentPage !== 'login' && isLoggedIn && (
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}

      <main className="flex-1 flex flex-col overflow-y-auto">
        {currentPage === 'home' && isLoggedIn && <HomePage setCurrentPage={setCurrentPage} />}
        {currentPage === 'stalls' && isLoggedIn && <StallsPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'personal' && isLoggedIn && (
          <PersonalOrderPage
            onBack={() => setCurrentPage('stalls')}
            onProceedToOrders={() => setCurrentPage('orders')}
          />
        )}
        {currentPage === 'dashboard' && isLoggedIn && <DashboardPage />}
        {currentPage === 'orders' && isLoggedIn && <OrdersPage onNavigateStalls={() => setCurrentPage('stalls')} />}
        {currentPage === 'settings' && isLoggedIn && <SettingsPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'disclaimer' && isLoggedIn && <DisclaimerPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'login' && <LoginPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'payment' && isLoggedIn && (
          <div className="max-w-xl mx-auto p-4 py-8">
            <PaymentCard
              selectedMethod={selectedPaymentMethod}
              setSelectedMethod={setSelectedPaymentMethod}
            />
          </div>
        )}
      </main>

      {currentPage !== 'login' && isLoggedIn && (
        <>
          <CartDrawer />
          <WhatsAppChatWidget />
        </>
      )}
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
