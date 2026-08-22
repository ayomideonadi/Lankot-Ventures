'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { formatNaira } from '@/lib/currency';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Truck, 
  PackageCheck, 
  FileText, 
  Printer,
  Building2,
  MapPin,
  ShieldCheck
} from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const { orders } = useApp();
  const orderId = params?.id as string;

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Order Not Found</h2>
        <p className="text-slate-500 text-sm">The requested order record could not be found.</p>
        <Link href="/orders" className="text-blue-600 font-semibold underline text-sm">
          Return to Orders List
        </Link>
      </div>
    );
  }

  const timelineSteps = [
    { key: 'pending', label: 'Order Submitted', desc: 'Order received & queued' },
    { key: 'confirmed', label: 'PO Confirmed', desc: 'Credit line verified' },
    { key: 'processing', label: 'Warehouse Pick & Pack', desc: 'Material palletization' },
    { key: 'shipped', label: 'In Transit', desc: 'Order dispatched' },
    { key: 'delivered', label: 'Delivered to Destination', desc: 'Dock offload complete' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'delivered': return 4;
      case 'shipped': return 3;
      case 'processing': return 2;
      case 'confirmed': return 1;
      default: return 0;
    }
  };

  const currentStepIndex = getStepIndex(order.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link href="/orders" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Order History
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Order {order.orderNumber}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            PO #: <span className="font-semibold text-slate-700">{order.poNumber}</span> • Invoice: <span className="font-semibold text-slate-700">{order.invoiceNumber}</span>
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-slate-200 self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" /> Print Commercial Invoice
        </button>
      </div>

      {/* Visual Status Timeline Progress Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-600" /> Supply Chain Timeline
        </h3>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
            {timelineSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.key}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Step 0{idx + 1}</span>
                    {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <h4 className="font-bold text-sm leading-tight">{step.label}</h4>
                  <p className="text-[11px] mt-1 opacity-80">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {order.trackingNumber && (
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-bold text-blue-950 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" /> Tracking reference: <span className="font-mono">{order.trackingNumber}</span>
            </span>
            <span className="text-blue-700">Estimated Dispatch Arrival: <strong className="text-blue-950">Next Business Day 10:00 AM</strong></span>
          </div>
        )}
      </div>

      {/* Main Order Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Line Items Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">
              Order Items Breakdown
            </h3>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-y border-slate-100">
                <tr>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Unit Price</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-bold text-slate-900">{item.itemName}</td>
                    <td className="p-3 font-medium text-slate-800">{item.productName}</td>
                    <td className="p-3 font-bold text-slate-900">{item.quantity} {item.unit}</td>
                    <td className="p-3 text-slate-600">{formatNaira(item.unitPrice)}</td>
                    <td className="p-3 text-right font-bold text-slate-900">{formatNaira(item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pt-4 border-t border-slate-100 flex flex-col items-end space-y-1 text-xs">
              <div className="flex justify-between w-64 text-slate-500">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-800">{formatNaira(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between w-64 text-slate-500">
                <span>Freight Logistics:</span>
                <span className="font-bold text-emerald-700">INCLUDED SLA</span>
              </div>
              <div className="flex justify-between w-64 text-slate-900 text-sm font-extrabold pt-2 border-t border-slate-200">
                <span>Total Invoice:</span>
                <span className="text-blue-600">{formatNaira(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Account Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Shipping & Account Details
            </h3>

            <div className="space-y-4 text-xs text-slate-600">
              <div>
                <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" /> B2B Account
                </span>
                <p className="font-semibold text-slate-900">{order.clientCompany}</p>
                <p>{order.clientContact}</p>
                <p>{order.email}</p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> Delivery Address
                </span>
                <p className="text-slate-800">{order.shippingAddress}</p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Payment & Credit Terms
                </span>
                <p className="text-slate-800">Corporate Net 30 Credit Account</p>
                <p className="text-slate-400 text-[11px]">Invoice issued upon dispatch</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
