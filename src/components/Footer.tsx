import React from 'react';
import Link from 'next/link';
import { Fish, ShieldCheck, Truck, Camera, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      {/* Value Proposition Strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Pre-Dispatch Video/Photo Proof</h4>
              <p className="mt-1 text-slate-400 leading-relaxed">
                Suppliers upload real packing photographs before shipment. Retailers inspect and approve prior to flight dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">DOA Protection & Live Arrival</h4>
              <p className="mt-1 text-slate-400 leading-relaxed">
                Dead-On-Arrival reporting within 2 hours of airport cargo pickup. Automatic dispute resolution and refunds.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Verified Indian Breeders</h4>
              <p className="mt-1 text-slate-400 leading-relaxed">
                Strict GST & hatchery physical verification across major hubs in Kolathur (Chennai), Galiff St (Kolkata), and Kochi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Wholesale Multi-Supplier Cart</h4>
              <p className="mt-1 text-slate-400 leading-relaxed">
                Compare prices per species, mix and match across farms, and track individual supplier orders in one checkout.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
              <Fish className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">FINDOM.in</span>
          </div>
          <p className="mt-3 text-slate-400 leading-relaxed max-w-sm">
            India’s dedicated B2B ornamental fish marketplace connecting certified commercial breeders, quarantine hatcheries, and retail aquarium shops across all states.
          </p>
          <div className="mt-4 text-slate-500 text-[11px]">
            Operating under Indian Fisheries & Aquaculture Wholesale Standards. Currency: INR (₹).
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Marketplace</h4>
          <ul className="space-y-2">
            <li><Link href="/products" className="hover:text-white transition">All Live Stock</Link></li>
            <li><Link href="/compare" className="hover:text-white transition">Compare Suppliers</Link></li>
            <li><Link href="/suppliers" className="hover:text-white transition">Verified Breeders</Link></li>
            <li><Link href="/products?category=discus-angelfish" className="hover:text-white transition">Discus & Angelfish</Link></li>
            <li><Link href="/products?category=cichlids" className="hover:text-white transition">African Cichlids</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Portals & Roles</h4>
          <ul className="space-y-2">
            <li><Link href="/retailer" className="hover:text-white transition">Retailer Dashboard</Link></li>
            <li><Link href="/supplier" className="hover:text-white transition">Supplier Dashboard</Link></li>
            <li><Link href="/admin" className="hover:text-white transition">Admin Operations</Link></li>
            <li><Link href="/auth/register/supplier" className="hover:text-white transition">Register as Supplier</Link></li>
            <li><Link href="/auth/register/retailer" className="hover:text-white transition">Register as Retailer</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Support & Legal</h4>
          <ul className="space-y-2">
            <li><Link href="/support" className="hover:text-white transition">Help & Dispute Center</Link></li>
            <li><Link href="/doa-policy" className="hover:text-white transition">DOA Claim Guidelines</Link></li>
            <li><Link href="/air-cargo" className="hover:text-white transition">Air Cargo Packaging SOP</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition">Terms of Trade</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-6 text-center text-slate-500 text-xs">
        © {new Date().getFullYear()} Findom B2B Marketplace Technologies India Pvt Ltd. All rights reserved.
      </div>
    </footer>
  );
}
