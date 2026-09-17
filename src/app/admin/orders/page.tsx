'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatNaira } from '@/lib/currency';
import { OrderStatus } from '@/types/b2b';
import { Badge, Card, EmptyState } from '@/components/ui';
import { Truck, ShieldCheck, CheckCircle2, ArrowRight, Trash2 } from 'lucide-react';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, removeOrder } = useApp();

  const handleAdvanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = 'confirmed';
    if (currentStatus === 'pending') nextStatus = 'confirmed';
    else if (currentStatus === 'confirmed') nextStatus = 'processing';
    else if (currentStatus === 'processing') nextStatus = 'shipped';
    else if (currentStatus === 'shipped') nextStatus = 'delivered';
    else return;

    const trackingNum =
      nextStatus === 'shipped'
        ? `LNK-TRK-${orderId.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}-CH`
        : undefined;
    updateOrderStatus(orderId, nextStatus, trackingNum);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#e2e8f0] pb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Lankot Fulfilment Desk</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0f172a] sm:text-3xl">
          Order Fulfilment & Shipping Management
        </h1>
        <p className="mt-1 text-sm text-[#64748b]">
          Advance approved orders through dispatch stages and generate automated waybill tracking numbers.
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Orders will appear here automatically when enterprise buyers accept active quotes."
          />
        ) : (
          orders.map((ord) => (
            <Card key={ord.id} className="p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e2e8f0] pb-4">
                <div>
                  <span className="font-mono font-extrabold text-base text-[#173962]">{ord.orderNumber}</span>
                  <span className="text-xs text-[#64748b] ml-3">
                    Buyer: <strong className="text-[#0f172a]">{ord.clientCompany}</strong> (PO #{ord.poNumber})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Badge tone={ord.status === 'delivered' ? 'success' : ord.status === 'shipped' ? 'info' : 'warning'}>
                    {ord.status.toUpperCase()}
                  </Badge>
                  <span className="font-extrabold text-[#0f172a] text-sm sm:text-base">{formatNaira(ord.totalAmount)}</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 text-xs space-y-1">
                <span className="font-bold text-[#0f172a] block uppercase text-[10px] tracking-wider mb-1">
                  Fulfilment Line Items
                </span>
                {ord.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-[#334155]">
                    <span>{i.itemName}</span>
                    <span className="font-bold text-[#0f172a]">
                      {i.quantity} {i.unit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="text-xs text-[#64748b]">
                  {ord.trackingNumber ? (
                    <span className="font-mono text-[#173962] font-bold bg-[#f1f5f9] px-2.5 py-1 rounded-md border border-[#e2e8f0]">
                      Waybill / Tracking: {ord.trackingNumber}
                    </span>
                  ) : (
                    <span>Receiving Dock: {ord.shippingAddress}</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {ord.status !== 'delivered' && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus(ord.id, ord.status)}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#087443] hover:bg-[#0b8f55] px-4 text-xs font-bold text-white transition-colors shadow-sm"
                    >
                      <ArrowRight className="w-3.5 h-3.5" /> Advance Fulfilment Stage
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeOrder(ord.id)}
                    className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#fef2f2] px-3 text-xs font-bold text-[#dc2626] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Order
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

