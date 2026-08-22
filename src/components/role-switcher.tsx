'use client';

import React from 'react';
import { useApp } from '../context/app-context';
import { ShieldCheck, UserCheck, RefreshCw, Layers } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { userRole, setUserRole, userProfile } = useApp();

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-200 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-inner">
      <div className="flex items-center gap-2 font-medium">
        <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono text-[11px] uppercase tracking-wider">
          <Layers className="w-3 h-3" /> Prototype Demo Mode
        </span>
        <span className="hidden sm:inline text-slate-400">
          Currently simulating:
        </span>
        <span className="font-semibold text-white">
          {userRole === 'buyer' ? `${userProfile.companyName} (Buyer Portal)` : 'Lankot Ventures HQ (Admin Operations)'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-400 hidden md:inline">Switch Role View:</span>
        <div className="inline-flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setUserRole('buyer')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
              userRole === 'buyer'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Corporate Buyer
          </button>
          <button
            onClick={() => setUserRole('admin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
              userRole === 'admin'
                ? 'bg-emerald-600 text-white shadow-sm'
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
