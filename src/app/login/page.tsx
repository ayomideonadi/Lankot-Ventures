'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  LoaderCircle,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const result = await signIn(email, password, 'buyer');
      if (!result.success) {
        setError(result.error || 'Unable to sign in. Check your credentials and try again.');
        return;
      }
      setSuccess('Signed in successfully. Opening your procurement workspace...');
      window.setTimeout(() => router.push('/dashboard'), 500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="grid overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm lg:grid-cols-[minmax(0,0.9fr)_minmax(440px,1.1fr)]">
        <section className="order-1 px-5 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Client portal</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0f172a] sm:text-4xl">Welcome back</h1>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#64748b]">Sign in to manage sourcing requests, approve quotes, and track deliveries for your business.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="corporate-email" className="text-xs font-bold uppercase tracking-wide text-[#334155]">Corporate email</label>
                <input
                  id="corporate-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="password" className="text-xs font-bold uppercase tracking-wide text-[#334155]">Password</label>
                  <a href="mailto:lankotventures01@gmail.com?subject=Password%20reset%20request" className="text-xs font-semibold text-[#087443] hover:text-[#065c35] hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="w-full border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 pr-12 text-sm text-[#0f172a]"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#173962]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50/80 px-3.5 py-3 text-sm text-red-800">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div role="status" className="flex items-start gap-2 rounded-lg border border-[#bdebd2] bg-[#edf9f2] px-3.5 py-3 text-sm text-[#087443]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#173962] px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#102a4c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
                {isSubmitting ? 'Signing in...' : 'Sign in to client portal'}
              </button>
            </form>

            <div className="mt-8 border-t border-[#edf0f4] pt-6 text-center text-sm text-[#64748b]">
              Need a corporate account?{' '}
              <Link href="/register" className="font-bold text-[#087443] hover:text-[#065c35] hover:underline">Register your company</Link>
            </div>
          </div>
        </section>

        <aside className="order-2 flex min-h-[360px] flex-col justify-between bg-[#102a4c] px-6 py-8 text-white sm:px-10 sm:py-12 lg:min-h-[620px] lg:px-12 lg:py-14">
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full border border-[#8ee0b2]/30 bg-[#0b8f55]/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#a7e4c2]">Procurement, organised</span>
              <ShieldCheck className="h-5 w-5 text-[#8ee0b2]" />
            </div>
            <h2 className="mt-8 max-w-lg text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">Keep every business request moving.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#c9d5e3]">One trusted workspace for the goods your teams need, from first request through approval and delivery.</p>
          </div>

          <div className="mt-10 space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0b8f55] text-white">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white">Office replenishment</p>
                    <p className="mt-0.5 text-[11px] text-[#9eb1c5]">Quote ready for review</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#8ee0b2]">READY</span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-4/5 rounded-full bg-[#8ee0b2]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <PackageCheck className="h-5 w-5 text-[#8ee0b2]" />
                <p className="mt-3 text-lg font-bold">24/7</p>
                <p className="mt-0.5 text-[11px] text-[#9eb1c5]">Request visibility</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <Clock3 className="h-5 w-5 text-[#8ee0b2]" />
                <p className="mt-3 text-lg font-bold">One flow</p>
                <p className="mt-0.5 text-[11px] text-[#9eb1c5]">From quote to order</p>
              </div>
            </div>

            <Link href="/about" className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
              Learn how Lankot supports your team <ArrowRight className="h-4 w-4 text-[#8ee0b2]" />
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

