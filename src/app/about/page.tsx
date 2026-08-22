'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText,
  ClipboardCheck,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">About Lankot</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Simplifying how businesses request and approve goods
          </h1>
          <p className="text-slate-300 max-w-3xl text-base sm:text-lg leading-relaxed">
            Lankot helps buyers submit exactly what they need, lets admin teams review the request, and turns approved items into clear quotes and orders without a catalog-first workflow.
          </p>
        </div>
      </section>

      {/* Core Operational Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">How it works</span>
          <h2 className="text-3xl font-extrabold text-slate-900">A simpler procurement flow for buying teams</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Submit the request</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Clients drop the items, quantities, and timing they need in a single structured intake form.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Admin reviews the need</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Internal teams review the request, validate the details, and decide the right quote or next steps.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Quote and order</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Once approved, the buyer receives a quote and can accept it to convert the request into an order.
            </p>
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="bg-slate-100/80 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Built for teams</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Who uses this platform</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Operations teams', desc: 'Request the goods they need without waiting on a long procurement back-and-forth.' },
              { title: 'Buying managers', desc: 'Review incoming requests, compare needs, and issue a firm quote.' },
              { title: 'Finance teams', desc: 'Track what was requested, quoted, and approved in one clear flow.' },
              { title: 'Support teams', desc: 'Keep each request organized around delivery dates, notes, and status updates.' }
            ].map((ind, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-base">{ind.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to simplify your request flow?</h3>
            <p className="text-blue-100 text-sm">
              Register your company account or submit a request for a faster quote process.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              href="/register"
              className="bg-white text-blue-900 font-bold px-6 py-3 rounded-xl text-sm hover:bg-blue-50 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/contact"
              className="bg-blue-700 text-white font-medium px-6 py-3 rounded-xl text-sm hover:bg-blue-800 transition-colors border border-blue-500"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
