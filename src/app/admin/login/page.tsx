'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useApp } from '@/context/app-context';
import { AlertCircle, CheckCircle2, Eye, EyeOff, LoaderCircle, LockKeyhole, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const result = await signIn(email, password, 'admin');
      if (!result.success) { setError(result.error || 'Unable to sign in.'); return; }
      setSuccess('Access verified. Opening admin operations...');
      window.setTimeout(() => router.replace('/admin'), 400);
    } finally { setLoading(false); }
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="grid overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
        <section className="px-5 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#102a4c] text-xl font-bold text-white shadow-sm">L</div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Restricted access</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0f172a]">Admin Portal</h1>
              <p className="mt-2 text-sm leading-relaxed text-[#64748b]">Sign in to manage procurement operations.</p>
            </div>
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label htmlFor="admin-email" className="text-xs font-bold uppercase tracking-wide text-[#334155]">Admin email</label>
                <input id="admin-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@company.com" className="mt-2 w-full border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-sm" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="admin-password" className="text-xs font-bold uppercase tracking-wide text-[#334155]">Password</label>
                  <a href="mailto:lankotventures01@gmail.com?subject=Admin%20password%20reset" className="text-xs font-semibold text-[#087443] hover:underline">Forgot password?</a>
                </div>
                <div className="relative mt-2">
                  <input id="admin-password" type={visible ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 pr-12 text-sm" />
                  <button type="button" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#64748b] hover:bg-[#f1f5f9]">
                    <Eye className={`${visible ? 'hidden' : 'block'} h-4 w-4`} />
                    <EyeOff className={`${visible ? 'block' : 'hidden'} h-4 w-4`} />
                  </button>
                </div>
              </div>
              {error && <div role="alert" aria-live="assertive" className="flex gap-2 rounded-lg border border-red-200 bg-red-50/80 px-3.5 py-3 text-sm text-red-800"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
              {success && <div role="status" className="flex gap-2 rounded-lg border border-[#bdebd2] bg-[#edf9f2] px-3.5 py-3 text-sm text-[#087443]"><CheckCircle2 className="h-4 w-4 shrink-0" />{success}</div>}
              <button type="submit" disabled={loading} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#173962] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#102a4c] disabled:opacity-60">
                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
                {loading ? 'Verifying access...' : 'Sign in to admin portal'}
              </button>
            </form>
            <div className="mt-8 border-t border-[#edf0f4] pt-6 text-center text-sm">
              <Link href="/login" className="font-semibold text-[#64748b] hover:text-[#173962] hover:underline">Return to customer sign in</Link>
            </div>
          </div>
        </section>
        <aside className="flex min-h-[300px] flex-col justify-between bg-[#102a4c] px-6 py-8 text-white sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-[#8ee0b2]/30 bg-[#0b8f55]/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#a7e4c2]">Lankot HQ</span>
              <ShieldCheck className="h-5 w-5 text-[#8ee0b2]" />
            </div>
            <h2 className="mt-8 text-2xl font-extrabold leading-tight sm:text-3xl">Keep supply decisions clear.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#c9d5e3]">The internal workspace for request review, quote preparation, and fulfilment coordination.</p>
          </div>
          <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-[#d9e3ed]">Authorised Lankot staff only.</p>
        </aside>
      </div>
    </main>
  );
}

