'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/app-context';
import { formatNaira } from '@/lib/currency';
import { 
  Building2, 
  ShoppingBag, 
  FileText, 
  Bookmark, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ArrowRight, 
  Plus, 
  RefreshCw,
} from 'lucide-react';

export default function ClientDashboardPage() {
  const { userProfile, orders, supplyRequests, placeOrderFromRFQ } = useApp();
  const [submittedRequestNumber, setSubmittedRequestNumber] = useState<string | null>(null);

  useEffect(() => {
    const requestNumber = new URLSearchParams(window.location.search).get('submitted');
    if (!requestNumber) return;
    window.setTimeout(() => setSubmittedRequestNumber(requestNumber), 0);
    window.history.replaceState({}, '', '/dashboard');
  }, []);

  const activeOrders = orders.filter(o => o.status !== 'delivered');
  const pendingRequests = supplyRequests.filter(r => r.status === 'pending' || r.status === 'quoted');
  const totalSpend = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">Delivered</span>;
      case 'shipped':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">In Transit (Shipped)</span>;
      case 'processing':
        return <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200">Processing Dispatch</span>;
      case 'confirmed':
        return <span className="bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">Confirmed Order</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">Pending Review</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {submittedRequestNumber && (
        <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
          <p className="font-extrabold">Request submitted successfully.</p>
          <p className="mt-1 text-emerald-800">Reference: {submittedRequestNumber}. The admin team will review it and prepare your quote.</p>
        </div>
      )}
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-blue-400 font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-blue-400" /> Account: {userProfile.taxId}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {userProfile.companyName}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Primary Contact: <span className="text-white font-medium">{userProfile.contactPerson}</span> ({userProfile.email})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/rfq"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" /> New RFQ Request
          </Link>
          <Link
            href="/saved-lists"
            className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Bookmark className="w-4 h-4 text-amber-400" /> Reorder Templates
          </Link>
        </div>
      </div>

      {/* Analytics / Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-medium">Active Orders</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{activeOrders.length}</span>
            <ShoppingBag className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-[11px] text-slate-500 pt-1">Orders in processing or transport</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-medium">Pending Requests</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{pendingRequests.length}</span>
            <FileText className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-[11px] text-slate-500 pt-1">Open request drops awaiting admin quotes</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-medium">Approved Quotes</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{supplyRequests.filter(r => r.status === 'accepted').length}</span>
            <Bookmark className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-[11px] text-slate-500 pt-1">Quotes accepted and converted to orders</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total YTD Spend</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">
              {formatNaira(totalSpend)}
            </span>
            <span className="text-xl font-bold text-emerald-600" aria-hidden="true">₦</span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1">Under Corporate Net 30 Terms</p>
        </div>
      </div>

      {/* Active Requests Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Active Supply Requests</h3>
            <p className="text-xs text-slate-500">Review admin quotes and convert approved requests into purchase orders</p>
          </div>
          <Link href="/rfq" className="text-xs font-bold text-blue-600 hover:underline">
            + New Request
          </Link>
        </div>

        {supplyRequests.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">No active supply requests submitted.</p>
        ) : (
          <div className="space-y-4">
            {supplyRequests.map((request) => (
              <div key={request.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div>
                    <span className="font-mono font-bold text-sm text-slate-900">{request.requestNumber}</span>
                    <span className="text-xs text-slate-400 ml-3">Submitted: {request.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Target Date: <strong className="text-slate-800">{request.targetDeliveryDate}</strong></span>
                    {request.status === 'quoted' ? (
                      <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full border border-emerald-300">
                        Quote Ready
                      </span>
                    ) : request.status === 'accepted' ? (
                      <span className="bg-blue-100 text-blue-800 font-bold text-xs px-3 py-1 rounded-full border border-blue-300">
                        Accepted & Ordered
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 font-bold text-xs px-3 py-1 rounded-full border border-amber-300">
                        Under Review
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-600">
                  <p className="font-semibold text-slate-800 mb-1">Requested Items:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    {request.items.map((item, idx) => (
                      <li key={idx}>
                        {item.itemName} — <strong className="text-slate-900">{item.quantity} {item.unit}</strong> {item.specificRequirements && `(${item.specificRequirements})`}
                      </li>
                    ))}
                  </ul>
                </div>

                {request.status === 'quoted' && (
                  <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                    <div>
                      <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider block">Official Firm Contract Quote</span>
                      <span className="text-2xl font-extrabold text-emerald-950">{formatNaira(request.totalQuoteAmount || 0)}</span>
                      <p className="text-xs text-emerald-700 mt-0.5">{request.adminNotes}</p>
                    </div>
                    <button
                      onClick={() => placeOrderFromRFQ(request.id, 'PO-APX-RFQ-ACCEPTED', userProfile.address)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept Quote & Issue PO Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Recent Supply Orders</h3>
            <p className="text-xs text-slate-500">Live fulfillment status and shipping tracking</p>
          </div>
          <Link href="/orders" className="text-xs font-bold text-blue-600 hover:underline">
            View All ({orders.length})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-y border-slate-100">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">PO Number</th>
                <th className="p-3">Order Date</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Fulfillment Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                  <td className="p-3 text-slate-600">{ord.poNumber}</td>
                  <td className="p-3 text-slate-500">{ord.createdAt}</td>
                  <td className="p-3 font-extrabold text-slate-900">{formatNaira(ord.totalAmount)}</td>
                  <td className="p-3">{getStatusBadge(ord.status)}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/orders/${ord.id}`}
                      className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                    >
                      Track Order →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
