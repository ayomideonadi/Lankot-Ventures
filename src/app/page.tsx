'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { ArrowRight, CheckCircle2, FileText, Plus, Sparkles } from 'lucide-react';

const examples = [
  ['Warehouse support', 'Packaging and day-to-day operational needs'],
  ['Onboarding kits', 'Branded materials and setup essentials'],
  ['Custom request', 'Any combination of goods and requirements']
];

export default function HomePage() {
  const router = useRouter();
  const { addCustomToRFQCart, rfqCart } = useApp();

  const handleQuickAdd = (itemName: string) => {
    addCustomToRFQCart(itemName, 1, 'Request');
    router.push('/rfq');
  };

  return (
    <div className="space-y-16 pb-16">
      <section className="relative overflow-hidden bg-slate-900 pt-16 pb-24 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400">
              <Sparkles className="h-3.5 w-3.5" /> Request-first procurement
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Tell us what your team needs.
              <span className="block bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">We will quote it.</span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Drop the goods and details you need into one request. Admin reviews it, prepares a quote, and sends it back for approval.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/rfq" className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold shadow-lg shadow-blue-600/30 transition-colors hover:bg-blue-500">
                <FileText className="h-4 w-4" /> Create request
              </Link>
              <Link href="/dashboard" className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-slate-700">
                Track requests <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-6 text-xs text-slate-400">
              <div><strong className="block text-2xl text-white">Admin</strong> review</div>
              <div><strong className="block text-2xl text-white">Clear</strong> approval</div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8 lg:col-span-5">
            <h2 className="text-lg font-bold">Quick add</h2>
            <p className="mt-1 text-xs text-slate-300">Start with a common request line.</p>
            <div className="mt-6 space-y-3">
              {examples.slice(0, 3).map(([name, description]) => (
                <div key={name} className="flex items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-800/80 p-3.5">
                  <div><p className="text-sm font-semibold">{name}</p><p className="text-xs text-slate-400">{description}</p></div>
                  <button onClick={() => handleQuickAdd(name)} className="flex shrink-0 items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium hover:bg-blue-500">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
              ))}
              <Link href="/rfq" className="block w-full rounded-xl bg-amber-400 py-3 text-center text-sm font-bold text-slate-950 transition-colors hover:bg-amber-300">
                Open request builder ({rfqCart.reduce((sum, item) => sum + item.quantity, 0)} items)
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8"><span className="text-xs font-bold uppercase tracking-wider text-blue-600">What can you request?</span><h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">Common request starting points</h2></div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {examples.map(([name, description]) => <Link key={name} href="/rfq" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl"><div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><FileText className="h-7 w-7" /></div><h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600">{name}</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p><span className="mt-6 flex items-center gap-1 border-t border-slate-100 pt-4 text-xs font-semibold text-blue-600">Start request <ArrowRight className="h-4 w-4" /></span></Link>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 p-8 text-white shadow-2xl sm:p-12"><span className="text-xs font-bold uppercase tracking-wider text-amber-400">One clear workflow</span><h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">Request, review, quote, approve.</h2><p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">Every quote and order stays connected to the original request, so buyers and admin teams always share the same context.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" /><span className="text-sm">Buyer submits goods, quantities, dates, and notes.</span></div><div className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" /><span className="text-sm">Admin reviews the request and provides pricing.</span></div><div className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" /><span className="text-sm">Buyer receives a clear quote for approval.</span></div><div className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" /><span className="text-sm">Approved quotes become trackable orders.</span></div></div></div></section>
    </div>
  );
}
