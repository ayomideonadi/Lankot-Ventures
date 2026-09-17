'use client';

import React from 'react';
import { useApp } from '../context/app-context';
import { ShieldCheck, UserCheck, Layers } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { userRole, setUserRole, userProfile } = useApp();

  return (
    <div className="bg-[#0b1f3a] border-b border-[#102a4c] text-slate-300 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 font-medium">
        <span className="inline-flex items-center gap-1.5 bg-[#0b8f55]/15 text-[#8ee0b2] border border-[#0b8f55]/30 px-2.5 py-0.5 rounded-full font-mono text-[11px] uppercase tracking-wider">
          <Layers className="w-3 h-3 text-[#0b8f55]" /> Workspace View
        </span>
        <span className="hidden sm:inline text-slate-400">
          Simulating:
        </span>
        <span className="font-semibold text-white">
          {userRole === 'buyer' ? `${userProfile.companyName} (Buyer Portal)` : 'Lankot Ventures HQ (Admin Operations)'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-400 hidden md:inline text-[11px]">Role Mode:</span>
        <div className="inline-flex bg-[#102a4c] p-0.5 rounded-lg border border-[#173962]">
          <button
            type="button"
            aria-pressed={userRole === 'buyer'}
            onClick={() => setUserRole('buyer')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-semibold ${
              userRole === 'buyer'
                ? 'bg-[#173962] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Corporate Buyer
          </button>
          <button
            type="button"
            aria-pressed={userRole === 'admin'}
            onClick={() => setUserRole('admin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-semibold ${
              userRole === 'admin'
                ? 'bg-[#0b8f55] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Lankot Admin
          </button>
        </div>
      </div>
    </div>
  );
};

