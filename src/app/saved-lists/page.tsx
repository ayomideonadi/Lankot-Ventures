'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { Bookmark, ShoppingCart, Plus, ArrowRight, CheckCircle2 } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Saved Templates</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Request templates & saved drafts
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Keep recurring business needs ready for review without rebuilding the same request each time.
          </p>
        </div>

        <Link
          href="/rfq"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow transition-colors self-start sm:self-auto"
        >
          Create a new request
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {savedLists.map((list) => (
          <div key={list.id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Saved bundle</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{list.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{list.description}</p>
              </div>
              <Bookmark className="w-6 h-6 text-purple-600 flex-shrink-0" />
            </div>

            {/* Item Preview list */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">Included items ({list.items.length})</span>
              {list.items.map((item, idx) => {
                const p = products.find(prod => prod.id === item.productId);
                return (
                  <div key={idx} className="flex items-center justify-between text-slate-700">
                    <span className="font-medium text-slate-900 truncate max-w-[240px]">{p?.name || 'Saved item'}</span>
                    <span className="font-semibold text-slate-600">{item.quantity} {p?.unit || 'units'}</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => handleAddToCart(list.id)}
              disabled={listAdded === list.id}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs shadow transition-colors flex items-center justify-center gap-2"
            >
              {listAdded === list.id ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" /> Added to request builder! Redirecting...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" /> Load bundle into request builder
                </>
              )}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
