'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building,
  Store,
  MapPin,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
  ExternalLink,
  X,
  CreditCard,
  Ban,
  RefreshCw,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import PortalHeader from '@/components/PortalHeader';
import { UserProfile, VerificationStatus } from '@/lib/types';

export default function AdminUsersPage() {
  const { allProfiles, updateUserVerification } = useMarketplace();

  const [roleFilter, setRoleFilter] = useState<'all' | 'supplier' | 'retailer'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Document modal inspection
  const [inspectUser, setInspectUser] = useState<UserProfile | null>(null);

  const filteredUsers = allProfiles.filter((u) => {
    if (u.role === 'admin') return false; // exclude admin accounts from verification queue

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.verification_status === statusFilter;

    const matchesSearch =
      u.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.gstin || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">✓ Verified Active</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">Pending Review</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">Rejected</span>;
      case 'suspended':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800">Suspended</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PortalHeader
        portal="admin"
        title="Breeder & Retailer Verification Queue"
        subtitle="Review trade licenses, GST certificates, and aquaculture physical farm infrastructure"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search business, proprietor, GSTIN, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Roles</option>
              <option value="supplier">Commercial Breeders / Suppliers</option>
              <option value="retailer">Retail Aquarium Stores</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Verification Statuses</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved &amp; Active</option>
              <option value="suspended">Suspended Accounts</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Business & Role</th>
                  <th className="py-3 px-4">Proprietor Contact</th>
                  <th className="py-3 px-4">Location / Hub</th>
                  <th className="py-3 px-4">GSTIN & Documents</th>
                  <th className="py-3 px-4">KYC Status</th>
                  <th className="py-3 px-4 text-right">Arbitration Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No accounts found matching this filter query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl ${
                              user.role === 'supplier'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-sky-50 text-sky-700'
                            }`}>
                              {user.role === 'supplier' ? <Building className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{user.business_name}</p>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                {user.role === 'supplier' ? 'Fish Hatchery / Breeder' : 'Aquarium Retail Store'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-900">{user.owner_name}</p>
                          <p className="text-slate-500 text-[11px]">{user.phone}</p>
                          <p className="text-slate-400 text-[10px]">{user.email}</p>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-800">{user.city}, {user.state}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{user.address || 'Address provided'}</p>
                          {user.hub && (
                            <span className="text-[10px] text-brand-700 font-medium">Hub: {user.hub}</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-mono text-xs font-semibold text-slate-900">
                            {user.gstin || 'GSTIN Pending'}
                          </p>
                          <button
                            onClick={() => setInspectUser(user)}
                            className="mt-1 text-[11px] font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" /> Inspect License Proof
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          {getStatusBadge(user.verification_status)}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {user.verification_status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateUserVerification(user.id, 'approved')}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-2xs transition"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateUserVerification(user.id, 'rejected')}
                                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs border border-rose-200 transition"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {user.verification_status === 'approved' && (
                              <button
                                onClick={() => updateUserVerification(user.id, 'suspended')}
                                className="px-2 py-1 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-semibold rounded-lg text-xs transition"
                                title="Suspend Account"
                              >
                                Suspend
                              </button>
                            )}

                            {(user.verification_status === 'suspended' || user.verification_status === 'rejected') && (
                              <button
                                onClick={() => updateUserVerification(user.id, 'approved')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
                              >
                                Restore
                              </button>
                            )}
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
      </div>

      {/* Inspect Business Document Modal */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="font-bold text-base">KYC License &amp; Document Review</h3>
                <p className="text-xs text-slate-300">{inspectUser.business_name}</p>
              </div>
              <button
                onClick={() => setInspectUser(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Proprietor</span>
                  <p className="font-bold text-slate-900">{inspectUser.owner_name}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">GSTIN / Tax ID</span>
                  <p className="font-mono font-bold text-slate-900">{inspectUser.gstin || 'Not registered'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Location Hub</span>
                  <p className="font-medium text-slate-800">{inspectUser.city}, {inspectUser.state}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Bank Account</span>
                  <p className="font-mono text-slate-700">{inspectUser.bank_account || 'Provided during onboarding'}</p>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">
                  Submitted Fisheries / Commercial Trade License:
                </span>
                <div className="rounded-xl overflow-hidden border border-slate-300 bg-slate-100 aspect-video relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={inspectUser.business_doc_url || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'}
                    alt="License proof"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <span className="text-white text-xs font-bold bg-black/60 px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <ExternalLink className="w-3.5 h-3.5" /> High-Resolution Inspection
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInspectUser(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
                >
                  Close
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateUserVerification(inspectUser.id, 'rejected');
                      setInspectUser(null);
                    }}
                    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateUserVerification(inspectUser.id, 'approved');
                      setInspectUser(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
                  >
                    Approve Verification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
