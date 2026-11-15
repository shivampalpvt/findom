'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  AlertTriangle,
  FileSpreadsheet,
  IndianRupee,
  Building,
  Store,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Camera,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import PortalHeader from '@/components/PortalHeader';

export default function AdminDashboard() {
  const { orders, tickets, allProfiles } = useMarketplace();

  // Metrics
  const totalGMV = orders.reduce((acc, o) => acc + o.total_amount, 0);
  const totalEscrowLocked = orders
    .filter((o) => o.payment_status === 'escrow_hold')
    .reduce((acc, o) => acc + o.total_amount, 0);

  const registeredBreeders = allProfiles.filter((p) => p.role === 'supplier').length;
  const registeredRetailers = allProfiles.filter((p) => p.role === 'retailer').length;

  const pendingApprovals = allProfiles.filter(
    (p) => p.verification_status === 'pending'
  );

  const openDisputes = tickets.filter(
    (t) => t.status === 'new' || t.status === 'under_review' || t.status === 'escalated'
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PortalHeader
        portal="admin"
        title="Findom Operations & Arbitration Command Center"
        subtitle="Platform-wide escrow custody, hatchery KYC verifications, DOA dispute arbitration, and order audit logs"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* High Priority Escalation Banner if open disputes or verifications exist */}
        {(openDisputes.length > 0 || pendingApprovals.length > 0) && (
          <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-500/20 text-rose-300 rounded-xl border border-rose-400/30 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-rose-500/30 text-rose-200 px-2 py-0.5 rounded-full">
                  Admin Attention Needed
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  {openDisputes.length} Active DOA Dispute(s) &amp; {pendingApprovals.length} Pending KYC Account(s)
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Escrow arbitration rulings and commercial hatchery licenses are awaiting platform sign-off.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {openDisputes.length > 0 && (
                <Link
                  href="/admin/disputes"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Arbitrate Disputes ({openDisputes.length})
                </Link>
              )}
              {pendingApprovals.length > 0 && (
                <Link
                  href="/admin/users"
                  className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Review KYC ({pendingApprovals.length})
                </Link>
              )}
            </div>
          </div>
        )}

        {/* 4 Core Executive Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Platform GMV</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              ₹{totalGMV.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Cumulative Marketplace Volume
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Escrow In Custody</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-blue-700 mt-2">
              ₹{totalEscrowLocked.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Pending live arrival signoffs</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Verified Network</span>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {registeredBreeders + registeredRetailers}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {registeredBreeders} Breeders • {registeredRetailers} Retail Stores
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Open Disputes</span>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-rose-600 mt-2">{openDisputes.length}</p>
            <p className="text-[11px] text-rose-700 font-medium mt-1">Requires admin arbitration ruling</p>
          </div>
        </div>

        {/* Operational Modules Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/users"
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs group transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
                  <Building className="w-6 h-6" />
                </div>
                {pendingApprovals.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    {pendingApprovals.length} Pending
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition">
                Breeder & Retailer KYC Verification
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Review business registrations, GSTIN numbers, MPEDA permits, and physical hatchery addresses.
              </p>
            </div>
            <span className="text-xs font-bold text-brand-600 flex items-center gap-1 mt-4">
              Inspect Verification Queue →
            </span>
          </Link>

          <Link
            href="/admin/disputes"
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs group transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                {openDisputes.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                    {openDisputes.length} Escalated
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition">
                DOA & Dispute Arbitration Center
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Compare supplier pre-dispatch photos against retailer casualty claims. Issue refunds or payout releases.
              </p>
            </div>
            <span className="text-xs font-bold text-rose-600 flex items-center gap-1 mt-4">
              Enter Arbitration Center →
            </span>
          </Link>

          <Link
            href="/admin/orders"
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs group transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {orders.length} Master Orders
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                Full Marketplace Order Audit
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Master audit trail of every wholesale transaction, Porter dispatch, tracking route, and settlement stage.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 mt-4">
              View Master Audit Ledger →
            </span>
          </Link>
        </div>

        {/* Live System Activity Log */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recent Operational Events
            </h3>
            <span className="text-xs text-slate-400">Live Webhook Feed</span>
          </div>

          <div className="space-y-3">
            {[
              {
                icon: AlertTriangle,
                color: 'text-rose-600 bg-rose-50',
                title: 'DOA Claim Logged for Order #FD-2026-5591',
                desc: 'Retailer Oceanic Blue reported 1x Zebra Pleco casualty. Escrow ₹26,500 locked.',
                time: '15 mins ago',
              },
              {
                icon: Camera,
                color: 'text-purple-600 bg-purple-50',
                title: 'Pre-Dispatch Photos Uploaded for Order #FD-2026-8812',
                desc: 'Coromandel Aqua Breeders uploaded 2 high-res inspection photos for 12 Red Marlboro Discus.',
                time: '1 hour ago',
              },
              {
                icon: CheckCircle2,
                color: 'text-emerald-600 bg-emerald-50',
                title: 'Escrow Payout Disbursed for Order #FD-2026-7643',
                desc: '₹4,250 released to Hooghly Ornamental Hatchery upon 0 DOA confirmation.',
                time: '3 hours ago',
              },
              {
                icon: Users,
                color: 'text-blue-600 bg-blue-50',
                title: 'New Hatchery Registration Submitted',
                desc: 'Godavari Bio-Aqua Hatcheries (Rajahmundry) uploaded commercial fisheries license.',
                time: '5 hours ago',
              },
            ].map((ev, i) => {
              const Icon = ev.icon;
              return (
                <div key={i} className="flex items-start gap-3 text-xs p-2.5 rounded-xl hover:bg-slate-50 transition">
                  <div className={`p-2 rounded-lg shrink-0 ${ev.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{ev.title}</p>
                    <p className="text-slate-500 mt-0.5">{ev.desc}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{ev.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
