'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Plane,
  Camera,
  Coins,
  CheckCircle2,
  SlidersHorizontal,
  Star,
  MapPin,
  TrendingUp,
  Sparkles,
  ChevronRight,
  ShoppingCart,
  Check,
  Building2,
  PackageCheck,
  BadgeCheck,
  Users,
  Award,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import { CATEGORIES, MASTER_PRODUCTS } from '@/lib/mock-data';

export default function HomePage() {
  const router = useRouter();
  const { listings, addToCart, reviews, allProfiles } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState('');
  const [addedListingId, setAddedListingId] = useState<string | null>(null);

  // Handle hero search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const handleAddToCart = (listing: any) => {
    addToCart(listing, listing.min_order_qty);
    setAddedListingId(listing.id);
    setTimeout(() => {
      setAddedListingId(null);
    }, 2000);
  };

  // Trending & Newly listed items
  const trendingListings = listings.slice(0, 6);

  // Verified Hatcheries (breeders)
  const verifiedBreeders = allProfiles.filter((p) => p.role === 'supplier' && p.verification_status === 'approved');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Toast Alert */}
      {addedListingId && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-brand-500/30 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Wholesale Lot Added</p>
            <p className="text-xs text-slate-300">Added MOQ to your supplier cart.</p>
          </div>
          <Link
            href="/cart"
            className="ml-3 text-xs font-semibold px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition"
          >
            View Cart
          </Link>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-navy-950 text-white pt-14 pb-20 lg:pt-20 lg:pb-28">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-600/15 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tag pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              Pan-India B2B Aquatic Live Trade
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              India’s First Transparent Wholesale Marketplace for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-sky-300 to-teal-200">
                Ornamental Fish Breeders & Retailers
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Source acclimated live stock directly from verified Kolathur, Kolkata & Kerala hatcheries.
              Inspect pre-dispatch photos, enjoy 24-hr airport cargo delivery, and pay with 100% Escrow DOA safety.
            </p>

            {/* Quick Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-2.5 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by variety (Discus, AFR Guppy, L-Pleco, Neon Tetra)..."
                    className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 shrink-0"
                >
                  Find Wholesale Stock
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Category Tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
              <span className="text-slate-400">Popular searches:</span>
              {[
                { label: 'Red Marlboro Discus', query: 'discus' },
                { label: 'Neon Tetras (Lot of 50)', query: 'tetra' },
                { label: 'AFR Albino Guppies', query: 'guppy' },
                { label: 'Zebra Pleco L046', query: 'pleco' },
                { label: 'Fire Red Shrimp', query: 'shrimp' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={`/products?q=${item.query}`}
                  className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Direct CTAs for Registration */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/auth/register/retailer"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-sky-400" />
                Register Aquarium Retail Shop
              </Link>
              <Link
                href="/auth/register/supplier"
                className="px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-200 text-xs sm:text-sm font-semibold transition flex items-center gap-2"
              >
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                Register Fish Breeding Farm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE MARKETPLACE STATS BANNER */}
      <section className="relative z-10 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-7 bg-white rounded-2xl shadow-xl border border-slate-200/80">
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">450+ Certified</p>
              <p className="text-xs text-slate-500 font-medium">Active Indian Breeders</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">1,200+ Strains</p>
              <p className="text-xs text-slate-500 font-medium">Acclimated Species & Grades</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">24-Hr Air Cargo</p>
              <p className="text-xs text-slate-500 font-medium">Guaranteed Live Arrival (DOA)</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">₹0 Brokerage</p>
              <p className="text-xs text-slate-500 font-medium">100% Direct Breeder Prices</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMPARE SUPPLIERS CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-brand-900 to-slate-900 p-8 sm:p-12 text-white shadow-2xl border border-brand-700/40">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-brand-500/20 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/20 text-brand-200 text-xs font-semibold mb-4 border border-brand-400/30">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Signature Findom Advantage
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Why Pay 30% More to Middlemen? Compare 5+ Certified Breeders for the Same Fish.
            </h2>

            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              Don’t settle for single-quote middlemen. Our comparison engine lets aquarium store owners see exact size grades, live stock counts, pricing in ₹, and breeder feedback across Chennai Kolathur, Kolkata Galiff St, and Kerala for every single species.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/compare/red-marlboro-discus"
                className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition shadow-lg shadow-brand-500/25 flex items-center gap-2"
              >
                Compare Red Marlboro Discus Offers
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/compare"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition border border-white/20 flex items-center gap-2"
              >
                Browse All Comparison Lines
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">Marketplace Taxonomy</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Shop by Aquatic Category
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            Explore all wholesale listings
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-200"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-slate-900/60 backdrop-blur-xs px-2 py-0.5 rounded">
                  Wholesale Lot
                </span>
              </div>
              <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 group-hover:text-brand-600 transition">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-brand-600 font-semibold">
                  <span>Browse strains</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. TRENDING & NEWLY LISTED FISH CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-semibold mb-2">
              <TrendingUp className="w-3.5 h-3.5" /> High Demand Wholesale Lots
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trending & Newly Listed Live Stock
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            View full stock catalog ({listings.length} lots)
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingListings.map((item) => {
            const hasMultipleOffers = listings.filter((l) => l.product_id === item.product_id).length > 1;

            return (
              <div
                key={item.id}
                className="flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition overflow-hidden group"
              >
                {/* Image & Badges */}
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.variety}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold">
                      MOQ: {item.min_order_qty} pcs
                    </span>
                    {item.available_qty < 50 && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold">
                        Only {item.available_qty} left
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <ShieldCheck className="w-3 h-3" />
                      DOA Protected
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-3">
                    <span className="text-[11px] font-semibold text-white/90 bg-slate-900/70 backdrop-blur-xs px-2 py-0.5 rounded">
                      {item.size_grade}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-600 transition">
                          {item.product?.common_name || item.variety}
                        </h3>
                        <p className="text-xs text-slate-500 italic mt-0.5">
                          {item.product?.scientific_name}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-lg font-black text-slate-900">
                          ₹{item.price_per_unit.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-medium">/ piece</span>
                      </div>
                    </div>

                    {/* Variety and Stock */}
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                      <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {item.variety}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">
                        {item.available_qty.toLocaleString('en-IN')} pcs ready
                      </span>
                    </div>

                    {/* Supplier info badge */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                          {item.supplier?.business_name.substring(0, 1)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 line-clamp-1 text-xs">
                            {item.supplier?.business_name}
                          </p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {item.location_city}, {item.location_state}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.supplier?.rating || 4.9}</span>
                        <span className="text-[10px] text-slate-400">({item.supplier?.review_count || 120})</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Add to Cart & Compare */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2.5">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 py-2.5 px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add Lot ({item.min_order_qty} pcs)
                    </button>

                    {hasMultipleOffers && item.product?.slug && (
                      <Link
                        href={`/compare/${item.product.slug}`}
                        className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1 shrink-0"
                        title="Compare other breeder offers"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
                        Compare
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. VERIFIED HATCHERIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-brand-400 tracking-wider uppercase">Direct-from-Source</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                Verified Indian Breeding Hubs
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
                Commercial ornamental fish hatcheries physically verified with GST compliance, disease quarantine, and air-freight packing SOPs.
              </p>
            </div>
            <Link
              href="/suppliers"
              className="text-xs sm:text-sm font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 group"
            >
              See all verified hatcheries
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verifiedBreeders.map((breeder) => (
              <div
                key={breeder.id}
                className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 flex flex-col justify-between hover:border-brand-500/50 transition group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-teal-500 flex items-center justify-center text-white font-black text-lg">
                      {breeder.business_name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-white mt-4 group-hover:text-brand-400 transition">
                    {breeder.business_name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {breeder.address || `${breeder.city}, ${breeder.state}`}
                  </p>

                  <div className="mt-4 flex items-center gap-3 text-xs text-slate-300">
                    <div className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{breeder.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{breeder.review_count} verified wholesale orders</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Owner: {breeder.owner_name}</span>
                  <Link
                    href={`/products?supplier=${breeder.id}`}
                    className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                  >
                    View stock →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HOW FINDOM PROTECTS RETAILERS & BREEDERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">Buyer & Seller Safeguards</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            How Findom Protects Retailers & Breeders
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Eliminating live fish wholesale fraud, poor packing, and transit death disputes with 3 automated pillars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-brand-600 border border-teal-100 flex items-center justify-center mb-6">
              <Camera className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Step 01</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
              Pre-Dispatch Photo & Health Inspection
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Before sealing cargo boxes, breeders upload high-resolution photos and videos showing the exact lot, fin condition, and oxygen bagging. Retailers inspect and give approval on mobile before the shipment leaves for the airport.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-teal-700">
              <CheckCircle2 className="w-4 h-4" /> Zero surprise sizing or bad color
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Step 02</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
              B2B Escrow Payment Protection
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When an order is placed, payments are safely held in Findom Escrow. Breeder payouts are released only after the retailer receives the air cargo and confirms healthy delivery. Neither side is ever at risk of non-payment or vanished stock.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-purple-700">
              <CheckCircle2 className="w-4 h-4" /> Safe NEFT / RTGS / UPI settlement
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center mb-6">
              <Plane className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Step 03</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
              24-Hr Air Cargo & DOA Claim Policy
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              All live orders fly via Indigo / BlueDart domestic air cargo in thick thermocol insulated boxes with medical pure oxygen. In case of transit casualty (Dead-On-Arrival), retail shops upload unboxing photos within 2 hours for instant credit.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-sky-700">
              <CheckCircle2 className="w-4 h-4" /> 100% fair Dead-On-Arrival coverage
            </div>
          </div>
        </div>
      </section>

      {/* 8. VERIFIED CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">Retailer Experiences</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Verified Feedback from Aquarium Store Owners
            </h2>
          </div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-slate-800">4.9 / 5.0 Pan-India Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Purchase
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{rev.retailer_name}</h4>
                  <p className="text-[11px] text-slate-500">{rev.retailer_location}</p>
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(rev.created_at).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
