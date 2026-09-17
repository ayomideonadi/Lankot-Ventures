import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Clock, Award, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#173962] bg-[#0b1f3a] pb-8 pt-12 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Prop Badges */}
        <div className="grid grid-cols-1 gap-6 border-b border-white/10 pb-12 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8ee0b2]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Guaranteed Delivery SLA</h4>
              <p className="text-slate-400 text-xs">Clear fulfillment coordination</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8ee0b2]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">ISO Certified Quality</h4>
              <p className="text-slate-400 text-xs">Reviewed request details</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8ee0b2]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Rapid quote review</h4>
              <p className="text-slate-400 text-xs">Quotes prepared after review</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8ee0b2]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Corporate Terms</h4>
              <p className="text-slate-400 text-xs">Net 30/60 account credit lines</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 gap-8 py-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b8f55] text-lg font-bold text-white">
                L
              </div>
              <span className="font-bold text-lg text-white">LANKOT VENTURES</span>
            </div>
              <p className="mb-4 text-xs leading-relaxed text-slate-400">
              Empowering enterprise procurement with modern digital order management, transparent contract pricing, and dependable supply chain execution.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-[#8ee0b2]" /> Lagos, Nigeria</p>
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-[#8ee0b2]" /> Sales: +234 805 521 1085-LANKOT</p>
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-[#8ee0b2]" /> lankotventures01@gmail.com</p>
            </div>
          </div>

          <div>
            <h2 className="text-white font-semibold text-sm mb-3">Request Workflow</h2>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/rfq" className="hover:text-white transition-colors">Submit a request</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Client dashboard</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">Order tracking</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Support desk</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold text-sm mb-3">Client Services</h2>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/rfq" className="hover:text-white transition-colors">Request builder</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Client Portal Dashboard</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">Order Tracking & History</Link></li>
              <li><Link href="/rfq" className="hover:text-white transition-colors">Request intake</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold text-sm mb-3">Corporate & Legal</h2>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Lankot</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact support</Link></li>
              <li><Link href="/admin/login" className="hover:text-white transition-colors">Staff / Admin Login</Link></li>
              <li><span>Request policy</span></li>
              <li><span>Buyer terms</span></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 md:flex-row">
          <p>© 2026 Lankot B2B Request Platform. All rights reserved.</p>
          <p>Built for request-driven procurement teams.</p>
        </div>

      </div>
    </footer>
  );
};
