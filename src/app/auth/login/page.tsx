'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Fish,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Building,
  Store,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import { UserRole } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useMarketplace();

  const [email, setEmail] = useState('supplier1@findom.in');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('supplier');
  const [isLoading, setIsLoading] = useState(false);

  const handle1ClickLogin = (role: UserRole) => {
    switchRole(role);
    if (role === 'supplier') {
      setEmail('supplier1@findom.in');
      router.push('/supplier');
    } else if (role === 'retailer') {
      setEmail('retailer@findom.in');
      router.push('/retailer');
    } else if (role === 'admin') {
      setEmail('admin@findom.in');
      router.push('/admin');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      switchRole(selectedRole);
      if (selectedRole === 'supplier') router.push('/supplier');
      else if (selectedRole === 'retailer') router.push('/retailer');
      else router.push('/admin');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition">
            <Fish className="w-7 h-7 stroke-[2.2]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            FINDOM<span className="text-brand-600">.in</span>
          </span>
        </Link>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Commercial B2B Portal Sign In
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Direct wholesale access for verified Indian ornamental fish breeders and retail shops
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        {/* Fast Demo Role Auto-Fill Buttons */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl shadow-xl text-white mb-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1-Click Demo Login
            </span>
            <span className="text-[10px] text-slate-400">Instant Role Impersonation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handle1ClickLogin('supplier')}
              className="p-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-xl text-left transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">Supplier</span>
                <Building className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-300 mt-1 font-semibold truncate">Coromandel Aqua</p>
              <p className="text-[10px] text-slate-400">Kolathur Hatchery</p>
            </button>

            <button
              type="button"
              onClick={() => handle1ClickLogin('retailer')}
              className="p-3 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 rounded-xl text-left transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-300">Retailer</span>
                <Store className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <p className="text-[11px] text-slate-300 mt-1 font-semibold truncate">Oceanic Blue</p>
              <p className="text-[10px] text-slate-400">Mumbai Aquarium</p>
            </button>

            <button
              type="button"
              onClick={() => handle1ClickLogin('admin')}
              className="p-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded-xl text-left transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300">Admin</span>
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className="text-[11px] text-slate-300 mt-1 font-semibold truncate">Arbitration Desk</p>
              <p className="text-[10px] text-slate-400">Escrow Ops</p>
            </button>
          </div>
        </div>

        {/* Standard Credentials Form */}
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Your Business Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('supplier');
                    setEmail('supplier1@findom.in');
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition ${
                    selectedRole === 'supplier'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Commercial Breeder
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('retailer');
                    setEmail('retailer@findom.in');
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition ${
                    selectedRole === 'retailer'
                      ? 'bg-sky-50 border-sky-500 text-sky-900 ring-2 ring-sky-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Retail Aquarium Store
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Registered Email or Indian Mobile
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. breeder@findom.in or +91 98410..."
                  className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-[11px] font-bold text-brand-600 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? 'Verifying Credentials...' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-500">Don&apos;t have a verified commercial account yet?</p>
            <div className="flex items-center justify-center gap-3 text-xs font-bold">
              <Link
                href="/auth/register/supplier"
                className="text-emerald-700 hover:text-emerald-800 underline"
              >
                Register Hatchery
              </Link>
              <span className="text-slate-300">•</span>
              <Link
                href="/auth/register/retailer"
                className="text-sky-700 hover:text-sky-800 underline"
              >
                Register Aquarium Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
