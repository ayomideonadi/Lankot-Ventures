'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../context/app-context';
import { useEffect, useRef, useState } from 'react';
import { Bell, Bookmark, ChevronDown, FileCheck2, LayoutDashboard, Menu, ShoppingCart, UserRound, X } from 'lucide-react';

const publicLinks = [
  { label: 'About', href: '/about' },
  { label: 'How It Works', href: '/about#how-it-works' },
  { label: 'Contact', href: '/contact' },
];

const clientLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Requests', href: '/rfq', icon: FileCheck2 },
  { label: 'Saved Templates', href: '/saved-lists', icon: Bookmark },
  { label: 'Orders', href: '/orders', icon: ShoppingCart },
  { label: 'Support', href: '/contact', icon: UserRound },
  { label: 'Settings', href: '/settings', icon: UserRound },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, isAuthenticated, signOut, notifications, markNotificationRead, orders, rfqs } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((notification) => !notification.read_at);
  const activeOrders = orders.filter((order) => order.status !== 'delivered').length;
  const pendingQuotes = rfqs.filter((request) => request.status === 'pending').length;

  const authenticatedLinks =
    userRole === 'admin'
      ? [
          { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
          { label: 'Quotes & RFQs', href: '/admin/quotes', icon: FileCheck2 },
          { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
          { label: 'Clients', href: '/admin/clients', icon: UserRound },
        ]
      : clientLinks;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        setUserMenuOpen(false);
        setNotificationsOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (href: string) => {
    const path = href.split('#')[0];
    return pathname === path || (path !== '/' && pathname.startsWith(`${path}/`));
  };

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
      router.replace('/login');
    } finally {
      setSigningOut(false);
    }
  };

  const renderPublicLinks = (mobile = false) =>
    publicLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => setMobileOpen(false)}
        className={
          mobile
            ? 'block rounded-lg px-3 py-3 text-sm font-semibold text-[#52627a] hover:bg-[#f6f8fb]'
            : `rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? 'bg-[#eef4fb] text-[#173962]'
                  : 'text-[#52627a] hover:bg-[#f6f8fb] hover:text-[#173962]'
              }`
        }
      >
        {link.label}
      </Link>
    ));

  const renderAuthenticatedLinks = (mobile = false) =>
    authenticatedLinks.map(({ label, href, icon: Icon }) => (
      <Link
        key={href + label}
        href={href}
        onClick={() => setMobileOpen(false)}
        className={
          mobile
            ? 'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-[#52627a] hover:bg-[#f6f8fb]'
            : `relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                isActive(href)
                  ? 'bg-[#eef4fb] text-[#173962]'
                  : 'text-[#52627a] hover:bg-[#f6f8fb] hover:text-[#173962]'
              }`
        }
      >
        {Icon && <Icon className="h-4 w-4" />}
        {label}
        {label === 'Quotes & RFQs' && pendingQuotes > 0 && (
          <span className="rounded-full bg-[#edf9f2] px-1.5 py-0.5 text-[10px] font-bold text-[#087443]">
            {pendingQuotes}
          </span>
        )}
        {label === 'Orders' && activeOrders > 0 && userRole === 'buyer' && (
          <span className="rounded-full bg-[#eef4fb] px-1.5 py-0.5 text-[10px] font-bold text-[#173962]">
            {activeOrders}
          </span>
        )}
      </Link>
    ));

  return (
    <header className="sticky top-0 z-40 border-b border-[#dfe6ee] bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="Lankot Ventures home">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#102a4c] text-xl font-bold text-white shadow-sm transition-transform group-hover:-translate-y-0.5">
            L
          </span>
          <span>
            <span className="block text-[17px] font-extrabold tracking-tight text-[#172033]">
              LANKOT <span className="text-[#087443]">VENTURES</span>
            </span>
            <span className="-mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">
              B2B Supply Platform
            </span>
          </span>
        </Link>
        {!isAuthenticated && (
          <nav aria-label="Public navigation" className="hidden items-center gap-1 lg:flex">
            {renderPublicLinks()}
          </nav>
        )}
        {isAuthenticated && (
          <nav aria-label="Authenticated navigation" className="hidden items-center gap-1 lg:flex">
            {renderAuthenticatedLinks()}
          </nav>
        )}
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                aria-label={`Notifications, ${unread.length} unread`}
                aria-expanded={notificationsOpen}
                onClick={() => {
                  setNotificationsOpen((open) => !open);
                  setUserMenuOpen(false);
                }}
                className="relative rounded-lg p-2.5 text-[#52627a] hover:bg-[#f6f8fb] hover:text-[#173962]"
              >
                <Bell className="h-5 w-5" />
                {unread.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0b8f55] px-1 text-[9px] font-bold text-white">
                    {unread.length > 9 ? '9+' : unread.length}
                  </span>
                )}
              </button>
              {notificationsOpen && (
                <div
                  role="region"
                  aria-label="Notifications"
                  className="absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-[#dfe6ee] bg-white p-3 shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-[#edf0f4] px-2 pb-2">
                    <strong className="text-sm text-[#172033]">Notifications</strong>
                    <span className="text-[11px] text-[#64748b]">{unread.length} unread</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-2 py-5 text-center text-sm text-[#52627a]">You&apos;re all caught up.</p>
                    ) : (
                      notifications.slice(0, 8).map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() => markNotificationRead(notification.id)}
                          className={`w-full border-b border-[#edf0f4] px-2 py-3 text-left ${
                            notification.read_at ? 'opacity-60' : ''
                          }`}
                        >
                          <span className="block text-xs font-bold text-[#172033]">{notification.title}</span>
                          <span className="mt-0.5 block text-[11px] text-[#64748b]">{notification.message}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-[#52627a] hover:bg-[#f6f8fb] hover:text-[#173962] sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="hidden min-h-10 items-center rounded-lg bg-[#0b8f55] px-4 text-sm font-bold text-white hover:bg-[#087443] sm:inline-flex"
              >
                Get started
              </Link>
            </>
          ) : (
            <div className="relative hidden sm:block" ref={userMenuRef}>
              <button
                type="button"
                aria-label="Open company menu"
                aria-expanded={userMenuOpen}
                onClick={() => {
                  setUserMenuOpen((open) => !open);
                  setNotificationsOpen(false);
                }}
                className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-[#f6f8fb]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173962] text-sm font-bold text-white">
                  L
                </span>
                <span className="hidden max-w-28 truncate text-xs font-bold text-[#172033] md:block">
                  {userRole === 'admin' ? 'Lankot HQ' : 'Company account'}
                </span>
                <ChevronDown className="h-4 w-4 text-[#64748b]" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-[#dfe6ee] bg-white p-2 shadow-xl">
                  <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">Account</p>
                  <Link
                    href="/settings#company-profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#52627a] hover:bg-[#f6f8fb]"
                  >
                    Company profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#52627a] hover:bg-[#f6f8fb]"
                  >
                    Account settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleSignOut()}
                    disabled={signingOut}
                    className="mt-1 w-full border-t border-[#edf0f4] px-3 py-3 text-left text-sm font-semibold text-red-700 hover:bg-red-50"
                  >
                    {signingOut ? 'Signing out...' : 'Sign out'}
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-lg p-2.5 text-[#52627a] hover:bg-[#f6f8fb] lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="border-t border-[#edf0f4] bg-white px-4 pb-5 pt-3 shadow-lg lg:hidden"
        >
          <nav aria-label="Mobile navigation" className="space-y-1">
            {!isAuthenticated && renderPublicLinks(true)}
            {isAuthenticated && renderAuthenticatedLinks(true)}
            {!isAuthenticated ? (
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#edf0f4] pt-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-[#dfe6ee] px-3 py-3 text-center text-sm font-bold text-[#173962]"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-[#0b8f55] px-3 py-3 text-center text-sm font-bold text-white"
                >
                  Get started
                </Link>
              </div>
            ) : (
              <div className="mt-2 border-t border-[#edf0f4] pt-2">
                <Link
                  href="/settings#company-profile"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-3 text-sm font-semibold text-[#52627a] hover:bg-[#f6f8fb]"
                >
                  Company profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-3 text-sm font-semibold text-[#52627a] hover:bg-[#f6f8fb]"
                >
                  Account settings
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    void handleSignOut();
                  }}
                  className="w-full rounded-lg px-3 py-3 text-left text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  {signingOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

