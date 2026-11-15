'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Trash2,
  Building2,
  MapPin,
  Plane,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Package,
  Plus,
  Minus,
  Info,
  ChevronRight,
  Fish,
} from 'lucide-react';
import { useMarketplace, CartItem } from '@/lib/store';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateCartQty, clearCart, allProfiles } = useMarketplace();

  // Group cart items supplier-wise (CRITICAL PRD REQUIREMENT)
  const supplierGroups = React.useMemo(() => {
    const groups: {
      [supplierId: string]: {
        supplierId: string;
        supplier: any;
        items: CartItem[];
        subtotal: number;
        shippingFee: number;
        total: number;
      };
    } = {};

    cart.forEach((item) => {
      const sId = item.listing.supplier_id;
      if (!groups[sId]) {
        const foundSupplier = allProfiles.find((p) => p.id === sId) || item.listing.supplier;
        groups[sId] = {
          supplierId: sId,
          supplier: foundSupplier,
          items: [],
          subtotal: 0,
          shippingFee: 0,
          total: 0,
        };
      }
      groups[sId].items.push(item);
    });

    // Calculate subtotals and air cargo fees for each supplier group
    Object.values(groups).forEach((g) => {
      g.subtotal = g.items.reduce((sum, it) => sum + it.listing.price_per_unit * it.quantity, 0);
      // Free air-freight if supplier subtotal > 15,000, else standard 950 INR thermocol + medical O2 flight fee
      g.shippingFee = g.subtotal > 15000 ? 0 : 950;
      g.total = g.subtotal + g.shippingFee;
    });

    return Object.values(groups);
  }, [cart, allProfiles]);

  const totalItemsCount = cart.reduce((sum, it) => sum + it.quantity, 0);
  const grandSubtotal = supplierGroups.reduce((sum, g) => sum + g.subtotal, 0);
  const grandShipping = supplierGroups.reduce((sum, g) => sum + g.shippingFee, 0);
  const grandTotal = grandSubtotal + grandShipping;

  // MOQ check
  const hasMoqViolation = cart.some((it) => it.quantity < it.listing.min_order_qty);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-6 shadow-xs">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Your Wholesale Cart is Empty
        </h1>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
          Explore direct pricing on Discus, Tetras, African Cichlids, Guppies and Shrimps from verified Indian hatcheries.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/products"
            className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2"
          >
            Browse Wholesale Catalog
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/compare"
            className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2"
          >
            Compare Supplier Prices
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Link href="/" className="hover:text-slate-900">Home</Link>
                <span>/</span>
                <span className="text-slate-900 font-semibold">Wholesale Cart</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Wholesale Order Cart ({totalItemsCount} pieces)
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition"
              >
                Clear Cart
              </button>
              <Link
                href="/products"
                className="text-xs font-semibold text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition"
              >
                + Add More Live Stock
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: SUPPLIER-WISE GROUPED CART ITEMS */}
          <div className="lg:col-span-2 space-y-8">
            {/* PRD Notice Banner */}
            <div className="bg-sky-50/80 border border-sky-200 rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div className="text-xs text-sky-900 leading-relaxed">
                <span className="font-bold">Multi-Supplier Logistics:</span> Because live fish originate directly from physical breeding hatcheries (e.g. Kolathur vs Galiff St), your order is neatly separated by supplier. Each hatchery uploads pre-dispatch photos and books domestic air cargo independently.
              </div>
            </div>

            {/* Loop Over Supplier Groups */}
            {supplierGroups.map((group, groupIdx) => (
              <div
                key={group.supplierId}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
              >
                {/* Supplier Group Header */}
                <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-400/30 text-brand-300 flex items-center justify-center font-bold text-sm shrink-0">
                      <Building2 className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider">
                          Consignment #{groupIdx + 1}
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                          Verified Breeder
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-white">
                        {group.supplier?.business_name || 'Verified Supplier'}
                      </h2>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 flex items-center gap-1.5 sm:text-right">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{group.supplier?.city}, {group.supplier?.state}</span>
                  </div>
                </div>

                {/* Items List in this Supplier Group */}
                <div className="divide-y divide-slate-100 p-4 sm:p-6 space-y-4">
                  {group.items.map((item) => {
                    const isMoqViolated = item.quantity < item.listing.min_order_qty;

                    return (
                      <div
                        key={item.listing.id}
                        className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        {/* Image and Spec Details */}
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            <img
                              src={item.listing.images[0]}
                              alt={item.listing.variety}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-bold text-sm text-slate-900 truncate">
                              {item.listing.product?.common_name || item.listing.variety}
                            </h3>
                            <p className="text-xs text-slate-500 italic truncate">
                              {item.listing.product?.scientific_name}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-600">
                              <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-[11px]">
                                Grade: {item.listing.size_grade}
                              </span>
                              <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-[11px]">
                                Variety: {item.listing.variety}
                              </span>
                            </div>
                            <div className="text-xs font-semibold text-slate-700 mt-1">
                              ₹{item.listing.price_per_unit.toLocaleString('en-IN')} / piece
                              <span className="text-[10px] text-slate-400 font-normal ml-1">
                                (Min. Order {item.listing.min_order_qty} pcs)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          {/* Quantity selector */}
                          <div className="flex flex-col items-end">
                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                              <button
                                onClick={() =>
                                  updateCartQty(
                                    item.listing.id,
                                    item.quantity - (item.listing.min_order_qty >= 10 ? 5 : 1)
                                  )
                                }
                                className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                                title="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <input
                                type="number"
                                min={1}
                                max={item.listing.available_qty}
                                value={item.quantity}
                                onChange={(e) =>
                                  updateCartQty(item.listing.id, parseInt(e.target.value) || 0)
                                }
                                className="w-14 text-center bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                              />
                              <button
                                onClick={() =>
                                  updateCartQty(
                                    item.listing.id,
                                    item.quantity + (item.listing.min_order_qty >= 10 ? 5 : 1)
                                  )
                                }
                                className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                                title="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {isMoqViolated && (
                              <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3 h-3" />
                                Below MOQ ({item.listing.min_order_qty})
                              </span>
                            )}
                          </div>

                          {/* Line Total */}
                          <div className="text-right w-24">
                            <span className="text-sm font-black text-slate-900 block">
                              ₹{(item.listing.price_per_unit * item.quantity).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {item.quantity} pieces
                            </span>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => removeFromCart(item.listing.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Supplier Subtotal & Freight Strip */}
                <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Plane className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>
                      Air Cargo Freight ({group.supplier?.city} Hub):{' '}
                      {group.shippingFee === 0 ? (
                        <span className="font-bold text-emerald-700">FREE (Order &gt; ₹15,000)</span>
                      ) : (
                        <span className="font-bold text-slate-800">
                          ₹{group.shippingFee.toLocaleString('en-IN')}{' '}
                          <span className="font-normal text-slate-400">
                            (Insulated box + medical O2)
                          </span>
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 sm:text-right">
                    <span className="text-slate-500 font-medium">Consignment Subtotal:</span>
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{group.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: GRAND SUMMARY & CHECKOUT CTA */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs sticky top-24">
              <h2 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Wholesale Summary</span>
                <span className="text-xs font-normal text-slate-500">
                  {supplierGroups.length} {supplierGroups.length === 1 ? 'Consignment' : 'Consignments'}
                </span>
              </h2>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Total Live Fish:</span>
                  <span className="font-bold text-slate-900">{totalItemsCount} pieces</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Gross Stock Subtotal:</span>
                  <span className="font-semibold text-slate-900">
                    ₹{grandSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    Combined Air Cargo:
                  </span>
                  <span className="font-semibold text-slate-900">
                    {grandShipping === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `₹${grandShipping.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>

                {hasMoqViolation && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] leading-relaxed">
                    <strong>Notice:</strong> One or more items are below the supplier’s Minimum Order Quantity (MOQ). Please adjust quantities before checkout.
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-900">Grand Total (INR):</span>
                  <div className="text-right">
                    <span className="text-xl font-black text-brand-700">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">
                      Incl. 100% Escrow Protection
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="mt-6 space-y-3">
                <button
                  disabled={hasMoqViolation}
                  onClick={() => router.push('/checkout')}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white transition flex items-center justify-center gap-2 shadow-md ${
                    hasMoqViolation
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-brand-600 hover:bg-brand-500 shadow-brand-600/25'
                  }`}
                >
                  Proceed to Wholesale Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  Funds held in Escrow. Zero risk until air arrival confirmation.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-3 text-[11px] text-slate-600">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Pre-Dispatch Photo Approval Mandated</span>
                </div>
                <div className="flex items-center gap-2 text-sky-700 font-semibold">
                  <Plane className="w-4 h-4 shrink-0 text-sky-600" />
                  <span>24-Hour Domestic Air Cargo Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-purple-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-purple-600" />
                  <span>DOA Claim Guarantee within 2 Hours of Airport Pickup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
