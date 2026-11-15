'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, Store, KeyRound } from 'lucide-react';
import { useMarketplace } from '@/lib/store';

export default function RetailerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useMarketplace();

  // If unauthenticated (public guest/visitor)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 p-8 shadow-xl text-center">
          <div className="w-14 h-14 bg-sky-50 border border-sky-200 rounded-2xl flex items-center justify-center mx-auto mb-5 text-sky-600">
            <Store className="w-7 h-7" />
          </div>

          <div className="inline-block px-3 py-1 bg-sky-50 border border-sky-200 text-sky-800 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
            Retailer Portal
          </div>

          <h1 className="font-serif text-2xl font-bold tracking-tight text-gray-900 mb-2">
            Retailer Account Required
          </h1>

          <p className="text-xs text-gray-600 leading-relaxed mb-6 font-light">
            The retailer portal allows certified aquarium shop owners to track shipments, inspect pre-dispatch health photos, and confirm live arrivals.
          </p>

          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-sky-700 text-white font-serif text-xs font-bold uppercase tracking-widest hover:bg-sky-800 transition shadow-sm"
            >
              <KeyRound className="w-4 h-4" /> Sign In to Retailer Portal
            </Link>

            <Link
              href="/auth/register/retailer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold hover:bg-gray-100 transition"
            >
              Register Aquarium Retail Store
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-800 text-xs transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If signed in as Supplier (and not admin)
  if (currentUser.role !== 'retailer' && currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 p-8 shadow-xl text-center">
          <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-5 text-amber-600">
            <Lock className="w-7 h-7" />
          </div>

          <div className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
            Access Restricted
          </div>

          <h1 className="font-serif text-2xl font-bold tracking-tight text-gray-900 mb-2">
            Retailer Portal Exclusivity
          </h1>

          <p className="text-xs text-gray-600 leading-relaxed mb-6 font-light">
            You are currently signed in as a <span className="font-semibold text-gray-900">Supplier/Breeder</span> ({currentUser.business_name}). This portal is dedicated to retail store purchase tracking.
          </p>

          <div className="space-y-3">
            <Link
              href="/supplier"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-700 text-white font-serif text-xs font-bold uppercase tracking-widest hover:bg-emerald-800 transition"
            >
              Go to Your Supplier Dashboard
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-800 text-xs transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
