'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText,
  ClipboardCheck,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-[#102a4c] text-white py-16 border-b border-[#173962]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-[#8ee0b2] text-xs font-bold uppercase tracking-wider">About Lankot</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Simplifying how businesses request and approve goods
          </h1>
          <p className="text-slate-300 max-w-3xl text-base sm:text-lg leading-relaxed">
            Lankot helps buyers submit exactly what they need, lets admin teams review the request, and turns approved items into clear quotes and orders without a catalog-first workflow.
          </p>
        </div>
      </section>

      {/* Core Operational Pillars */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-[#0b8f55] text-xs font-bold uppercase tracking-wider">How it works</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">A simpler procurement flow for buying teams</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-xl border border-[#e2e8f0] shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-lg bg-[#edf9f2] text-[#087443] flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0f172a]">Submit the request</h3>
            <p className="text-[#64748b] text-sm leading-relaxed">
              Clients drop the items, quantities, and timing they need in a single structured intake form.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-[#e2e8f0] shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-lg bg-[#edf9f2] text-[#087443] flex items-center justify-center font-bold">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0f172a]">Admin reviews the need</h3>
            <p className="text-[#64748b] text-sm leading-relaxed">
              Internal teams review the request, validate the details, and decide the right quote or next steps.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-[#e2e8f0] shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-lg bg-[#edf9f2] text-[#087443] flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0f172a]">Quote and order</h3>
            <p className="text-[#64748b] text-sm leading-relaxed">
              Once approved, the buyer receives a quote and can accept it to convert the request into an order.
            </p>
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="bg-[#f8fafc] py-16 border-y border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-[#0b8f55] text-xs font-bold uppercase tracking-wider">Built for teams</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] mt-1">Who uses this platform</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Operations teams', desc: 'Request the goods they need without waiting on a long procurement back-and-forth.' },
              { title: 'Buying managers', desc: 'Review incoming requests, compare needs, and issue a firm quote.' },
              { title: 'Finance teams', desc: 'Track what was requested, quoted, and approved in one clear flow.' },
              { title: 'Support teams', desc: 'Keep each request organized around delivery dates, notes, and status updates.' }
            ].map((ind, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-[#e2e8f0] space-y-3">
                <CheckCircle2 className="w-5 h-5 text-[#0b8f55]" />
                <h4 className="font-bold text-[#0f172a] text-base">{ind.title}</h4>
                <p className="text-[#64748b] text-xs leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#173962] text-white rounded-xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to simplify your request flow?</h2>
            <p className="text-slate-300 text-sm">
              Register your company account or submit a request for a faster quote process.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/register"
              className="bg-[#0b8f55] text-white font-bold px-6 py-3 rounded-lg text-sm hover:bg-[#087443] transition-colors shadow-sm"
            >
              Get Started
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 text-white font-medium px-6 py-3 rounded-lg text-sm hover:bg-white/20 transition-colors border border-white/20"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

