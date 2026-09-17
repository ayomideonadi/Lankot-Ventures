'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { Card, EmptyState } from '@/components/ui';
import { Bookmark, ShoppingCart, CheckCircle2, ArrowRight, Layers } from 'lucide-react';

export default function SavedListsPage() {
  const router = useRouter();
  const { savedLists, reorderListToCart, products } = useApp();
  const [listAdded, setListAdded] = useState<string | null>(null);

  const handleAddToCart = (listId: string) => {
    reorderListToCart(listId);
    setListAdded(listId);
    setTimeout(() => {
      router.push('/rfq');
    }, 1200);
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#e2e8f0] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Procurement Templates</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0f172a] sm:text-3xl">
            Saved Request Templates & Bundles
          </h1>
          <p className="mt-1 text-sm text-[#64748b]">
            Keep recurring supply line items organized for rapid re-ordering without building requests from scratch.
          </p>
        </div>

        <Link
          href="/rfq"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#173962] px-4 text-xs font-bold text-white transition-colors hover:bg-[#102a4c] self-start sm:self-auto shadow-sm"
        >
          Create new request
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Grid of Templates */}
      {savedLists.length === 0 ? (
        <EmptyState
          title="No saved templates yet"
          description="Save line item bundles during RFQ building to streamline repeat procurement."
          action={
            <Link
              href="/rfq"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#173962] px-4 text-xs font-bold text-white transition-colors hover:bg-[#102a4c]"
            >
              Start an RFQ
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedLists.map((list) => (
            <Card key={list.id} className="p-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#0b8f55] uppercase tracking-wider">Saved bundle</span>
                    <h2 className="text-lg font-bold text-[#0f172a] mt-0.5">{list.name}</h2>
                    <p className="text-xs text-[#64748b] mt-1">{list.description}</p>
                  </div>
                  <div className="rounded-lg bg-[#f0fdf4] p-2 text-[#0b8f55] shrink-0">
                    <Bookmark className="w-5 h-5" />
                  </div>
                </div>

                {/* Included Items Table / List */}
                <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-1 border-b border-[#e2e8f0]">
                    <span className="font-bold text-[#0f172a] uppercase text-[10px] tracking-wider">
                      Included Items ({list.items.length})
                    </span>
                    <span className="text-[10px] text-[#64748b] font-medium">Est. Quantities</span>
                  </div>
                  {list.items.map((item, idx) => {
                    const p = products.find((prod) => prod.id === item.productId);
                    return (
                      <div key={idx} className="flex items-center justify-between text-[#334155]">
                        <span className="font-medium text-[#0f172a] truncate max-w-[240px]">
                          {p?.name || 'Saved item'}
                        </span>
                        <span className="font-semibold text-[#64748b]">
                          {item.quantity} {p?.unit || 'units'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAddToCart(list.id)}
                disabled={listAdded === list.id}
                className={`w-full min-h-11 rounded-lg text-xs font-bold text-white transition-colors flex items-center justify-center gap-2 shadow-sm ${
                  listAdded === list.id
                    ? 'bg-[#087443]'
                    : 'bg-[#173962] hover:bg-[#102a4c]'
                }`}
              >
                {listAdded === list.id ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#8ee0b2]" /> Added to builder! Redirecting...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Load bundle into request builder
                  </>
                )}
              </button>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

