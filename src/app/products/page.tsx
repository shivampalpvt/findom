'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Star,
  MapPin,
  ShoppingCart,
  Check,
  ShieldCheck,
  ChevronDown,
  ArrowUpDown,
  RefreshCw,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import { CATEGORIES } from '@/lib/mock-data';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const initialSupplier = searchParams.get('supplier') || 'all';

  const { listings, addToCart } = useMarketplace();

  // Filter States
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedWaterType, setSelectedWaterType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState(initialSupplier);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating-desc' | 'moq-asc' | 'stock-desc'>('price-asc');
  
  // Custom quantities per listing
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  const [addedId, setAddedId] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available locations
  const availableLocations = useMemo(() => {
    const locs = new Set<string>();
    listings.forEach((l) => {
      if (l.location_city) locs.add(l.location_city);
    });
    return Array.from(locs).sort();
  }, [listings]);

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // Query search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCommon = item.product?.common_name.toLowerCase().includes(q);
          const matchScientific = item.product?.scientific_name.toLowerCase().includes(q);
          const matchVariety = item.variety.toLowerCase().includes(q);
          const matchSupplier = item.supplier?.business_name.toLowerCase().includes(q);
          const matchLocation = `${item.location_city} ${item.location_state}`.toLowerCase().includes(q);
          if (!matchCommon && !matchScientific && !matchVariety && !matchSupplier && !matchLocation) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all') {
          const cat = CATEGORIES.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
          if (cat && item.product?.category_id !== cat.id) {
            return false;
          }
        }

        // Water type filter
        if (selectedWaterType !== 'all') {
          if (item.product?.water_type !== selectedWaterType) {
            return false;
          }
        }

        // Location filter
        if (selectedLocation !== 'all') {
          if (item.location_city !== selectedLocation) {
            return false;
          }
        }

        // Supplier filter
        if (selectedSupplier !== 'all') {
          if (item.supplier_id !== selectedSupplier) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price_per_unit - b.price_per_unit;
        if (sortBy === 'price-desc') return b.price_per_unit - a.price_per_unit;
        if (sortBy === 'rating-desc') return (b.supplier?.rating || 0) - (a.supplier?.rating || 0);
        if (sortBy === 'moq-asc') return a.min_order_qty - b.min_order_qty;
        if (sortBy === 'stock-desc') return b.available_qty - a.available_qty;
        return 0;
      });
  }, [listings, searchQuery, selectedCategory, selectedWaterType, selectedLocation, selectedSupplier, sortBy]);

  const handleQtyChange = (listingId: string, value: number, moq: number, max: number) => {
    const validVal = Math.max(moq, Math.min(value, max));
    setQuantities((prev) => ({ ...prev, [listingId]: validVal }));
  };

  const handleAddToCart = (listing: any) => {
    const qty = quantities[listing.id] || listing.min_order_qty;
    addToCart(listing, qty);
    setAddedId(listing.id);
    setTimeout(() => {
      setAddedId(null);
    }, 2000);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedWaterType('all');
    setSelectedLocation('all');
    setSelectedSupplier('all');
    setSortBy('price-asc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification */}
      {addedId && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-brand-500/30 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Wholesale Lot Added</p>
            <p className="text-xs text-slate-300">Item placed into your supplier grouped cart.</p>
          </div>
          <Link
            href="/cart"
            className="ml-3 text-xs font-semibold px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition"
          >
            Open Cart
          </Link>
        </div>
      )}

      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/" className="hover:text-slate-900">Marketplace</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Wholesale Aquatic Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Live Fish Wholesale Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time direct pricing from certified Indian hatcheries. All shipments include 24h air-cargo DOA coverage.
          </p>
        </div>

        {/* Quick Compare Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl border border-brand-200 transition shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            Compare Breeder Offers
          </Link>
        </div>
      </div>

      {/* Layout Grid: Sidebar Filters & Main Results */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 text-xs font-bold text-slate-800"
          >
            <Filter className="w-4 h-4 text-brand-600" />
            {mobileFilterOpen ? 'Hide Filters' : 'Show Filters & Sort'}
          </button>
          <span className="text-xs text-slate-500">
            {filteredListings.length} results
          </span>
        </div>

        {/* Left Filter Sidebar */}
        <aside
          className={`lg:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } bg-white rounded-2xl border border-slate-200/90 p-5 space-y-6 shadow-xs h-fit sticky top-24`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-600" />
              Filter Stock
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs text-slate-400 hover:text-brand-600 flex items-center gap-1 transition"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Search Input in Sidebar */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Search Species or Farm
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Discus, Guppy, Kolathur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Category
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg font-medium transition ${
                  selectedCategory === 'all'
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories ({listings.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = listings.filter((l) => l.product?.category_id === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg font-medium flex items-center justify-between transition ${
                      selectedCategory === cat.slug
                        ? 'bg-brand-50 text-brand-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Water Type Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Water Type
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'All', value: 'all' },
                { label: 'Freshwater', value: 'Freshwater' },
                { label: 'Marine Reef', value: 'Marine' },
              ].map((wt) => (
                <button
                  key={wt.value}
                  onClick={() => setSelectedWaterType(wt.value)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium border text-center transition ${
                    selectedWaterType === wt.value
                      ? 'bg-brand-600 border-brand-600 text-white font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {wt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location / Breeding Hub Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Hatchery Location
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedLocation('all')}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg font-medium transition ${
                  selectedLocation === 'all'
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Breeding Hubs
              </button>
              {availableLocations.map((loc) => {
                const count = listings.filter((l) => l.location_city === loc).length;
                return (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocation(loc)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg font-medium flex items-center justify-between transition ${
                      selectedLocation === loc
                        ? 'bg-brand-50 text-brand-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {loc}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Safety Guarantee Info */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              100% Escrow Protection
            </div>
            <p className="leading-relaxed">
              Payments released to breeders only after 2-hour post-flight delivery inspection confirmation.
            </p>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="lg:col-span-3">
          {/* Top Control Bar: Total Count & Sort Dropdown */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Showing <span className="font-bold text-slate-900">{filteredListings.length}</span> wholesale lots ready for air-cargo dispatch
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-medium shrink-0 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="price-asc">Lowest Price (₹ / unit)</option>
                <option value="price-desc">Highest Price (₹ / unit)</option>
                <option value="rating-desc">Breeder Rating (Highest)</option>
                <option value="moq-asc">Minimum Order Qty (Lowest MOQ)</option>
                <option value="stock-desc">Available Stock (Highest)</option>
              </select>
            </div>
          </div>

          {/* Empty State */}
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-slate-800">No matching wholesale listings found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try adjusting your search keywords, clear category selections, or select all breeding locations.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-500 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Product Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((item) => {
                const currentQty = quantities[item.id] || item.min_order_qty;
                const hasMultipleOffers = listings.filter((l) => l.product_id === item.product_id).length > 1;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition overflow-hidden group"
                  >
                    {/* Visual Media Header */}
                    <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                      <img
                        src={item.images[0]}
                        alt={item.variety}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />

                      {/* MOQ Badge */}
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold">
                          MOQ: {item.min_order_qty} pcs
                        </span>
                      </div>

                      {/* Water Type / Status Badge */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                          <ShieldCheck className="w-3 h-3" />
                          DOA Insured
                        </span>
                      </div>

                      {/* Size Grade Strip */}
                      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white">
                        <span className="font-semibold bg-slate-900/70 backdrop-blur-xs px-2 py-0.5 rounded">
                          {item.size_grade}
                        </span>
                        <span className="text-[10px] bg-brand-600/90 backdrop-blur-xs px-1.5 py-0.5 rounded font-bold">
                          {item.product?.water_type}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title and Price */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition line-clamp-1">
                              {item.product?.common_name || item.variety}
                            </h3>
                            <p className="text-[11px] text-slate-500 italic mt-0.5 line-clamp-1">
                              {item.product?.scientific_name}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-base font-black text-slate-900">
                              ₹{item.price_per_unit.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-medium">/ piece</span>
                          </div>
                        </div>

                        {/* Variety and Stock */}
                        <div className="mt-2.5 flex items-center gap-2 text-xs">
                          <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {item.variety}
                          </span>
                          <span className="text-emerald-700 font-bold text-[11px]">
                            {item.available_qty.toLocaleString('en-IN')} ready
                          </span>
                        </div>

                        {/* Supplier Info */}
                        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
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

                          <div className="flex items-center gap-1 text-amber-500 font-bold text-xs shrink-0">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{item.supplier?.rating || 4.8}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-slate-500 font-medium">Order Quantity:</span>
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                            <button
                              onClick={() =>
                                handleQtyChange(
                                  item.id,
                                  currentQty - (item.min_order_qty >= 10 ? 5 : 1),
                                  item.min_order_qty,
                                  item.available_qty
                                )
                              }
                              className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={item.min_order_qty}
                              max={item.available_qty}
                              value={currentQty}
                              onChange={(e) =>
                                handleQtyChange(
                                  item.id,
                                  parseInt(e.target.value) || item.min_order_qty,
                                  item.min_order_qty,
                                  item.available_qty
                                )
                              }
                              className="w-14 text-center bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                            />
                            <button
                              onClick={() =>
                                handleQtyChange(
                                  item.id,
                                  currentQty + (item.min_order_qty >= 10 ? 5 : 1),
                                  item.min_order_qty,
                                  item.available_qty
                                )
                              }
                              className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="flex-1 py-2 px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add ₹{(item.price_per_unit * currentQty).toLocaleString('en-IN')}
                          </button>

                          {hasMultipleOffers && item.product?.slug && (
                            <Link
                              href={`/compare/${item.product.slug}`}
                              className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1 shrink-0"
                              title="Compare other breeder offers"
                            >
                              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
                              Compare
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">
          Loading aquatic wholesale catalog...
        </div>
      }
    >
      <ProductsCatalogContent />
    </Suspense>
  );
}
