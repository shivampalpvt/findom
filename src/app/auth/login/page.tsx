'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Fish,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Building,
  Store,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import { UserRole } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useMarketplace();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('supplier');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setAuthError('Please enter your registered email address.');
      return;
    }
    if (!password) {
      setAuthError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    const result = await loginUser(email, password, selectedRole);

    if (!result.success) {
      setAuthError(result.error || 'Authentication failed. Please check your credentials or register.');
      setIsLoading(false);
      return;
    }

    // Redirect to the appropriate portal for the authenticated user
    if (result.user?.role === 'supplier') {
      router.push('/supplier');
    } else if (result.user?.role === 'retailer') {
      router.push('/retailer');
    } else if (result.user?.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
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
          Enter your registered email and password to access your dedicated business portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 sm:px-10">
          {authError && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Sign In Failed</p>
                <p className="mt-0.5 text-red-700">{authError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('supplier')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition flex items-center justify-center gap-1.5 ${
                    selectedRole === 'supplier'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-3.5 h-3.5 text-emerald-600" />
                  Fish Supplier
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('retailer')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition flex items-center justify-center gap-1.5 ${
                    selectedRole === 'retailer'
                      ? 'bg-sky-50 border-sky-500 text-sky-900 ring-2 ring-sky-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Store className="w-3.5 h-3.5 text-sky-600" />
                  Aquarium Retailer
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@farm.com or store@pets.in"
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
                  placeholder="Enter your account password"
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
              {isLoading ? 'Verifying Account...' : 'Sign In to Portal'}
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
                Register Hatchery / Farm
              </Link>
              <span className="text-slate-300">•</span>
              <Link
                href="/auth/register/retailer"
                className="text-sky-700 hover:text-sky-800 underline"
              >
                Register Retail Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
