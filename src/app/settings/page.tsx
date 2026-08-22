'use client';

import React from 'react';
import { useApp } from '@/context/app-context';
import { Building2, MapPin, UserCheck, ShieldCheck, Mail, Phone } from 'lucide-react';

export default function SettingsPage() {
  const { userProfile } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Account Settings</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Corporate Profile & Delivery Locations
        </h1>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" /> Company Profile Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Legal Entity Name</span>
            <p className="font-extrabold text-slate-900 mt-1">{userProfile.companyName}</p>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Federal Tax ID / EIN</span>
            <p className="font-mono font-bold text-slate-800 mt-1">{userProfile.taxId}</p>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Primary Procurement Officer</span>
            <p className="font-bold text-slate-900 mt-1">{userProfile.contactPerson}</p>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Corporate Email</span>
            <p className="font-medium text-slate-800 mt-1">{userProfile.email}</p>
          </div>

          <div className="sm:col-span-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Default Delivery Dock Address</span>
            <p className="font-medium text-slate-800 mt-1">{userProfile.address}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
