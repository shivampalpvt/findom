'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  TrendingDown,
  Layers,
  Sparkles,
  Building2,
  CheckCircle2,
  ChevronRight,
  Fish,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import { MASTER_PRODUCTS, CATEGORIES } from '@/lib/mock-data';

export default function CompareLandingPage() {
  const { listings } = useMarketplace();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Group listings by product_id
  const productOfferGroups = MASTER_PRODUCTS.map((product) => {
    const productListings = listings.filter((l) => l.product_id === product.id);
    const prices = productListings.map((l) => l.price_per_unit);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;
    const totalStock = productListings.reduce((sum, l) => sum + l.available_qty, 0);

    return {
      product,
      listings: productListings,
      offerCount: productListings.length,
      minPrice,
      maxPrice,
      totalStock,
      category: CATEGORIES.find((c) => c.id === product.category_id),
    };
  }).filter((group) => group.offerCount > 0);

  const filteredGroups = selectedCategory === 'all'
    ? productOfferGroups
    : productOfferGroups.filter((g) => g.product.category_id === selectedCategory);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-navy-950 text-white pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-4 border border-brand-500/30">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Multi-Breeder Comparison Engine
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Compare Wholesale Offers Across Certified Indian Hatcheries
            </h1>

            <p className="mt-4 text-base text-slate-300 leading-relaxed">
              Wholesale pricing, grading, and minimum order quantities vary wildly between Kolathur (Chennai), Galiff Street (Kolkata), and Kochi breeders. Select a fish species to inspect side-by-side offers and optimize your store’s profit margins.
            </p>

            {/* Quick Benefits Strip */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Save 15% - 30% per lot</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Uniform DOA protection</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Direct breeder verification</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white p-3 rounded-2xl shadow-lg border border-slate-200/90 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedCategory === 'all'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Species ({productOfferGroups.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition ${
                selectedCategory === cat.id
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Species Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Available Multi-Supplier Comparison Lines
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredGroups.length} aquatic strains
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => {
            const hasSavings = group.offerCount > 1 && group.maxPrice > group.minPrice;
            const savingsPercent = hasSavings
              ? Math.round(((group.maxPrice - group.minPrice) / group.maxPrice) * 100)
              : 0;

            return (
              <div
                key={group.product.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image & Header */}
                  <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                    <img
                      src={group.product.default_image}
                      alt={group.product.common_name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    {/* Offer Count Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-lg bg-brand-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                        <Building2 className="w-3.5 h-3.5" />
                        {group.offerCount} Breeder {group.offerCount === 1 ? 'Offer' : 'Offers'}
                      </span>
                    </div>

                    {/* Savings tag */}
                    {hasSavings && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-md">
                          <TrendingDown className="w-3.5 h-3.5" />
                          Up to {savingsPercent}% Price Spread
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-2 left-3 right-3 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                        {group.category?.name || 'Freshwater'}
                      </span>
                      <h3 className="text-base font-bold text-white line-clamp-1">
                        {group.product.common_name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-slate-500 italic line-clamp-1">
                      {group.product.scientific_name}
                    </p>

                    {/* Price Range */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                          Wholesale Price Range
                        </span>
                        <div className="text-base font-black text-slate-900 mt-0.5">
                          {group.offerCount > 1 && group.minPrice !== group.maxPrice ? (
                            <>
                              ₹{group.minPrice.toLocaleString('en-IN')}{' '}
                              <span className="text-slate-400 font-normal text-xs">-</span>{' '}
                              ₹{group.maxPrice.toLocaleString('en-IN')}
                            </>
                          ) : (
                            <>₹{group.minPrice.toLocaleString('en-IN')}</>
                          )}
                          <span className="text-[11px] text-slate-500 font-normal"> / piece</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                          Ready Stock
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          {group.totalStock.toLocaleString('en-IN')} pcs
                        </span>
                      </div>
                    </div>

                    {/* Breeders Offering This Fish */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                        Participating Hatcheries:
                      </span>
                      <div className="space-y-1.5">
                        {group.listings.map((l) => (
                          <div
                            key={l.id}
                            className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0"
                          >
                            <span className="font-medium text-slate-800 line-clamp-1 flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {l.supplier?.business_name} ({l.location_city})
                            </span>
                            <span className="font-bold text-slate-900 shrink-0">
                              ₹{l.price_per_unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <Link
                    href={`/compare/${group.product.slug}`}
                    className="w-full py-3 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 group/btn shadow-xs"
                  >
                    Compare All {group.offerCount} Offers
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
