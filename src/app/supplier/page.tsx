'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Camera,
  ArrowRight,
  Filter,
  Eye,
  IndianRupee,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import PortalHeader from '@/components/PortalHeader';
import { OrderStatus } from '@/lib/types';

export default function SupplierDashboard() {
  const { currentUser, orders, listings, updateOrderStatus } = useMarketplace();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Supplier's orders
  const supplierOrders = orders.filter((o) =>
    currentUser ? o.supplier_id === currentUser.id : true
  );

  // Supplier's listings
  const supplierListings = listings.filter((l) =>
    currentUser ? l.supplier_id === currentUser.id : true
  );

  // Metrics calculation
  const totalSales = supplierOrders.reduce((acc, o) => acc + o.total_amount, 0);
  const activeOrders = supplierOrders.filter(
    (o) => !['delivered', 'completed', 'cancelled'].includes(o.status)
  ).length;
  const inventoryCount = supplierListings.reduce((acc, l) => acc + l.available_qty, 0);
  const pendingPhotosApproval = supplierOrders.filter(
    (o) => o.status === 'photos_uploaded'
  ).length;
  const completedPayouts = supplierOrders
    .filter((o) => o.payment_status === 'payout_processed')
    .reduce((acc, o) => acc + o.total_amount, 0);

  // Pipeline count
  const pipelineCounts = {
    new: supplierOrders.filter((o) => o.status === 'new').length,
    accepted: supplierOrders.filter((o) => o.status === 'accepted').length,
    preparing: supplierOrders.filter((o) => o.status === 'preparing').length,
    photos_uploaded: supplierOrders.filter((o) => o.status === 'photos_uploaded').length,
    dispatched: supplierOrders.filter((o) => o.status === 'dispatched').length,
    delivered: supplierOrders.filter((o) => o.status === 'delivered' || o.status === 'completed').length,
  };

  // Filtered orders for table
  const filteredOrders = supplierOrders.filter((o) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'action_needed') {
      return ['new', 'accepted', 'preparing', 'photos_uploaded'].includes(o.status);
    }
    return o.status === statusFilter;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">New Order</span>;
      case 'accepted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">Accepted</span>;
      case 'preparing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Packaging / Prep</span>;
      case 'photos_uploaded':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">Photos Uploaded (Waiting Approval)</span>;
      case 'photos_approved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Photos Approved! Dispatch Now</span>;
      case 'dispatched':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">In Air/Cargo Transit</span>;
      case 'delivered':
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Delivered & Completed</span>;
      case 'disputed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Disputed / DOA Claim</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <PortalHeader
        portal="supplier"
        title="Breeder & Hatchery Dashboard"
        subtitle="Manage live stock shipments, oxygen-bagging dispatch proofs, and escrow payouts"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Verification Status Banner if not approved */}
        {currentUser && currentUser.verification_status !== 'approved' && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-amber-900">Commercial Hatchery Verification Pending</h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Your MPEDA / Fisheries Registration documents are currently under review by Findom Platform Administrators.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-lg">
              Pending Admin Review
            </span>
          </div>
        )}

        {/* Action Alert Banner for Dispatch Approvals */}
        {pendingPhotosApproval > 0 && (
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <Camera className="w-6 h-6 text-purple-200" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{pendingPhotosApproval} Shipment Photos Submitted to Retailer</span>
                  <span className="bg-purple-500/30 text-purple-200 text-xs px-2 py-0.5 rounded-full border border-purple-400/30">Live Check</span>
                </h3>
                <p className="text-xs text-purple-200 mt-0.5">
                  Retailer is inspecting pre-dispatch health, fin integrity &amp; packaging proofs before Porter driver pickup.
                </p>
              </div>
            </div>
            <Link
              href="/supplier/orders/ord-1001"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-purple-950 font-bold text-xs rounded-xl hover:bg-purple-50 transition shrink-0"
            >
              View Inspection Thread <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* 5 Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium uppercase tracking-wider">Total Sales</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              ₹{totalSales.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600 inline" /> All wholesale volume
            </p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium uppercase tracking-wider">Active Orders</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{activeOrders}</p>
            <p className="text-[11px] text-slate-500 mt-1">Requiring fulfillment</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium uppercase tracking-wider">Live Inventory</span>
              <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{inventoryCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">{supplierListings.length} species listings</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium uppercase tracking-wider">Photos in Review</span>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Camera className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{pendingPhotosApproval}</p>
            <p className="text-[11px] text-slate-500 mt-1">Pending buyer signoff</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium uppercase tracking-wider">Settled Payouts</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              ₹{completedPayouts.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Escrow released to bank</p>
          </div>
        </div>

        {/* Order Status Pipeline Tracker */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Wholesale Order Pipeline</h3>
              <p className="text-xs text-slate-500">Findom 6-stage verified fulfillment workflow</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {supplierOrders.length} Total Orders
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { key: 'new', label: '1. New Order', count: pipelineCounts.new, color: 'border-blue-300 bg-blue-50/50 text-blue-900' },
              { key: 'accepted', label: '2. Accepted', count: pipelineCounts.accepted, color: 'border-cyan-300 bg-cyan-50/50 text-cyan-900' },
              { key: 'preparing', label: '3. Packaging / Bagging', count: pipelineCounts.preparing, color: 'border-amber-300 bg-amber-50/50 text-amber-900' },
              { key: 'photos_uploaded', label: '4. Photos Uploaded', count: pipelineCounts.photos_uploaded, color: 'border-purple-300 bg-purple-50/50 text-purple-900' },
              { key: 'dispatched', label: '5. In Air Transit', count: pipelineCounts.dispatched, color: 'border-indigo-300 bg-indigo-50/50 text-indigo-900' },
              { key: 'delivered', label: '6. Delivered (DOA Free)', count: pipelineCounts.delivered, color: 'border-emerald-300 bg-emerald-50/50 text-emerald-900' },
            ].map((stage) => (
              <button
                key={stage.key}
                onClick={() => setStatusFilter(statusFilter === stage.key ? 'all' : stage.key)}
                className={`p-3 rounded-xl border text-left transition ${
                  statusFilter === stage.key
                    ? 'ring-2 ring-slate-900 bg-slate-900 text-white'
                    : stage.color
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold leading-tight">{stage.label}</span>
                  <span className={`text-base font-black ${statusFilter === stage.key ? 'text-white' : 'text-slate-900'}`}>
                    {stage.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Incoming Orders Table with 1-Click Status Actions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Incoming Wholesale Orders</h3>
              <p className="text-xs text-slate-500">Live order queue with 1-click status transitions and photo verification</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Statuses ({supplierOrders.length})</option>
                <option value="action_needed">Action Needed</option>
                <option value="new">New Orders</option>
                <option value="accepted">Accepted</option>
                <option value="preparing">Packaging</option>
                <option value="photos_uploaded">Photos Uploaded</option>
                <option value="dispatched">Dispatched</option>
                <option value="delivered">Delivered</option>
                <option value="disputed">Disputed / DOA</option>
              </select>

              <Link
                href="/supplier/listings"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1 shadow-2xs"
              >
                + New Listing
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Order / Retailer</th>
                  <th className="py-3 px-4">Specimens & Quantity</th>
                  <th className="py-3 px-4">Escrow Value</th>
                  <th className="py-3 px-4">Workflow Status</th>
                  <th className="py-3 px-4 text-right">Quick 1-Click Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No orders found under this filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    return (
                      <tr key={order.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <Link
                            href={`/supplier/orders/${order.id}`}
                            className="font-bold text-slate-900 hover:text-brand-600 transition flex items-center gap-1"
                          >
                            #{order.order_number}
                          </Link>
                          <p className="text-slate-600 font-medium mt-0.5">{order.retailer?.business_name}</p>
                          <p className="text-[10px] text-slate-400">
                            {order.shipping_address.city}, {order.shipping_address.state} • {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-1.5">
                                <span className="font-semibold text-slate-800">{item.product_name}</span>
                                <span className="text-slate-400">x{item.quantity}</span>
                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                  {item.size_grade}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <div>₹{order.total_amount.toLocaleString('en-IN')}</div>
                          <span className={`text-[10px] uppercase font-bold tracking-wider ${
                            order.payment_status === 'escrow_hold'
                              ? 'text-amber-600'
                              : order.payment_status === 'payout_processed'
                              ? 'text-emerald-600'
                              : 'text-slate-500'
                          }`}>
                            {order.payment_status === 'escrow_hold' ? '🔒 Escrow Locked' : '✓ Payout Done'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {getStatusBadge(order.status)}
                          {order.dispatch_verification?.retailer_approved === true && (
                            <p className="text-[11px] text-emerald-600 font-medium mt-1">
                              ✓ Photos Approved by Retailer
                            </p>
                          )}
                          {order.dispatch_verification?.retailer_approved === false && (
                            <p className="text-[11px] text-rose-600 font-medium mt-1">
                              ⚠️ Discrepancy Flagged: {order.dispatch_verification.retailer_feedback}
                            </p>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {order.status === 'new' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'accepted')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-2xs transition"
                              >
                                Accept Order
                              </button>
                            )}

                            {order.status === 'accepted' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg text-xs shadow-2xs transition"
                              >
                                Mark Preparing
                              </button>
                            )}

                            {(order.status === 'preparing' || order.status === 'photos_uploaded') && (
                              <Link
                                href={`/supplier/orders/${order.id}`}
                                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-xs shadow-2xs transition flex items-center gap-1"
                              >
                                <Camera className="w-3 h-3" />
                                {order.status === 'photos_uploaded' ? 'View Photos' : 'Upload Photos'}
                              </Link>
                            )}

                            {order.status === 'photos_approved' && (
                              <Link
                                href={`/supplier/orders/${order.id}`}
                                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs shadow-2xs transition flex items-center gap-1"
                              >
                                <Truck className="w-3 h-3" /> Dispatch via Porter
                              </Link>
                            )}

                            <Link
                              href={`/supplier/orders/${order.id}`}
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

        {/* Quick Links Footer Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/supplier/listings"
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs flex items-center justify-between group transition"
          >
            <div>
              <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition">Manage Fish Catalog</h4>
              <p className="text-xs text-slate-500">Update stock quantities, MOQs, and prices per piece</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            href="/supplier/payments"
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs flex items-center justify-between group transition"
          >
            <div>
              <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition">Escrow & Payout Records</h4>
              <p className="text-xs text-slate-500">Monitor bank settlement cycles and GST invoices</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            href="/compare"
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs flex items-center justify-between group transition"
          >
            <div>
              <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition">Live Market Price Index</h4>
              <p className="text-xs text-slate-500">Check current wholesale prices across Mumbai &amp; MMR hatcheries</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
}
