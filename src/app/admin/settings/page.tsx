import Link from 'next/link';
import { Card } from '@/components/ui';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 space-y-8">
      {/* Header */}
      <header className="border-b border-[#e2e8f0] pb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Lankot HQ Security</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0f172a] sm:text-3xl">
          System Administration & Role Access
        </h1>
        <p className="mt-1 text-sm text-[#64748b]">
          Security governance and administrative authentication configurations for Lankot Ventures.
        </p>
      </header>

      {/* Info Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#f0fdf4] p-2 text-[#0b8f55]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0f172a]">Authentication Infrastructure</h2>
            <p className="text-xs text-[#64748b]">Role authorization is backed by Supabase row-level policies.</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-[#334155] border-t border-[#e2e8f0] pt-4">
          All administrative operations and commercial contract actions are scoped to verified administrator roles. To switch accounts or verify security credentials, navigate back to the administrative portal login.
        </p>
        <div className="pt-2">
          <Link
            href="/admin/login"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 text-xs font-bold text-[#173962] transition-colors hover:bg-[#e2e8f0]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to Admin Login Portal
          </Link>
        </div>
      </Card>
    </div>
  );
}

