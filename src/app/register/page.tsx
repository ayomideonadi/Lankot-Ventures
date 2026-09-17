'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { validatePassword } from '@/lib/password-validation';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Eye, EyeOff, FileCheck2, LoaderCircle, ShieldCheck } from 'lucide-react';

type RegistrationForm = {
  companyName: string;
  taxId: string;
  industry: string;
  email: string;
  contactPerson: string;
  phone: string;
  password: string;
};

const steps = ['Company information', 'Contact information', 'Confirmation'];

export default function RegisterPage() {
  const router = useRouter();
  const { registerAccount } = useApp();
  const [step, setStep] = useState(0);
  const [registered, setRegistered] = useState(false);
  const [confirmationRequired, setConfirmationRequired] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<RegistrationForm>({ companyName: '', taxId: '', industry: 'Business Operations', email: '', contactPerson: '', phone: '', password: '' });

  const passwordChecks = [
    { label: '8+ characters', valid: form.password.length >= 8 },
    { label: 'Uppercase letter', valid: /[A-Z]/.test(form.password) },
    { label: 'Lowercase letter', valid: /[a-z]/.test(form.password) },
    { label: 'Number', valid: /\d/.test(form.password) },
  ];
  const strength = passwordChecks.filter((check) => check.valid).length;
  const strengthLabel = strength <= 1 ? 'Weak' : strength === 2 || strength === 3 ? 'Building strength' : 'Strong';

  const updateField = (field: keyof RegistrationForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }));
  };

  const validateStep = (stepToValidate: number) => {
    const nextErrors: Record<string, string> = {};
    if (stepToValidate === 0) {
      if (form.companyName.trim().length < 2) nextErrors.companyName = 'Enter your registered company name.';
      if (!form.industry) nextErrors.industry = 'Select your primary industry.';
      if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid business email.';
    }
    if (stepToValidate === 1) {
      if (form.contactPerson.trim().length < 2) nextErrors.contactPerson = 'Enter the primary contact name.';
      if (form.phone.trim().length < 7) nextErrors.phone = 'Enter a valid phone number.';
      const passwordValidation = validatePassword(form.password);
      if (!passwordValidation.valid) nextErrors.password = passwordValidation.error || 'Enter a stronger password.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((current) => current + 1);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateStep(1) || isSubmitting) return;
    setIsSubmitting(true);
    const result = await registerAccount({ ...form, taxId: form.taxId || 'Account pending' }, form.password);
    if (!result.success) {
      setErrors({ submit: result.error || 'Unable to create account. Please try again.' });
      setIsSubmitting(false);
      return;
    }
    setConfirmationRequired(Boolean(result.requiresConfirmation));
    setRegistered(true);
    setIsSubmitting(false);
    if (!result.requiresConfirmation) window.setTimeout(() => router.push('/dashboard'), 1500);
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="grid overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm lg:grid-cols-[minmax(0,0.9fr)_minmax(440px,1.1fr)]">
        <section className="order-1 px-5 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Company onboarding</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0f172a] sm:text-4xl">Set up your client portal</h1>
              <p className="mt-2 text-sm leading-relaxed text-[#64748b]">A few details help us prepare a better procurement workspace for your team.</p>
            </div>

            <div className="mb-8 grid grid-cols-3 gap-2" aria-label="Registration progress">
              {steps.map((label, index) => (
                <div key={label} aria-current={index === step ? 'step' : undefined} className="space-y-2">
                  <div className={`h-1.5 rounded-full ${index <= step ? 'bg-[#0b8f55]' : 'bg-[#e2e8f0]'}`} />
                  <div className={`text-[11px] font-semibold ${index === step ? 'text-[#173962]' : 'text-[#94a3b8]'}`}>
                    {index + 1}. {label}
                  </div>
                </div>
              ))}
            </div>

            {registered ? (
              <div className="rounded-xl border border-[#bdebd2] bg-[#edf9f2] px-5 py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0b8f55] text-white">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-[#0f172a]">Company profile created</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#52627a]">{confirmationRequired ? 'Check your business email to verify the account before signing in.' : 'Your client portal is ready. Redirecting you now...'}</p>
                {confirmationRequired && (
                  <Link href="/login" className="mt-5 inline-flex rounded-lg bg-[#173962] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#102a4c]">Return to sign in</Link>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 0 && (
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="company-name" className="text-xs font-bold uppercase tracking-wide text-[#334155]">Company name</label>
                      <input id="company-name" value={form.companyName} onChange={(event) => updateField('companyName', event.target.value)} placeholder="e.g. Apex Business & Logistics Ltd." autoComplete="organization" className="mt-2 w-full border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-sm" />
                      {errors.companyName && <p className="mt-1.5 text-xs text-red-700">{errors.companyName}</p>}
                    </div>
                    <div>
                      <label htmlFor="industry" className="text-xs font-bold uppercase tracking-wide text-[#334155]">Industry</label>
                      <select id="industry" value={form.industry} onChange={(event) => updateField('industry', event.target.value)} className="mt-2 w-full border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-sm">
                        <option>Business Operations</option>
                        <option>Retail</option>
                        <option>Manufacturing</option>
                        <option>Professional Services</option>
                        <option>Hospitality</option>
                      </select>
                      {errors.industry && <p className="mt-1.5 text-xs text-red-700">{errors.industry}</p>}
                    </div>
                    <div>
                      <label htmlFor="business-email" className="text-xs font-bold uppercase tracking-wide text-[#334155]">Business email</label>
                      <input id="business-email" type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="you@company.com" autoComplete="email" className="mt-2 w-full border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-sm" />
                      {errors.email && <p className="mt-1.5 text-xs text-red-700">{errors.email}</p>}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="contact-person" className="text-xs font-bold uppercase tracking-wide text-[#334155]">Contact person&apos;s name</label>
                      <input id="contact-person" value={form.contactPerson} onChange={(event) => updateField('contactPerson', event.target.value)} placeholder="Your full name" autoComplete="name" className="mt-2 w-full border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-sm" />
                      {errors.contactPerson && <p className="mt-1.5 text-xs text-red-700">{errors.contactPerson}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wide text-[#334155]">Phone number</label>
                      <input id="phone" type="tel" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="+234 800 000 0000" autoComplete="tel" className="mt-2 w-full border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-sm" />
                      {errors.phone && <p className="mt-1.5 text-xs text-red-700">{errors.phone}</p>}
                    </div>
                    <div>
                      <label htmlFor="registration-password" className="text-xs font-bold uppercase tracking-wide text-[#334155]">Password</label>
                      <div className="relative mt-2">
                        <input id="registration-password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => updateField('password', event.target.value)} autoComplete="new-password" className="w-full border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 pr-12 text-sm" />
                        <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#173962]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748b]">
                          <span>Password strength</span>
                          <span className={strength === 4 ? 'text-[#087443]' : 'text-[#946200]'}>{form.password ? strengthLabel : 'Start typing'}</span>
                        </div>
                        <div className="mt-2 grid grid-cols-4 gap-1">
                          <span className={`h-1.5 rounded-full ${strength > 0 ? 'bg-[#0b8f55]' : 'bg-[#e2e8f0]'}`} />
                          <span className={`h-1.5 rounded-full ${strength > 1 ? 'bg-[#0b8f55]' : 'bg-[#e2e8f0]'}`} />
                          <span className={`h-1.5 rounded-full ${strength > 2 ? 'bg-[#0b8f55]' : 'bg-[#e2e8f0]'}`} />
                          <span className={`h-1.5 rounded-full ${strength > 3 ? 'bg-[#0b8f55]' : 'bg-[#e2e8f0]'}`} />
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-[#64748b]">
                          {passwordChecks.map((check) => (
                            <span key={check.label} className="flex items-center gap-1.5">
                              <Check className={`h-3 w-3 ${check.valid ? 'text-[#0b8f55]' : 'text-[#cbd5e1]'}`} />
                              {check.label}
                            </span>
                          ))}
                        </div>
                      </div>
                      {errors.password && <p className="mt-1.5 text-xs text-red-700">{errors.password}</p>}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf9f2] text-[#087443]">
                          <FileCheck2 className="h-4 w-4" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-[#0f172a]">Review your details</h2>
                          <p className="mt-0.5 text-xs text-[#64748b]">Confirm everything before creating your account.</p>
                        </div>
                      </div>
                      <dl className="mt-5 space-y-3 text-sm">
                        <div className="flex justify-between gap-4 border-b border-[#e2e8f0] pb-3">
                          <dt className="text-[#64748b]">Company</dt>
                          <dd className="text-right font-semibold text-[#0f172a]">{form.companyName}</dd>
                        </div>
                        <div className="flex justify-between gap-4 border-b border-[#e2e8f0] pb-3">
                          <dt className="text-[#64748b]">Industry</dt>
                          <dd className="text-right font-semibold text-[#0f172a]">{form.industry}</dd>
                        </div>
                        <div className="flex justify-between gap-4 border-b border-[#e2e8f0] pb-3">
                          <dt className="text-[#64748b]">Business email</dt>
                          <dd className="break-all text-right font-semibold text-[#0f172a]">{form.email}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-[#64748b]">Primary contact</dt>
                          <dd className="text-right font-semibold text-[#0f172a]">{form.contactPerson}<br /><span className="text-xs font-normal text-[#64748b]">{form.phone}</span></dd>
                        </div>
                      </dl>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border border-[#bdebd2] bg-[#edf9f2] px-4 py-3 text-xs leading-5 text-[#087443]">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>Your details are used to set up your secure client portal and support procurement requests.</span>
                    </div>
                    {errors.submit && <p role="alert" className="text-sm text-red-700">{errors.submit}</p>}
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button type="button" onClick={() => { setErrors({}); setStep((current) => Math.max(0, current - 1)); }} disabled={step === 0 || isSubmitting} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#64748b] transition-colors hover:bg-[#f1f5f9] disabled:invisible">
                    <ArrowLeft className="h-4 w-4" />Back
                  </button>
                  {step < 2 ? (
                    <button type="button" onClick={handleNext} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#173962] px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#102a4c]">
                      Continue <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button type="submit" disabled={isSubmitting} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#0b8f55] px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#087443] disabled:cursor-not-allowed disabled:opacity-60">
                      {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      {isSubmitting ? 'Creating account...' : 'Create client account'}
                    </button>
                  )}
                </div>
              </form>
            )}

            <div className="mt-8 border-t border-[#edf0f4] pt-6 text-center text-sm text-[#64748b]">
              Already registered?{' '}
              <Link href="/login" className="font-bold text-[#087443] hover:text-[#065c35] hover:underline">Sign in</Link>
            </div>
          </div>
        </section>

        <aside className="order-2 flex min-h-[360px] flex-col justify-between bg-[#102a4c] px-6 py-8 text-white sm:px-10 sm:py-12 lg:min-h-[620px] lg:px-12 lg:py-14">
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full border border-[#8ee0b2]/30 bg-[#0b8f55]/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#a7e4c2]">Built for business</span>
              <ShieldCheck className="h-5 w-5 text-[#8ee0b2]" />
            </div>
            <h2 className="mt-8 max-w-lg text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">A more dependable way to source.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#c9d5e3]">Bring your team&apos;s requirements together and move from request to approved order with confidence.</p>
          </div>
          <div className="mt-10 space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#8ee0b2]">Your portal includes</p>
              <div className="mt-4 space-y-3 text-sm text-[#d9e3ed]">
                <p className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-[#8ee0b2]" />Centralised request history</p>
                <p className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-[#8ee0b2]" />Clear quote approvals</p>
                <p className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-[#8ee0b2]" />Order and delivery visibility</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-[#c9d5e3]">
              Serving procurement teams across Nigeria with a practical, request-first workflow.
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

