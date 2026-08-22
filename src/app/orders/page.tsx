'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/app-context';
import { formatNaira } from '@/lib/currency';
import { ShoppingBag, Search, Truck, CheckCircle2, ArrowRight, Clock, FileText } from 'lucide-react';

export default function OrdersPage() {
  const { orders, placeQuickOrder } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">Delivered</span>;
      case 'shipped':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-300">Shipped (In Transit)</span>;
      case 'processing':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full border border-purple-300">Processing</span>;
      case 'confirmed':
        return <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-300">Confirmed</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">Pending Review</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Client Portal</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Order History & Fulfillment Status
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track approved requests, order timelines, and fulfillment updates in one place.
          </p>
        </div>

        <Link
          href="/rfq"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow transition-colors self-start sm:self-auto"
        >
          + New Request
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Order #, PO #, Invoice #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((ord) => (
          <div key={ord.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-base text-slate-900">{ord.orderNumber}</span>
                  {getStatusBadge(ord.status)}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  PO #: <span className="font-semibold text-slate-700">{ord.poNumber}</span> • Invoice: <span className="font-semibold text-slate-700">{ord.invoiceNumber}</span> • Placed: {ord.createdAt}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Invoice Amount</span>
                <span className="text-xl font-extrabold text-slate-900">{formatNaira(ord.totalAmount)}</span>
              </div>
            </div>

            {/* Line items list */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">Line Items ({ord.items.length})</span>
              {ord.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-700">
                  <span className="font-medium text-slate-900">{item.itemName}</span>
                  <span className="font-semibold">{item.quantity} {item.unit} @ {formatNaira(item.unitPrice)}</span>
                </div>
              ))}
            </div>

            {/* Actions footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-500">
                {ord.trackingNumber ? (
                  <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
                    <Truck className="w-4 h-4" /> Tracking #: {ord.trackingNumber}
                  </span>
                ) : (
                  <span>Shipping Address: {ord.shippingAddress}</span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link href="/rfq" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors border border-slate-200 flex-1 sm:flex-initial text-center">
                  Submit new request
                </Link>
                <Link
                  href={`/orders/${ord.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow flex-1 sm:flex-initial text-center"
                >
                  View Details & Tracking →
                </Link>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
