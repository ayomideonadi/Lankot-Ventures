'use client';

import Link from 'next/link';
import { useApp } from '@/context/app-context';
import { Badge, Card } from '@/components/ui';
import { ArrowRight, ClipboardList, FileCheck2, PackageCheck, ShoppingCart, Users } from 'lucide-react';

export default function AdminDashboardPage() {
  const { supplyRequests, orders } = useApp();
  const newRequests = supplyRequests.filter((request) => request.status === 'pending').length;
  const underReview = supplyRequests.filter((request) => request.status === 'pending').length;
  const pendingQuotes = supplyRequests.filter((request) => request.status === 'pending').length;
  const approvedQuotes = supplyRequests.filter((request) => request.status === 'accepted').length;
  const activeOrders = orders.filter((order) => order.status !== 'delivered').length;
  const deliveries = orders.filter((order) => ['shipped', 'delivered'].includes(order.status)).length;
  const clients = new Set(supplyRequests.map((request) => request.email)).size;

  const cards = [
    { label: 'New RFQs', value: newRequests, href: '/admin/quotes', icon: ClipboardList },
    { label: 'Pending Quotes', value: pendingQuotes, href: '/admin/quotes', icon: FileCheck2 },
    { label: 'Approved Quotes', value: approvedQuotes, href: '/admin/quotes', icon: FileCheck2 },
    { label: 'Active Orders', value: activeOrders, href: '/admin/orders', icon: ShoppingCart },
    { label: 'Deliveries', value: deliveries, href: '/admin/deliveries', icon: PackageCheck },
    { label: 'Registered Clients', value: clients, href: '/admin/clients', icon: Users },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 space-y-8">
      {/* Header */}
      <header className="border-b border-[#e2e8f0] pb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Lankot HQ Control Center</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0f172a] sm:text-3xl">
          Procurement & Operations Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#64748b]">
          Monitor real-time client RFQ submissions, issue commercial contracts, and manage order dispatches.
        </p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href}>
            <Card className="h-full p-5 transition-all hover:border-[#173962] hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#64748b]">{label}</p>
                  <p className="mt-2 text-2xl font-extrabold text-[#0f172a]">{value}</p>
                </div>
                <span className="rounded-lg bg-[#f0fdf4] p-2.5 text-[#0b8f55]">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-4 flex items-center gap-1 text-[11px] font-bold text-[#087443]">
                Open view <ArrowRight className="h-3 w-3" />
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Latest Requests */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
            <div>
              <h2 className="text-base font-bold text-[#0f172a]">Latest RFQs</h2>
              <p className="mt-0.5 text-xs text-[#64748b]">Client requests awaiting contract pricing.</p>
            </div>
            <Link href="/admin/quotes" className="text-xs font-bold text-[#087443] hover:underline">
              View all
            </Link>
          </div>
          {supplyRequests.length === 0 ? (
            <p className="p-6 text-xs text-[#64748b]">No procurement requests submitted yet.</p>
          ) : (
            <div className="divide-y divide-[#e2e8f0]">
              {supplyRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-[#f8fafc]">
                  <div>
                    <p className="font-mono text-xs font-bold text-[#173962]">{request.requestNumber}</p>
                    <p className="mt-0.5 text-xs font-semibold text-[#0f172a]">{request.clientCompany}</p>
                  </div>
                  <Badge tone={request.status === 'quoted' ? 'success' : request.status === 'accepted' ? 'info' : 'warning'}>
                    {request.status === 'quoted' ? 'Quote Issued' : request.status === 'accepted' ? 'Approved' : 'Pending Review'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Latest Orders */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
            <div>
              <h2 className="text-base font-bold text-[#0f172a]">Active Orders</h2>
              <p className="mt-0.5 text-xs text-[#64748b]">Fulfillment activity across buyer accounts.</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-bold text-[#087443] hover:underline">
              View all
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="p-6 text-xs text-[#64748b]">No active orders created yet.</p>
          ) : (
            <div className="divide-y divide-[#e2e8f0]">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-[#f8fafc]">
                  <div>
                    <p className="font-mono text-xs font-bold text-[#173962]">{order.orderNumber}</p>
                    <p className="mt-0.5 text-xs font-semibold text-[#0f172a]">{order.clientCompany}</p>
                  </div>
                  <Badge tone={order.status === 'delivered' ? 'success' : order.status === 'shipped' ? 'info' : 'warning'}>
                    {order.status === 'delivered' ? 'Delivered' : order.status === 'shipped' ? 'Dispatched' : order.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

