'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatNaira } from '@/lib/currency';
import { FileText, Send, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export default function AdminQuotesPage() {
  const { supplyRequests, submitAdminQuote, clearAdminQuote, removeSupplyRequest } = useApp();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<number>(20000);
  const [itemPrices, setItemPrices] = useState<Record<string, number>>({});
  const [quoteNotes, setQuoteNotes] = useState('');

  const activeRequest = supplyRequests.find(r => r.id === selectedRequestId);

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestId || !activeRequest) return;

    const quoteItems = activeRequest.items.map((item) => ({
      itemId: item.id,
      unitPrice: Math.max(0, itemPrices[item.id] || 0)
    }));

    submitAdminQuote(selectedRequestId, quoteItems, 'Fulfillment timing confirmed during admin review', quoteNotes);
    setSelectedRequestId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-3xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-600" /> Admin Operations
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            RFQ Inbox & Quote Generator
          </h1>
          <p className="text-slate-600 text-xs">
            Review incoming corporate buyer quote requests and issue official contract rates.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {supplyRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono font-extrabold text-base text-slate-900">{request.requestNumber}</span>
                <span className="text-xs text-slate-500 ml-3">Client: <strong className="text-slate-800">{request.clientCompany}</strong> ({request.clientContact})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Target Date: {request.targetDeliveryDate}</span>
                <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                  request.status === 'quoted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : request.status === 'accepted'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {request.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">Requested Line Items</span>
              {request.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-800">
                  <span>{item.itemName}</span>
                  <span className="font-bold">{item.quantity} {item.unit} {item.specificRequirements && `— ${item.specificRequirements}`}</span>
                </div>
              ))}
              {request.generalNotes && (
                <p className="text-slate-500 italic pt-1 border-t border-slate-200/60">
                  Notes: "{request.generalNotes}"
                </p>
              )}
            </div>

            {request.totalQuoteAmount && (
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex justify-between items-center">
                <div>
                  <span className="font-bold">Quote issued: {formatNaira(request.totalQuoteAmount)}</span>
                  <p className="text-[11px] text-emerald-700">{request.adminNotes}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-700 font-semibold">Active Quote</span>
                  <button
                    onClick={() => clearAdminQuote(request.id)}
                    className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 font-bold text-emerald-800 hover:bg-emerald-100"
                  >
                    Clear Quote
                  </button>
                </div>
              </div>
            )}

            {request.status === 'pending' && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedRequestId(request.id);
                    const initialPrices = Object.fromEntries(request.items.map((item) => [item.id, 10]));
                    setItemPrices(initialPrices);
                    setQuoteAmount(request.items.reduce((sum, item) => sum + (item.quantity * (initialPrices[item.id] || 0)), 0));
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow flex items-center gap-1.5"
                >
                  <span className="text-base leading-none" aria-hidden="true">₦</span> Issue Contract Quote to Buyer
                </button>
                <button
                  onClick={() => removeSupplyRequest(request.id)}
                  className="border border-red-200 bg-white hover:bg-red-50 text-red-700 font-bold px-5 py-2.5 rounded-xl text-xs"
                >
                  Remove Request
                </button>
              </div>
            )}

          </div>
        ))}
      </div>

      {selectedRequestId && activeRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Issue Contract Quote for {activeRequest.requestNumber}</h3>
              <p className="text-xs text-slate-500">Client: {activeRequest.clientCompany}</p>
            </div>

            <form onSubmit={handleSendQuote} className="space-y-4 text-xs">
              <div className="space-y-3">
                <p className="font-bold text-slate-700">Quote each requested item (NGN)</p>
                {activeRequest.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-[1fr_7rem] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div>
                      <p className="font-bold text-slate-900">{item.itemName}</p>
                      <p className="text-slate-500">{item.quantity} {item.unit} × unit price</p>
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
                        setQuoteAmount(activeRequest.items.reduce((sum, currentItem) => sum + (currentItem.quantity * (currentItem.id === item.id ? nextPrice : (itemPrices[currentItem.id] || 0))), 0));
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2 font-bold text-slate-900"
                    />
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-sm">
                  <span className="font-bold text-slate-700">Total of all items</span>
                  <span className="font-extrabold text-emerald-700">NGN {quoteAmount.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Quote Notes & Terms</label>
                <textarea
                  rows={3}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 border rounded-xl"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRequestId(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Send Quote to Buyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
