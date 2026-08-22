'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatNaira } from '@/lib/currency';
import { OrderStatus } from '@/types/b2b';
import { Truck, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, removeOrder } = useApp();

  const handleAdvanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = 'confirmed';
    if (currentStatus === 'pending') nextStatus = 'confirmed';
    else if (currentStatus === 'confirmed') nextStatus = 'processing';
    else if (currentStatus === 'processing') nextStatus = 'shipped';
    else if (currentStatus === 'shipped') nextStatus = 'delivered';
    else return;

    const trackingNum = nextStatus === 'shipped' ? `LNK-TRK-${Math.floor(100000 + Math.random() * 900000)}-CH` : undefined;
    updateOrderStatus(orderId, nextStatus, trackingNum);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-3xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-600" /> Admin Operations
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Order Fulfillment & Shipping Management
          </h1>
          <p className="text-slate-600 text-xs">
            Advance approved order status through fulfillment stages and assign tracking details.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((ord) => (
          <div key={ord.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono font-extrabold text-base text-slate-900">{ord.orderNumber}</span>
                <span className="text-xs text-slate-500 ml-3">Client: <strong className="text-slate-800">{ord.clientCompany}</strong> (PO #: {ord.poNumber})</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase px-3 py-1 bg-slate-100 rounded-full text-slate-700">
                  Status: {ord.status}
                </span>
                <span className="font-extrabold text-slate-900 text-base">{formatNaira(ord.totalAmount)}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-1">
              <span className="font-bold text-slate-700 block uppercase text-[10px]">Items</span>
              {ord.items.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{i.itemName}</span>
                  <span className="font-bold">{i.quantity} {i.unit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-500">
                {ord.trackingNumber ? (
                  <span className="font-mono text-blue-700 font-bold">Tracking: {ord.trackingNumber}</span>
                ) : (
                  <span>Ship To: {ord.shippingAddress}</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {ord.status !== 'delivered' && (
                  <button
                    onClick={() => handleAdvanceStatus(ord.id, ord.status)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow flex items-center justify-center gap-1.5"
                  >
                    <ArrowRight className="w-4 h-4" /> Advance Status to next stage
                  </button>
                )}
                <button
                  onClick={() => removeOrder(ord.id)}
                  className="border border-red-200 bg-white hover:bg-red-50 text-red-700 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Remove Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
