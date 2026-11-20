'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  AlertTriangle,
  Plus,
  Clock,
  CheckCircle2,
  MessageSquare,
  FileText,
  Search,
  ExternalLink,
  X,
  HelpCircle,
  Building,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import PortalHeader from '@/components/PortalHeader';
import { SupportTicket } from '@/lib/types';
import DirectImageUploader from '@/components/DirectImageUploader';

export default function RetailerDisputesPage() {
  const { currentUser, tickets, createTicket, orders } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New ticket form state
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('doa_dispute');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceList, setEvidenceList] = useState<string[]>([]);

  // Retailer tickets
  const retailerTickets = tickets.filter((t) =>
    currentUser ? t.user_id === currentUser.id || t.user_role === 'retailer' : true
  );

  const filteredTickets = retailerTickets.filter((t) => {
    const matchesSearch =
      t.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    createTicket({
      order_id: selectedOrderId || undefined,
      user_id: currentUser?.id || 'ret-1',
      user_name: `${currentUser?.owner_name || 'Retail Store Owner'} (${currentUser?.business_name || 'Oceanic Blue'})`,
      user_role: 'retailer',
      subject: subject.trim(),
      category,
      description: description.trim(),
      evidence_urls: evidenceList,
      admin_notes: 'Claim initiated by retailer. Admin assigned for review.',
    });

    setIsModalOpen(false);
    setSubject('');
    setDescription('');
    setSelectedOrderId('');
    setEvidenceList([]);
  };

  const handleAddEvidence = () => {
    if (!evidenceUrl.trim()) return;
    setEvidenceList([...evidenceList, evidenceUrl.trim()]);
    setEvidenceUrl('');
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">New Ticket</span>;
      case 'under_review':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">Arbitration In Review</span>;
      case 'waiting_for_supplier':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">Awaiting Breeder Response</span>;
      case 'escalated':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">Escalated to Lead Ops</span>;
      case 'resolved':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">✓ Resolved</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">Closed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PortalHeader
        portal="retailer"
        title="DOA Claims & Dispute Center"
        subtitle="Report transit casualties, track arbitration tickets, and claim escrow refunds"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Policy Explainer Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-white/10 rounded-xl text-sky-300 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Findom 48-Hour Live Arrival Guarantee</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                All wholesale purchases are held safely in escrow. If any live fish arrive deceased due to transit delay, punctured bags, or temperature shock, submit a DOA claim with uncut bag photos within 48 hours to receive an automatic refund or replacement credit.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> File New DOA / Support Claim
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by Ticket #, subject, or order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Dispute Statuses</option>
              <option value="under_review">Under Review</option>
              <option value="waiting_for_supplier">Waiting for Breeder</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-2xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-base font-bold text-slate-900">No Open Disputes</h4>
              <p className="text-xs text-slate-500 mt-1">
                Your shipments have had 0 reported delivery issues under this filter.
              </p>
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              return (
                <div
                  key={ticket.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 hover:border-slate-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs bg-slate-100 px-2.5 py-1 rounded-lg text-slate-800">
                        {ticket.ticket_number}
                      </span>
                      {getStatusBadge(ticket.status)}
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                        Category: {ticket.category.replace('_', ' ')}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      Filed on {new Date(ticket.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{ticket.subject}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ticket.description}</p>
                  </div>

                  {/* Evidence Photos */}
                  {ticket.evidence_urls.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block mb-1">
                        Attached DOA Proof Photos:
                      </span>
                      <div className="flex items-center gap-2">
                        {ticket.evidence_urls.map((url, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={i}
                            src={url}
                            alt={`Evidence ${i + 1}`}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-100"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Admin Notes & Resolution Message */}
                  {ticket.admin_notes && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-brand-800 block text-[11px] uppercase tracking-wider mb-0.5">
                        Platform Arbitration Findings & Resolution:
                      </span>
                      <p className="text-slate-700 font-medium">{ticket.admin_notes}</p>
                    </div>
                  )}

                  {ticket.order_id && (
                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                      <span>Associated Order: <span className="font-bold text-slate-800">#{ticket.order_id}</span></span>
                      <Link
                        href={`/retailer/orders/${ticket.order_id}`}
                        className="text-brand-600 hover:text-brand-700 font-bold inline-flex items-center gap-1"
                      >
                        Inspect Order Details <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* File Dispute Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <h3 className="font-bold text-base flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                File Wholesale Dispute / DOA Claim
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Related Wholesale Order
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Select Order (Optional)</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      #{o.order_number} — {o.supplier?.business_name} (₹{o.total_amount.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Dispute Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="doa_dispute">Dead on Arrival (DOA) / Casualties</option>
                  <option value="species_mismatch">Species or Grade Mismatch</option>
                  <option value="packaging_failure">Packaging Leak or Insulation Damage</option>
                  <option value="porter_delay">Porter / Local Courier Delay (&gt;60 min)</option>
                  <option value="general_support">General Support</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Claim Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DOA Claim: 3 Discus dead on arrival due to ruptured bag"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Incident Description & Unboxing Notes
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail exact casualty count, water odor, unboxing timestamp, bag integrity..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <DirectImageUploader
                  label="Attach Evidence Photos *"
                  helperText="Upload dead fish, punctured bag, or water parameter photos directly from storage. Files are stored on Findom server."
                  images={evidenceList}
                  onChange={setEvidenceList}
                  multiple={true}
                  maxFiles={6}
                  accentColor="rose"
                  sampleImages={[
                    {
                      label: 'Sample DOA Bag',
                      url: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=800&q=80',
                    },
                  ]}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition"
                >
                  Submit Dispute Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
