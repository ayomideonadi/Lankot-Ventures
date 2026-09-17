import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { AlertCircle, LoaderCircle, RefreshCw, SearchX } from 'lucide-react';

type ButtonTone = 'primary' | 'secondary' | 'success' | 'quiet' | 'danger';

const buttonTones: Record<ButtonTone, string> = {
  primary: 'bg-[#173962] text-white shadow-sm hover:bg-[#102a4c] focus-visible:ring-2 focus-visible:ring-[#173962]/30',
  secondary: 'border border-[#e2e8f0] bg-white text-[#1e293b] shadow-sm hover:bg-[#f8fafc] focus-visible:ring-2 focus-visible:ring-[#173962]/20',
  success: 'bg-[#0b8f55] text-white shadow-sm hover:bg-[#087443] focus-visible:ring-2 focus-visible:ring-[#0b8f55]/30',
  quiet: 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]',
  danger: 'border border-red-200 bg-white text-red-700 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500/20',
};

export function Button({
  tone = 'primary',
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: ButtonTone }) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-55 active:scale-[0.99] ${buttonTones[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-xl border border-[#e2e8f0] bg-white shadow-sm transition-shadow ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Badge({ tone = 'neutral', children }: { tone?: 'neutral' | 'success' | 'warning' | 'info' | 'danger'; children: ReactNode }) {
  const tones = {
    neutral: 'border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]',
    success: 'border-[#bdebd2] bg-[#edf9f2] text-[#087443]',
    warning: 'border-[#fef3c7] bg-[#fffbe6] text-[#b45309]',
    info: 'border-[#cbd5e1] bg-[#f1f5f9] text-[#1e293b]',
    danger: 'border-red-200 bg-red-50 text-red-700',
  };

  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1f5f9] text-[#94a3b8]">
        <SearchX className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-bold text-[#0f172a]">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-[#64748b]">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm font-medium text-[#64748b]" role="status">
      <LoaderCircle className="h-5 w-5 animate-spin text-[#0b8f55]" />
      <span>{label}</span>
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-[#e2e8f0] ${className}`} />;
}

export function SkeletonRows({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading content">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-4 rounded-xl border border-[#e2e8f0] bg-white p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ title = 'We could not load this section', description, onRetry }: { title?: string; description: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/70 px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="mt-3 text-sm font-bold text-red-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-red-800">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-800"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  );
}