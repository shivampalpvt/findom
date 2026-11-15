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
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, switchRole, cart, notifications, markNotificationRead } = useMarketplace();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifs = notifications.filter(
    (n) => !n.is_read && (!currentUser || n.user_id === currentUser.id || n.user_id === 'admin-1')
  );

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* 1. Luxury Announcement Bar (Aura luxury-interior-59 style) */}
      <div className="bg-gray-900 text-gray-300 text-[11px] sm:text-xs py-2 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="tracking-wide text-center sm:text-left text-gray-200 font-light">
            Experience the epitome of aquatic luxury living — Enjoy complimentary{' '}
            <span className="font-semibold text-white">White Glove Air Cargo Delivery</span> on all wholesale orders over ₹15,000
          </p>

          {/* Role switcher */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-gray-400 text-[10px] uppercase tracking-wider hidden md:inline">View As:</span>
            <div className="inline-flex rounded-sm bg-gray-800 p-0.5 border border-gray-700 text-[10px]">
              <button
                onClick={() => switchRole('visitor')}
                className={`px-2 py-0.5 rounded-xs transition ${
                  !currentUser ? 'bg-white text-gray-900 font-semibold' : 'text-gray-300 hover:text-white'
                }`}
              >
                Visitor
              </button>
              <button
                onClick={() => switchRole('retailer')}
                className={`px-2 py-0.5 rounded-xs transition ${
                  currentUser?.role === 'retailer' ? 'bg-white text-gray-900 font-semibold' : 'text-gray-300 hover:text-white'
                }`}
              >
                Retailer
              </button>
              <button
                onClick={() => switchRole('supplier')}
                className={`px-2 py-0.5 rounded-xs transition ${
                  currentUser?.role === 'supplier' ? 'bg-white text-gray-900 font-semibold' : 'text-gray-300 hover:text-white'
                }`}
              >
                Supplier
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-2 py-0.5 rounded-xs transition ${
                  currentUser?.role === 'admin' ? 'bg-white text-gray-900 font-semibold' : 'text-gray-300 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Luxury Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-6">
          {/* Left: Minimalist Search Input */}
          <div className="w-1/4 hidden md:block">
            <form action="/products" method="GET" className="relative max-w-xs">
              <input
                type="text"
                name="q"
                placeholder="Search..."
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

          {/* Right: Customer Actions */}
          <div className="w-auto md:w-1/4 flex items-center justify-end gap-5">
            {/* Direct Dashboard Link if logged in */}
            {currentUser?.role === 'supplier' && (
              <Link
                href="/supplier"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-900 hover:text-gray-600 transition tracking-wider uppercase text-[11px]"
              >
                <Building2 className="w-3.5 h-3.5" /> Supplier Portal
              </Link>
            )}

            {currentUser?.role === 'retailer' && (
              <Link
                href="/retailer"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-900 hover:text-gray-600 transition tracking-wider uppercase text-[11px]"
              >
                <Store className="w-3.5 h-3.5" /> Retailer Portal
              </Link>
            )}

            {currentUser?.role === 'admin' && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-purple-900 hover:text-purple-700 transition tracking-wider uppercase text-[11px]"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Console
              </Link>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-700 hover:text-gray-900 transition relative p-1"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 stroke-[1.8]" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-gray-200 shadow-xl py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-serif font-bold text-xs uppercase tracking-wider text-gray-900">Notifications ({unreadNotifs.length})</span>
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

            {/* User Profile / Sign In */}
            {!currentUser ? (
              <Link
                href="/auth/login"
                className="text-xs tracking-wider uppercase text-gray-900 hover:text-gray-600 font-medium flex items-center gap-1.5"
              >
                <User className="w-4 h-4 stroke-[1.8]" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif font-bold tracking-wider uppercase text-gray-900 max-w-[120px] truncate">
                  {currentUser.business_name}
                </span>
              </div>
            )}

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className="text-gray-900 hover:text-gray-600 transition flex items-center gap-1 text-xs tracking-wider uppercase font-medium"
            >
              <ShoppingCart className="w-4 h-4 stroke-[1.8]" />
              <span className="hidden sm:inline">Cart</span>
              <span className="font-mono text-xs">({cartCount})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Luxury Category Bar (Aura luxury-interior-59 style) */}
      <div className="border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-8 overflow-x-auto py-3 text-[11px] font-sans font-medium tracking-[0.18em] uppercase text-gray-700 no-scrollbar">
            <Link href="/products?category=discus-angelfish" className="hover:text-gray-900 shrink-0 transition">
              Discus & Angelfish
            </Link>
            <Link href="/products?category=cichlids" className="hover:text-gray-900 shrink-0 transition">
              Malawi Cichlids
            </Link>
            <Link href="/products?category=livebearers" className="hover:text-gray-900 shrink-0 transition">
              Show Guppies
            </Link>
            <Link href="/products?category=tetras-schooling" className="hover:text-gray-900 shrink-0 transition">
              Tetras & Schooling
            </Link>
            <Link href="/products?category=catfish-plecos" className="hover:text-gray-900 shrink-0 transition">
              L-Plecos & Corydoras
            </Link>
            <Link href="/products?category=planted-shrimps" className="hover:text-gray-900 shrink-0 transition">
              Aquascaping & Shrimps
            </Link>
            <Link href="/compare" className="text-gray-900 font-bold hover:text-gray-600 shrink-0 transition">
              Compare Suppliers
            </Link>
            <Link href="/suppliers" className="text-gray-500 hover:text-gray-900 shrink-0 transition">
              Hatcheries
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
