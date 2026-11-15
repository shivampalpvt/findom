'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Instagram, Twitter, Facebook, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 text-xs border-t border-gray-900">
      {/* Main Multi-Column Footer (Aura luxury-interior-59 style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-10">
          {/* Column 1: Brand & Social */}
          <div className="space-y-4">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.25em] text-white uppercase block">
              FINDOM
            </span>
            <p className="text-gray-400 leading-relaxed text-[11px] max-w-xs font-light">
              The premier destination for extraordinary aquatic life. We curate the finest live ornamental fish, lighting, and aquascaping masterworks from India’s top certified breeders.
            </p>
            <div className="flex items-center gap-4 pt-2 text-gray-400">
              <a href="#" className="hover:text-white transition" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-white transition" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-white transition" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-white transition" aria-label="Global">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Customer Care */}
          <div>
            <h4 className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase text-white mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-[11px] font-light">
              <li>
                <Link href="/support" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/local-delivery" className="hover:text-white transition">
                  1-Hour Porter Express Delivery
                </Link>
              </li>
              <li>
                <Link href="/doa-policy" className="hover:text-white transition">
                  DOA Claims & Escrow Refunds
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: The Company */}
          <div>
            <h4 className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase text-white mb-4">
              The Company
            </h4>
            <ul className="space-y-2.5 text-[11px] font-light">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Findom
                </Link>
              </li>
              <li>
                <Link href="/auth/register/supplier" className="hover:text-white transition">
                  Commercial Breeder Program
                </Link>
              </li>
              <li>
                <Link href="/auth/register/retailer" className="hover:text-white transition">
                  Aquarium Retail Trade Account
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-white transition">
                  Aquatic Journal & Sourcing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter / VIP List */}
          <div>
            <h4 className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase text-white mb-4">
              Join the List
            </h4>
            <p className="text-[11px] text-gray-400 mb-4 font-light leading-relaxed">
              Subscribe for early access to new acclimated arrivals, exclusive breeder lots, and seasonal pricing.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center border-b border-gray-700 pb-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border-none text-xs text-white placeholder-gray-500 focus:outline-none w-full"
              />
              <button
                type="submit"
                className="text-gray-400 hover:text-white transition shrink-0 ml-2"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Sub-Footer */}
      <div className="border-t border-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} Findom Atelier Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-gray-300 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
