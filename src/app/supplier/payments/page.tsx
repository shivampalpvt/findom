'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Download,
  IndianRupee,
  Building,
  CreditCard,
  AlertCircle,
  FileText,
  Calendar,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import PortalHeader from '@/components/PortalHeader';

export default function SupplierPaymentsPage() {
  const { currentUser, orders } = useMarketplace();
  const [filter, setFilter] = useState<'all' | 'escrow_hold' | 'payout_processed'>('all');

  const supplierOrders = orders.filter((o) =>
    currentUser ? o.supplier_id === currentUser.id : true
  );

  // Financial calculations
  const totalRevenue = supplierOrders.reduce((acc, o) => acc + o.total_amount, 0);

  const escrowLockedFunds = supplierOrders
    .filter((o) => o.payment_status === 'escrow_hold')
    .reduce((acc, o) => acc + o.total_amount, 0);

  const completedPayouts = supplierOrders
    .filter((o) => o.payment_status === 'payout_processed')
    .reduce((acc, o) => acc + o.total_amount, 0);

  const disputedEscrow = supplierOrders
    .filter((o) => o.status === 'disputed')
    .reduce((acc, o) => acc + o.total_amount, 0);

  const filteredOrders = supplierOrders.filter((o) => {
    if (filter === 'all') return true;
    return o.payment_status === filter;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PortalHeader
        portal="supplier"
        title="Wholesale Payouts & Escrow Ledger"
        subtitle="Transparent escrow tracking, automated T+1 bank releases, and GST invoicing"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Financial Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Sales Volume</span>
              <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Across {supplierOrders.length} wholesale orders</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Escrow Held</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-600 mt-2">
              ₹{escrowLockedFunds.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3" /> Awaiting live arrival confirmation
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Completed Payouts</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600 mt-2">
              ₹{completedPayouts.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">
              Disbursed to linked bank account
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Disputed In Escrow</span>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-rose-600 mt-2">
              ₹{disputedEscrow.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-rose-700 mt-1 font-medium">Under DOA arbitration review</p>
          </div>
        </div>

        {/* Bank & Settlement Guarantee Card */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-xl text-emerald-400 shrink-0">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Designated Settlement Bank Account
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Verified NEFT/RTGS
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-mono">
                {currentUser?.bank_account || 'HDFC Bank - A/C: 501002881923'} | IFSC:{' '}
                {currentUser?.bank_ifsc || 'HDFC0001234'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Account Holder: <span className="text-white font-medium">{currentUser?.owner_name || 'K. Rajasekaran'}</span> • GSTIN:{' '}
                <span className="text-white font-medium">{currentUser?.gstin || '33AAACB1234F1Z8'}</span>
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl text-xs space-y-1 shrink-0">
            <p className="font-bold text-slate-200">Automated Release Cycle:</p>
            <p className="text-slate-400 text-[11px]">
              • Payout triggers automatically when buyer confirms live arrival
            </p>
            <p className="text-slate-400 text-[11px]">
              • Auto-release kicks in 48 hours after courier delivery scan
            </p>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Order-wise Transaction Ledger</h3>
              <p className="text-xs text-slate-500">Live escrow settlements, commission deductions & payout statuses</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-xs border border-slate-300 rounded-xl px-3 py-1.5 bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Settlements ({supplierOrders.length})</option>
                <option value="escrow_hold">Locked in Escrow</option>
                <option value="payout_processed">Released / Paid Out</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Order Ref / Date</th>
                  <th className="py-3 px-4">Retail Buyer</th>
                  <th className="py-3 px-4">Order Value</th>
                  <th className="py-3 px-4">Platform Fee (3%)</th>
                  <th className="py-3 px-4">Net Payout</th>
                  <th className="py-3 px-4">Escrow Status</th>
                  <th className="py-3 px-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No transactions recorded under this filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const platformFee = Math.round(order.total_amount * 0.03);
                    const netPayout = order.total_amount - platformFee;

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <Link
                            href={`/supplier/orders/${order.id}`}
                            className="font-bold text-slate-900 hover:text-brand-600 transition"
                          >
                            #{order.order_number}
                          </Link>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-900">{order.retailer?.business_name}</p>
                          <p className="text-[10px] text-slate-500">
                            {order.shipping_address.city}, {order.shipping_address.state}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          ₹{order.total_amount.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 font-mono">
                          - ₹{platformFee.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4 font-black text-emerald-600 text-sm">
                          ₹{netPayout.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4">
                          {order.payment_status === 'escrow_hold' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Escrow Locked
                            </span>
                          ) : order.payment_status === 'payout_processed' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Transferred
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                              {order.payment_status}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() =>
                              alert(
                                `Generating B2B Tax Invoice for Order #${order.order_number}\nSupplier: ${currentUser?.business_name}\nGSTIN: ${currentUser?.gstin || '33AAACB1234F1Z8'}\nNet Amount: ₹${netPayout}`
                              )
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold transition"
                          >
                            <Download className="w-3 h-3" /> GST Tax Inv
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
