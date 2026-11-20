'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Truck,
  IndianRupee,
  ShieldCheck,
  Building,
  MapPin,
  Phone,
  Mail,
  FileText,
  UploadCloud,
  Check,
  Send,
  Plus,
  Trash2,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import { OrderStatus } from '@/lib/types';
import DirectImageUploader from '@/components/DirectImageUploader';

export default function SupplierOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const { orders, updateOrderStatus, uploadDispatchPhotos, updateOrderTracking } =
    useMarketplace();

  const order = orders.find((o) => o.id === orderId);

  // Form states for dispatch photos
  const [photoList, setPhotoList] = useState<string[]>(
    order?.dispatch_verification?.photo_urls || [
      'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=800&q=80',
    ]
  );
  const [packagingNotes, setPackagingNotes] = useState(
    order?.dispatch_verification?.notes ||
      'Double oxygen bagging (70% O2 / 30% water ratio), 30mm heavy-duty insulated EPS thermocol box, sealed with tamper-evident waterproof vinyl tape.'
  );
  const [isSubmittingPhotos, setIsSubmittingPhotos] = useState(false);
  const [showPhotoSuccess, setShowPhotoSuccess] = useState(false);

  // Form states for dispatch tracking
  const [courierName, setCourierName] = useState(
    order?.tracking_courier || 'Porter 2-Wheeler (Express <45 mins)'
  );
  const [trackingNumber, setTrackingNumber] = useState(
    order?.tracking_number || ''
  );
  const [driverName, setDriverName] = useState(
    order?.driver_name || 'Ramesh Shinde'
  );
  const [driverPhone, setDriverPhone] = useState(
    order?.driver_phone || '+91 98201 54321'
  );
  const [vehicleNumber, setVehicleNumber] = useState(
    order?.vehicle_number || 'MH-02-EE-4129'
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    order?.estimated_transit_minutes || 35
  );
  const [isSubmittingTracking, setIsSubmittingTracking] = useState(false);

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-xs">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Wholesale Order Not Found</h2>
          <p className="text-sm text-slate-500 mt-1">
            Order #{orderId} could not be located in your active supplier registry.
          </p>
          <Link
            href="/supplier"
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Supplier Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleUploadPhotos = (e: React.FormEvent) => {
    e.preventDefault();
    if (photoList.length === 0) {
      alert('Please attach at least one pre-dispatch photo or video proof URL.');
      return;
    }
    setIsSubmittingPhotos(true);
    setTimeout(() => {
      uploadDispatchPhotos(order.id, photoList, packagingNotes);
      setIsSubmittingPhotos(false);
      setShowPhotoSuccess(true);
      setTimeout(() => setShowPhotoSuccess(false), 5000);
    }, 400);
  };

  const handleDispatchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      alert('Please enter a valid Porter Booking ID or local courier tracking number.');
      return;
    }
    setIsSubmittingTracking(true);
    setTimeout(() => {
      updateOrderTracking(order.id, courierName, trackingNumber.trim(), {
        driver_name: driverName,
        driver_phone: driverPhone,
        vehicle_number: vehicleNumber,
        estimated_transit_minutes: estimatedMinutes,
      });
      setIsSubmittingTracking(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Banner & Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/supplier"
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    Order #{order.order_number}
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ordered on {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} • Retailer: <span className="font-semibold text-slate-800">{order.retailer?.business_name}</span>
                </p>
              </div>
            </div>

            {/* Quick Status Control Buttons */}
            <div className="flex items-center gap-2">
              {order.status === 'new' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'accepted')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition"
                >
                  ✓ Accept Order
                </button>
              )}
              {order.status === 'accepted' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-2xs transition"
                >
                  Start Preparing / Packaging
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: Verification & Dispatch Workflows */}
          <div className="lg:col-span-2 space-y-6">
            {/* Retailer Review Status Banner */}
            {order.dispatch_verification && (
              <div
                className={`p-5 rounded-2xl border ${
                  order.dispatch_verification.retailer_approved === true
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : order.dispatch_verification.retailer_approved === false
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : 'bg-purple-50 border-purple-200 text-purple-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  {order.dispatch_verification.retailer_approved === true ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : order.dispatch_verification.retailer_approved === false ? (
                    <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                  ) : (
                    <Clock className="w-6 h-6 text-purple-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">
                      {order.dispatch_verification.retailer_approved === true
                        ? 'Retailer Approved Pre-Dispatch Photos'
                        : order.dispatch_verification.retailer_approved === false
                        ? 'Retailer Flagged Quality Discrepancy'
                        : 'Pre-Dispatch Photos Under Retailer Inspection'}
                    </h4>
                    <p className="text-xs mt-1 leading-relaxed opacity-90">
                      {order.dispatch_verification.retailer_approved === true
                        ? `The buyer has officially confirmed specimen health and packaging compliance. You may now book Porter or local courier and enter driver details below for direct <1-hr delivery.`
                        : order.dispatch_verification.retailer_approved === false
                        ? `Retailer note: "${order.dispatch_verification.retailer_feedback}". Please review and upload updated replacement photos or adjust stock.`
                        : `Photos were uploaded on ${new Date(order.dispatch_verification.uploaded_at).toLocaleString('en-IN')}. The retailer has been notified to inspect and approve.`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CRITICAL FEATURE: Dispatch Photo Upload Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-brand-50 text-brand-700 rounded-lg">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Pre-Dispatch Live Verification Evidence
                    </h3>
                    <p className="text-xs text-slate-500">
                      Mandatory Findom protocol: Attach live fish photos & packaging specs before dispatching
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                  DOA Guarantee Safeguard
                </span>
              </div>

              {showPhotoSuccess && (
                <div className="mt-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Dispatch inspection package submitted successfully! Retailer notified.
                </div>
              )}

              <form onSubmit={handleUploadPhotos} className="mt-5 space-y-4">
                {/* Modern Direct Storage & Camera Photo Uploader */}
                <DirectImageUploader
                  label="Live Stock & Packaging Inspection Photos *"
                  helperText="Select or drag live specimen photos and packaging boxes directly from your device storage or camera. All proof photos are securely uploaded and saved to Findom server storage."
                  images={photoList}
                  onChange={setPhotoList}
                  multiple={true}
                  maxFiles={8}
                  accentColor="emerald"
                  sampleImages={[
                    {
                      label: 'Bagged Discus',
                      url: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=800&q=80',
                    },
                    {
                      label: 'Cichlids Live Check',
                      url: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
                    },
                    {
                      label: 'Guppy Trio Pack',
                      url: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=800&q=80',
                    },
                  ]}
                />

                {/* Packaging Specs & Water Quality Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Hatchery Packaging & Transit Notes
                  </label>
                  <textarea
                    rows={3}
                    value={packagingNotes}
                    onChange={(e) => setPackagingNotes(e.target.value)}
                    placeholder="Specify oxygen ratio, carrier bag insulation, water temperature at packing, local Porter route, and store delivery instructions..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Providing accurate oxygen and thermocol specs protects your escrow payout under Findom DOA Arbitration terms.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingPhotos}
                    className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <UploadCloud className="w-4 h-4" />
                    {isSubmittingPhotos
                      ? 'Submitting Proofs...'
                      : order.dispatch_verification
                      ? 'Update Inspection Photos'
                      : 'Submit for Retailer Approval'}
                  </button>
                </div>
              </form>
            </div>

            {/* Courier Dispatch & Tracking Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Local Express Dispatch (Porter / 1-Hour SLA)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Book Porter or local express partner for same-day store delivery (&lt;1 hr)
                    </p>
                  </div>
                </div>
                {order.status === 'dispatched' ? (
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                    Dispatched &amp; In Transit
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    Awaiting Dispatch
                  </span>
                )}
              </div>

              {order.tracking_number && (
                <div className="mt-4 p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Assigned Delivery Partner</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        {order.tracking_courier} — <span className="font-mono text-brand-700">{order.tracking_number}</span>
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Live Porter Tracking Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-indigo-100/70 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Driver:</span>
                      <span className="font-semibold text-slate-800">{order.driver_name || 'Ramesh Shinde'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Vehicle:</span>
                      <span className="font-mono font-semibold text-slate-800">{order.vehicle_number || 'MH-02-EE-4129'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Est. Transit:</span>
                      <span className="font-semibold text-emerald-700">{order.estimated_transit_minutes || 35} mins</span>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleDispatchOrder} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Delivery Partner / Mode
                    </label>
                    <select
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Porter 2-Wheeler (Express <45 mins)">Porter 2-Wheeler (Express &lt;45 mins)</option>
                      <option value="Porter 3-Wheeler / Tata Ace">Porter 3-Wheeler / Tata Ace (Heavy Tanks &amp; Crates)</option>
                      <option value="Borzo Hyperlocal Courier">Borzo Hyperlocal Express Courier</option>
                      <option value="Direct Farm Store Delivery">Direct Farm Van / Store Runner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Porter Booking / Trip ID #
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PORTER-BOM-88392 or BORZO-7712"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Driver Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Shinde"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Driver Contact Mobile
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98201 54321"
                      value={driverPhone}
                      onChange={(e) => setDriverPhone(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Vehicle Reg Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MH-02-EE-4129"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Estimated Transit Time (Minutes)
                    </label>
                    <input
                      type="number"
                      min="15"
                      max="60"
                      value={estimatedMinutes}
                      onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] text-slate-500">
                    * Assigning driver updates order to &quot;In Transit&quot; and sends SMS with live driver ETA and delivery OTP to retailer.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmittingTracking}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <Truck className="w-4 h-4" />
                    {isSubmittingTracking ? 'Confirming Dispatch...' : 'Dispatch via Porter / Courier'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary, Escrow, and Retailer Details */}
          <div className="space-y-6">
            {/* Escrow Guarantee Status Box */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Escrow Payment Status
                </span>
                <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>

              <div>
                <p className="text-2xl font-black text-white">
                  ₹{order.total_amount.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {order.payment_status === 'escrow_hold'
                    ? '100% Funds Safeguarded in Escrow'
                    : order.payment_status === 'payout_processed'
                    ? 'Payout Released to Bank Account'
                    : order.payment_status.replace('_', ' ')}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-700/60 pt-3 space-y-1">
                <p>• Escrow auto-releases upon live arrival confirmation.</p>
                <p>• 48-Hour DOA Protection window applies.</p>
              </div>
            </div>

            {/* Wholesale Itemized Invoice */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Shipment Contents</span>
                <span className="text-xs text-slate-500">{order.items.length} Line Items</span>
              </h3>

              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{item.product_name}</p>
                      <p className="text-[11px] text-slate-500">Grade: {item.size_grade}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        ₹{item.unit_price} × {item.quantity} units
                      </p>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      ₹{item.total_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    ₹{order.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Insulated Freight & Airport Handling</span>
                  <span className="font-semibold text-slate-900">
                    ₹{order.shipping_fee.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Order Escrow</span>
                  <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Retailer & Shipping Destination */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Retail Delivery Destination
              </h3>

              <div className="text-xs space-y-2">
                <div className="flex items-start gap-2 text-slate-700">
                  <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">{order.shipping_address.shop_name}</p>
                    <p className="text-slate-500">Contact: {order.shipping_address.contact_person}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p>
                    {order.shipping_address.address_line}, {order.shipping_address.city},{' '}
                    {order.shipping_address.state} - {order.shipping_address.pincode}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <p>{order.shipping_address.phone}</p>
                </div>
              </div>

              {order.retailer_notes && (
                <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-800 mb-0.5">
                    Buyer Note:
                  </span>
                  &ldquo;{order.retailer_notes}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
