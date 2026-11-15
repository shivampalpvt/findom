'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Fish,
  Store,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UploadCloud,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';

export default function RegisterRetailerPage() {
  const router = useRouter();
  const { registerUser } = useMarketplace();

  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gstin: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '',
    address: '',
    docUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match. Please ensure both password fields are identical.');
      return;
    }
    if (formData.password && formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { supabase } = await import('@/lib/supabase');
      if (supabase && formData.email) {
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password || 'password123',
          options: {
            data: {
              role: 'retailer',
              business_name: formData.shopName,
              owner_name: formData.ownerName,
              phone: formData.phone,
              city: formData.city,
              state: formData.state,
            },
          },
        });
      }
    } catch (err) {
      console.warn('Supabase register notice:', err);
    }

    const newRetailer = {
      id: `ret-${Date.now()}`,
      role: 'retailer' as const,
      business_name: formData.shopName || 'Aqua Paradise Pets & Marine',
      owner_name: formData.ownerName || 'Store Proprietor',
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      address: formData.address,
      gstin: formData.gstin || '27AABCO8812D1Z0',
      business_doc_url: formData.docUrl,
      verification_status: 'approved' as const,
      rating: 5.0,
      review_count: 0,
      created_at: new Date().toISOString(),
    };

    registerUser(newRetailer);
    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      router.push('/retailer');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-brand-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 group-hover:scale-105 transition">
              <Fish className="w-7 h-7 stroke-[2.2]" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              FINDOM<span className="text-sky-600">.in</span>
            </span>
          </Link>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200 mb-2">
            Retail Aquarium Store Verification
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Register Aquarium Retail Shop
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl mx-auto">
            Order directly from source breeders in Kolathur, Kolkata &amp; Kochi at farm-gate wholesale prices with 100% DOA protection and pre-dispatch inspection photos.
          </p>
        </div>

        {formError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-3">
            <span className="font-bold">Error:</span> {formError}
          </div>
        )}

        {isSuccess ? (
          <div className="bg-white p-8 rounded-2xl border border-sky-300 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Retailer Store Registered!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your retail account is activated. Redirecting to your retailer console...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-6 text-xs"
          >
            {/* 1. Store Entity Details */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Store className="w-4 h-4 text-sky-600" />
                1. Retail Store Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Aquarium Shop / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oceanic Reef Aquarium & Pets"
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Proprietor / Store Manager Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amitabh Sharma"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Store WhatsApp / Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Store Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="shop@oceanicblue.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Account Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Create a secure password (min 6 characters)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shop Location & Delivery Address */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600" />
                2. Physical Shop &amp; Delivery Destination
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                <div className="sm:col-span-3">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Store Address (Where wholesale thermocol boxes should be delivered) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Shop No., Market / Mall Name, Main Road, Landmark..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="400050"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 3. Tax GSTIN & Trade Verification */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                3. GSTIN &amp; Shop License Document
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    GSTIN Number (For B2B Tax Invoicing & Input Credit)
                  </label>
                  <input
                    type="text"
                    placeholder="27AABCO8812D1Z0"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Trade License / Shop Board Proof Photo URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.docUrl}
                    onChange={(e) => setFormData({ ...formData, docUrl: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                {isSubmitting ? 'Registering Shop...' : 'Register Aquarium Store & Start Sourcing'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
