'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Fish,
  Wallet,
  ShieldAlert,
  Users,
  FileSpreadsheet,
  AlertCircle,
  Building2,
  Store,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';

interface TabItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface PortalHeaderProps {
  portal: 'supplier' | 'retailer' | 'admin';
  title?: string;
  subtitle?: string;
}

export default function PortalHeader({ portal, title, subtitle }: PortalHeaderProps) {
  const pathname = usePathname();
  const { currentUser, orders, tickets, allProfiles } = useMarketplace();

  // Metrics for badges
  const pendingPhotosCount = orders.filter((o) => o.status === 'photos_uploaded').length;
  const activeDisputesCount = tickets.filter(
    (t) => t.status === 'new' || t.status === 'under_review' || t.status === 'escalated'
  ).length;
  const pendingVerificationsCount = allProfiles.filter((p) => p.verification_status === 'pending').length;

  const supplierTabs: TabItem[] = [
    { label: 'Overview', href: '/supplier', icon: LayoutDashboard },
    { label: 'Inventory & Listings', href: '/supplier/listings', icon: Fish },
    { label: 'Payments & Escrow', href: '/supplier/payments', icon: Wallet },
  ];

  const retailerTabs: TabItem[] = [
    {
      label: 'My Orders & Deliveries',
      href: '/retailer',
      icon: Store,
      badge: pendingPhotosCount > 0 ? `${pendingPhotosCount} Action Required` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      label: 'DOA Claims & Support',
      href: '/retailer/disputes',
      icon: ShieldAlert,
      badge: activeDisputesCount > 0 ? `${activeDisputesCount}` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
  ];

  const adminTabs: TabItem[] = [
    { label: 'Executive Overview', href: '/admin', icon: LayoutDashboard },
    {
      label: 'Breeder & Retailer Verification',
      href: '/admin/users',
      icon: Users,
      badge: pendingVerificationsCount > 0 ? `${pendingVerificationsCount} Pending` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      label: 'DOA & Dispute Arbitration',
      href: '/admin/disputes',
      icon: AlertCircle,
      badge: activeDisputesCount > 0 ? `${activeDisputesCount} Open` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    { label: 'Master Order Audit', href: '/admin/orders', icon: FileSpreadsheet },
  ];

  const tabs =
    portal === 'supplier'
      ? supplierTabs
      : portal === 'retailer'
      ? retailerTabs
      : adminTabs;

  const portalBadge =
    portal === 'supplier'
      ? { text: 'Breeder / Supplier Console', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300' }
      : portal === 'retailer'
      ? { text: 'Retail Aquarium Store Console', color: 'bg-sky-500/10 text-sky-700 border-sky-300' }
      : { text: 'Operations & Arbitration Console', color: 'bg-purple-500/10 text-purple-700 border-purple-300' };

  return (
    <div className="bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${portalBadge.color}`}>
                {portalBadge.text}
              </span>
              {currentUser?.verification_status === 'approved' && (
                <span className="inline-flex items-center text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Verified Account
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {title || (portal === 'supplier' ? 'Supplier Portal' : portal === 'retailer' ? 'Retailer Portal' : 'Admin Operations')}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {subtitle ||
                (currentUser?.business_name ? `${currentUser.business_name} • ${currentUser.city}, ${currentUser.state}` : 'Manage live aquatic commerce & operations')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold">
                {currentUser?.business_name?.[0] || 'U'}
              </div>
              <div>
                <p className="font-semibold text-slate-800 leading-tight">
                  {currentUser?.business_name || 'Guest User'}
                </p>
                <p className="text-slate-500 text-[11px]">
                  {currentUser?.owner_name || 'Sign in to access'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-t border-slate-100 pt-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                      tab.badgeColor || 'bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
