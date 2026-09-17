'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatNaira } from '@/lib/currency';
import { Badge, Card, EmptyState } from '@/components/ui';
import { FileText, Send, CheckCircle2, ShieldCheck, Clock, Trash2 } from 'lucide-react';

export default function AdminQuotesPage() {
  const { supplyRequests, submitAdminQuote, clearAdminQuote, removeSupplyRequest } = useApp();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<number>(20000);
  const [itemPrices, setItemPrices] = useState<Record<string, number>>({});
  const [quoteNotes, setQuoteNotes] = useState('');

  const activeRequest = supplyRequests.find((r) => r.id === selectedRequestId);

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestId || !activeRequest) return;

    const quoteItems = activeRequest.items.map((item) => ({
      itemId: item.id,
      unitPrice: Math.max(0, itemPrices[item.id] || 0),
    }));

    submitAdminQuote(selectedRequestId, quoteItems, 'Fulfillment timing confirmed during admin review', quoteNotes);
    setSelectedRequestId(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 space-y-8">
      {/* Banner / Header */}
      <div className="border-b border-[#e2e8f0] pb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Lankot Commercial Operations</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0f172a] sm:text-3xl">
          RFQ Inbox & Commercial Contract Generator
        </h1>
        <p className="mt-1 text-sm text-[#64748b]">
          Review incoming corporate buyer requests, establish line-item pricing, and issue binding quotes.
        </p>
      </div>

      {/* RFQ List */}
      <div className="space-y-6">
        {supplyRequests.length === 0 ? (
          <EmptyState
            title="No procurement requests yet"
            description="New client RFQs submitted by enterprise buyers will appear here automatically."
          />
        ) : (
          supplyRequests.map((request) => (
            <Card key={request.id} className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e2e8f0] pb-4">
                <div>
                  <span className="font-mono font-extrabold text-base text-[#173962]">{request.requestNumber}</span>
                  <span className="text-xs text-[#64748b] ml-3">
                    Buyer: <strong className="text-[#0f172a]">{request.clientCompany}</strong> ({request.clientContact})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#64748b]">Target Delivery: {request.targetDeliveryDate}</span>
                  <Badge
                    tone={
                      request.status === 'quoted'
                        ? 'success'
                        : request.status === 'accepted'
                        ? 'info'
                        : 'warning'
                    }
                  >
                    {request.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Line items preview */}
              <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 text-xs space-y-2">
                <span className="font-bold text-[#0f172a] block uppercase tracking-wider text-[10px]">
                  Requested Commercial Items
                </span>
                {request.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[#334155]">
                    <span>{item.itemName}</span>
                    <span className="font-bold text-[#0f172a]">
                      {item.quantity} {item.unit} {item.specificRequirements && `— ${item.specificRequirements}`}
                    </span>
                  </div>
                ))}
                {request.generalNotes && (
                  <p className="text-[#64748b] italic pt-2 border-t border-[#e2e8f0]">
                    Client Notes: &quot;{request.generalNotes}&quot;
                  </p>
                )}
              </div>

              {/* Existing Issued Quote Banner */}
              {request.totalQuoteAmount && (
                <div className="rounded-xl border border-[#0b8f55]/30 bg-[#f0fdf4] p-4 text-xs text-[#087443] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="font-bold text-sm">Quote Issued: {formatNaira(request.totalQuoteAmount)}</span>
                    <p className="text-[11px] text-[#087443]/90 mt-0.5">{request.adminNotes}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => clearAdminQuote(request.id)}
                      className="rounded-lg border border-[#0b8f55]/40 bg-white px-3 py-1.5 font-bold text-[#087443] hover:bg-[#f0fdf4] shadow-sm"
                    >
                      Clear / Revise Quote
                    </button>
                  </div>
                </div>
              )}

              {/* Pending Action Buttons */}
              {request.status === 'pending' && (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRequestId(request.id);
                      const initialPrices = Object.fromEntries(request.items.map((item) => [item.id, 10]));
                      setItemPrices(initialPrices);
                      setQuoteAmount(
                        request.items.reduce((sum, item) => sum + item.quantity * (initialPrices[item.id] || 0), 0)
                      );
                    }}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#173962] px-4 text-xs font-bold text-white transition-colors hover:bg-[#102a4c] shadow-sm"
                  >
                    Issue Commercial Quote
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSupplyRequest(request.id)}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-[#e2e8f0] bg-white px-4 text-xs font-bold text-[#dc2626] transition-colors hover:bg-[#fef2f2] shadow-sm"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove Request
                  </button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Quote Dialog Modal */}
      {selectedRequestId && activeRequest && (
        <div
          className="fixed inset-0 z-50 bg-[#0f172a]/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="presentation"
          onKeyDown={(event) => {
            if (event.key === 'Escape') setSelectedRequestId(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-dialog-title"
            tabIndex={-1}
            className="bg-white rounded-xl border border-[#e2e8f0] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-xl"
          >
            <div className="border-b border-[#e2e8f0] pb-4">
              <h2 id="quote-dialog-title" className="font-extrabold text-lg text-[#0f172a]">
                Issue Contract Quote for {activeRequest.requestNumber}
              </h2>
              <p className="text-xs text-[#64748b]">Buyer Account: {activeRequest.clientCompany}</p>
            </div>

            <form onSubmit={handleSendQuote} className="space-y-4 text-xs">
              <div className="space-y-3">
                <p className="font-bold text-[#0f172a]">Set Unit Rate per Line Item (NGN)</p>
                {activeRequest.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_8rem] items-center gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3"
                  >
                    <div>
                      <p className="font-bold text-[#0f172a]">{item.itemName}</p>
                      <p className="text-[11px] text-[#64748b]">
                        {item.quantity} {item.unit} &times; unit price
                      </p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      aria-label={`Unit price for ${item.itemName}`}
                      value={itemPrices[item.id] ?? 0}
                      onChange={(e) => {
                        const nextPrice = Math.max(0, parseFloat(e.target.value) || 0);
                        setItemPrices((prices) => ({ ...prices, [item.id]: nextPrice }));
                        setQuoteAmount(
                          activeRequest.items.reduce(
                            (sum, currentItem) =>
                              sum +
                              currentItem.quantity *
                                (currentItem.id === item.id ? nextPrice : itemPrices[currentItem.id] || 0),
                            0
                          )
                        );
                      }}
                      className="w-full rounded-lg border border-[#e2e8f0] bg-white p-2 font-bold text-[#0f172a] focus:border-[#0b8f55] focus:outline-none"
                    />
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-[#e2e8f0] pt-3 text-sm">
                  <span className="font-bold text-[#0f172a]">Calculated Contract Total</span>
                  <span className="font-extrabold text-[#087443]">{formatNaira(quoteAmount)}</span>
                </div>
              </div>

              <div>
                <label htmlFor="quote-notes" className="font-bold text-[#0f172a] block mb-1">
                  Fulfilment Terms & Admin Notes
                </label>
                <textarea
                  id="quote-notes"
                  rows={3}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  placeholder="Specify lead times, delivery dock details, or payment terms..."
                  className="w-full p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs text-[#0f172a] focus:border-[#0b8f55] focus:outline-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRequestId(null)}
                  className="flex-1 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] py-2.5 font-bold text-[#64748b] hover:bg-[#e2e8f0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#087443] hover:bg-[#0b8f55] py-2.5 font-bold text-white shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Issue Quote to Buyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

