'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Eye,
  IndianRupee,
  Building,
  Store,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  Camera,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import PortalHeader from '@/components/PortalHeader';
import { Order, OrderStatus } from '@/lib/types';

export default function AdminOrdersPage() {
  const { orders } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.retailer?.business_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.supplier?.business_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.tracking_number || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">New Order</span>;
      case 'accepted':
      case 'preparing':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">Preparing Cargo</span>;
      case 'photos_uploaded':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">Photos Uploaded</span>;
      case 'photos_approved':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Photos Approved</span>;
      case 'dispatched':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">In Air Cargo</span>;
      case 'delivered':
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">Completed (Escrow Released)</span>;
      case 'disputed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300">Dispute Under Review</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PortalHeader
        portal="admin"
        title="Master Order Audit & Consignments"
        subtitle="Complete cross-platform audit of all wholesale orders, live Porter dispatches, and escrow settlement status"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by order #, retailer, breeder, Porter ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-slate-500 font-semibold shrink-0">Status:</span>
            {['all', 'photos_uploaded', 'dispatched', 'delivered', 'completed', 'disputed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize shrink-0 transition ${
                  statusFilter === s
                    ? 'bg-purple-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Master Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Aquarium Retailer</th>
                  <th className="py-3 px-4">Breeder / Supplier</th>
                  <th className="py-3 px-4">Consignment Total</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4">Escrow Status</th>
                  <th className="py-3 px-4">Local Courier / Porter ID</th>
                  <th className="py-3 px-4 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No orders match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900">{order.order_number}</span>
                        <div className="text-[10px] text-slate-400">
                          {new Date(order.created_at).toLocaleDateString('en-IN')}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          {order.retailer?.business_name || 'Retail Store'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {order.retailer?.city}, {order.retailer?.state}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          {order.supplier?.business_name || 'Breeder'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {order.supplier?.city}, {order.supplier?.state}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ₹{order.total_amount.toLocaleString('en-IN')}
                        <div className="text-[10px] text-slate-400 font-normal">
                          {order.items.length} species ({order.items.reduce((a, b) => a + b.quantity, 0)} pcs)
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            order.payment_status === 'payout_processed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.payment_status === 'escrow_hold'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {order.payment_status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {order.tracking_number ? (
                          <div className="font-mono text-xs text-sky-700 bg-sky-50 px-2 py-1 rounded inline-block">
                            {order.tracking_number}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Pending dispatch</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Consignment Audit: #{selectedOrder.order_number}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Created on {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Retail Buyer</span>
                  <p className="font-bold text-slate-900">{selectedOrder.retailer?.business_name}</p>
                  <p className="text-slate-500">{selectedOrder.retailer?.owner_name}</p>
                  <p className="text-slate-500">{selectedOrder.retailer?.phone}</p>
                  <p className="text-slate-500">{selectedOrder.shipping_address.address_line}, {selectedOrder.shipping_address.city}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Breeder / Consignor</span>
                  <p className="font-bold text-slate-900">{selectedOrder.supplier?.business_name}</p>
                  <p className="text-slate-500">{selectedOrder.supplier?.owner_name}</p>
                  <p className="text-slate-500">{selectedOrder.supplier?.phone}</p>
                  <p className="text-slate-500">{selectedOrder.supplier?.city}, {selectedOrder.supplier?.state}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Live Aquatic Consignment</h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{item.product_name}</p>
                        <p className="text-slate-500 text-[11px]">{item.size_grade} • {item.quantity} pieces</p>
                      </div>
                      <span className="font-bold text-slate-900">₹{item.total_price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pre-Dispatch Inspection Photos */}
              {selectedOrder.dispatch_verification && (
                <div className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-600" /> Supplier Pre-Dispatch Photo Evidence
                  </h4>
                  <p className="text-[11px] text-amber-800">{selectedOrder.dispatch_verification.notes}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedOrder.dispatch_verification.photo_urls.map((url, idx) => (
                      <img key={idx} src={url} alt="Dispatch proof" className="w-full h-32 object-cover rounded-lg border border-amber-200" />
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Confirmation */}
              {selectedOrder.delivery_confirmation && (
                <div className="bg-sky-50/60 border border-sky-200/80 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-600" /> Delivery Arrival Report
                  </h4>
                  <p className="text-[11px] text-sky-800">
                    Condition: <strong className="uppercase">{selectedOrder.delivery_confirmation.condition}</strong> (DOA Count: {selectedOrder.delivery_confirmation.doa_count})
                  </p>
                  {selectedOrder.delivery_confirmation.issue_description && (
                    <p className="text-[11px] text-slate-600 italic">"{selectedOrder.delivery_confirmation.issue_description}"</p>
                  )}
                </div>
              )}

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs">
                <span className="text-slate-500">Escrow Custody ID: ESC-{selectedOrder.id.slice(0, 8)}</span>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Close Audit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
