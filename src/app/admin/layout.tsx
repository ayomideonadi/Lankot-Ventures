'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/app-context';
import Link from 'next/link';
import { BarChart3, ClipboardList, LifeBuoy, PackageCheck, Settings, ShieldCheck, ShoppingCart, Users, ArrowLeft } from 'lucide-react';

const adminNavigation = [
  { label: 'Dashboard', href: '/admin', icon: BarChart3 },
  { label: 'Quotes & RFQs', href: '/admin/quotes', icon: ClipboardList },
  { label: 'Orders & Fulfilment', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Clients', href: '/admin/clients', icon: Users },
  { label: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, authReady, userRole } = useApp();
  const adminRouteState = `${pathname}|${authReady}|${isAuthenticated}|${userRole}`;

  useEffect(() => {
    const [route, ready, authenticated, role] = adminRouteState.split('|');
    if (route !== '/admin/login' && ready === 'true' && (authenticated !== 'true' || role !== 'admin')) {
      router.replace('/admin/login');
    }
  });

  if (pathname === '/admin/login') return children;
  if (!authReady || !isAuthenticated || userRole !== 'admin') return null;

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#f8fafc]">
      <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-[1600px]">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-[#e2e8f0] bg-white lg:flex">
          <div className="border-b border-[#e2e8f0] px-6 py-5">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0b8f55]">
              <ShieldCheck className="h-4 w-4 text-[#0b8f55]" />
              Lankot HQ Operations
            </p>
            <p className="mt-1 text-sm font-extrabold text-[#0f172a]">Commercial Admin</p>
          </div>

          <nav aria-label="Admin navigation" className="flex-1 space-y-1 p-4">
            {adminNavigation.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-[#173962] text-white'
                      : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-[#8ee0b2]' : 'text-[#64748b]'}`} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[#e2e8f0] p-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-semibold text-[#64748b] transition-colors hover:text-[#173962]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to public platform
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

