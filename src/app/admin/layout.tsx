'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Lock, ArrowLeft, KeyRound } from 'lucide-react';
import { useMarketplace } from '@/lib/store';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, signOut } = useMarketplace();

  // If unauthenticated (public guest/visitor)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-950 border border-stone-800 p-8 shadow-2xl text-center">
          <div className="w-14 h-14 bg-red-950/60 border border-red-800/80 rounded-full flex items-center justify-center mx-auto mb-5 text-red-400">
            <Lock className="w-7 h-7" />
          </div>

          <div className="inline-block px-3 py-1 bg-red-950/50 border border-red-800/60 text-red-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
            401 Unauthorized
          </div>

          <h1 className="font-serif text-2xl font-bold tracking-tight text-white mb-2">
            Admin Clearance Required
          </h1>

          <p className="text-xs text-stone-400 leading-relaxed mb-6 font-light">
            The Findom Central Operations &amp; Arbitration Command Center is restricted strictly to authorized platform administrators. Unauthenticated visitors cannot access this console.
          </p>

          <div className="space-y-3">
            <Link
              href="/auth/login?role=admin"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-white text-stone-950 font-serif text-xs font-bold uppercase tracking-widest hover:bg-stone-200 transition"
            >
              <KeyRound className="w-4 h-4" /> Sign In to Admin Console
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-stone-400 hover:text-stone-200 text-xs transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated but NOT an administrator (e.g. supplier or retailer)
  if (currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-950 border border-stone-800 p-8 shadow-2xl text-center">
          <div className="w-14 h-14 bg-amber-950/60 border border-amber-800/80 rounded-full flex items-center justify-center mx-auto mb-5 text-amber-400">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="inline-block px-3 py-1 bg-amber-950/50 border border-amber-800/60 text-amber-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
            403 Forbidden
          </div>

          <h1 className="font-serif text-2xl font-bold tracking-tight text-white mb-2">
            Insufficient Privileges
          </h1>

          <p className="text-xs text-stone-400 leading-relaxed mb-4 font-light">
            You are signed in as <span className="font-semibold text-white">{currentUser.business_name}</span> with role <span className="uppercase font-mono text-amber-300">[{currentUser.role}]</span>. Your account does not possess platform governance or master dispute arbitration clearance.
          </p>

          <div className="p-3 bg-stone-900/80 border border-stone-800 rounded text-left mb-6 text-[11px] text-stone-400">
            <div className="text-stone-300 font-semibold mb-1">Active Credentials:</div>
            <div>Account: {currentUser.owner_name} ({currentUser.email})</div>
            <div>Authorized Scope: {currentUser.role === 'supplier' ? 'Breeder/Supplier Portal only' : 'Retailer Portal only'}</div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={async () => {
                await signOut();
                window.location.href = '/auth/login?role=admin';
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-purple-700 text-white font-serif text-xs font-bold uppercase tracking-widest hover:bg-purple-600 transition cursor-pointer"
            >
              <KeyRound className="w-4 h-4" /> Sign In with Admin Account
            </button>

            <Link
              href={currentUser.role === 'supplier' ? '/supplier' : '/retailer'}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-800 text-stone-200 font-serif text-xs font-bold uppercase tracking-widest hover:bg-stone-700 transition"
            >
              Go to Your {currentUser.role === 'supplier' ? 'Supplier' : 'Retailer'} Portal
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-stone-400 hover:text-stone-200 text-xs transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Admin
  return <>{children}</>;
}
