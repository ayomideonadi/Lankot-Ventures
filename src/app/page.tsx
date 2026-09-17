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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#102a4c] pb-20 pt-16 text-white">
        <div className="absolute inset-y-0 right-0 hidden w-2/5 bg-[#173962] lg:block opacity-40" />
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8ee0b2]/30 bg-[#0b8f55]/20 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#a7e4c2]">
              <Sparkles className="h-3.5 w-3.5" /> Request-first procurement
            </div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              A clearer way to source for your business.
              <span className="block text-[#8ee0b2]">Built for Nigerian teams.</span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Submit what your team needs, receive a considered quote, and keep every approval and delivery milestone connected in one place.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/rfq" className="flex items-center gap-2 rounded-lg bg-[#0b8f55] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#087443]">
                <FileText className="h-4 w-4" /> Create request
              </Link>
              <Link href="/dashboard" className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                Track requests <ArrowRight className="h-4 w-4 text-slate-300" />
              </Link>
            </div>
            <div className="grid max-w-md grid-cols-3 gap-4 border-t border-white/15 pt-6 text-xs text-slate-300">
              <div><strong className="block text-xl text-white">One</strong> request flow</div>
              <div><strong className="block text-xl text-white">Clear</strong> approvals</div>
              <div><strong className="block text-xl text-white">Local</strong> supply focus</div>
            </div>
          </div>

          <div className="relative rounded-xl border border-[#e2e8f0] bg-white p-6 text-[#0f172a] shadow-md sm:p-8 lg:col-span-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Start sourcing</p>
                <h2 className="mt-1 text-xl font-bold text-[#0f172a]">Build a request</h2>
              </div>
              <div className="rounded-lg bg-[#edf9f2] p-2 text-[#087443]">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-sm text-[#64748b]">Add a common need and we will help you take it from request to delivery.</p>
            <div className="mt-6 space-y-3">
              {examples.slice(0, 3).map(([name, description]) => (
                <div key={name} className="flex items-center justify-between gap-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3.5">
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">{name}</p>
                    <p className="text-xs text-[#64748b]">{description}</p>
                  </div>
                  <button onClick={() => handleQuickAdd(name)} className="flex shrink-0 items-center gap-1 rounded-lg bg-white border border-[#e2e8f0] px-3 py-1.5 text-xs font-semibold text-[#173962] transition-colors hover:bg-[#f1f5f9]">
                    <Plus className="h-3.5 w-3.5 text-[#0b8f55]" /> Add
                  </button>
                </div>
              ))}
              <Link href="/rfq" className="block w-full rounded-lg bg-[#0b8f55] py-3 text-center text-sm font-bold text-white transition-colors hover:bg-[#087443]">
                Open request builder ({rfqCart.reduce((sum, item) => sum + item.quantity, 0)} items)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories / Starting Points */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">What can you request?</span>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Common request starting points</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map(([name, description]) => (
            <Link key={name} href="/rfq" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-[#0b8f55]/40 hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-[#edf9f2] text-[#087443]">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0b8f55]">{name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
              <span className="mt-6 flex items-center gap-1 border-t border-slate-100 pt-4 text-xs font-semibold text-[#173962]">
                Start request <ArrowRight className="h-4 w-4 text-[#0b8f55]" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-[#173962] p-8 text-white shadow-sm sm:p-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8ee0b2]">One clear workflow</span>
          <h2 className="mt-2 max-w-3xl text-2xl font-extrabold tracking-tight sm:text-3xl">Request, review, quote, approve.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
            Every quote and order stays connected to the original request, so buyers and admin teams always share the same context.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#8ee0b2]" />
              <span className="text-sm">Buyer submits goods, quantities, dates, and notes.</span>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#8ee0b2]" />
              <span className="text-sm">Admin reviews the request and provides pricing.</span>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#8ee0b2]" />
              <span className="text-sm">Buyer receives a clear quote for approval.</span>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#8ee0b2]" />
              <span className="text-sm">Approved quotes become trackable orders.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

