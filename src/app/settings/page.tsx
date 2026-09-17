'use client';

import React from 'react';
import { useApp } from '@/context/app-context';
import { Card } from '@/components/ui';
import { Building2, MapPin, UserCheck, ShieldCheck, Mail, Phone } from 'lucide-react';

export default function SettingsPage() {
  const { userProfile } = useApp();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#e2e8f0] pb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Account Settings</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0f172a] sm:text-3xl">
          Corporate Profile & Delivery Locations
        </h1>
        <p className="mt-1 text-sm text-[#64748b]">
          Manage registered enterprise account details and default receiving dock specifications.
        </p>
      </div>

      {/* Corporate Profile Card */}
      <Card id="company-profile" className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-[#e2e8f0] pb-4">
          <div className="rounded-lg bg-[#f0fdf4] p-2 text-[#0b8f55]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0f172a]">Company Profile Details</h2>
            <p className="text-xs text-[#64748b]">Official corporate entity record and primary contact information.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Legal Entity Name</span>
            <p className="font-extrabold text-sm text-[#0f172a] mt-1">{userProfile.companyName}</p>
          </div>

          <div>
            <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Tax Identification / TIN</span>
            <p className="font-mono font-bold text-sm text-[#0f172a] mt-1">{userProfile.taxId}</p>
          </div>

          <div>
            <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Primary Procurement Officer</span>
            <p className="font-bold text-sm text-[#0f172a] mt-1">{userProfile.contactPerson}</p>
          </div>

          <div>
            <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Corporate Email Address</span>
            <p className="font-semibold text-sm text-[#173962] mt-1">{userProfile.email}</p>
          </div>

          <div className="sm:col-span-2 pt-2 border-t border-[#e2e8f0]">
            <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#0b8f55]" /> Default Delivery Dock Address
            </span>
            <p className="font-semibold text-xs text-[#334155] mt-1 leading-relaxed">{userProfile.address}</p>
          </div>
        </div>
      </Card>
    </main>
  );
}

