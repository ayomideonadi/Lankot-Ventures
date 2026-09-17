'use client';

import Link from 'next/link';
import { useApp } from '@/context/app-context';
import { SupplyRequest } from '@/types/b2b';
import { Button, Card, EmptyState } from '@/components/ui';
import {
  ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, ClipboardList,
  FilePlus2, LoaderCircle, MapPin, Minus, Package, Plus, Send, Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type RequestItem = { id: string; itemName: string; quantity: number; unit: string; specificRequirements: string };
type Draft = { title: string; items: RequestItem[]; targetDate: string; location: string; deliveryInstructions: string };

const steps = ['Request details', 'Delivery', 'Review', 'Success'];
const draftKey = 'lankot-rfq-draft';

function makeItem(): RequestItem {
  return { id: `draft-${Date.now()}-${Math.random()}`, itemName: '', quantity: 1, unit: 'Units', specificRequirements: '' };
}

export default function RFQPage() {
  const { rfqCart, submitSupplyRequest, userProfile } = useApp();
  const [step, setStep] = useState(0);
  const [submittedRequest, setSubmittedRequest] = useState<SupplyRequest | null>(null);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [draft, setDraft] = useState<Draft>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(draftKey);
      if (saved) {
        try {
          return JSON.parse(saved) as Draft;
        } catch {
          window.localStorage.removeItem(draftKey);
        }
      }
    }
    return {
      title: '',
      items: rfqCart.length
        ? rfqCart.map((item, index) => ({
            id: `cart-${item.productId}-${index}`,
            itemName: item.product?.name || item.itemName || '',
            quantity: item.quantity,
            unit: item.product?.unit || item.unit || 'Units',
            specificRequirements: '',
          }))
        : [],
      targetDate: '',
      location: userProfile.address === 'Add your delivery address' ? '' : userProfile.address,
      deliveryInstructions: '',
    };
  });

  useEffect(() => {
    if (!submittedRequest && typeof window !== 'undefined') {
      window.localStorage.setItem(draftKey, JSON.stringify(draft));
    }
  }, [draft, submittedRequest]);

  const totalItems = useMemo(() => draft.items.reduce((sum, item) => sum + item.quantity, 0), [draft.items]);
  const updateDraft = (changes: Partial<Draft>) => {
    setValidationErrors({});
    setError('');
    setDraft((current) => ({ ...current, ...changes }));
  };

  const updateItem = (id: string, changes: Partial<RequestItem>) => {
    setValidationErrors({});
    setError('');
    updateDraft({ items: draft.items.map((item) => (item.id === id ? { ...item, ...changes } : item)) });
  };

  const validate = (section: number) => {
    setError('');
    const newErrors: Record<string, boolean> = {};

    if (section === 0) {
      if (draft.title.trim().length < 3) {
        newErrors['title'] = true;
      }
      if (draft.items.length === 0) {
        newErrors['noItems'] = true;
      }
      draft.items.forEach((item) => {
        if (!item.itemName.trim()) newErrors[`itemName-${item.id}`] = true;
        if (item.quantity < 1) newErrors[`itemQuantity-${item.id}`] = true;
        if (!item.unit.trim()) newErrors[`itemUnit-${item.id}`] = true;
      });

      if (Object.keys(newErrors).length > 0) {
        setValidationErrors(newErrors);
        setError('Add a valid request title (min 3 chars) and ensure every item has a name, quantity (min 1), and unit.');
        return false;
      }
    }

    if (section === 1) {
      if (!draft.targetDate) newErrors['targetDate'] = true;
      if (!draft.location.trim()) newErrors['location'] = true;

      if (Object.keys(newErrors).length > 0) {
        setValidationErrors(newErrors);
        setError('Choose a valid delivery date and add a receiving dock/location address.');
        return false;
      }
    }

    setValidationErrors({});
    return true;
  };

  const addItem = () => updateDraft({ items: [...draft.items, makeItem()] });
  const removeItem = (id: string) => updateDraft({ items: draft.items.filter((item) => item.id !== id) });

  const submit = async () => {
    if (!validate(0) || !validate(1) || isSubmitting) return;
    setIsSubmitting(true);
    const notes = [
      `Request title: ${draft.title.trim()}`,
      `Delivery location: ${draft.location.trim()}`,
      `Delivery instructions: ${draft.deliveryInstructions.trim() || 'None provided.'}`,
    ].join('\n');

    try {
      const request = await submitSupplyRequest(
        draft.items.map((item) => ({
          itemName: item.itemName,
          quantity: item.quantity,
          unit: item.unit,
          specificRequirements: item.specificRequirements,
        })),
        draft.targetDate,
        notes
      );
      setSubmittedRequest(request);
      setStep(3);
      if (typeof window !== 'undefined') window.localStorage.removeItem(draftKey);
    } catch (submissionError) {
      console.error(submissionError);
      setError('We could not submit this request. Check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Procurement request</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0f172a] sm:text-4xl">Tell us what your team needs</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#64748b]">Build one clear request for your sourcing team. You can review and edit everything before it is submitted.</p>
      </div>

      <div className="mb-8 grid grid-cols-4 gap-2" aria-label="Request progress">
        {steps.map((label, index) => (
          <div key={label} aria-current={index === step ? 'step' : undefined} className="space-y-2">
            <div className={`h-1.5 rounded-full ${index <= step ? 'bg-[#0b8f55]' : 'bg-[#e2e8f0]'}`} />
            <div className={`text-[10px] font-semibold sm:text-[11px] ${index === step ? 'text-[#173962]' : 'text-[#94a3b8]'}`}>
              {index + 1}. {label}
            </div>
          </div>
        ))}
      </div>

      {step === 3 && submittedRequest ? (
        <SuccessState request={submittedRequest} />
      ) : (
        <Card className="overflow-hidden">
          <div className="p-5 sm:p-8">
            {step === 0 && (
              <DetailsStep
                draft={draft}
                totalItems={totalItems}
                validationErrors={validationErrors}
                updateDraft={updateDraft}
                updateItem={updateItem}
                addItem={addItem}
                removeItem={removeItem}
              />
            )}
            {step === 1 && <DeliveryStep draft={draft} validationErrors={validationErrors} updateDraft={updateDraft} />}
            {step === 2 && <ReviewStep draft={draft} userProfile={userProfile} setStep={setStep} />}

            {error && (
              <div role="alert" aria-live="assertive" className="mt-6 rounded-lg border border-red-200 bg-red-50/80 px-3.5 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#e2e8f0] pt-5">
              <button
                type="button"
                onClick={() => { setError(''); setValidationErrors({}); setStep((current) => Math.max(0, current - 1)); }}
                disabled={step === 0 || isSubmitting}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#64748b] hover:bg-[#f1f5f9] disabled:invisible transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />Back
              </button>
              {step < 2 ? (
                <Button type="button" onClick={() => validate(step) && setStep((current) => current + 1)}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="button" onClick={() => void submit()} disabled={isSubmitting} tone="success">
                  {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {isSubmitting ? 'Submitting request...' : 'Submit request'}
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
      {step !== 3 && <p className="mt-4 text-center text-xs text-[#94a3b8]">Your progress is saved automatically on this device.</p>}
    </main>
  );
}

function DetailsStep({
  draft,
  totalItems,
  validationErrors,
  updateDraft,
  updateItem,
  addItem,
  removeItem,
}: {
  draft: Draft;
  totalItems: number;
  validationErrors: Record<string, boolean>;
  updateDraft: (changes: Partial<Draft>) => void;
  updateItem: (id: string, changes: Partial<RequestItem>) => void;
  addItem: () => void;
  removeItem: (id: string) => void;
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">Request details</h2>
          <p className="mt-1 text-sm text-[#64748b]">Start with a useful name, then add every item your team needs.</p>
        </div>
        <ClipboardList className="h-6 w-6 text-[#173962]" />
      </div>
      <div>
        <label htmlFor="request-title" className="text-xs font-bold uppercase tracking-wide text-[#334155]">
          Request title
        </label>
        <input
          id="request-title"
          value={draft.title}
          aria-invalid={Boolean(validationErrors['title'])}
          onChange={(event) => updateDraft({ title: event.target.value })}
          placeholder="e.g. Q4 office replenishment"
          className={`mt-2 w-full rounded-lg border px-4 py-3 text-sm focus:outline-none ${
            validationErrors['title']
              ? 'border-red-500 bg-red-50/20 focus:border-red-500'
              : 'border-[#e2e8f0] bg-[#f8fafc] focus:border-[#0b8f55]'
          }`}
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0f172a]">Items and specifications</h3>
            <p className="mt-0.5 text-xs text-[#64748b]">
              {draft.items.length} item{draft.items.length === 1 ? '' : 's'} &middot; {totalItems} total units
            </p>
          </div>
          <Button type="button" tone="secondary" onClick={addItem}>
            <Plus className="h-4 w-4" />Add item
          </Button>
        </div>
        {draft.items.length === 0 ? (
          <EmptyState
            title="No items added yet"
            description="Add your first product or service requirement to continue."
            action={
              <Button type="button" tone="success" onClick={addItem}>
                <FilePlus2 className="h-4 w-4" />Add first item
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {draft.items.map((item, index) => (
              <div key={item.id} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">Item {index + 1}</span>
                  {draft.items.length > 1 && (
                    <button
                      type="button"
                      aria-label={`Remove item ${index + 1}`}
                      onClick={() => removeItem(item.id)}
                      className="rounded-md p-1.5 text-[#94a3b8] hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-12">
                  <div className="sm:col-span-6">
                    <label htmlFor={`item-name-${item.id}`} className="text-[11px] font-semibold text-[#52627a]">
                      Item or product
                    </label>
                    <input
                      id={`item-name-${item.id}`}
                      value={item.itemName}
                      aria-invalid={Boolean(validationErrors[`itemName-${item.id}`])}
                      onChange={(event) => updateItem(item.id, { itemName: event.target.value })}
                      placeholder="e.g. Branded notebooks"
                      className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
                        validationErrors[`itemName-${item.id}`]
                          ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                          : 'border-[#e2e8f0] bg-white focus:border-[#0b8f55]'
                      }`}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor={`item-quantity-${item.id}`} className="text-[11px] font-semibold text-[#52627a]">
                      Quantity
                    </label>
                    <div
                      className={`mt-1.5 flex items-center rounded-lg border bg-white ${
                        validationErrors[`itemQuantity-${item.id}`] ? 'border-red-500' : 'border-[#e2e8f0]'
                      }`}
                    >
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                        className="p-2 text-[#64748b] hover:bg-[#f1f5f9]"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <input
                        id={`item-quantity-${item.id}`}
                        type="number"
                        min={1}
                        value={item.quantity}
                        aria-invalid={Boolean(validationErrors[`itemQuantity-${item.id}`])}
                        onChange={(event) =>
                          updateItem(item.id, { quantity: Math.max(1, parseInt(event.target.value, 10) || 1) })
                        }
                        className="min-w-0 flex-1 border-0 px-1 py-2 text-center text-sm focus:outline-none"
                      />
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                        className="p-2 text-[#64748b] hover:bg-[#f1f5f9]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor={`item-unit-${item.id}`} className="text-[11px] font-semibold text-[#52627a]">
                      Unit
                    </label>
                    <input
                      id={`item-unit-${item.id}`}
                      value={item.unit}
                      aria-invalid={Boolean(validationErrors[`itemUnit-${item.id}`])}
                      onChange={(event) => updateItem(item.id, { unit: event.target.value })}
                      placeholder="Units"
                      className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
                        validationErrors[`itemUnit-${item.id}`]
                          ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                          : 'border-[#e2e8f0] bg-white focus:border-[#0b8f55]'
                      }`}
                    />
                  </div>
                  <div className="sm:col-span-12">
                    <label htmlFor={`item-spec-${item.id}`} className="text-[11px] font-semibold text-[#52627a]">
                      Specification or additional requirement
                    </label>
                    <input
                      id={`item-spec-${item.id}`}
                      value={item.specificRequirements}
                      onChange={(event) => updateItem(item.id, { specificRequirements: event.target.value })}
                      placeholder="Brand, grade, dimensions, colour or certification"
                      className="mt-1.5 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-sm focus:border-[#0b8f55] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function DeliveryStep({
  draft,
  validationErrors,
  updateDraft,
}: {
  draft: Draft;
  validationErrors: Record<string, boolean>;
  updateDraft: (changes: Partial<Draft>) => void;
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">Delivery</h2>
          <p className="mt-1 text-sm text-[#64748b]">Tell us when and where your team needs this request fulfilled.</p>
        </div>
        <Package className="h-6 w-6 text-[#173962]" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="delivery-date" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#334155]">
            <CalendarDays className="h-4 w-4 text-[#0b8f55]" />Preferred delivery date
          </label>
          <input
            id="delivery-date"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={draft.targetDate}
            aria-invalid={Boolean(validationErrors['targetDate'])}
            onChange={(event) => updateDraft({ targetDate: event.target.value })}
            className={`mt-2 w-full rounded-lg border px-4 py-3 text-sm focus:outline-none ${
              validationErrors['targetDate']
                ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                : 'border-[#e2e8f0] bg-[#f8fafc] focus:border-[#0b8f55]'
            }`}
          />
        </div>
        <div>
          <label htmlFor="delivery-location" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#334155]">
            <MapPin className="h-4 w-4 text-[#0b8f55]" />Delivery location
          </label>
          <input
            id="delivery-location"
            value={draft.location}
            aria-invalid={Boolean(validationErrors['location'])}
            onChange={(event) => updateDraft({ location: event.target.value })}
            placeholder="Office address or site location"
            className={`mt-2 w-full rounded-lg border px-4 py-3 text-sm focus:outline-none ${
              validationErrors['location']
                ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                : 'border-[#e2e8f0] bg-[#f8fafc] focus:border-[#0b8f55]'
            }`}
          />
        </div>
      </div>
      <div>
        <label htmlFor="delivery-instructions" className="text-xs font-bold uppercase tracking-wide text-[#334155]">
          Special delivery instructions
        </label>
        <textarea
          id="delivery-instructions"
          rows={4}
          value={draft.deliveryInstructions}
          onChange={(event) => updateDraft({ deliveryInstructions: event.target.value })}
          placeholder="Access instructions, receiving hours, contact at site, or other details"
          className="mt-2 w-full rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3 text-sm focus:border-[#0b8f55] focus:outline-none"
        />
      </div>
    </section>
  );
}

function ReviewStep({ draft, userProfile, setStep }: { draft: Draft; userProfile: { companyName: string; email: string }; setStep: (step: number) => void }) {
  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">Review request</h2>
          <p className="mt-1 text-sm text-[#64748b]">Check every detail before sending this request to Lankot.</p>
        </div>
        <CheckCircle2 className="h-6 w-6 text-[#0b8f55]" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">Request information</p>
          <p className="mt-2 font-bold text-[#0f172a]">{draft.title}</p>
          <p className="mt-1 text-xs text-[#64748b]">{userProfile.companyName} · {userProfile.email}</p>
          <button type="button" onClick={() => setStep(0)} className="mt-4 text-xs font-bold text-[#087443] hover:underline">Edit request details</button>
        </div>
        <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">Delivery information</p>
          <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#0f172a]">
            <CalendarDays className="h-4 w-4 text-[#0b8f55]" />{draft.targetDate}
          </p>
          <p className="mt-2 flex items-start gap-2 text-sm text-[#52627a]">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0b8f55]" />{draft.location}
          </p>
          <button type="button" onClick={() => setStep(1)} className="mt-4 text-xs font-bold text-[#087443] hover:underline">Edit delivery</button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-[#e2e8f0]">
        <div className="border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">Requested items ({draft.items.length})</p>
        </div>
        <div className="divide-y divide-[#e2e8f0]">
          {draft.items.map((item) => (
            <div key={item.id} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-[#0f172a]">{item.itemName}</p>
                <p className="mt-0.5 text-xs text-[#64748b]">{item.specificRequirements || 'No additional specification'}</p>
              </div>
              <p className="whitespace-nowrap text-sm font-semibold text-[#173962]">{item.quantity} {item.unit}</p>
            </div>
          ))}
        </div>
      </div>
      {draft.deliveryInstructions && (
        <p className="rounded-lg border border-[#bdebd2] bg-[#edf9f2] px-4 py-3 text-xs leading-relaxed text-[#087443]">
          <strong>Delivery instructions:</strong> {draft.deliveryInstructions}
        </p>
      )}
    </section>
  );
}

function SuccessState({ request }: { request: SupplyRequest }) {
  return (
    <Card className="mx-auto max-w-2xl p-6 text-center sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf9f2] text-[#087443]">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <p className="mt-6 text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Request submitted</p>
      <h2 className="mt-2 text-2xl font-extrabold text-[#0f172a]">Your request is with the Lankot team</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748b]">We will review your requirements and prepare a quote for your approval.</p>
      <div className="mx-auto mt-6 max-w-sm rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 text-left text-sm">
        <p className="flex justify-between gap-4"><span className="text-[#64748b]">Request ID</span><strong className="font-mono text-[#173962]">{request.requestNumber}</strong></p>
        <p className="mt-3 flex justify-between gap-4"><span className="text-[#64748b]">Submitted</span><strong className="text-[#0f172a]">{request.createdAt}</strong></p>
        <p className="mt-3 flex justify-between gap-4"><span className="text-[#64748b]">Next step</span><strong className="text-right text-[#0f172a]">Admin review and quote</strong></p>
      </div>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href={`/dashboard?submitted=${encodeURIComponent(request.requestNumber)}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#173962] px-5 text-sm font-bold text-white hover:bg-[#102a4c]">
          View request <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/dashboard" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#e2e8f0] px-5 text-sm font-semibold text-[#173962] hover:bg-[#f8fafc]">
          Return to dashboard
        </Link>
      </div>
    </Card>
  );
}

