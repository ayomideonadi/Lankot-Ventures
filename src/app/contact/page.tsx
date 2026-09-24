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
        <span className="text-[#0b8f55] text-xs font-bold uppercase tracking-wider">Contact Lankot</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
          Request support for your buying workflow
        </h1>
        <p className="text-[#64748b] text-sm">
          Need help with a quote request, order status, or account setup? Our team is ready to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#102a4c] text-white rounded-xl p-8 space-y-8 shadow-sm">
            <h2 className="text-xl font-bold">Lankot Support Desk</h2>

            <div className="space-y-6 text-sm text-slate-300">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#8ee0b2] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Head Office</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Lagos, Nigeria<br />Business Operations</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-[#8ee0b2] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Phone</h4>
                  <p className="text-xs text-slate-400 mt-0.5">+234 805 521 1085-LANKOT</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[#8ee0b2] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Email</h4>
                  <p className="text-xs text-slate-400 mt-0.5">lankotventures01@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-[#8ee0b2] shrink-0 mt-0.5" />
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
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 shadow-sm">
            {sent ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 bg-[#edf9f2] text-[#087443] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0f172a]">Message Received</h3>
                <p className="text-[#64748b] text-sm max-w-md mx-auto">
                  Thank you for reaching out. Our team will respond shortly with the next step.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-bold text-[#0f172a]">Send a message</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-bold text-[#334155] uppercase tracking-wide">Contact Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Toyin Onadi"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-company" className="text-xs font-bold text-[#334155] uppercase tracking-wide">Company Name</label>
                    <input
                      id="contact-company"
                      type="text"
                      required
                      placeholder="e.g. Lankot Ventures."
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-bold text-[#334155] uppercase tracking-wide">Corporate Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="lankotventures@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-bold text-[#334155] uppercase tracking-wide">Message & Procurement Needs</label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    placeholder="Tell us what you need, the delivery timing, and any notes for the request..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#173962] hover:bg-[#102a4c] text-white font-bold py-3.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4 text-[#8ee0b2]" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

