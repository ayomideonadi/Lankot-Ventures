'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatNaira } from '@/lib/currency';
import { Badge, Card, EmptyState } from '@/components/ui';
import { ArrowUpDown, ChevronRight, FileText, PackageCheck, Search, Truck } from 'lucide-react';

function Status({ value }: { value: string }) {
  if (value === 'delivered') return <Badge tone="success">Delivered</Badge>;
  if (value === 'shipped') return <Badge tone="info">Dispatched</Badge>;
  if (value === 'processing' || value === 'confirmed') return <Badge tone="warning">Processing</Badge>;
  return <Badge tone="neutral">Submitted</Badge>;
}

export default function OrdersPage() {
  const { orders, supplyRequests } = useApp();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [date, setDate] = useState('all');
  const [sort, setSort] = useState('newest');
  const query = search.toLowerCase().trim();
  const months = [...new Set(orders.map((order) => order.createdAt.slice(0, 7)))];

  const visibleOrders = useMemo(() => [...orders].filter((order) => {
    const description = order.items.map((item) => item.itemName).join(' ');
    const matchesSearch = !query || `${order.orderNumber} ${order.poNumber} ${order.invoiceNumber || ''} ${description}`.toLowerCase().includes(query);
    return matchesSearch && (status === 'all' || order.status === status) && (date === 'all' || order.createdAt.slice(0, 7) === date);
  }).sort((a, b) => sort === 'oldest' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt)), [date, orders, query, sort, status]);

  const deliveryDate = (orderId: string, orderStatus: string) => {
    const order = orders.find((item) => item.id === orderId);
    if (orderStatus === 'delivered') return order?.updatedAt || 'Delivered';
    return supplyRequests.find((request) => request.id === order?.requestId)?.targetDeliveryDate || 'In coordination';
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="mb-8 flex flex-col justify-between gap-4 border-b border-[#e2e8f0] pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Client portal</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0f172a]">Orders</h1>
          <p className="mt-1 text-sm text-[#64748b]">Track approved procurement through fulfilment and delivery.</p>
        </div>
        <Link href="/rfq" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0b8f55] px-4 text-sm font-bold text-white shadow-sm hover:bg-[#087443] transition-colors">
          <FileText className="h-4 w-4" />New procurement request
        </Link>
      </header>

      <Card className="mb-6 p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_180px_180px_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search orders, PO or invoice" aria-label="Search orders" className="h-10 w-full border border-[#e2e8f0] bg-[#f8fafc] pl-9 pr-3 text-sm" />
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status" className="h-10 border border-[#e2e8f0] bg-[#f8fafc] px-3 text-sm">
            <option value="all">All statuses</option>
            <option value="pending">Submitted</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Dispatched</option>
            <option value="delivered">Delivered</option>
          </select>
          <select value={date} onChange={(event) => setDate(event.target.value)} aria-label="Filter by date" className="h-10 border border-[#e2e8f0] bg-[#f8fafc] px-3 text-sm">
            <option value="all">All dates</option>
            {months.map((month) => <option key={month} value={month}>{month}</option>)}
          </select>
          <label className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort orders" className="h-10 w-full border border-[#e2e8f0] bg-[#f8fafc] pl-9 pr-3 text-sm">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>
      </Card>

      {visibleOrders.length === 0 ? (
        <EmptyState
          title={orders.length ? 'No orders match these filters' : 'No orders yet'}
          description={orders.length ? 'Try changing your search or filters.' : 'Approved quotes will appear here as trackable orders.'}
          action={
            <Link href="/rfq" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#173962] px-4 text-sm font-bold text-white hover:bg-[#102a4c]">
              <FileText className="h-4 w-4" />Create request
            </Link>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-[10px] uppercase tracking-wider text-[#64748b]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-4 py-4 font-semibold">Order description</th>
                  <th className="px-4 py-4 font-semibold">Date</th>
                  <th className="px-4 py-4 font-semibold">Amount</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">Expected delivery</th>
                  <th className="px-6 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {visibleOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#f8fafc]/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#173962]">{order.orderNumber}</td>
                    <td className="max-w-xs px-4 py-4 font-semibold text-[#334155] truncate">{order.items.map((item) => item.itemName).join(', ')}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-[#64748b]">{order.createdAt}</td>
                    <td className="whitespace-nowrap px-4 py-4 font-bold text-[#0f172a]">{formatNaira(order.totalAmount)}</td>
                    <td className="px-4 py-4"><Status value={order.status} /></td>
                    <td className="whitespace-nowrap px-4 py-4 text-[#64748b]">{deliveryDate(order.id, order.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/orders/${order.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-[#173962] hover:underline">
                        View order <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-[#e2e8f0] md:hidden">
            {visibleOrders.map((order) => (
              <div key={order.id} className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs font-bold text-[#173962]">{order.orderNumber}</p>
                    <p className="mt-1 text-sm font-bold text-[#0f172a]">{order.items.map((item) => item.itemName).join(', ')}</p>
                  </div>
                  <Status value={order.status} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-[#94a3b8]">Date</p>
                    <p className="mt-1 font-semibold text-[#334155]">{order.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-[#94a3b8]">Amount</p>
                    <p className="mt-1 font-semibold text-[#0f172a]">{formatNaira(order.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-[#94a3b8]">Expected delivery</p>
                    <p className="mt-1 font-semibold text-[#334155]">{deliveryDate(order.id, order.status)}</p>
                  </div>
                  <div>
                    <p className="text-[#94a3b8]">PO number</p>
                    <p className="mt-1 font-semibold text-[#334155]">{order.poNumber}</p>
                  </div>
                </div>
                <Link href={`/orders/${order.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-[#173962]">
                  View order <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}
      <div className="mt-5 flex flex-wrap gap-4 text-xs text-[#64748b]">
        <span className="flex items-center gap-1.5"><PackageCheck className="h-4 w-4 text-[#0b8f55]" />{orders.filter((order) => order.status !== 'delivered').length} active orders</span>
        <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-[#173962]" />{orders.filter((order) => order.trackingNumber).length} with tracking references</span>
      </div>
    </main>
  );
}

