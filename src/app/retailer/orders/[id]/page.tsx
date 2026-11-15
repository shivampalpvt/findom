'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
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
  Star,
  Check,
  X,
  Plus,
  Trash2,
  MessageSquare,
  Sparkles,
  Info,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import { DeliveryCondition } from '@/lib/types';

export default function RetailerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const {
    orders,
    reviews,
    reviewDispatchPhotos,
    confirmDelivery,
    addReview,
  } = useMarketplace();

  const order = orders.find((o) => o.id === orderId);

  // Modal 1: Dispatch Photos Inspection
  const [isPhotoInspectionOpen, setIsPhotoInspectionOpen] = useState(false);
  const [photoFeedback, setPhotoFeedback] = useState('');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Modal 2: Delivery Confirmation
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [deliveryCondition, setDeliveryCondition] = useState<DeliveryCondition>('all_healthy');
  const [doaCount, setDoaCount] = useState<number>(0);
  const [issueDesc, setIssueDesc] = useState('');
  const [doaEvidencePhotos, setDoaEvidencePhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=800&q=80',
  ]);
  const [evidenceInput, setEvidenceInput] = useState('');

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Check if a review already exists for this order
  const existingReview = reviews.find((r) => r.order_id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-xs">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
          <p className="text-sm text-slate-500 mt-1">
            Order #{orderId} does not exist in your account.
          </p>
          <Link
            href="/retailer"
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Retailer Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Handle Photo Review (Approve or Reject)
  const handleReviewPhotos = (approved: boolean) => {
    reviewDispatchPhotos(order.id, approved, photoFeedback);
    setIsPhotoInspectionOpen(false);
  };

  // Handle Delivery Confirmation
  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    confirmDelivery(
      order.id,
      deliveryCondition,
      deliveryCondition === 'all_healthy' ? 0 : doaCount,
      issueDesc,
      deliveryCondition === 'all_healthy' ? [] : doaEvidencePhotos
    );
    setIsDeliveryModalOpen(false);
  };

  // Handle Review Submission
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addReview(order.id, reviewRating, reviewComment.trim());
    setReviewSubmitted(true);
  };

  const handleAddEvidencePhoto = () => {
    if (!evidenceInput.trim()) return;
    setDoaEvidencePhotos([...doaEvidencePhotos, evidenceInput.trim()]);
    setEvidenceInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Banner & Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/retailer"
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    Order #{order.order_number}
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Breeder / Hatchery: <span className="font-semibold text-slate-800">{order.supplier?.business_name}</span> ({order.supplier?.city}, {order.supplier?.state})
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              {order.dispatch_verification && order.dispatch_verification.retailer_approved === null && (
                <button
                  onClick={() => setIsPhotoInspectionOpen(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 animate-pulse"
                >
                  <Camera className="w-4 h-4" /> Inspect Pre-Dispatch Photos
                </button>
              )}

              {(order.status === 'dispatched' || order.status === 'delivered') && !order.delivery_confirmation && (
                <button
                  onClick={() => setIsDeliveryModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm Live Delivery
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: Verification Workflow, Evidence, Delivery Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Pre-Dispatch Verification Banner & Trigger */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    order.dispatch_verification?.retailer_approved === true
                      ? 'bg-emerald-50 text-emerald-700'
                      : order.dispatch_verification?.retailer_approved === false
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Phase 1: Pre-Dispatch Visual Health Verification
                    </h3>
                    <p className="text-xs text-slate-500">
                      Breeder must provide oxygen-bagged inspection photos before cargo boarding
                    </p>
                  </div>
                </div>

                {order.dispatch_verification ? (
                  <button
                    onClick={() => setIsPhotoInspectionOpen(true)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    {order.dispatch_verification.retailer_approved === null
                      ? 'Inspect & Approve'
                      : 'View Uploaded Photos'}
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
                    Breeder preparing photos
                  </span>
                )}
              </div>

              {order.dispatch_verification ? (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Verification Status:</span>
                    {order.dispatch_verification.retailer_approved === true ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved by You on{' '}
                        {order.dispatch_verification.reviewed_at
                          ? new Date(order.dispatch_verification.reviewed_at).toLocaleDateString('en-IN')
                          : 'Recent'}
                      </span>
                    ) : order.dispatch_verification.retailer_approved === false ? (
                      <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Quality Concern Raised
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full animate-pulse">
                        Pending Your Inspection & Sign-off
                      </span>
                    )}
                  </div>

                  {order.dispatch_verification.notes && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                      <span className="font-bold text-slate-900 block mb-0.5">Breeder Packaging Note:</span>
                      &ldquo;{order.dispatch_verification.notes}&rdquo;
                    </div>
                  )}

                  {/* Thumbnail Row */}
                  <div className="flex items-center gap-2.5 overflow-x-auto pt-1">
                    {order.dispatch_verification.photo_urls.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedPhotoIndex(i);
                          setIsPhotoInspectionOpen(true);
                        }}
                        className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 hover:scale-105 transition shrink-0 group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Inspection ${i + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                  Breeder has received your order and is currently acclimating, sorting, and bagging your specimens. Photos will appear here once ready.
                </div>
              )}
            </div>

            {/* Step 2: In-Transit Air Waybill & Courier Tracker */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Phase 2: Live Airport & Cargo Transit
                    </h3>
                    <p className="text-xs text-slate-500">
                      High-priority insulated air freight with oxygen guarantee
                    </p>
                  </div>
                </div>

                {order.tracking_number ? (
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                    In Air Transit
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    Awaiting Flight Handover
                  </span>
                )}
              </div>

              {order.tracking_number ? (
                <div className="mt-4 space-y-3">
                  <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500">Cargo Logistics Carrier</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{order.tracking_courier}</p>
                      <p className="text-xs font-mono font-bold text-indigo-700 mt-0.5">
                        AWB # {order.tracking_number}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        alert(`Opening live tracking satellite feed for AWB #${order.tracking_number} via ${order.tracking_courier}`)
                      }
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-2xs shrink-0"
                    >
                      Track Live Flight →
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    * Make sure to have your store temperature-controlled acclimatization tanks ready at 26-28°C before box arrival.
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                  Tracking number and flight waybill will be generated once the supplier hands over the thermocol shipment to the airline cargo counter.
                </div>
              )}
            </div>

            {/* Step 3: Delivery Confirmation & DOA Claims */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    order.delivery_confirmation?.condition === 'all_healthy'
                      ? 'bg-emerald-50 text-emerald-700'
                      : order.delivery_confirmation?.condition === 'dead_on_arrival'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-teal-50 text-teal-700'
                  }`}>
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Phase 3: Arrival Confirmation & DOA Safeguard
                    </h3>
                    <p className="text-xs text-slate-500">
                      Inspect specimens upon opening. Confirm live arrival to disburse escrow, or report DOA for full refund
                    </p>
                  </div>
                </div>

                {!order.delivery_confirmation && (order.status === 'dispatched' || order.status === 'delivered') && (
                  <button
                    onClick={() => setIsDeliveryModalOpen(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs shrink-0"
                  >
                    Confirm Delivery
                  </button>
                )}
              </div>

              {order.delivery_confirmation ? (
                <div className="mt-4 space-y-3">
                  <div className={`p-4 rounded-xl border ${
                    order.delivery_confirmation.condition === 'all_healthy'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/70 border-rose-200 text-rose-950'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider block">
                          {order.delivery_confirmation.condition === 'all_healthy'
                            ? '✓ 100% Live Arrival Confirmed (0 DOA)'
                            : `🚨 DOA / Damage Claim Filed (${order.delivery_confirmation.doa_count} Dead Reported)`}
                        </span>
                        <p className="text-xs mt-1">
                          Confirmed on{' '}
                          {new Date(order.delivery_confirmation.confirmed_at).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>
                      </div>

                      {order.delivery_confirmation.condition === 'all_healthy' ? (
                        <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                          Escrow Payout Released
                        </span>
                      ) : (
                        <Link
                          href="/retailer/disputes"
                          className="text-xs font-bold bg-rose-600 text-white px-3 py-1.5 rounded-lg hover:bg-rose-700 transition"
                        >
                          View Dispute Ticket →
                        </Link>
                      )}
                    </div>

                    {order.delivery_confirmation.issue_description && (
                      <p className="text-xs mt-2 italic border-t border-slate-200/40 pt-2">
                        &ldquo;{order.delivery_confirmation.issue_description}&rdquo;
                      </p>
                    )}

                    {order.delivery_confirmation.evidence_photos.length > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[11px] font-bold block mb-1">DOA Proof Photos:</span>
                        <div className="flex gap-2">
                          {order.delivery_confirmation.evidence_photos.map((p, i) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={i}
                              src={p}
                              alt="DOA proof"
                              className="w-14 h-14 rounded-lg object-cover border border-rose-300"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                  Once your shipment arrives from the airport or courier, open the thermocol box and click &ldquo;Confirm Live Delivery&rdquo;.
                </div>
              )}
            </div>

            {/* Step 4: Breeder Review & Rating (Only after completion) */}
            {(order.status === 'completed' || order.delivery_confirmation?.condition === 'all_healthy') && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                    <Star className="w-5 h-5 fill-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Verified Hatchery Review & Rating
                    </h3>
                    <p className="text-xs text-slate-500">
                      Your review builds transparent reputations across Indian aquarium wholesale hubs
                    </p>
                  </div>
                </div>

                {existingReview || reviewSubmitted ? (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (existingReview?.rating || reviewRating)
                              ? 'fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                      <span className="font-bold text-slate-900 ml-1.5">
                        {existingReview?.rating || reviewRating} / 5 Stars
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium mt-2">
                      &ldquo;{existingReview?.comment || reviewComment}&rdquo;
                    </p>
                    <p className="text-[11px] text-emerald-700 font-bold mt-1">
                      ✓ Verified B2B Wholesale Purchase
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">Rating</label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-1 hover:scale-110 transition"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= reviewRating
                                  ? 'fill-amber-400 text-amber-500'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Feedback on Specimen Health & Packaging Quality
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Comment on water temperature, fin integrity, oxygen ratio, breeder communication..."
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-xs"
                    >
                      Submit Verified Review
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Escrow Status, Itemized Invoice, Supplier Details */}
          <div className="space-y-6">
            {/* Escrow Guarantee Box */}
            <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white p-5 rounded-2xl shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider">
                  Escrow Protection
                </span>
                <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>

              <div>
                <p className="text-2xl font-black text-white">
                  ₹{order.total_amount.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-sky-200 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {order.payment_status === 'escrow_hold'
                    ? 'Funds Locked in Findom Escrow'
                    : order.payment_status === 'payout_processed'
                    ? 'Payment Released to Breeder'
                    : order.payment_status.replace('_', ' ')}
                </p>
              </div>

              <div className="text-[11px] text-sky-200/80 border-t border-sky-800/60 pt-3 space-y-1">
                <p>• Money is held safely until you confirm 0 DOA arrival.</p>
                <p>• If dead fish occur, claim is automatically arbitrated.</p>
              </div>
            </div>

            {/* Wholesale Itemized Invoice */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Shipment Breakdown</span>
                <span className="text-xs text-slate-500">{order.items.length} Items</span>
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
                  <span>Insulated Thermocol & Oxygen Freight</span>
                  <span className="font-semibold text-slate-900">
                    ₹{order.shipping_fee.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Escrow Paid</span>
                  <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Breeder / Hatchery Contact Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Hatchery Information
              </h3>

              <div className="text-xs space-y-2 text-slate-700">
                <div className="flex items-start gap-2">
                  <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">{order.supplier?.business_name}</p>
                    <p className="text-slate-500">Proprietor: {order.supplier?.owner_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p>
                    {order.supplier?.address || 'Aquaculture Breeding Zone'}, {order.supplier?.city},{' '}
                    {order.supplier?.state}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <p>{order.supplier?.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Dispatch Photos Inspection Modal */}
      {isPhotoInspectionOpen && order.dispatch_verification && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  Pre-Dispatch Live Health Inspection
                </h3>
                <p className="text-xs text-slate-300">
                  Order #{order.order_number} • Breeder: {order.supplier?.business_name}
                </p>
              </div>
              <button
                onClick={() => setIsPhotoInspectionOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Main Expanded Image */}
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={order.dispatch_verification.photo_urls[selectedPhotoIndex]}
                  alt={`Specimen proof ${selectedPhotoIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2.5 py-1 rounded-md font-mono">
                  Photo {selectedPhotoIndex + 1} of {order.dispatch_verification.photo_urls.length}
                </span>
              </div>

              {/* Thumbnails row */}
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {order.dispatch_verification.photo_urls.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPhotoIndex(i)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                      selectedPhotoIndex === i ? 'border-brand-500 scale-105' : 'border-slate-200 opacity-60'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Breeder notes */}
              {order.dispatch_verification.notes && (
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-800 mb-0.5">
                    Hatchery Packaging Specifications:
                  </span>
                  &ldquo;{order.dispatch_verification.notes}&rdquo;
                </div>
              )}

              {/* Feedback text area for discrepancy or note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Optional Feedback / Instructions for Breeder
                </label>
                <input
                  type="text"
                  placeholder="e.g. Looks great, proceed with dispatch! OR Please add extra heat pack for evening transit."
                  value={photoFeedback}
                  onChange={(e) => setPhotoFeedback(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Approval or Rejection Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleReviewPhotos(false)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4" /> Raise Concern / Reject Quality
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewPhotos(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve Dispatch & Quality
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Delivery Confirmation Modal (Live Arrival or DOA) */}
      {isDeliveryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="font-bold text-base">Delivery Arrival Confirmation</h3>
                <p className="text-xs text-slate-300">Order #{order.order_number}</p>
              </div>
              <button
                onClick={() => setIsDeliveryModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDelivery} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Condition of Specimens Upon Opening Box
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryCondition('all_healthy');
                      setDoaCount(0);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      deliveryCondition === 'all_healthy'
                        ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500 text-emerald-950 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
                    <p className="font-bold">All Healthy & Live</p>
                    <p className="text-[11px] text-slate-500 font-normal">0 DOA. Releases escrow payout to breeder.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryCondition('dead_on_arrival');
                      if (doaCount === 0) setDoaCount(1);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      deliveryCondition === 'dead_on_arrival'
                        ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-500 text-rose-950 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5 text-rose-600 mb-1" />
                    <p className="font-bold">Dead-on-Arrival (DOA)</p>
                    <p className="text-[11px] text-slate-500 font-normal">Specimen casualties. Auto-flags admin dispute.</p>
                  </button>
                </div>
              </div>

              {/* If DOA is selected */}
              {deliveryCondition !== 'all_healthy' && (
                <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-3">
                  <div>
                    <label className="block font-bold text-rose-950 mb-1">
                      Number of DOA (Casualty) Specimens
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={doaCount}
                      onChange={(e) => setDoaCount(Number(e.target.value))}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-rose-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-rose-950 mb-1">
                      DOA Description & Unboxing Details
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Describe water smell, bag puncture, airline delay, deceased specimen condition..."
                      value={issueDesc}
                      onChange={(e) => setIssueDesc(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-rose-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-rose-950 mb-1">
                      Upload Proof Photo URL (Uncut bag / deceased specimen)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Paste image URL of deceased fish in bag..."
                        value={evidenceInput}
                        onChange={(e) => setEvidenceInput(e.target.value)}
                        className="flex-1 text-xs px-3 py-2 rounded-xl border border-rose-300 bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddEvidencePhoto}
                        className="px-3 py-2 bg-rose-700 text-white rounded-xl font-bold"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {doaEvidencePhotos.map((p, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={i}
                          src={p}
                          alt="Proof"
                          className="w-12 h-12 rounded-lg object-cover border border-rose-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDeliveryModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-bold rounded-xl shadow-xs transition ${
                    deliveryCondition === 'all_healthy'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {deliveryCondition === 'all_healthy'
                    ? 'Confirm Live Arrival & Release Escrow'
                    : 'Submit DOA Claim to Arbitration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
