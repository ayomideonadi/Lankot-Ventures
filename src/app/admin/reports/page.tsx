'use client';

import { useApp } from '@/context/app-context';
import { Card } from '@/components/ui';
import { BarChart3, FileCheck2, PackageCheck, ClipboardList } from 'lucide-react';

export default function AdminReportsPage() {
  const { supplyRequests, orders } = useApp();
  const quoted = supplyRequests.filter((request) => request.status === 'quoted').length;
  const delivered = orders.filter((order) => order.status === 'delivered').length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 space-y-8">
      {/* Header */}
      <header className="border-b border-[#e2e8f0] pb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Lankot Operational Analytics</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0f172a] sm:text-3xl">
          Procurement Activity Reports
        </h1>
        <p className="mt-1 text-sm text-[#64748b]">
          Real-time volume metrics and turnaround indicators calculated from live platform state.
        </p>
      </header>

      {/* Metrics Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Requests Received</span>
            <div className="rounded-lg bg-[#f0fdf4] p-2 text-[#0b8f55]">
              <ClipboardList className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#0f172a]">{supplyRequests.length}</p>
          <p className="text-[11px] text-[#64748b]">Total buyer RFQs logged in system</p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Quotes Prepared</span>
            <div className="rounded-lg bg-[#f0fdf4] p-2 text-[#0b8f55]">
              <FileCheck2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#0f172a]">{quoted}</p>
          <p className="text-[11px] text-[#64748b]">Issued binding commercial rates</p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Orders Delivered</span>
            <div className="rounded-lg bg-[#f0fdf4] p-2 text-[#0b8f55]">
              <PackageCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#087443]">{delivered}</p>
          <p className="text-[11px] text-[#64748b]">Completed order fulfilment cycles</p>
        </Card>
      </div>
    </div>
  );
}

