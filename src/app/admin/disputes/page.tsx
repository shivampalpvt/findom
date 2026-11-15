'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  AlertTriangle,
  Scale,
  CheckCircle2,
  XCircle,
  Camera,
  Split,
  MessageSquare,
  ArrowRight,
  Eye,
  FileText,
  IndianRupee,
  ExternalLink,
  ChevronRight,
  X,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import PortalHeader from '@/components/PortalHeader';
import { SupportTicket, Order } from '@/lib/types';

export default function AdminDisputesPage() {
  const { tickets, orders, resolveDispute, updateTicketStatus } = useMarketplace();

  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    tickets.find((t) => t.category === 'doa_dispute' || t.status === 'under_review')?.id || tickets[0]?.id || ''
  );

  const [resolutionNotes, setResolutionNotes] = useState('');
  const [splitRefundPercent, setSplitRefundPercent] = useState(50);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];
  const associatedOrder: Order | undefined = selectedTicket?.order_id
    ? orders.find((o) => o.id === selectedTicket.order_id)
    : undefined;

  const handleResolve = (resolution: 'retailer_refund' | 'supplier_release' | 'split') => {
    if (!selectedTicket) return;

    let notes = resolutionNotes.trim();
    if (!notes) {
      if (resolution === 'retailer_refund') {
        notes = 'DOA claim verified from unboxing media. 100% Escrow refund authorized to retailer account.';
      } else if (resolution === 'supplier_release') {
        notes = 'Pre-dispatch packaging met all MPEDA air standards. Flight delay outside breeder custody. Escrow payout released to supplier.';
      } else {
        notes = `Split settlement approved (${splitRefundPercent}% refund / ${100 - splitRefundPercent}% payout release). Escrow divided between parties.`;
      }
    }

    resolveDispute(selectedTicket.id, selectedTicket.order_id, resolution, notes);
    setActionSuccessMsg(`Dispute successfully resolved with action: ${resolution.replace('_', ' ').toUpperCase()}`);
    setTimeout(() => setActionSuccessMsg(''), 6000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PortalHeader
        portal="admin"
        title="DOA & Commercial Dispute Arbitration Center"
        subtitle="Independent judicial review of pre-dispatch evidence vs unboxing casualty reports with escrow disbursement authority"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {actionSuccessMsg && (
          <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-2xl flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg('')} className="p-1 text-emerald-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Tickets Queue (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Arbitration Docket</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  {tickets.length} Cases
                </span>
              </div>

              <div className="divide-y divide-slate-100 mt-2 max-h-[600px] overflow-y-auto">
                {tickets.map((t) => {
                  const isSelected = t.id === selectedTicketId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedTicketId(t.id);
                        setResolutionNotes('');
                      }}
                      className={`w-full text-left p-3 rounded-xl transition mt-1.5 ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-brand-300' : 'text-slate-500'}`}>
                          {t.ticket_number}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : t.status === 'resolved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {t.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold mt-1 line-clamp-1">{t.subject}</h4>
                      <p className={`text-[11px] mt-0.5 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {t.user_name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Case Details & Side-by-Side Evidence Inspection (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {selectedTicket ? (
              <>
                {/* Case Header Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-slate-100 px-2.5 py-1 rounded-lg text-slate-800">
                          {selectedTicket.ticket_number}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                          {selectedTicket.category.replace('_', ' ')}
                        </span>
                      </div>
                      <h2 className="text-lg font-black text-slate-900 mt-2">
                        {selectedTicket.subject}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Claimant: <span className="font-bold text-slate-800">{selectedTicket.user_name}</span> • Filed on {new Date(selectedTicket.created_at).toLocaleString('en-IN')}
                      </p>
                    </div>

                    {associatedOrder && (
                      <div className="text-right sm:border-l sm:pl-4 sm:border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Escrow Value at Risk</span>
                        <p className="text-xl font-black text-slate-900">
                          ₹{associatedOrder.total_amount.toLocaleString('en-IN')}
                        </p>
                        <span className="text-[10px] font-bold text-amber-600 block">
                          🔒 {associatedOrder.payment_status.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider mb-1">
                      Retailer Statement of Claim:
                    </span>
                    <p className="leading-relaxed">&ldquo;{selectedTicket.description}&rdquo;</p>
                  </div>
                </div>

                {/* CRITICAL FEATURE: Side-by-Side Photographic Evidence Comparison */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                        <Scale className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          Photographic Evidence Comparison
                        </h3>
                        <p className="text-xs text-slate-500">
                          Supplier Pre-Dispatch Proofs vs Retailer Unboxing DOA Proofs
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                      Side-by-Side Inspection
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Supplier Pre-Dispatch Media */}
                    <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Supplier Pre-Dispatch Photos
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          Pre-dispatch inspection
                        </span>
                      </div>

                      {associatedOrder?.dispatch_verification?.photo_urls &&
                      associatedOrder.dispatch_verification.photo_urls.length > 0 ? (
                        <div className="space-y-2">
                          <div className="aspect-video rounded-lg overflow-hidden border border-emerald-300 bg-black">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={associatedOrder.dispatch_verification.photo_urls[0]}
                              alt="Supplier dispatch proof"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-[11px] text-emerald-950 font-medium">
                            Notes: &ldquo;{associatedOrder.dispatch_verification.notes}&rdquo;
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic py-8 text-center">
                          No pre-dispatch photos logged for this shipment.
                        </p>
                      )}
                    </div>

                    {/* Right: Retailer Casualty Claim Media */}
                    <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          Retailer Casualty (DOA) Proofs
                        </span>
                        <span className="text-[10px] text-rose-700 font-semibold">
                          Arrival unboxing
                        </span>
                      </div>

                      {selectedTicket.evidence_urls.length > 0 ? (
                        <div className="space-y-2">
                          <div className="aspect-video rounded-lg overflow-hidden border border-rose-300 bg-black">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={selectedTicket.evidence_urls[0]}
                              alt="Retailer DOA proof"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-[11px] text-rose-950 font-medium">
                            {associatedOrder?.delivery_confirmation?.issue_description || 'Casualties inspected upon bag opening.'}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic py-8 text-center">
                          No unboxing casualty photos attached.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Arbitration Ruling Action Panel */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">
                      Arbitrator Official Ruling & Escrow Execution
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">
                      Status: {selectedTicket.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Official Ruling Notes & Justification (Logged to both parties)
                    </label>
                    <textarea
                      rows={3}
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="Enter legal & factual findings (e.g. Airline confirmed delay exceeding 14h, bag rupture observed, partial refund assigned)..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {/* Action 1: Refund Retailer */}
                    <button
                      type="button"
                      onClick={() => handleResolve('retailer_refund')}
                      className="p-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-xs transition text-center space-y-1"
                    >
                      <XCircle className="w-5 h-5 mx-auto" />
                      <p className="font-bold">Rule for Retailer</p>
                      <p className="text-[10px] text-rose-100 font-normal">
                        Full Refund from Escrow
                      </p>
                    </button>

                    {/* Action 2: Release to Supplier */}
                    <button
                      type="button"
                      onClick={() => handleResolve('supplier_release')}
                      className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition text-center space-y-1"
                    >
                      <CheckCircle2 className="w-5 h-5 mx-auto" />
                      <p className="font-bold">Rule for Supplier</p>
                      <p className="text-[10px] text-emerald-100 font-normal">
                        Release Escrow Payout
                      </p>
                    </button>

                    {/* Action 3: Split Settlement */}
                    <button
                      type="button"
                      onClick={() => handleResolve('split')}
                      className="p-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-xs transition text-center space-y-1"
                    >
                      <Split className="w-5 h-5 mx-auto" />
                      <p className="font-bold">Split Settlement</p>
                      <p className="text-[10px] text-purple-100 font-normal">
                        50% Refund / 50% Payout
                      </p>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-2xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800">No active cases in arbitration docket</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
