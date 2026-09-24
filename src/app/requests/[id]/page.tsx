'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { formatNaira } from '@/lib/currency';
import { Badge, Card, EmptyState } from '@/components/ui';
import { ArrowLeft, CheckCircle2, FileText, MapPin, PackageCheck } from 'lucide-react';

function statusBadge(status: string) {
  if (status === 'quoted') return <Badge tone="success">Quote Ready</Badge>;
  if (status === 'accepted') return <Badge tone="info">Approved</Badge>;
  if (status === 'declined') return <Badge tone="neutral">Cancelled</Badge>;
  return <Badge tone="warning">Under Review</Badge>;
}

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { supplyRequests, orders, placeOrderFromRFQ, userProfile } = useApp();
  const request = supplyRequests.find((item) => item.id === params?.id);
  const relatedOrder = request ? orders.find((order) => order.requestId === request.id) : undefined;

  if (!request) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Request not found"
          description="The requested procurement record could not be found."
          action={
            <Link
              href="/requests"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#173962] px-4 text-sm font-bold text-white transition-colors hover:bg-[#102a4c]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to requests
            </Link>
          }
        />
      </main>
    );
  }

  const description = request.items.map((item) => item.itemName).join(', ') || request.generalNotes || 'Procurement request';

  const displayItems: {
    id: string;
    itemName: string;
    productName?: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    lineTotal: number;
  }[] = request.quoteLineItems?.length
    ? request.quoteLineItems
    : request.items.map((item) => ({
        id: item.id,
        itemName: item.itemName,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: 0,
        lineTotal: 0,
      }));

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="mb-8 border-b border-[#e2e8f0] pb-6">
        <Link
          href="/requests"
          className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-[#173962] transition-colors hover:text-[#0b8f55]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to requests
        </Link>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Procurement request</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0f172a] sm:text-3xl">
              {request.requestNumber}
            </h1>
            <p className="mt-1 text-sm text-[#64748b]">
              {description} &middot; Submitted {request.createdAt}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {statusBadge(request.status)}
            {request.status === 'quoted' && (
              <button
                type="button"
                onClick={() => {
                  const order = placeOrderFromRFQ(request.id, 'PO-APX-RFQ-ACCEPTED', userProfile.address);
                  router.push(`/orders/${order.id}`);
                }}
                className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#0b8f55] px-3.5 text-xs font-bold text-white shadow-sm hover:bg-[#087443]"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve quote
              </button>
            )}
            {relatedOrder && (
              <Link
                href={`/orders/${relatedOrder.id}`}
                className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-xs font-bold text-[#173962] shadow-sm hover:bg-[#f8fafc]"
              >
                View order
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          <Card className="overflow-hidden">
            <div className="border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-base font-bold text-[#0f172a]">Requested items</h2>
              <p className="mt-0.5 text-xs text-[#64748b]">{request.items.length} item(s) in this request</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[10px] uppercase tracking-wider text-[#64748b]">
                  <tr>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Unit price</th>
                    <th className="px-6 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {displayItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f8fafc]">
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#0f172a]">{item.itemName}</p>
                        {item.productName ? (
                          <p className="mt-0.5 text-[11px] text-[#64748b]">{item.productName}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-4 font-semibold text-[#334155]">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-4 py-4 text-[#64748b]">{item.unitPrice ? formatNaira(item.unitPrice) : 'Pending'}</td>
                      <td className="px-6 py-4 text-right font-bold text-[#0f172a]">
                        {item.lineTotal ? formatNaira(item.lineTotal) : 'Pending'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end border-t border-[#e2e8f0] bg-[#f8fafc]/50 px-6 py-5">
              <div className="w-full max-w-xs space-y-2 text-xs">
                <div className="flex justify-between text-[#64748b]">
                  <span>Quoted total</span>
                  <span>{request.totalQuoteAmount ? formatNaira(request.totalQuoteAmount) : 'Pending review'}</span>
                </div>
              </div>
            </div>
          </Card>

          {request.generalNotes && (
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 shrink-0 text-[#0b8f55]" />
                <div>
                  <h2 className="text-base font-bold text-[#0f172a]">Notes</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#334155]">{request.generalNotes}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <aside className="space-y-6">
          <Card className="p-6">
            <h2 className="text-base font-bold text-[#0f172a]">Delivery</h2>
            <div className="mt-4 space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0b8f55]" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#64748b]">Target delivery</span>
                  <strong className="mt-1 block text-xs font-semibold text-[#334155]">{request.targetDeliveryDate || 'In coordination'}</strong>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0b8f55]" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#64748b]">Company</span>
                  <strong className="mt-1 block text-xs font-semibold text-[#334155] leading-relaxed">{request.clientCompany}</strong>
                </div>
              </div>
            </div>
          </Card>

          {request.adminNotes && (
            <Card className="p-6">
              <h2 className="text-base font-bold text-[#0f172a]">Quote notes</h2>
              <p className="mt-2 text-xs leading-relaxed text-[#64748b]">{request.adminNotes}</p>
              {request.freightTerms && <p className="mt-3 text-xs font-semibold text-[#334155]">{request.freightTerms}</p>}
            </Card>
          )}
        </aside>
      </div>
    </main>
  );
}
