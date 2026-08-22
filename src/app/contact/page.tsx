'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Contact Lankot</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Request support for your buying workflow
        </h1>
        <p className="text-slate-500 text-sm">
          Need help with a quote request, order status, or account setup? Our team is ready to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 shadow-xl">
            <h3 className="text-xl font-bold">Lankot Support Desk</h3>

            <div className="space-y-6 text-sm text-slate-300">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Head Office</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Business support hub<br />Remote-first operations</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Phone</h4>
                  <p className="text-xs text-slate-400 mt-0.5">+234 805 521 1085</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Email</h4>
                  <p className="text-xs text-slate-400 mt-0.5">support@lankot.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Hours</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Monday - Saturday: 8:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            {sent ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">Message Received</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  Thank you for reaching out. Our team will respond shortly with the next step.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Send a message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Contact Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Business Inc."
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Corporate Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Message & Procurement Needs</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you need, the delivery timing, and any notes for the request..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
