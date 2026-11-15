'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  Check,
  ShoppingCart,
  TrendingDown,
  Building2,
  Table,
  LayoutGrid,
  CheckCircle2,
  Info,
  ChevronRight,
  Sparkles,
  Plane,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import { MASTER_PRODUCTS, CATEGORIES } from '@/lib/mock-data';

export default function CompareSlugPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { listings, addToCart } = useMarketplace();

  // Find product by slug
  const product = MASTER_PRODUCTS.find((p) => p.slug === slug);

  // If no product found, show 404 or return not found
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Fish Species Not Found</h1>
        <p className="text-sm text-slate-500 mt-2">The requested aquatic species comparison is unavailable.</p>
        <Link
          href="/compare"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          Browse All Comparison Lines
        </Link>
      </div>
    );
  }

  // Get all listings for this product
  const productListings = listings.filter((l) => l.product_id === product.id);
  const category = CATEGORIES.find((c) => c.id === product.category_id);

  // States
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  const [addedListingId, setAddedListingId] = useState<string | null>(null);

  // Lowest price calculations
  const lowestPrice = productListings.length
    ? Math.min(...productListings.map((l) => l.price_per_unit))
    : 0;

  const highestPrice = productListings.length
    ? Math.max(...productListings.map((l) => l.price_per_unit))
    : 0;

  const handleQtyChange = (listingId: string, val: number, moq: number, max: number) => {
    const valid = Math.max(moq, Math.min(val, max));
    setQuantities((prev) => ({ ...prev, [listingId]: valid }));
  };

  const handleAddToCart = (listing: any) => {
    const qty = quantities[listing.id] || listing.min_order_qty;
    addToCart(listing, qty);
    setAddedListingId(listing.id);
    setTimeout(() => {
      setAddedListingId(null);
    }, 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Toast Notification */}
      {addedListingId && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-brand-500/30 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Wholesale Lot Added</p>
            <p className="text-xs text-slate-300">Item placed into your supplier-separated order.</p>
          </div>
          <Link
            href="/cart"
            className="ml-3 text-xs font-semibold px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition"
          >
            Go to Cart
          </Link>
        </div>
      )}

      {/* Breadcrumb & Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <span>/</span>
            <Link href="/compare" className="hover:text-slate-900">Compare Suppliers</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{product.common_name}</span>
          </div>
        </div>
      </div>

      {/* Species Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-950 to-slate-900 text-white py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700 shrink-0 shadow-xl">
                <img
                  src={product.default_image}
                  alt={product.common_name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
                    {category?.name || 'Aquatic Specimen'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
                    {product.water_type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
                    Care: {product.care_level}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  {product.common_name}
                </h1>
                <p className="text-sm text-slate-400 italic mt-0.5">
                  {product.scientific_name}
                </p>
                <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Price Snapshot Card */}
            <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shrink-0 lg:w-72 shadow-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Active Supplier Range
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                ₹{lowestPrice.toLocaleString('en-IN')}{' '}
                {highestPrice > lowestPrice && (
                  <span className="text-slate-400 text-lg font-normal">
                    - ₹{highestPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-slate-400 font-normal"> / pc</span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between text-xs text-slate-300">
                <span>Verified Breeders:</span>
                <span className="font-bold text-emerald-400">{productListings.length} Farms</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-300">
                <span>Total Ready Stock:</span>
                <span className="font-bold text-white">
                  {productListings.reduce((sum, l) => sum + l.available_qty, 0).toLocaleString('en-IN')} pcs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Controls: View Mode Switcher and Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-600" />
              Verified Breeder Quotations ({productListings.length} Approved Offers)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare variety strain, minimum order quantity, size grade, and city of origin.
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-white p-1 border border-slate-200 shadow-xs">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'cards'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Comparison Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'table'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-4 h-4" />
              Specs Matrix Table
            </button>
          </div>
        </div>

        {/* VIEW 1: SIDE-BY-SIDE COMPARISON CARDS */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productListings.map((listing) => {
              const currentQty = quantities[listing.id] || listing.min_order_qty;
              const isBestPrice = listing.price_per_unit === lowestPrice;

              return (
                <div
                  key={listing.id}
                  className={`bg-white rounded-2xl border transition duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl ${
                    isBestPrice ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200/90'
                  }`}
                >
                  <div>
                    {/* Media header */}
                    <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                      <img
                        src={listing.images[0]}
                        alt={listing.variety}
                        className="w-full h-full object-cover"
                      />

                      {/* Best price highlight */}
                      {isBestPrice && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                            <TrendingDown className="w-3.5 h-3.5" />
                            Lowest Price
                          </span>
                        </div>
                      )}

                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                          MOQ: {listing.min_order_qty} pcs
                        </span>
                      </div>

                      <div className="absolute bottom-2 left-3">
                        <span className="text-[11px] font-bold text-white bg-slate-900/70 backdrop-blur-xs px-2 py-0.5 rounded">
                          {listing.size_grade}
                        </span>
                      </div>
                    </div>

                    {/* Breeder & Offer Body */}
                    <div className="p-5 space-y-4">
                      {/* Price Header */}
                      <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                            Variety Strain
                          </span>
                          <h3 className="font-bold text-base text-slate-900">
                            {listing.variety}
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-black text-slate-900">
                            ₹{listing.price_per_unit.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-medium">/ piece</span>
                        </div>
                      </div>

                      {/* Breeder Profile Details */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-brand-600" />
                            {listing.supplier?.business_name}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {listing.location_city}, {listing.location_state}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{listing.supplier?.rating || 4.8}</span>
                            <span className="text-slate-400 font-normal">({listing.supplier?.review_count || 80})</span>
                          </div>
                        </div>
                      </div>

                      {/* Spec Matrix Checklist */}
                      <div className="text-xs space-y-2 pt-1 text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Size / Grade:</span>
                          <span className="font-semibold text-slate-900">{listing.size_grade}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Available Stock:</span>
                          <span className="font-semibold text-emerald-700">{listing.available_qty.toLocaleString('en-IN')} pcs ready</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Transit Packing:</span>
                          <span className="font-semibold text-slate-900">Medical O2 + Thermocol</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">DOA Policy:</span>
                          <span className="font-semibold text-teal-700">24-hr Air Cargo Guaranteed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Selector Footer */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Quantity (MOQ {listing.min_order_qty}):</span>
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() =>
                              handleQtyChange(
                                listing.id,
                                currentQty - (listing.min_order_qty >= 10 ? 5 : 1),
                                listing.min_order_qty,
                                listing.available_qty
                              )
                            }
                            className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={listing.min_order_qty}
                            max={listing.available_qty}
                            value={currentQty}
                            onChange={(e) =>
                              handleQtyChange(
                                listing.id,
                                parseInt(e.target.value) || listing.min_order_qty,
                                listing.min_order_qty,
                                listing.available_qty
                              )
                            }
                            className="w-14 text-center bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                          />
                          <button
                            onClick={() =>
                              handleQtyChange(
                                listing.id,
                                currentQty + (listing.min_order_qty >= 10 ? 5 : 1),
                                listing.min_order_qty,
                                listing.available_qty
                              )
                            }
                            className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(listing)}
                        className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Order Lot (₹{(listing.price_per_unit * currentQty).toLocaleString('en-IN')})
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: SEMANTIC COMPARISON DATA TABLE (Modern Web Guidance Compliant) */}
        {viewMode === 'table' && (
          <div
            tabIndex={0}
            role="region"
            aria-label={`Wholesale supplier comparison for ${product.common_name}`}
            className="table-wrapper bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <table className="w-full border-collapse text-left text-xs min-w-[750px]">
              <caption className="sr-only">
                Comparison of approved breeders and offers for {product.common_name}
              </caption>
              <thead className="bg-slate-900 text-white sticky top-0 z-10">
                <tr>
                  <th scope="col" className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">
                    Hatchery / Breeder
                  </th>
                  <th scope="col" className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">
                    Location
                  </th>
                  <th scope="col" className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">
                    Variety / Strain
                  </th>
                  <th scope="col" className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">
                    Size Grade
                  </th>
                  <th scope="col" className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">
                    Price / Unit
                  </th>
                  <th scope="col" className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">
                    MOQ
                  </th>
                  <th scope="col" className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">
                    Stock
                  </th>
                  <th scope="col" className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-right">
                    Wholesale Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productListings.map((listing) => {
                  const currentQty = quantities[listing.id] || listing.min_order_qty;
                  const isBestPrice = listing.price_per_unit === lowestPrice;

                  return (
                    <tr
                      key={listing.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isBestPrice ? 'bg-brand-50/30' : ''
                      }`}
                    >
                      {/* Hatchery */}
                      <th scope="row" className="py-4 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0 text-xs">
                            {listing.supplier?.business_name.substring(0, 1)}
                          </div>
                          <div>
                            <span className="block">{listing.supplier?.business_name}</span>
                            <div className="flex items-center gap-1 text-[10px] text-amber-500 font-semibold mt-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{listing.supplier?.rating || 4.8}</span>
                              <span className="text-slate-400 font-normal">({listing.supplier?.review_count || 80})</span>
                            </div>
                          </div>
                        </div>
                      </th>

                      {/* Location */}
                      <td className="py-4 px-4 text-slate-600">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {listing.location_city}, {listing.location_state}
                        </span>
                      </td>

                      {/* Variety */}
                      <td className="py-4 px-4 font-semibold text-slate-800">
                        {listing.variety}
                      </td>

                      {/* Size Grade */}
                      <td className="py-4 px-4 text-slate-600 font-medium">
                        {listing.size_grade}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-slate-900 text-sm">
                            ₹{listing.price_per_unit.toLocaleString('en-IN')}
                          </span>
                          {isBestPrice && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              Lowest
                            </span>
                          )}
                        </div>
                      </td>

                      {/* MOQ */}
                      <td className="py-4 px-4 text-slate-700 font-bold">
                        {listing.min_order_qty} pcs
                      </td>

                      {/* Stock */}
                      <td className="py-4 px-4 text-emerald-700 font-bold">
                        {listing.available_qty.toLocaleString('en-IN')} pcs
                      </td>

                      {/* Order Action */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                            <button
                              onClick={() =>
                                handleQtyChange(
                                  listing.id,
                                  currentQty - (listing.min_order_qty >= 10 ? 5 : 1),
                                  listing.min_order_qty,
                                  listing.available_qty
                                )
                              }
                              className="px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={listing.min_order_qty}
                              max={listing.available_qty}
                              value={currentQty}
                              onChange={(e) =>
                                handleQtyChange(
                                  listing.id,
                                  parseInt(e.target.value) || listing.min_order_qty,
                                  listing.min_order_qty,
                                  listing.available_qty
                                )
                              }
                              className="w-12 text-center bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                            />
                            <button
                              onClick={() =>
                                handleQtyChange(
                                  listing.id,
                                  currentQty + (listing.min_order_qty >= 10 ? 5 : 1),
                                  listing.min_order_qty,
                                  listing.available_qty
                                )
                              }
                              className="px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleAddToCart(listing)}
                            className="py-1.5 px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 shadow-xs"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add (₹{(listing.price_per_unit * currentQty).toLocaleString('en-IN')})
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Protection & Quality Notice */}
        <div className="mt-8 bg-brand-50/60 rounded-2xl p-6 border border-brand-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                100% Pre-Dispatch Photo Inspection & Live Arrival Guarantee
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Whichever breeder you select above, Findom mandates photo approval before domestic air cargo packaging. Funds remain safely held in Escrow.
              </p>
            </div>
          </div>

          <Link
            href="/cart"
            className="px-5 py-2.5 bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shrink-0 shadow-sm"
          >
            Review Grouped Cart
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Other Popular Species to Compare */}
        <div className="mt-16 pt-10 border-t border-slate-200">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Also Compare Other Popular Live Stock:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MASTER_PRODUCTS.filter((p) => p.slug !== slug).slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href={`/compare/${p.slug}`}
                className="group p-3 bg-white rounded-xl border border-slate-200 hover:border-brand-500 transition shadow-xs flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <img src={p.default_image} alt={p.common_name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition truncate">
                    {p.common_name}
                  </p>
                  <p className="text-[10px] text-slate-400 italic truncate">
                    {p.scientific_name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
