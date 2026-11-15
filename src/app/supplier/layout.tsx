'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, Building2, KeyRound } from 'lucide-react';
import { useMarketplace } from '@/lib/store';

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, switchRole } = useMarketplace();

  // If unauthenticated (public guest/visitor)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 p-8 shadow-xl text-center">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-5 text-emerald-600">
            <Building2 className="w-7 h-7" />
          </div>

          <div className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
            Supplier Portal
          </div>

          <h1 className="font-serif text-2xl font-bold tracking-tight text-gray-900 mb-2">
            Breeder Account Required
          </h1>

          <p className="text-xs text-gray-600 leading-relaxed mb-6 font-light">
            The supplier portal is reserved for verified fish breeding farms and commercial hatcheries to list livestock, update inventory, and upload dispatch proof.
          </p>

          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-700 text-white font-serif text-xs font-bold uppercase tracking-widest hover:bg-emerald-800 transition shadow-sm"
            >
              <KeyRound className="w-4 h-4" /> Sign In to Supplier Portal
            </Link>

            <Link
              href="/auth/register/supplier"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold hover:bg-gray-100 transition"
            >
              Register New Breeding Farm
            </Link>

            <button
              onClick={() => switchRole('supplier')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-300 text-gray-600 text-xs hover:border-gray-400 hover:text-gray-900 transition"
            >
              Demo: Quick Authorize as Supplier
            </button>

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

  // If signed in as Retailer (and not admin)
  if (currentUser.role !== 'supplier' && currentUser.role !== 'admin') {
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
            Supplier Portal Exclusivity
          </h1>

          <p className="text-xs text-gray-600 leading-relaxed mb-6 font-light">
            You are currently signed in as a <span className="font-semibold text-gray-900">Retailer</span> ({currentUser.business_name}). This portal is dedicated to commercial breeders managing wholesale supply.
          </p>

          <div className="space-y-3">
            <Link
              href="/retailer"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-sky-700 text-white font-serif text-xs font-bold uppercase tracking-widest hover:bg-sky-800 transition"
            >
              Go to Your Retailer Dashboard
            </Link>

            <button
              onClick={() => switchRole('supplier')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 transition"
            >
              Switch Role to Supplier
            </button>

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
