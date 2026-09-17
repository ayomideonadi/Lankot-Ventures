'use client';

import { useMemo, useState } from 'react';
import { useApp } from '@/context/app-context';
import { Card, EmptyState } from '@/components/ui';
import { Search, Users, Building2 } from 'lucide-react';

export default function AdminClientsPage() {
  const { supplyRequests, orders } = useApp();
  const [search, setSearch] = useState('');

  const clients = useMemo(() => {
    const map = new Map<
      string,
      { company: string; contact: string; email: string; phone: string; requests: number; orders: number; date: string }
    >();

    supplyRequests.forEach((request) => {
      const current = map.get(request.email) || {
        company: request.clientCompany,
        contact: request.clientContact,
        email: request.email,
        phone: request.phone,
        requests: 0,
        orders: 0,
        date: request.createdAt,
      };
      current.requests += 1;
      map.set(request.email, current);
    });

    orders.forEach((order) => {
      const current = map.get(order.email) || {
        company: order.clientCompany,
        contact: order.clientContact,
        email: order.email,
        phone: 'Not provided',
        requests: 0,
        orders: 0,
        date: order.createdAt,
      };
      current.orders += 1;
      map.set(order.email, current);
    });

    return [...map.values()].filter((client) =>
      `${client.company} ${client.contact} ${client.email}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search, supplyRequests]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 space-y-8">
      {/* Header */}
      <header className="border-b border-[#e2e8f0] pb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Lankot Account Directory</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0f172a] sm:text-3xl">
          Enterprise Client Directory
        </h1>
        <p className="mt-1 text-sm text-[#64748b]">
          Inspect registered client organizations, activity history, and engagement metrics.
        </p>
      </header>

      {/* Content Card */}
      <Card className="overflow-hidden">
        <div className="border-b border-[#e2e8f0] p-4 bg-[#f8fafc]/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
            <input
              aria-label="Search clients"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by company, officer name, or corporate email..."
              className="h-10 w-full rounded-lg border border-[#e2e8f0] bg-white pl-9 pr-3 text-xs text-[#0f172a] placeholder-[#94a3b8] focus:border-[#0b8f55] focus:outline-none focus:ring-2 focus:ring-[#0b8f55]/20"
            />
          </div>
        </div>

        {clients.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No matching clients found"
              description="Client records appear automatically as buyers submit RFQs or approve quotes."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[10px] uppercase tracking-wider text-[#64748b]">
                <tr>
                  <th className="px-6 py-3.5">Company Name</th>
                  <th className="px-4 py-3.5">Procurement Officer</th>
                  <th className="px-4 py-3.5">Corporate Email</th>
                  <th className="px-4 py-3.5">Phone Number</th>
                  <th className="px-4 py-3.5">Total RFQs</th>
                  <th className="px-4 py-3.5">Total Orders</th>
                  <th className="px-6 py-3.5">First Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {clients.map((client) => (
                  <tr key={client.email} className="hover:bg-[#f8fafc]">
                    <td className="px-6 py-4 font-bold text-[#0f172a]">
                      <Building2 className="mr-2 inline h-4 w-4 text-[#0b8f55]" />
                      {client.company}
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#334155]">{client.contact}</td>
                    <td className="px-4 py-4 text-[#173962] font-mono">{client.email}</td>
                    <td className="px-4 py-4 text-[#64748b]">{client.phone}</td>
                    <td className="px-4 py-4 font-extrabold text-[#0f172a]">{client.requests}</td>
                    <td className="px-4 py-4 font-extrabold text-[#087443]">{client.orders}</td>
                    <td className="px-6 py-4 text-[#64748b]">{client.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

