'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { SupplyRequest } from '@/types/b2b';
import { 
  FileText, 
  Trash2, 
  Plus, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Send
} from 'lucide-react';

export default function RFQPage() {
  const router = useRouter();
  const { rfqCart, removeFromRFQCart, updateRFQCartQuantity, submitRFQ, userProfile, addCustomToRFQCart } = useApp();

  const [targetDate, setTargetDate] = useState('2026-09-20');
  const [notes, setNotes] = useState('');
  const [customItemName, setCustomItemName] = useState('');
  const [customQuantity, setCustomQuantity] = useState(1);
  const [customUnit, setCustomUnit] = useState('Units');
  const [showAdditionalItemForm, setShowAdditionalItemForm] = useState(false);
  const [submittedRfq] = useState<SupplyRequest | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rfqCart.length === 0) return;
    try {
      const newRfq = await submitRFQ(targetDate, notes);
      router.push(`/dashboard?submitted=${encodeURIComponent(newRfq.requestNumber)}`);
    } catch (error) {
      console.error(error);
    }
  };

  const addItemToRequest = () => {
    const itemName = customItemName.trim();
    if (!itemName || customQuantity < 1) return;
    addCustomToRFQCart(itemName, customQuantity, customUnit.trim() || 'Units');
    setCustomItemName('');
    setCustomQuantity(1);
    setCustomUnit('Units');
  };

  const handleAddFirstItem = (e: React.FormEvent) => {
    e.preventDefault();
    addItemToRequest();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Quote Request</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Request intake form
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Add the goods you need, include the details, and send a single request for admin review.
        </p>
      </div>

      {submittedRfq ? (
        /* Success State */
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full uppercase">
              Reference #: {submittedRfq.requestNumber}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 pt-2">
              RFQ Submitted Successfully!
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
                  Your request for <span className="font-bold text-slate-800">{submittedRfq.items.length} line items</span> has gone to the admin review team. A quote will be sent to <span className="font-bold text-slate-800">{submittedRfq.email}</span> once it is reviewed.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-2">
            <p className="font-bold text-slate-800">Target Delivery Date: <span className="font-normal text-slate-600">{submittedRfq.targetDeliveryDate}</span></p>
            <p className="font-bold text-slate-800">Client Account: <span className="font-normal text-slate-600">{submittedRfq.clientCompany}</span></p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
            >
                Track in dashboard
            </Link>
            <Link
                href="/rfq"
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl text-sm transition-colors border border-slate-200"
            >
                Add another request
            </Link>
          </div>
        </div>
      ) : rfqCart.length === 0 ? (
        /* Empty Cart State */
        <form onSubmit={handleAddFirstItem} className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Your request builder is empty</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
            Type the goods you need and the quantity. You can add more items and details next.
          </p>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-12">
            <div className="sm:col-span-6">
              <label htmlFor="first-item-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">What do you need?</label>
              <input id="first-item-name" value={customItemName} onChange={(e) => setCustomItemName(e.target.value)} placeholder="e.g. Branded notebooks" required autoFocus className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="first-item-quantity" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Quantity</label>
              <input id="first-item-quantity" type="number" min={1} value={customQuantity} onChange={(e) => setCustomQuantity(Number(e.target.value) || 1)} required className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="first-item-unit" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Unit</label>
              <input id="first-item-unit" value={customUnit} onChange={(e) => setCustomUnit(e.target.value)} placeholder="Units" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700">
            Add item and continue <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      ) : (
        /* RFQ Builder Form */
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Item List (Left) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" /> Requested items ({rfqCart.length})
                </h3>
                <button type="button" onClick={() => { setShowAdditionalItemForm(true); setTimeout(() => document.getElementById('additional-item-name')?.focus(), 0); }} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add more items
                </button>
              </div>

              {showAdditionalItemForm && <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-900">Add another item</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                  <input id="additional-item-name" value={customItemName} onChange={(e) => setCustomItemName(e.target.value)} placeholder="What else do you need?" className="rounded-xl border border-slate-200 bg-white p-3 text-sm sm:col-span-6 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input aria-label="Additional item quantity" type="number" min={1} value={customQuantity} onChange={(e) => setCustomQuantity(Number(e.target.value) || 1)} className="rounded-xl border border-slate-200 bg-white p-3 text-sm sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input aria-label="Additional item unit" value={customUnit} onChange={(e) => setCustomUnit(e.target.value)} placeholder="Units" className="rounded-xl border border-slate-200 bg-white p-3 text-sm sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button type="button" onClick={addItemToRequest} className="flex items-center justify-center gap-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 sm:col-span-2">
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </div>
              </div>}

              <div className="divide-y divide-slate-100 space-y-4 divide-y-0">
                {rfqCart.map((item) => (
                  <div key={item.productId} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                        {item.product?.sku || 'Custom item'}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{item.product?.name || item.itemName}</h4>
                      <p className="text-xs text-slate-500">
                        Unit: <span className="font-semibold text-slate-700">{item.product?.unit || item.unit || 'Units'}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="flex items-center bg-white rounded-xl border border-slate-300">
                        <button
                          type="button"
                          onClick={() => updateRFQCartQuantity(item.productId, Math.max(1, item.quantity - 5))}
                          className="px-2.5 py-1 text-slate-600 font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          min={1}
                          onChange={(e) => updateRFQCartQuantity(item.productId, parseInt(e.target.value) || 1)}
                          className="w-16 py-1 text-center font-bold text-xs bg-transparent focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateRFQCartQuantity(item.productId, item.quantity + 5)}
                          className="px-2.5 py-1 text-slate-600 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromRFQCart(item.productId)}
                        className="text-slate-400 hover:text-red-600 p-2 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Delivery & Account Details (Right) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-md">
              
              <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
                Request details
              </h3>

              {/* Company Info Box */}
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <Building2 className="w-4 h-4 text-blue-600" /> {userProfile.companyName}
                </div>
                <p className="text-slate-600">Contact Rep: <span className="font-medium text-slate-800">{userProfile.contactPerson}</span></p>
                <p className="text-slate-600">Email: <span className="font-medium text-slate-800">{userProfile.email}</span></p>
              </div>

              {/* Target Delivery Date */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" /> Target Delivery Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Special Instructions */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Request notes & delivery instructions
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add quantities, specifications, delivery details, or other requirements..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all text-sm"
              >
                <Send className="w-4 h-4" /> Submit request
              </button>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                By submitting, your request will be queued for admin review. You will receive a quote after it is assessed.
              </p>

            </div>
          </div>

        </form>
      )}

    </div>
  );
}
