'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { formatNaira } from '@/lib/currency';
import { Badge, Card, EmptyState } from '@/components/ui';
import { ArrowLeft, Check, CircleHelp, FileText, MapPin, PackageCheck, Printer, Truck } from 'lucide-react';

const stages = [
  ['submitted', 'Request submitted', 'Your procurement request was received.'],
  ['approved', 'Quote approved', 'The quoted items were approved for fulfilment.'],
  ['confirmed', 'Order confirmed', 'The order was accepted for processing.'],
  ['processing', 'Preparing shipment', 'Items are being prepared for dispatch.'],
  ['shipped', 'Dispatched', 'The shipment has left the fulfilment point.'],
  ['delivered', 'Delivered', 'The order has reached its destination.'],
] as const;

function stageIndex(status: string) {
  if (status === 'delivered') return 5;
  if (status === 'shipped') return 4;
  if (status === 'processing') return 3;
  if (status === 'confirmed') return 2;
  return 1;
}

export default function OrderDetailPage() {
  const params = useParams();
  const { orders, supplyRequests } = useApp();
  const order = orders.find((item) => item.id === params?.id);

  if (!order) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Order not found"
          description="The requested order record could not be found."
          action={
            <Link
              href="/orders"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#173962] px-4 text-sm font-bold text-white transition-colors hover:bg-[#102a4c]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to orders
            </Link>
          }
        />
      </main>
    );
  }

  const request = supplyRequests.find((item) => item.id === order.requestId);
  const activeStage = stageIndex(order.status);
  const expectedDelivery = order.status === 'delivered' ? order.updatedAt : request?.targetDeliveryDate || 'In coordination';

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Header Banner */}
      <header className="mb-8 border-b border-[#e2e8f0] pb-6">
        <Link
          href="/orders"
          className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-[#173962] transition-colors hover:text-[#0b8f55]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to orders
        </Link>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Order fulfilment detail</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0f172a] sm:text-3xl">
              {order.orderNumber}
            </h1>
            <p className="mt-1 text-sm text-[#64748b]">
              PO Number: <span className="font-semibold text-[#0f172a]">{order.poNumber}</span> &middot; Created on {order.createdAt}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={order.status === 'delivered' ? 'success' : order.status === 'shipped' ? 'info' : 'warning'}>
              {order.status === 'delivered' ? 'Delivered' : order.status === 'shipped' ? 'Dispatched' : 'Processing'}
            </Badge>
            {order.invoiceNumber && (
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-xs font-bold text-[#173962] shadow-sm hover:bg-[#f8fafc]"
              >
                <Printer className="h-3.5 w-3.5" />
                Print invoice
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Order Progress Stepper */}
      <Card className="mb-8 p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#0f172a]">Fulfilment Stepper</h2>
            <p className="mt-0.5 text-xs text-[#64748b]">Track live progress across operational procurement checkpoints.</p>
          </div>
          <Truck className="h-5 w-5 text-[#173962]" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {stages.map(([key, label, description], index) => {
            const completed = index < activeStage;
            const current = index === activeStage;
            return (
              <div
                key={key}
                className={`rounded-xl border p-4 transition-colors ${
                  current
                    ? 'border-[#173962] bg-[#173962] text-white'
                    : completed
                    ? 'border-[#0b8f55]/30 bg-[#f0fdf4] text-[#087443]'
                    : 'border-[#e2e8f0] bg-[#f8fafc] text-[#94a3b8]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Step {index + 1}</span>
                  {completed ? (
                    <Check className="h-4 w-4 text-[#087443]" />
                  ) : current ? (
                    <PackageCheck className="h-4 w-4 text-[#8ee0b2]" />
                  ) : (
                    <span className="h-3 w-3 rounded-full border border-current" />
                  )}
                </div>
                <h3 className="mt-3 text-xs font-bold leading-tight">{label}</h3>
                <p className="mt-1 text-[11px] leading-relaxed opacity-80">{description}</p>
              </div>
            );
          })}
        </div>
        {order.trackingNumber && (
          <div className="mt-6 flex flex-col gap-2 rounded-xl border border-[#173962]/20 bg-[#f1f5f9] px-4 py-3.5 text-xs text-[#173962] sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2 font-semibold">
              <Truck className="h-4 w-4 text-[#0b8f55]" />
              Waybill / Tracking Reference: <span className="font-mono font-bold">{order.trackingNumber}</span>
            </span>
            <span className="text-[11px] text-[#64748b]">Provide this reference to account support for dispatch queries.</span>
          </div>
        )}
      </Card>

      {/* Detail Grid */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          {/* Order Items Table */}
          <Card className="overflow-hidden">
            <div className="border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-base font-bold text-[#0f172a]">Commercial Line Items</h2>
              <p className="mt-0.5 text-xs text-[#64748b]">{order.items.length} item(s) included in this order</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[10px] uppercase tracking-wider text-[#64748b]">
                  <tr>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Unit Price</th>
                    <th className="px-6 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f8fafc]">
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#0f172a]">{item.itemName}</p>
                        <p className="mt-0.5 text-[11px] text-[#64748b]">{item.productName || item.itemName}</p>
                      </td>
                      <td className="px-4 py-4 font-semibold text-[#334155]">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-4 py-4 text-[#64748b]">{formatNaira(item.unitPrice)}</td>
                      <td className="px-6 py-4 text-right font-bold text-[#0f172a]">
                        {formatNaira(item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end border-t border-[#e2e8f0] bg-[#f8fafc]/50 px-6 py-5">
              <div className="w-full max-w-xs space-y-2 text-xs">
                <div className="flex justify-between text-[#64748b]">
                  <span>Subtotal</span>
                  <span>{formatNaira(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-[#64748b]">
                  <span>Logistics & Handling</span>
                  <span className="font-semibold text-[#087443]">Included</span>
                </div>
                <div className="flex justify-between border-t border-[#e2e8f0] pt-2 text-sm font-extrabold text-[#0f172a]">
                  <span>Total Amount</span>
                  <span>{formatNaira(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* References Card */}
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 shrink-0 text-[#0b8f55]" />
              <div>
                <h2 className="text-base font-bold text-[#0f172a]">Commercial References</h2>
                <p className="mt-0.5 text-xs text-[#64748b]">Linked accounting and purchase documentation.</p>
                <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-[#64748b]">Purchase Order</span>
                    <strong className="mt-1 block text-sm font-bold text-[#0f172a]">{order.poNumber}</strong>
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-[#64748b]">Invoice Number</span>
                    <strong className="mt-1 block text-sm font-bold text-[#0f172a]">
                      {order.invoiceNumber || 'Pending Issuance'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-6">
          <Card className="p-6">
            <h2 className="text-base font-bold text-[#0f172a]">Delivery Dock Details</h2>
            <div className="mt-4 space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0b8f55]" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#64748b]">Shipping Address</span>
                  <strong className="mt-1 block text-xs font-semibold text-[#334155] leading-relaxed">
                    {order.shippingAddress}
                  </strong>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0b8f55]" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#64748b]">Target Delivery</span>
                  <strong className="mt-1 block text-xs font-semibold text-[#334155]">
                    {expectedDelivery}
                  </strong>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-base font-bold text-[#0f172a]">Account Support</h2>
            <p className="mt-2 text-xs leading-relaxed text-[#64748b]">
              Have questions regarding dispatch schedules, inspection records, or accounting documents?
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#087443] hover:underline"
            >
              Contact Account Officer <CircleHelp className="h-4 w-4" />
            </Link>
          </Card>
        </aside>
      </div>
    </main>
  );
}

