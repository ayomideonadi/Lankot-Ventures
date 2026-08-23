import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Clock, Award, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Prop Badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Guaranteed Delivery SLA</h4>
              <p className="text-slate-400 text-xs">Clear fulfillment coordination</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">ISO Certified Quality</h4>
              <p className="text-slate-400 text-xs">Reviewed request details</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Rapid quote review</h4>
              <p className="text-slate-400 text-xs">Quotes prepared after review</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Corporate Terms</h4>
              <p className="text-slate-400 text-xs">Net 30/60 account credit lines</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                L
              </div>
              <span className="font-bold text-lg text-white">LANKOT VENTURES</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Empowering enterprise procurement with modern digital order management, transparent contract pricing, and dependable supply chain execution.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-blue-400" /> Lagos, Nigeria</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-blue-400" /> Sales: +234 805 521 1085-LANKOT</p>
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-blue-400" /> lankotventures01@gmail.com</p>
            </div>
          </div>

          <div>
            <h5 className="text-white font-semibold text-sm mb-3">Request Workflow</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/rfq" className="hover:text-white transition-colors">Submit a request</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Client dashboard</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">Order tracking</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Support desk</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-sm mb-3">Client Services</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/rfq" className="hover:text-white transition-colors">Request builder</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Client Portal Dashboard</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">Order Tracking & History</Link></li>
              <li><Link href="/rfq" className="hover:text-white transition-colors">Request intake</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-sm mb-3">Corporate & Legal</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Lankot</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact support</Link></li>
              <li><span className="hover:text-white cursor-pointer">Request policy</span></li>
              <li><span className="hover:text-white cursor-pointer">Buyer terms</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Lankot B2B Request Platform. All rights reserved.</p>
          <p>Built for request-driven procurement teams.</p>
        </div>

      </div>
    </footer>
  );
};
