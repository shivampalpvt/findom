'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Truck,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Package,
  Sparkles,
  PhoneCall,
  KeyRound,
} from 'lucide-react';

export default function LocalDeliveryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold tracking-[0.25em] uppercase rounded-full mb-4">
            <Clock className="w-3.5 h-3.5" />
            Hyperlocal Logistics Standard
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white tracking-tight mb-4">
            1-Hour Express Local Delivery
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Eliminating airport delays and interstate transit stress. Findom connects retail aquarium stores with local city breeders and distributors via on-demand <strong>Porter 2-Wheelers</strong>, <strong>Porter 3-Wheelers</strong>, and direct couriers for guaranteed under 1-hour shopfront arrival.
          </p>
        </div>
      </section>

      {/* 3 Core Advantages */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-slate-900 font-medium">Under 60 Minutes SLA</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Direct point-to-point dispatch from the breeding farm or warehouse gate straight to your shop entrance. No sorting hubs, no airport cargo terminal lines.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-slate-900 font-medium">Near-Zero Mortality (&lt;0.1%)</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Because specimens travel for just 30 to 45 minutes in medical pure oxygen bags, water temperature stays stable and transit shock is virtually eliminated.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-slate-900 font-medium">OTP Doorstep Handover</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                The Porter driver verifies your 4-digit Delivery OTP only after you inspect the sealed oxygen bags and specimen vigor at your store door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Breakdown */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-slate-400 uppercase">
              LOCAL MODES OF FULFILLMENT
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-light mt-2">
              On-Demand Vehicle Selection
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Tailored transport modes based on your consignment weight, fragility, and species requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mode 1: Porter 2-Wheeler */}
            <div className="p-8 border border-slate-200 rounded-2xl bg-white shadow-xs hover:border-slate-900 transition">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-brand-50 text-brand-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                  Express Bike (&lt;45 min)
                </span>
                <Truck className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Porter 2-Wheeler Courier</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-light">
                Best for bagged live fish (up to 20kg), fish &amp; turtle food buckets, water conditioners, bio-sponges, and HOB filtration units. Navigates city traffic swiftly for immediate delivery.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Dispatch Fee:</span>
                <span className="font-bold text-emerald-700">FREE over ₹4,999 (else ₹199)</span>
              </div>
            </div>

            {/* Mode 2: Porter 3-Wheeler / Tata Ace */}
            <div className="p-8 border border-slate-200 rounded-2xl bg-white shadow-xs hover:border-slate-900 transition">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                  Heavy Vehicle (Up to 500kg)
                </span>
                <Package className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Porter 3-Wheeler / Tata Ace</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-light">
                Required for rimless Opti-White aquariums, heavy hand-blown glass bowls, 200L commercial tubs, and bulk master cases of fish foods. Padded bed ensures zero glass micro-fractures.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Dispatch Fee:</span>
                <span className="font-bold text-emerald-700">FREE over ₹9,999 (else ₹349)</span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Flow */}
          <div className="mt-16 bg-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl">
            <h3 className="font-serif text-xl sm:text-2xl font-light text-white mb-8 text-center">
              The 4-Step 1-Hour Handover Journey
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-bold text-white text-sm">Oxygen Bagging</h4>
                <p className="text-slate-400 leading-relaxed font-light">
                  Breeder packs fish with 70% pure medical O2 and uploads high-res proof to your order screen.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-bold text-white text-sm">Retailer Approval</h4>
                <p className="text-slate-400 leading-relaxed font-light">
                  You inspect fin health and bag counts. One-click approval alerts the supplier to summon Porter.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-bold text-white text-sm">Driver En Route</h4>
                <p className="text-slate-400 leading-relaxed font-light">
                  Porter driver picks up directly. Real-time GPS map tracking, vehicle number, and phone number go live.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center text-sm">
                  4
                </div>
                <h4 className="font-bold text-white text-sm">OTP Sign-Off</h4>
                <p className="text-slate-400 leading-relaxed font-light">
                  Box arrives at your shop door. Confirm lively arrival, share the 4-digit OTP, and escrow releases.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-md"
            >
              Browse Local Stock in Your City
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
