'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Bell,
  User,
  SlidersHorizontal,
  X,
  Store,
  Building2,
  ShieldCheck,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, signOut, cart, notifications, markNotificationRead } = useMarketplace();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRegisterMenu, setShowRegisterMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifs = notifications.filter(
    (n) => !n.is_read && (!currentUser || n.user_id === currentUser.id || n.user_id === 'admin-1')
  );

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* 1. Luxury Announcement Bar */}
      <div className="bg-gray-900 text-gray-300 text-[11px] sm:text-xs py-2 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="tracking-wide text-center sm:text-left text-gray-200 font-light">
            Experience the epitome of aquatic luxury living — Enjoy complimentary{' '}
            <span className="font-semibold text-white">White Glove Air Cargo Delivery</span> on all wholesale orders over ₹15,000
          </p>

          <div className="flex items-center gap-4 text-gray-300 text-[11px] tracking-wider uppercase font-medium">
            <span className="hidden md:inline text-gray-400">Pan-India Live Arrival Guaranteed</span>
            <span className="text-gray-600 hidden md:inline">•</span>
            <span>Wholesale Support: +91 98200 11223</span>
          </div>
        </div>
      </div>

      {/* 2. Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-6">
          {/* Left: Search Input */}
          <div className="w-1/4 hidden md:block">
            <form action="/products" method="GET" className="relative max-w-xs">
              <input
                type="text"
                name="q"
                placeholder="Search species, breeders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-transparent border border-gray-300 rounded-none text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            </form>
          </div>

          {/* Center: Editorial Brand Wordmark */}
          <div className="flex-1 md:flex-initial text-center">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-gray-900 uppercase">
                FINDOM
              </span>
              <span className="block text-[9px] font-sans tracking-[0.35em] text-gray-500 uppercase mt-0.5">
                Aquatic Wholesale Atelier
              </span>
            </Link>
          </div>

          {/* Right: Auth, Cart & Notifications */}
          <div className="w-auto md:w-auto flex items-center justify-end gap-3 sm:gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-700 hover:text-gray-900 transition relative p-1.5 rounded-full hover:bg-gray-100"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 stroke-[1.8]" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-gray-200 shadow-xl py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-serif font-bold text-xs uppercase tracking-wider text-gray-900">
                      Notifications ({unreadNotifs.length})
                    </span>
                    <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
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
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-3.5 hover:bg-gray-50 cursor-pointer ${!notif.is_read ? 'bg-gray-50/80' : ''}`}
                        >
                          <h4 className="font-semibold text-gray-900">{notif.title}</h4>
                          <p className="text-gray-600 mt-0.5 line-clamp-2 text-[11px]">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className="text-gray-900 hover:text-gray-600 transition flex items-center gap-1 text-xs tracking-wider uppercase font-medium p-1.5"
            >
              <ShoppingCart className="w-4 h-4 stroke-[1.8]" />
              <span className="hidden sm:inline">Cart</span>
              <span className="font-mono text-xs font-bold">({cartCount})</span>
            </Link>

            {/* AUTH SECTION (PROMINENT SIGN IN / REGISTER OR LOGGED-IN CONTROLS) */}
            {!currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                {/* PROMINENT LOGIN BUTTON */}
                <Link
                  href="/auth/login"
                  className="px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-xs font-semibold tracking-wider uppercase transition shadow-2xs"
                >
                  Sign In / Login
                </Link>

                {/* REGISTER DROPDOWN */}
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
              <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                {/* Portal Link */}
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

                {/* Account Name */}
                <div className="hidden lg:block text-right">
                  <div className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[140px]">
                    {currentUser.business_name}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
                    {currentUser.role}
                  </div>
                </div>

                {/* SIGN OUT BUTTON */}
                <button
                  onClick={signOut}
                  title="Sign Out"
                  className="px-2.5 py-1 text-[11px] tracking-wider uppercase font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-xs transition flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Product Categories Bar */}
      <div className="border-t border-b border-gray-200 bg-white shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-6 sm:gap-8 overflow-x-auto py-3 text-[11px] font-sans font-semibold tracking-[0.16em] uppercase text-gray-700 no-scrollbar">
            <Link href="/products" className="hover:text-gray-900 shrink-0 transition text-gray-900 font-bold">
              All Products
            </Link>
            <Link href="/products?category=live-fish" className="hover:text-gray-900 shrink-0 transition">
              Live Fish
            </Link>
            <Link href="/products?category=tanks-bowls" className="hover:text-gray-900 shrink-0 transition">
              Tanks &amp; Bowls
            </Link>
            <Link href="/products?category=fish-food" className="hover:text-gray-900 shrink-0 transition">
              Fish Food
            </Link>
            <Link href="/products?category=turtle-food" className="hover:text-gray-900 shrink-0 transition">
              Turtle Food
            </Link>
            <Link href="/products?category=equipment-care" className="hover:text-gray-900 shrink-0 transition text-emerald-800">
              Equipment &amp; Care
            </Link>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <Link href="/compare" className="text-gray-900 font-bold hover:text-gray-600 shrink-0 transition">
              Compare Offers
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
