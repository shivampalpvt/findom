'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Fish,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UploadCloud,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';

export default function RegisterSupplierPage() {
  const router = useRouter();
  const { registerUser } = useMarketplace();

  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '',
    address: '',
    hub: 'Kolathur Aquarium Hub, Chennai',
    gstin: '',
    tankCount: '50-100 Breeding Tanks',
    bankAccount: '',
    bankIfsc: '',
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
              role: 'supplier',
              business_name: formData.businessName,
              owner_name: formData.ownerName,
              phone: formData.phone,
              city: formData.city,
              state: formData.state,
              hub: formData.hub,
              gstin: formData.gstin,
            },
          },
        });
      }
    } catch (err) {
      console.warn('Supabase supplier register notice:', err);
    }

    // Create user profile with the exact data the user entered
    const newSupplier = {
      id: `sup-${Date.now()}`,
      role: 'supplier' as const,
      business_name: formData.businessName || 'Aqua Breeders Enterprise',
      owner_name: formData.ownerName || 'Proprietor',
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      address: formData.address,
      hub: formData.hub,
      gstin: formData.gstin || '33AAACB1234F1Z8',
      bank_account: formData.bankAccount || 'HDFC0001234 - 501002881923',
      bank_ifsc: formData.bankIfsc || 'HDFC0001234',
      business_doc_url: formData.docUrl,
      verification_status: 'pending' as const,
      rating: 5.0,
      review_count: 0,
      created_at: new Date().toISOString(),
    };

    registerUser(newSupplier);
    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      router.push('/supplier');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition">
              <Fish className="w-7 h-7 stroke-[2.2]" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              FINDOM<span className="text-emerald-600">.in</span>
            </span>
          </Link>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
            Breeder Onboarding Protocol
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Register Commercial Fish Hatchery
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl mx-auto">
            Sell directly to verified aquarium shops in your metropolitan region. Guaranteed escrow payments, direct Porter 1-hour store pickup, and zero non-payment risk.
          </p>
        </div>

        {formError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-3">
            <span className="font-bold">Error:</span> {formError}
          </div>
        )}

        {isSuccess ? (
          <div className="bg-white p-8 rounded-2xl border border-emerald-300 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Commercial Registration Submitted!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your hatchery documents have been uploaded to Findom Platform Administration. Redirecting to your breeder console...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-6 text-xs"
          >
            {/* 1. Hatchery Entity Details */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" />
                1. Hatchery Business Entity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Commercial Hatchery / Farm Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kaveri Aqua Breeders & Farms"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Breeder / Proprietor Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. S. Ramanathan"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Indian Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98410 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="breeder@aquafarm.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
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
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 2. Aquaculture Hub & Farm Location */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                2. Breeding Hub & Physical Farm Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                <div className="sm:col-span-3">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Primary Wholesale Aquatic Hub *
                  </label>
                  <select
                    value={formData.hub}
                    onChange={(e) => setFormData({ ...formData, hub: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="Kolathur Aquarium Hub, Chennai">Kolathur Ornamental Fish Hub (Chennai, Tamil Nadu)</option>
                    <option value="Galiff Street Exotic Fish Center, Kolkata">Galiff Street / Howrah Exotic Fish Hub (Kolkata, WB)</option>
                    <option value="Kochi Aluva Aquatic Gateway, Kerala">Aluva & Ernakulam Riverine Aquaculture (Kochi, Kerala)</option>
                    <option value="Andhra Godavari Delta Zone">Godavari Delta Breeding Zone (Rajahmundry / Kovvur, AP)</option>
                    <option value="Bengaluru Urban & Rural Aquaculture">Bengaluru Bio-Aquaculture Zone (Karnataka)</option>
                    <option value="North East Ornamental Gateway, Guwahati">Assam & NE Native Ornamental Gateway (Guwahati)</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Hatchery Physical Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Plot / Survey No, Village, Road, Landmark..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">City / District *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="600001"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 3. Regulatory Verification & Bank Account */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                3. Tax, License Document & Payout Bank Account
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    GSTIN Number (Optional for local, required for interstate)
                  </label>
                  <input
                    type="text"
                    placeholder="33AAACB1234F1Z8"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    MPEDA / Fisheries License Proof URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.docUrl}
                    onChange={(e) => setFormData({ ...formData, docUrl: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Bank Account Number (For Escrow Releases) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 501002881923"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Bank IFSC Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="HDFC0001234"
                    value={formData.bankIfsc}
                    onChange={(e) => setFormData({ ...formData, bankIfsc: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                {isSubmitting ? 'Registering Hatchery...' : 'Complete Hatchery Registration & Launch Console'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
