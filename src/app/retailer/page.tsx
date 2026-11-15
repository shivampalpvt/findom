'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Camera,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  Store,
  Star,
  MapPin,
  Clock,
  IndianRupee,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import PortalHeader from '@/components/PortalHeader';
import { OrderStatus } from '@/lib/types';

export default function RetailerDashboard() {
  const { currentUser, orders, reviews } = useMarketplace();
  const [filter, setFilter] = useState<'all' | 'needs_photo_approval' | 'in_transit' | 'delivered'>('all');

  // Retailer orders
  const retailerOrders = orders.filter((o) =>
    currentUser ? o.retailer_id === currentUser.id : true
  );

  // Key metrics
  const activeOrdersCount = retailerOrders.filter(
    (o) => !['completed', 'cancelled'].includes(o.status)
  ).length;

  const ordersAwaitingPhotoApproval = retailerOrders.filter(
    (o) => o.status === 'photos_uploaded'
  );

  const ordersInTransit = retailerOrders.filter(
    (o) => o.status === 'dispatched'
  );

  const completedPurchases = retailerOrders.filter(
    (o) => o.status === 'completed' || o.status === 'delivered'
  );

  const totalSpent = retailerOrders.reduce((acc, o) => acc + o.total_amount, 0);

  // Filtered orders
  const filteredOrders = retailerOrders.filter((order) => {
    if (filter === 'all') return true;
    if (filter === 'needs_photo_approval') return order.status === 'photos_uploaded';
    if (filter === 'in_transit') return order.status === 'dispatched';
    if (filter === 'delivered') return order.status === 'delivered' || order.status === 'completed';
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Order Placed</span>;
      case 'accepted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">Accepted by Breeder</span>;
      case 'preparing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Packaging & Oxygen Prep</span>;
      case 'photos_uploaded':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse flex items-center gap-1">
            <Camera className="w-3 h-3" /> Inspect Photos Now
          </span>
        );
      case 'photos_approved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Photos Approved (Awaiting Flight)</span>;
      case 'dispatched':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
            <Truck className="w-3 h-3" /> In Air Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Delivered — Confirm Arrival
          </span>
        );
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">✓ Completed (0 DOA)</span>;
      case 'disputed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">DOA Claim Under Review</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PortalHeader
        portal="retailer"
        title="Retail Aquarium Store Portal"
        subtitle="Track live batches, verify breeder packing photos, report DOAs, and manage wholesale deliveries"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* CRITICAL ALERT BANNER: Photos Awaiting Retailer Approval */}
        {ordersAwaitingPhotoApproval.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-2.5 bg-black/15 rounded-xl">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full">
                  Action Required
                </span>
                <h3 className="text-base sm:text-lg font-black text-white mt-1">
                  {ordersAwaitingPhotoApproval.length} Pre-Dispatch Shipment(s) Ready for Your Inspection!
                </h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  The breeder has packaged your fish with oxygen and uploaded visual inspection proofs. Inspect specimen health before Porter driver pickup.
                </p>
              </div>
            </div>
            <Link
              href={`/retailer/orders/${ordersAwaitingPhotoApproval[0].id}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-orange-950 font-black text-xs rounded-xl hover:bg-orange-50 transition shadow-xs shrink-0"
            >
              Inspect Order #{ordersAwaitingPhotoApproval[0].order_number} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Orders</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{activeOrdersCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Wholesale lots in pipeline</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Photos to Approve</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Camera className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-600 mt-2">
              {ordersAwaitingPhotoApproval.length}
            </p>
            <p className="text-[11px] text-amber-700 mt-1 font-medium">Pre-dispatch verification</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Porter in Local Transit</span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-indigo-600 mt-2">{ordersInTransit.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">Live tracking active</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Sourced (₹)</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              ₹{totalSpent.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">100% Escrow Protected</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Wholesale Orders</h3>
              <p className="text-xs text-slate-500">Inspect photos, track local Porter delivery, and confirm live arrival</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Orders ({retailerOrders.length})
              </button>
              <button
                onClick={() => setFilter('needs_photo_approval')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filter === 'needs_photo_approval'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                Inspect Photos ({ordersAwaitingPhotoApproval.length})
              </button>
              <button
                onClick={() => setFilter('in_transit')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filter === 'in_transit'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                In Local Transit ({ordersInTransit.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Order Ref / Hatchery</th>
                  <th className="py-3 px-4">Specimens</th>
                  <th className="py-3 px-4">Total Amount (₹)</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No orders matching this filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    return (
                      <tr key={order.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <Link
                            href={`/retailer/orders/${order.id}`}
                            className="font-bold text-slate-900 hover:text-brand-600 transition"
                          >
                            #{order.order_number}
                          </Link>
                          <p className="text-slate-700 font-medium mt-0.5">{order.supplier?.business_name}</p>
                          <p className="text-[10px] text-slate-400">
                            Breeder Hub: {order.supplier?.city}, {order.supplier?.state}
                          </p>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            {order.items.map((it) => (
                              <div key={it.id} className="flex items-center gap-1.5">
                                <span className="font-semibold text-slate-900">{it.product_name}</span>
                                <span className="text-slate-400">× {it.quantity}</span>
                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                  {it.size_grade}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          ₹{order.total_amount.toLocaleString('en-IN')}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            Includes 1-hr Porter delivery
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {getStatusBadge(order.status)}
                          {order.tracking_number && (
                            <p className="text-[11px] text-emerald-700 font-mono mt-1 font-semibold">
                              Porter: {order.tracking_number}
                            </p>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {order.status === 'photos_uploaded' && (
                              <Link
                                href={`/retailer/orders/${order.id}`}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-2xs transition flex items-center gap-1"
                              >
                                <Camera className="w-3.5 h-3.5" /> Inspect Photos
                              </Link>
                            )}

                            {order.status === 'delivered' && !order.delivery_confirmation && (
                              <Link
                                href={`/retailer/orders/${order.id}`}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-2xs transition flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Arrival
                              </Link>
                            )}

                            <Link
                              href={`/retailer/orders/${order.id}`}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                              title="View Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Favorite Verified Breeders & Hatcheries Spotlight */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Partner Commercial Breeders</h3>
              <p className="text-xs text-slate-500">Government & MPEDA registered hatcheries supplying your store</p>
            </div>
            <Link href="/compare" className="text-xs font-bold text-brand-600 hover:underline">
              Compare All Breeders →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'Western Ghats & Mumbai Aqua Hub',
                location: 'Andheri West, Mumbai',
                specialty: 'High-Grade Show Discus & Altum Angelfish',
                rating: 4.9,
                deliveries: 142,
                doaRate: '0.0%',
              },
              {
                name: 'Thane Exotic Fish Breeders & Imports',
                location: 'Thane West, Mumbai Metro',
                specialty: 'Pure Strain Guppies & Tetras',
                rating: 4.8,
                deliveries: 98,
                doaRate: '0.1%',
              },
              {
                name: 'Navi Mumbai Aquatic Center & Supplies',
                location: 'Vashi, Navi Mumbai',
                specialty: 'Rare L-Number Plecos & Wholesale Care Supplies',
                rating: 4.9,
                deliveries: 115,
                doaRate: '0.0%',
              },
            ].map((breeder, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{breeder.name}</h4>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{breeder.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {breeder.location}
                </p>
                <p className="text-xs text-slate-700 font-medium mt-2">{breeder.specialty}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-2.5 mt-3">
                  <span>{breeder.deliveries} wholesale dispatches</span>
                  <span className="font-bold text-emerald-700">{breeder.doaRate} DOA rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
