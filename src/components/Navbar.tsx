'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Fish,
  Search,
  ShoppingCart,
  Bell,
  ShieldCheck,
  Store,
  Layers,
  ChevronDown,
  User,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, switchRole, cart, notifications, markNotificationRead } = useMarketplace();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadNotifs = notifications.filter(
    (n) => !n.is_read && (!currentUser || n.user_id === currentUser.id || n.user_id === 'admin-1')
  );

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Demo Bar / Role Impersonation Switcher */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white tracking-wide uppercase">B2B Live Platform</span>
          <span className="hidden md:inline text-slate-400">| Pan-India Aquatic Wholesale Marketplace</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 hidden sm:inline">Active Role View:</span>
          <div className="inline-flex rounded-md shadow-xs bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={() => switchRole('visitor')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                !currentUser ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Public Visitor
            </button>
            <button
              onClick={() => switchRole('retailer')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                currentUser?.role === 'retailer' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Retailer
            </button>
            <button
              onClick={() => switchRole('supplier')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                currentUser?.role === 'supplier' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Supplier
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                currentUser?.role === 'admin' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition">
              <Fish className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
                FINDOM<span className="text-brand-600">.in</span>
              </span>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">B2B Fish Wholesale</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <form action="/products" method="GET" className="relative">
              <input
                type="text"
                name="q"
                placeholder="Search Discus, Neon Tetras, Cichlids, Chennai/Kolkata breeders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </form>
          </div>

          {/* Right Navigation & Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/compare"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
              Compare Suppliers
            </Link>

            {/* Portal Link based on logged in role */}
            {currentUser?.role === 'supplier' && (
              <Link
                href="/supplier"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition"
              >
                <Store className="w-4 h-4 text-emerald-600" />
                Supplier Dashboard
              </Link>
            )}

            {currentUser?.role === 'retailer' && (
              <Link
                href="/retailer"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 transition"
              >
                <Store className="w-4 h-4 text-sky-600" />
                Retailer Dashboard
              </Link>
            )}

            {currentUser?.role === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 transition"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Admin Console
              </Link>
            )}

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 relative transition"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-900">Notifications ({unreadNotifs.length})</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-xs text-slate-500">No notifications yet.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition ${
                            !notif.is_read ? 'bg-brand-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-slate-900">{notif.title}</h4>
                            <span className="text-[10px] text-slate-400 shrink-0">Just now</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notif.message}</p>
                          {notif.link && (
                            <Link
                              href={notif.link}
                              onClick={() => setShowNotifications(false)}
                              className="text-[11px] font-medium text-brand-600 hover:text-brand-700 mt-1.5 inline-block"
                            >
                              View details →
                            </Link>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 relative transition flex items-center gap-1"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="bg-brand-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account / Registration */}
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-2"
                >
                  Sign In
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition"
                  >
                    Register <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {showRoleMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                      <Link
                        href="/auth/register/retailer"
                        onClick={() => setShowRoleMenu(false)}
                        className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        Register as Aquarium Retailer
                      </Link>
                      <Link
                        href="/auth/register/supplier"
                        onClick={() => setShowRoleMenu(false)}
                        className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        Register as Fish Supplier / Farm
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs uppercase">
                  {currentUser.business_name.substring(0, 2)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">{currentUser.business_name}</div>
                  <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                    {currentUser.role}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Horizontal Strip */}
        <div className="flex items-center gap-6 overflow-x-auto py-2.5 text-xs font-medium text-slate-600 border-t border-slate-100 no-scrollbar">
          <Link href="/products" className="text-slate-900 font-semibold hover:text-brand-600 shrink-0">
            All Live Stock
          </Link>
          <Link href="/products?category=discus-angelfish" className="hover:text-brand-600 shrink-0">
            Discus & Angelfish
          </Link>
          <Link href="/products?category=cichlids" className="hover:text-brand-600 shrink-0">
            Malawi & American Cichlids
          </Link>
          <Link href="/products?category=livebearers" className="hover:text-brand-600 shrink-0">
            Guppies & Livebearers
          </Link>
          <Link href="/products?category=tetras-schooling" className="hover:text-brand-600 shrink-0">
            Tetras & Schooling
          </Link>
          <Link href="/products?category=catfish-plecos" className="hover:text-brand-600 shrink-0">
            Plecos (L-Numbers) & Corydoras
          </Link>
          <Link href="/products?category=planted-shrimps" className="hover:text-brand-600 shrink-0">
            Aquascaping & Shrimps
          </Link>
          <Link href="/suppliers" className="text-brand-700 font-semibold hover:text-brand-800 shrink-0 ml-auto">
            Verified Hatcheries (Kolathur / Kolkata / Kochi) →
          </Link>
        </div>
      </div>
    </header>
  );
}
