'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Building2,
  MapPin,
  Plane,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  Fish,
  AlertCircle,
  Clock,
  Camera,
  PackageCheck,
  ChevronRight,
  Truck,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, currentUser, registerUser, placeOrder, allProfiles } = useMarketplace();

  // Address Form State (Pre-filled with retailer profile if available)
  const [formData, setFormData] = useState({
    shopName: currentUser?.business_name || '',
    contactPerson: currentUser?.owner_name || '',
    phone: currentUser?.phone || '',
    gstin: currentUser?.gstin || '',
    addressLine: currentUser?.address || '',
    city: currentUser?.city || 'Mumbai',
    state: currentUser?.state || 'Maharashtra',
    pincode: currentUser?.pincode || '',
    nearestAirport: 'Chhatrapati Shivaji Maharaj Intl (BOM) Air Cargo Terminal',
    deliveryNotes: 'Please ensure oxygen double-bagging and thermocol insulation for morning flight.',
  });

  const [paymentMethod, setPaymentMethod] = useState<'escrow' | 'credit'>('escrow');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState<string[] | null>(null);

  // Group cart items supplier-wise
  const supplierGroups = React.useMemo(() => {
    const groups: {
      [supplierId: string]: {
        supplierId: string;
        supplier: any;
        items: any[];
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

    Object.values(groups).forEach((g) => {
      g.subtotal = g.items.reduce((sum, it) => sum + it.listing.price_per_unit * it.quantity, 0);
      g.shippingFee = g.subtotal > 15000 ? 0 : 950;
      g.total = g.subtotal + g.shippingFee;
    });

    return Object.values(groups);
  }, [cart, allProfiles]);

  const grandSubtotal = supplierGroups.reduce((sum, g) => sum + g.subtotal, 0);
  const grandShipping = supplierGroups.reduce((sum, g) => sum + g.shippingFee, 0);
  const grandTotal = grandSubtotal + grandShipping;
  const totalPieces = cart.reduce((sum, it) => sum + it.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      registerUser({
        id: `ret-${Date.now()}`,
        role: 'retailer',
        business_name: formData.shopName || 'Retail Aquarium Store',
        owner_name: formData.contactPerson || 'Store Proprietor',
        email: 'retailer@order.in',
        phone: formData.phone || '',
        city: formData.city || 'Mumbai',
        state: formData.state || 'Maharashtra',
        pincode: formData.pincode || '',
        address: formData.addressLine || '',
        gstin: formData.gstin || '',
        verification_status: 'approved',
        rating: 5.0,
        review_count: 0,
        created_at: new Date().toISOString(),
      });
    }

    setIsSubmitting(true);
    try {
      const shippingAddress = {
        shop_name: formData.shopName,
        contact_person: formData.contactPerson,
        phone: formData.phone,
        address_line: formData.addressLine,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        gstin: formData.gstin,
        airport_terminal: formData.nearestAirport,
      };

      const generatedIds = await placeOrder(
        shippingAddress,
        `${formData.deliveryNotes} | Airport: ${formData.nearestAirport}`
      );

      setOrderPlacedSuccess(generatedIds);
    } catch (err: any) {
      console.error(err);
      alert('Error placing order: ' + (err.message || 'Please check all required fields'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Empty cart redirect / state
  if (cart.length === 0 && !orderPlacedSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Your cart is empty</h1>
        <p className="text-sm text-slate-500 mt-2">Add wholesale fish stock before proceeding to checkout.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          Browse Wholesale Catalog
        </Link>
      </div>
    );
  }

  // ORDER SUCCESS SCREEN
  if (orderPlacedSuccess) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full uppercase tracking-wider">
            Escrow Locked & Payment Authorized
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            Wholesale Consignment Orders Placed!
          </h1>

          <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
            Your payment is securely held in <span className="font-bold text-slate-900">Findom B2B Escrow</span>. Breeders have been notified and will now pack and upload pre-dispatch inspection photos.
          </p>

          {/* Generated Consignments List */}
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 text-left shadow-xs space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              Active Consignments Generated ({orderPlacedSuccess.length})
            </h3>
            {orderPlacedSuccess.map((id, index) => (
              <div
                key={id}
                className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Order Ref: #{id.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-brand-600" />
                    Status: Awaiting Pre-Dispatch Photo Upload
                  </span>
                </div>
                <Link
                  href="/retailer"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>

          {/* Next Steps Timeline */}
          <div className="mt-8 bg-brand-50/60 rounded-2xl border border-brand-200/80 p-6 text-left space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-teal-800">
              What Happens Next:
            </h4>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  1
                </span>
                <p>
                  <strong>Pre-Dispatch Photo Upload:</strong> The breeding farm captures photos of your live specimens in oxygen bags before packing into insulated thermocol boxes.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  2
                </span>
                <p>
                  <strong>Retailer Inspection & Approval:</strong> You review the photos on your phone. Once approved, the consignment is dispatched to the airport cargo terminal.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  3
                </span>
                <p>
                  <strong>24-Hour Air Cargo Pickup:</strong> Collect the live boxes at your airport terminal. Confirm live delivery within 2 hours to release escrow funds.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/retailer"
              className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition"
            >
              Go to Retailer Dashboard
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition"
            >
              Order More Live Stock
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-slate-900">Cart</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Wholesale Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Wholesale B2B Checkout
            <span className="text-xs bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-0.5 rounded-full font-bold">
              Escrow Protected
            </span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* User Session Banner */}
        {!currentUser && (
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-sky-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-sky-600 shrink-0" />
              <span>
                Ordering as a guest aquarium retail store. Enter your physical shop delivery details below, or sign in to save orders to your portal.
              </span>
            </div>
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-bold shrink-0 transition"
            >
              Sign In to Your Account
            </Link>
          </div>
        )}

        <form onSubmit={handlePlaceOrderSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: ADDRESS & ESCROW PAYMENT FORM */}
          <div className="lg:col-span-2 space-y-6">
            {/* Aquarium Shop Delivery Address */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Building2 className="w-5 h-5 text-brand-600" />
                Aquarium Retail Shop Delivery Destination
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Aquarium Store / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    placeholder="e.g. Oceanic Blue Aquarium & Pets"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="e.g. Amitabh Sharma"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Indian Mobile Number (+91) *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98200 11223"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    GSTIN (Optional for tax invoice)
                  </label>
                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleInputChange}
                    placeholder="27AABCU9603R1ZM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Shop Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleInputChange}
                    placeholder="Shop 14, Hill Road, Bandra West"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Mumbai"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Maharashtra"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="400050"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nearest Domestic Airport Cargo Terminal *
                  </label>
                  <input
                    type="text"
                    required
                    name="nearestAirport"
                    value={formData.nearestAirport}
                    onChange={handleInputChange}
                    placeholder="e.g. Mumbai (BOM) / Delhi (DEL) / Bengaluru (BLR)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Delivery & Packing Instructions (Insulation, Flight Timing)
                  </label>
                  <textarea
                    rows={2}
                    name="deliveryNotes"
                    value={formData.deliveryNotes}
                    onChange={handleInputChange}
                    placeholder="e.g. Please oxygen pack 2 fish per bag. Morning flight preferred."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* B2B Escrow Payment Selection */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Lock className="w-5 h-5 text-emerald-600" />
                Payment Method: Protected Escrow
              </h2>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('escrow')}
                  className={`block p-4 rounded-xl border transition cursor-pointer ${
                    paymentMethod === 'escrow'
                      ? 'border-brand-500 bg-brand-50/30 ring-1 ring-brand-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-brand-600 flex items-center justify-center mt-0.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                          Findom B2B Escrow Pay (NEFT / RTGS / UPI / NetBanking)
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                            Recommended
                          </span>
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Your funds are authorized and placed into a secure escrow account. The money is transferred to the hatchery only after you review pre-dispatch photos and confirm healthy live delivery at airport cargo pickup.
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('credit')}
                  className={`block p-4 rounded-xl border transition cursor-pointer ${
                    paymentMethod === 'credit'
                      ? 'border-brand-500 bg-brand-50/30 ring-1 ring-brand-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center mt-0.5">
                        {paymentMethod === 'credit' && <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                          Verified Retailer Credit Facility (30-Day Terms)
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Available for GST registered aquarium retail shops with 3+ successful deliveries on Findom.
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Escrow Guarantee Banner */}
              <div className="mt-4 p-4 rounded-xl bg-slate-900 text-slate-300 text-xs flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="text-white font-bold block mb-0.5">
                    100% Escrow Protection Active
                  </span>
                  Suppliers cannot claim payouts until you give final thumbs up after arrival. Any Dead-On-Arrival (DOA) reported within 2 hours is refunded directly from escrow.
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY & SUBMISSION */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs sticky top-24">
              <h2 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Consignments Breakdown</span>
                <span className="text-xs font-normal text-slate-500">
                  {supplierGroups.length} {supplierGroups.length === 1 ? 'Shipment' : 'Shipments'}
                </span>
              </h2>

              {/* Multi-supplier consignments list */}
              <div className="divide-y divide-slate-100 text-xs my-4 space-y-3">
                {supplierGroups.map((g, idx) => (
                  <div key={g.supplierId} className="pt-3 first:pt-0">
                    <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                      <span className="truncate pr-2">
                        {idx + 1}. {g.supplier?.business_name || 'Hatchery'}
                      </span>
                      <span className="shrink-0">₹{g.total.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-0.5">
                      <p>
                        {g.items.reduce((sum, it) => sum + it.quantity, 0)} pcs ({g.items.map((it) => it.listing.variety).join(', ')})
                      </p>
                      <p className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3" />
                        Dispatches from {g.supplier?.city}
                      </p>
                      <p className="text-teal-700 font-semibold">
                        Freight: {g.shippingFee === 0 ? 'FREE' : `₹${g.shippingFee}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Totals */}
              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Total Aquatic Stock:</span>
                  <span className="font-bold text-slate-900">{totalPieces} pieces</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Stock Subtotal:</span>
                  <span className="font-semibold text-slate-900">
                    ₹{grandSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Domestic Air Cargo Fee:</span>
                  <span className="font-semibold text-slate-900">
                    {grandShipping === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `₹${grandShipping.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-900">Total Escrow Hold:</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-brand-700">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">
                      Zero broker commission
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Securing Escrow & Placing Orders...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Confirm Wholesale Order & Lock Escrow
                  </>
                )}
              </button>

              <div className="mt-4 text-[11px] text-slate-400 text-center leading-relaxed">
                By confirming, you agree to inspect pre-dispatch photos prior to airline takeoff.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
