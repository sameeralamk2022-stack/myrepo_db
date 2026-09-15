import React, { useState } from 'react';
import { Home, Store, LayoutDashboard, Package, Sparkles, Settings, ShoppingBag, LogOut, User as UserIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const { cart = [], setIsCartOpen = () => {}, profile, logout } = useApp() as any;
  const totalCartItems = cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    setCurrentPage('login');
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'stalls', label: 'Stalls', icon: Store },
    { id: 'personal', label: 'Personal', icon: Sparkles, highlight: true },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-3 py-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <div
            onClick={() => setCurrentPage('home')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              MB
            </div>
            <div>
              <span className="text-xs font-black text-white block">Meerut Bites</span>
              <span className="text-[9px] text-amber-400 font-bold uppercase tracking-widest block">Street Food PWA</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* User badge */}
            {profile?.name && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                <UserIcon className="w-3 h-3 text-teal-400" />
                <span className="text-[10px] font-bold text-slate-300 max-w-[80px] truncate">{profile.name}</span>
              </div>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-slate-950">
                  {totalCartItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 bg-slate-900 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 rounded-xl transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <nav className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1 -mx-3 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : item.highlight
                      ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                      : 'text-slate-300 bg-slate-900/90 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowLogoutConfirm(false)}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xs w-full space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-white text-center">Logout from Meerut Bites?</h3>
            <p className="text-[11px] text-slate-400 text-center">Your saved profile and cart will be cleared. You'll need to enter your details again.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-400 text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
