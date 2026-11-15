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
  Tag,
  Fish,
  Waves,
  Feather,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import { CATEGORIES } from '@/lib/mock-data';

const CATEGORY_SUB_VARIETIES: Record<string, { label: string; query: string }[]> = {
  'live-fish': [
    { label: 'All Live Fish', query: 'all' },
    { label: 'Discus Fish', query: 'discus' },
    { label: 'Exotic Guppies', query: 'guppy' },
    { label: 'Tetras & Schooling', query: 'tetra' },
    { label: 'Lake Malawi Cichlids', query: 'cichlid' },
    { label: 'L-Number Plecos', query: 'pleco' },
  ],
  'tanks-bowls': [
    { label: 'All Tanks & Bowls', query: 'all' },
    { label: 'Rimless Opti-White Tanks', query: 'rimless' },
    { label: 'Curved Glass Bowls', query: 'bowl' },
    { label: 'Commercial Breeder Tubs', query: 'tub' },
  ],
  'fish-food': [
    { label: 'All Fish Food', query: 'all' },
    { label: 'Discus Bio-Gold Granules', query: 'granules' },
    { label: 'TetraBits Color Pellets', query: 'pellets' },
    { label: 'Freeze-Dried Bloodworms', query: 'bloodworms' },
  ],
  'turtle-food': [
    { label: 'All Turtle Food', query: 'all' },
    { label: 'Floating Turtle Sticks', query: 'sticks' },
    { label: 'Sun-Dried Gammarus Shrimp', query: 'gammarus' },
  ],
  'equipment-care': [
    { label: 'All Equipment & Care', query: 'all' },
    { label: 'HOB Filters (Hang-on-Back)', query: 'hob' },
    { label: 'Oxygen Air Pumps', query: 'oxygen' },
    { label: 'Bio-Sponges', query: 'sponge' },
    { label: 'Anti-Chlorine Treatments', query: 'chlorine' },
    { label: 'Water Conditioners', query: 'conditioner' },
  ],
};

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const initialSupplier = searchParams.get('supplier') || 'all';

  const { listings, addToCart } = useMarketplace();

  // Filter States
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedVariety, setSelectedVariety] = useState('all');
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

  // Handle category switch
  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setSelectedVariety('all'); // reset sub-variety filter on category change
  };

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

        // Variety / Sub-product filter
        if (selectedVariety !== 'all') {
          const v = selectedVariety.toLowerCase();
          const matchVariety = item.variety.toLowerCase().includes(v);
          const matchName = item.product?.common_name.toLowerCase().includes(v);
          const matchDesc = item.product?.description.toLowerCase().includes(v);
          if (!matchVariety && !matchName && !matchDesc) {
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
  }, [listings, searchQuery, selectedCategory, selectedVariety, selectedLocation, selectedSupplier, sortBy]);

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
    setSelectedVariety('all');
    setSelectedLocation('all');
    setSelectedSupplier('all');
    setSortBy('price-asc');
  };

  // Active category display title
  const activeCategoryTitle = useMemo(() => {
    if (selectedCategory === 'all') return 'Wholesale Aquatic & Pet Store Catalog';
    const found = CATEGORIES.find((c) => c.slug === selectedCategory);
    return found ? `${found.name} Wholesale Catalog` : 'Wholesale Catalog';
  }, [selectedCategory]);

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
            <p className="text-xs text-slate-300">Item placed into your supplier-grouped cart.</p>
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
            <span className="text-slate-900 font-semibold">{activeCategoryTitle}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {activeCategoryTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Source live fish, glass tanks, turtle &amp; fish foods, HOB filters, oxygen pumps, and water conditioners directly from verified Indian distributors.
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

      {/* 1. TOP CATEGORY SELECTION BAR */}
      <div className="mt-6 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Products ({listings.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = listings.filter((l) => l.product?.category_id === cat.id).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition flex items-center gap-2 ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. SUB-VARIETY / SUB-PRODUCT PILLS BAR (Category specific) */}
        {selectedCategory !== 'all' && CATEGORY_SUB_VARIETIES[selectedCategory] && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" />
              Filter Variety:
            </span>
            {CATEGORY_SUB_VARIETIES[selectedCategory].map((sub) => {
              const isActive = selectedVariety === sub.query;
              return (
                <button
                  key={sub.query}
                  onClick={() => setSelectedVariety(sub.query)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition ${
                    isActive
                      ? 'bg-brand-100 text-brand-900 font-bold border border-brand-300'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        )}
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
              Filter Catalog
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
              Search Products &amp; Brands
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Discus, HOB filter, Anti-chlorine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Product Category
            </label>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              <button
                onClick={() => handleCategorySelect('all')}
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
                    onClick={() => handleCategorySelect(cat.slug)}
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

          {/* Sub-Variety Selector in Sidebar */}
          {selectedCategory !== 'all' && CATEGORY_SUB_VARIETIES[selectedCategory] && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Specific Item / Variety
              </label>
              <div className="space-y-1">
                {CATEGORY_SUB_VARIETIES[selectedCategory].map((sub) => (
                  <button
                    key={sub.query}
                    onClick={() => setSelectedVariety(sub.query)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg font-medium transition ${
                      selectedVariety === sub.query
                        ? 'bg-brand-50 text-brand-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location / Breeding Hub Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Supplier Location / Hub
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
                All Wholesale Hubs
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
              Payments released to breeders &amp; suppliers only after delivery inspection sign-off.
            </p>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="lg:col-span-3">
          {/* Top Control Bar: Total Count & Sort Dropdown */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Showing <span className="font-bold text-slate-900">{filteredListings.length}</span> wholesale products available for commercial ordering
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Supplier Rating</option>
                <option value="moq-asc">Lowest Minimum Order (MOQ)</option>
                <option value="stock-desc">Available Stock Quantity</option>
              </select>
            </div>
          </div>

          {/* Empty State */}
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800">No matching wholesale listings found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                We couldn&apos;t find products matching your current category or search filters. Try clearing filters or searching for alternative species.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Product Listings Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredListings.map((item) => {
                const currentQty = quantities[item.id] || item.min_order_qty;
                const totalItemCost = currentQty * item.price_per_unit;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Product Image & Badges */}
                      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                        <img
                          src={item.images[0] || item.product?.default_image}
                          alt={item.product?.common_name || 'Product'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                            MOQ: {item.min_order_qty} units
                          </span>
                        </div>
                        <div className="absolute top-2.5 right-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-900 shadow-xs backdrop-blur-xs">
                            {item.available_qty} in stock
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 space-y-2.5">
                        {/* Title and Variety */}
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition line-clamp-1">
                            {item.product?.common_name}
                          </h3>
                          <p className="text-[11px] text-slate-500 italic font-serif line-clamp-1">
                            {item.variety}
                          </p>
                        </div>

                        {/* Specifications */}
                        <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] space-y-1 text-slate-600">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Spec / Grade:</span>
                            <span className="font-medium text-slate-800">{item.size_grade}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Supplier:</span>
                            <span className="font-semibold text-slate-900 truncate max-w-[140px]">
                              {item.supplier?.business_name}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5" /> Hub:
                            </span>
                            <span className="text-slate-700">{item.location_city}, {item.location_state}</span>
                          </div>
                        </div>

                        {/* Supplier Rating */}
                        <div className="flex items-center justify-between text-xs pt-1">
                          <div className="flex items-center gap-1 text-amber-600 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-500 stroke-none" />
                            <span>{item.supplier?.rating?.toFixed(1) || '5.0'}</span>
                            <span className="text-slate-400 text-[10px] font-normal">
                              ({item.supplier?.review_count || 12} reviews)
                            </span>
                          </div>

                          {/* Compare Link */}
                          {item.product && (
                            <Link
                              href={`/compare/${item.product.slug}`}
                              className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
                            >
                              Compare Offers &gt;
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Cart Actions Footer */}
                    <div className="p-4 pt-0 border-t border-slate-100 mt-2 space-y-3">
                      <div className="flex items-baseline justify-between pt-3">
                        <div>
                          <span className="text-lg font-black text-slate-900 font-mono">
                            ₹{item.price_per_unit.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">/ unit</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Total ({currentQty}x)</span>
                          <span className="text-xs font-bold text-slate-800 font-mono">
                            ₹{totalItemCost.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Add to Cart Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 text-xs w-28 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleQtyChange(
                                item.id,
                                currentQty - item.min_order_qty,
                                item.min_order_qty,
                                item.available_qty
                              )
                            }
                            disabled={currentQty <= item.min_order_qty}
                            className="px-2.5 py-2 hover:bg-slate-200 rounded-l-xl text-slate-600 font-bold disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={currentQty}
                            min={item.min_order_qty}
                            max={item.available_qty}
                            step={item.min_order_qty}
                            onChange={(e) =>
                              handleQtyChange(
                                item.id,
                                parseInt(e.target.value) || item.min_order_qty,
                                item.min_order_qty,
                                item.available_qty
                              )
                            }
                            className="w-full text-center bg-transparent focus:outline-none font-bold text-slate-900"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleQtyChange(
                                item.id,
                                currentQty + item.min_order_qty,
                                item.min_order_qty,
                                item.available_qty
                              )
                            }
                            disabled={currentQty >= item.available_qty}
                            className="px-2.5 py-2 hover:bg-slate-200 rounded-r-xl text-slate-600 font-bold disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 py-2 px-3 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>
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

export default function ProductsCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs text-slate-400">
          Loading Findom Wholesale Catalog...
        </div>
      }
    >
      <ProductsCatalogContent />
    </Suspense>
  );
}
