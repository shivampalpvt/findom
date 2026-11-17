'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Bell,
  SlidersHorizontal,
  X,
  Menu,
  Store,
  Building2,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, signOut, cart, notifications, markNotificationRead } = useMarketplace();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRegisterMenu, setShowRegisterMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifs = notifications.filter(
    (n) => !n.is_read && (!currentUser || n.user_id === currentUser.id || n.user_id === 'admin-1')
  );

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Left: Desktop Search Input */}
          <div className="w-1/4 hidden md:block">
            <form action="/products" method="GET" className="relative max-w-xs">
              <input
                type="text"
                name="q"
                placeholder="Search species, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-transparent border border-gray-300 rounded-none text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            </form>
          </div>

          {/* Center: Editorial Brand Wordmark */}
          <div className="flex-1 md:flex-initial text-left md:text-center">
            <Link href="/" className="inline-block group" onClick={() => setMobileMenuOpen(false)}>
              <span className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.2em] sm:tracking-[0.25em] text-gray-900 uppercase">
                FINDOM
              </span>
              <span className="block text-[8px] sm:text-[9px] font-sans tracking-[0.25em] sm:tracking-[0.35em] text-gray-500 uppercase mt-0.5">
                Aquatic Wholesale Atelier
              </span>
            </Link>
          </div>

          {/* Right: Auth, Cart, Notifications & Mobile Toggle */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-4">
            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-gray-900 transition relative p-2 rounded-full hover:bg-gray-100 min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 stroke-[1.8]" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Popover - responsive width */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 md:w-96 max-w-sm bg-white border border-gray-200 shadow-xl py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-serif font-bold text-xs uppercase tracking-wider text-gray-900">
                      Notifications ({unreadNotifs.length})
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 text-xs">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-gray-500">No new notices.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            setShowNotifications(false);
                          }}
                          className={`p-3.5 hover:bg-gray-50 cursor-pointer ${
                            !notif.is_read ? 'bg-gray-50/80' : ''
                          }`}
                        >
                          <h4 className="font-semibold text-gray-900">{notif.title}</h4>
                          <p className="text-gray-600 mt-0.5 line-clamp-2 text-[11px]">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-900 hover:text-gray-600 transition flex items-center gap-1 text-xs tracking-wider uppercase font-medium p-2 min-w-[36px] min-h-[36px]"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4 stroke-[1.8]" />
              <span className="hidden sm:inline">Cart</span>
              <span className="font-mono text-xs font-bold bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-800">
                {cartCount}
              </span>
            </Link>

            {/* Desktop Auth Controls */}
            {!currentUser ? (
              <div className="hidden md:flex items-center gap-2 pl-2 border-l border-gray-200">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-xs font-semibold tracking-wider uppercase transition shadow-2xs"
                >
                  Sign In
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setShowRegisterMenu(!showRegisterMenu)}
                    className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold tracking-wider uppercase transition flex items-center gap-1 shadow-2xs"
                  >
                    Register <ChevronDown className="w-3 h-3" />
                  </button>

                  {showRegisterMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-xl py-2 z-50 animate-in fade-in">
                      <Link
                        href="/auth/register/retailer"
                        onClick={() => setShowRegisterMenu(false)}
                        className="block px-4 py-2 text-xs text-gray-800 hover:bg-gray-50 font-medium"
                      >
                        <span className="font-bold text-sky-700 block">Aquarium Retailer</span>
                        <span className="text-[10px] text-gray-500">Source live stock at farm prices</span>
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <Link
                        href="/auth/register/supplier"
                        onClick={() => setShowRegisterMenu(false)}
                        className="block px-4 py-2 text-xs text-gray-800 hover:bg-gray-50 font-medium"
                      >
                        <span className="font-bold text-emerald-700 block">Breeding Farm / Supplier</span>
                        <span className="text-[10px] text-gray-500">List live stock & receive B2B orders</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3 pl-2 border-l border-gray-200">
                {currentUser.role === 'supplier' && (
                  <Link
                    href="/supplier"
                    className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition"
                  >
                    <Building2 className="w-3 h-3 text-emerald-600" /> Supplier Dashboard
                  </Link>
                )}

                {currentUser.role === 'retailer' && (
                  <Link
                    href="/retailer"
                    className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 transition"
                  >
                    <Store className="w-3 h-3 text-sky-600" /> Retailer Dashboard
                  </Link>
                )}

                {currentUser.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 transition"
                  >
                    <ShieldCheck className="w-3 h-3 text-purple-600" /> Admin Console
                  </Link>
                )}

                <div className="text-right">
                  <div className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[130px]">
                    {currentUser.business_name}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
                    {currentUser.role}
                  </div>
                </div>

                <button
                  onClick={signOut}
                  title="Sign Out"
                  className="px-2.5 py-1 text-[11px] tracking-wider uppercase font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-xs transition flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden lg:inline">Sign Out</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setShowNotifications(false);
                setShowRegisterMenu(false);
              }}
              className="md:hidden p-2 text-gray-800 hover:text-black hover:bg-gray-100 rounded-lg transition min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-900" />
              ) : (
                <Menu className="w-5 h-5 text-gray-900" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Search */}
          <form action="/products" method="GET" onSubmit={() => setMobileMenuOpen(false)}>
            <div className="relative">
              <input
                type="text"
                name="q"
                placeholder="Search species, foods, equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </form>

          {/* Quick Categories Navigation */}
          <div>
            <span className="block text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">
              Browse Categories
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900 flex items-center justify-between"
              >
                <span>All Products</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/products?category=live-fish"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900 flex items-center justify-between"
              >
                <span>Live Fish</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/products?category=tanks-bowls"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900 flex items-center justify-between"
              >
                <span>Tanks &amp; Bowls</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/products?category=fish-food"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900 flex items-center justify-between"
              >
                <span>Fish Food</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/products?category=turtle-food"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900 flex items-center justify-between"
              >
                <span>Turtle Food</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/products?category=equipment-care"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-between"
              >
                <span>Equipment &amp; Care</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
              </Link>
            </div>
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 block w-full p-2.5 rounded-lg bg-brand-50 text-brand-900 border border-brand-200 text-xs font-bold text-center"
            >
              Compare Breeder Offers &rarr;
            </Link>
          </div>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-gray-100">
            {!currentUser ? (
              <div className="space-y-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 bg-gray-900 text-white text-center font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs"
                >
                  Sign In to B2B Account
                </Link>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/auth/register/retailer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-2 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl font-bold text-center"
                  >
                    Register Store
                  </Link>
                  <Link
                    href="/auth/register/supplier"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-center"
                  >
                    Register Hatchery
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-900">
                      {currentUser.business_name}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase font-mono">
                      Logged in as {currentUser.role}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>

                {currentUser.role === 'supplier' && (
                  <Link
                    href="/supplier"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2.5 bg-emerald-600 text-white text-center font-bold text-xs uppercase tracking-wider rounded-lg"
                  >
                    Go to Supplier Console
                  </Link>
                )}

                {currentUser.role === 'retailer' && (
                  <Link
                    href="/retailer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2.5 bg-sky-600 text-white text-center font-bold text-xs uppercase tracking-wider rounded-lg"
                  >
                    Go to Retailer Console
                  </Link>
                )}

                {currentUser.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2.5 bg-purple-700 text-white text-center font-bold text-xs uppercase tracking-wider rounded-lg"
                  >
                    Go to Admin Command Center
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Quick Contact Footer */}
          <div className="pt-2 text-center text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mumbai Wholesale Desk: +91 98200 11223</span>
          </div>
        </div>
      )}

      {/* Product Categories Sub-Bar (Swipeable on Mobile) */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-start md:justify-center gap-4 sm:gap-6 md:gap-8 overflow-x-auto py-2.5 text-[11px] font-sans font-semibold tracking-[0.14em] uppercase text-gray-700 no-scrollbar whitespace-nowrap">
            <Link
              href="/products"
              className={`shrink-0 transition px-1 py-0.5 ${
                pathname === '/products'
                  ? 'text-gray-900 font-bold border-b-2 border-gray-900'
                  : 'hover:text-gray-900'
              }`}
            >
              All Products
            </Link>
            <Link
              href="/products?category=live-fish"
              className="hover:text-gray-900 shrink-0 transition px-1 py-0.5"
            >
              Live Fish
            </Link>
            <Link
              href="/products?category=tanks-bowls"
              className="hover:text-gray-900 shrink-0 transition px-1 py-0.5"
            >
              Tanks &amp; Bowls
            </Link>
            <Link
              href="/products?category=fish-food"
              className="hover:text-gray-900 shrink-0 transition px-1 py-0.5"
            >
              Fish Food
            </Link>
            <Link
              href="/products?category=turtle-food"
              className="hover:text-gray-900 shrink-0 transition px-1 py-0.5"
            >
              Turtle Food
            </Link>
            <Link
              href="/products?category=equipment-care"
              className="hover:text-gray-900 shrink-0 transition text-emerald-800 px-1 py-0.5"
            >
              Equipment &amp; Care
            </Link>
            <span className="text-gray-300 shrink-0">|</span>
            <Link
              href="/compare"
              className="text-gray-900 font-bold hover:text-gray-600 shrink-0 transition px-1 py-0.5"
            >
              Compare Offers
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
