'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ShieldCheck,
  Camera,
  Truck,
  CheckCircle2,
  SlidersHorizontal,
  Star,
  MapPin,
  Sparkles,
  ChevronRight,
  Check,
  Building2,
  Package,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import { CATEGORIES, MASTER_PRODUCTS } from '@/lib/mock-data';

export default function HomePage() {
  const router = useRouter();
  const { listings, addToCart, reviews, allProfiles } = useMarketplace();
  const [addedListingId, setAddedListingId] = useState<string | null>(null);

  const handleAddToCart = (listing: any) => {
    addToCart(listing, listing.min_order_qty);
    setAddedListingId(listing.id);
    setTimeout(() => {
      setAddedListingId(null);
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
      {/* Toast Alert */}
      {addedListingId && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-gray-900 text-white px-6 py-4 shadow-2xl border border-gray-700 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-6 h-6 rounded-full bg-white text-gray-900 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <div>
            <p className="text-xs font-serif font-bold uppercase tracking-wider text-white">Consignment Added</p>
            <p className="text-[11px] text-gray-300">Added wholesale MOQ lot to your multi-supplier cart.</p>
          </div>
          <Link
            href="/cart"
            className="ml-3 text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 bg-white text-gray-900 hover:bg-gray-100 transition"
          >
            View Cart
          </Link>
        </div>
      )}

      {/* 1. HERO SECTION (Aura luxury-interior-59 style: Full-width photographic backdrop + floating editorial white card) */}
      <section className="relative w-full h-[640px] sm:h-[720px] lg:h-[760px] overflow-hidden bg-gray-900">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=2000&q=85')`,
          }}
        >
          <div className="absolute inset-0 bg-black/35 backdrop-brightness-95" />
        </div>

        {/* Floating Editorial Card (Direct Aura Luxury Interior 59 Pattern) */}
        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="bg-white p-8 sm:p-12 md:p-14 max-w-xl shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-left-6 duration-700">
            <span className="block text-[10px] font-sans font-semibold tracking-[0.28em] text-gray-500 uppercase mb-4">
              ARTISANAL WHOLESALE AQUACULTURE
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 leading-[1.15] mb-6">
              Curate an Atmosphere of Uncompromising Luxury
            </h1>

            <p className="text-xs sm:text-sm text-gray-600 font-normal leading-relaxed mb-8">
              Elevate your retail collection with our exclusive portfolio of globally certified, domestic-bred aquatic masterworks. Direct from India's premier hatcheries in Kolathur, Galiff Street, and Kochi.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-gray-900 hover:bg-black text-white text-xs font-sans font-medium tracking-[0.2em] uppercase transition shadow-md"
              >
                Shop Now
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-transparent border border-gray-900 hover:bg-gray-50 text-gray-900 text-xs font-sans font-medium tracking-[0.2em] uppercase transition"
              >
                Compare Offers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROMOTIONAL & FINANCING VALUE STRIP (Aura luxury-interior-59 style: 3-column bordered bar) */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 py-6 text-center">
            <div className="py-2 px-4">
              <p className="font-serif text-sm sm:text-base text-gray-900 font-medium">
                Apply for our 30-Day B2B Store Credit Card
              </p>
              <p className="text-[11px] text-gray-500 tracking-wider uppercase mt-0.5">Flexible credit terms for verified retailers</p>
            </div>
            <div className="py-2 px-4">
              <p className="font-serif text-sm sm:text-base text-gray-900 font-bold">
                Take up to 30% Off Wholesale Margins
              </p>
              <p className="text-[11px] text-gray-500 tracking-wider uppercase mt-0.5">Direct farm-gate pricing without middlemen</p>
            </div>
            <div className="py-2 px-4">
              <p className="font-serif text-sm sm:text-base text-gray-900 font-medium">
                Zero DOA Risk + Free Air Cargo
              </p>
              <p className="text-[11px] text-gray-500 tracking-wider uppercase mt-0.5">On all wholesale consignments over ₹15,000</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURATED COLLECTIONS / DEAL SHOWCASE ("DEAL") (Aura luxury-interior-59 style: 3 framed cards with overlaid white buttons) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-100">
            <div>
              <span className="block text-[10px] font-sans font-semibold tracking-[0.28em] text-gray-400 uppercase mb-1">
                FEATURED WHOLESALE LOTS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-gray-900 font-light tracking-wide">
                DEAL
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-sans tracking-widest uppercase text-gray-900 hover:text-gray-600 font-medium transition"
            >
              See all of today's deals &gt;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Deal Card 1 */}
            <div className="relative group overflow-hidden bg-gray-100 aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=800&q=80"
                alt="High-Grade Discus"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/15" />
              <div className="absolute bottom-6 left-6 right-6">
                <Link
                  href="/products?category=discus-angelfish"
                  className="block w-full py-3 bg-white text-gray-900 text-center font-sans text-xs font-semibold tracking-[0.2em] uppercase border border-gray-200 shadow-lg hover:bg-gray-50 transition"
                >
                  High-Grade Discus Lots
                </Link>
              </div>
            </div>

            {/* Deal Card 2 */}
            <div className="relative group overflow-hidden bg-gray-100 aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80"
                alt="Living Room Furniture"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/15" />
              <div className="absolute bottom-6 left-6 right-6">
                <Link
                  href="/products?category=cichlids"
                  className="block w-full py-3 bg-white text-gray-900 text-center font-sans text-xs font-semibold tracking-[0.2em] uppercase border border-gray-200 shadow-lg hover:bg-gray-50 transition"
                >
                  Malawi Cichlid Colonies
                </Link>
              </div>
            </div>

            {/* Deal Card 3 */}
            <div className="relative group overflow-hidden bg-gray-100 aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1584282676052-19e3c907b278?auto=format&fit=crop&w=800&q=80"
                alt="Lighting"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/15" />
              <div className="absolute bottom-6 left-6 right-6">
                <Link
                  href="/products?category=catfish-plecos"
                  className="block w-full py-3 bg-white text-gray-900 text-center font-sans text-xs font-semibold tracking-[0.2em] uppercase border border-gray-200 shadow-lg hover:bg-gray-50 transition"
                >
                  Exotic Plecos under ₹15,000
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CURATED DESIGN COLLECTIONS / CATEGORY GRID ("DESIGN") (Aura luxury-interior-59 style: Asymmetrical gallery grid) */}
      <section className="py-16 sm:py-20 bg-gray-50/70 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="block text-[10px] font-sans font-semibold tracking-[0.3em] text-gray-400 uppercase mb-2">
              CURATED SPECIES VIGNETTES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-gray-900 font-light tracking-wide">
              DESIGN & STRAINS
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORIES.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative overflow-hidden bg-white border border-gray-200 flex flex-col transition hover:border-gray-900"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase block mb-1">
                      CAT 0{idx + 1}
                    </span>
                    <h3 className="font-serif text-sm sm:text-base text-gray-900 font-normal leading-snug group-hover:underline">
                      {cat.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MULTI-SUPPLIER LIVE COMPARISON SECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-950 text-white p-8 sm:p-14 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="text-[10px] font-sans font-semibold tracking-[0.3em] text-gray-400 uppercase block mb-3">
                THE FINDOM COMPARISON ENGINE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-light leading-tight mb-4">
                Compare Multiple Breeders For the Same Species
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-8">
                Eliminate regional monopolies and price discrepancies. When 5 suppliers offer Red Marlboro Discus, inspect their size grades, farm locations, minimum order quantities, and live ratings side-by-side on a single page.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/compare/red-marlboro-discus"
                  className="px-6 py-3 bg-white text-gray-900 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-gray-100 transition"
                >
                  Compare Discus Offers
                </Link>
                <Link
                  href="/compare"
                  className="px-6 py-3 border border-gray-700 text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-gray-900 transition"
                >
                  Browse All Comparisons
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL ATELIER PHILOSOPHY & CONCIERGE PILLARS (Aura luxury-interior-59 style) */}
      <section className="py-16 sm:py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Policy Guarantees Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 pb-16 border-b border-gray-200">
            <div className="py-4 md:px-6">
              <h3 className="font-serif text-lg text-gray-900 font-normal mb-2">Free Shipping Policy</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Complimentary airport-to-airport air cargo freight on wholesale consignments over ₹15,000 across India.
              </p>
              <Link href="/air-cargo" className="text-[11px] font-semibold tracking-wider uppercase text-gray-900 hover:underline">
                Read Full Policy &gt;
              </Link>
            </div>

            <div className="py-4 md:px-6">
              <h3 className="font-serif text-lg text-gray-900 font-normal mb-2">Quarantine Quality</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Every live specimen undergoes minimum 7-day prophylactic conditioning and health screening prior to listing.
              </p>
              <Link href="/doa-policy" className="text-[11px] font-semibold tracking-wider uppercase text-gray-900 hover:underline">
                Learn More &gt;
              </Link>
            </div>

            <div className="py-4 md:px-6">
              <h3 className="font-serif text-lg text-gray-900 font-normal mb-2">Escrow Protection</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Your funds remain locked in neutral custody until you confirm live arrival and inspect pre-dispatch proof.
              </p>
              <Link href="/terms" className="text-[11px] font-semibold tracking-wider uppercase text-gray-900 hover:underline">
                Learn More &gt;
              </Link>
            </div>
          </div>

          {/* Concierge Service Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
            <div className="space-y-3">
              <div className="w-10 h-10 border border-gray-900 flex items-center justify-center text-gray-900">
                <Truck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="font-serif text-base text-gray-900 font-medium">White Glove Delivery</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                30mm insulated thermocol packaging, double oxygen bagging, and expedited airport terminal cargo dispatch for 24-hr transit.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 border border-gray-900 flex items-center justify-center text-gray-900">
                <Camera className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="font-serif text-base text-gray-900 font-medium">Pre-Dispatch Verification</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                The supplier captures high-res photographs of your packed stock before shipment. You review and sign off before the flight takes off.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 border border-gray-900 flex items-center justify-center text-gray-900">
                <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="font-serif text-base text-gray-900 font-medium">Curated Quality</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Direct partnerships with licensed breeding facilities across Kolathur (Chennai), Galiff Street (Kolkata), and Kerala.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. EDITORIAL TESTIMONIALS (Aura luxury-interior-59 style: Minimalist white with oversized decorative quote marks) */}
      <section className="py-20 sm:py-28 bg-white border-t border-gray-200 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="block text-[10px] font-sans font-semibold tracking-[0.3em] text-gray-400 uppercase mb-6">
            TESTIMONIALS
          </span>

          <div className="font-serif text-6xl text-gray-300 leading-none mb-4 select-none">
            “
          </div>

          <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-gray-900 font-light leading-relaxed italic max-w-3xl mx-auto mb-8">
            From the moment our curated discus lots arrived, our showroom was transformed into a sanctuary of unparalleled aquatic elegance. The pre-dispatch photos matched the live specimens 100%, and the airport freight arrived with 0% casualty. True luxury is not just seen, it is deeply felt in every transaction.
          </blockquote>

          <div className="text-xs font-sans tracking-[0.2em] text-gray-600 uppercase">
            — Deb Jones, Oceanic Blue Aquarium, Mumbai
          </div>
        </div>
      </section>
    </div>
  );
}
