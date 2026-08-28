'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../context/app-context';
import { 
  FileText, 
  ShoppingBag, 
  LayoutDashboard, 
  Menu, 
  X,
  Bell
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, isAuthenticated, signOut, rfqCart, rfqs, orders, notifications, markNotificationRead } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const cartItemCount = rfqCart.reduce((sum, item) => sum + item.quantity, 0);
  const pendingRfqsCount = rfqs.filter(r => r.status === 'pending').length;
  const activeOrdersCount = orders.filter(o => o.status !== 'delivered').length;
  const unreadNotifications = notifications.filter((notification) => !notification.read_at);

  const isActive = (path: string) => pathname === path;

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

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              L
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                LANKOT <span className="text-blue-600">VENTURES</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase block -mt-1">
                B2B Supply Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            <Link
              href="/about"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/about') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Why Lankot
            </Link>

            {userRole === 'buyer' && (
              <>
                <Link
                  href="/dashboard"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-600" />
                  Client Portal
                </Link>

                <Link
                  href="/orders"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/orders') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Orders
                  {activeOrdersCount > 0 && (
                    <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full font-bold">
                      {activeOrdersCount}
                    </span>
                  )}
                </Link>

              </>
            )}

            {userRole === 'admin' && (
              <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200 ml-2">
                <span className="text-[11px] font-bold text-amber-800 uppercase px-2">Admin:</span>
                <Link
                  href="/admin/quotes"
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold relative ${
                    isActive('/admin/quotes') ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-700 hover:bg-amber-100'
                  }`}
                >
                  Quote Inbox
                  {pendingRfqsCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                      {pendingRfqsCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/admin/orders"
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                    isActive('/admin/orders') ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-700 hover:bg-amber-100'
                  }`}
                >
                  Orders
                </Link>
              </div>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <div className="relative">
                <button
                  type="button"
                  aria-label="View notifications"
                  title="View notifications"
                  onClick={() => setNotificationsOpen((open) => !open)}
                  className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-11 z-50 w-80 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-xl p-3">
                    <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
                      <span className="font-bold text-sm text-slate-900">Notifications</span>
                      <span className="text-[11px] text-slate-500">{unreadNotifications.length} unread</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <p className="px-2 py-5 text-xs text-slate-500">No notifications yet.</p>
                      ) : notifications.slice(0, 8).map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() => markNotificationRead(notification.id)}
                          className={`w-full text-left px-2 py-3 ${notification.read_at ? 'opacity-60' : ''}`}
                        >
                          <span className="block text-xs font-bold text-slate-900">{notification.title}</span>
                          <span className="block text-[11px] text-slate-600 mt-0.5">{notification.message}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => void handleSignOut()}
                disabled={signingOut}
                className="hidden sm:inline-flex rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                {signingOut ? 'Signing out...' : 'Sign out'}
              </button>
            ) : (
              <Link href="/login" className="hidden sm:inline-flex rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                Sign in
              </Link>
            )}
            {userRole === 'buyer' && (
              <Link
                href="/rfq"
                className="relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Request Quote</span>
                {cartItemCount > 0 && (
                  <span className="bg-amber-400 text-slate-900 font-extrabold text-xs px-2 py-0.5 rounded-full animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
          >
            Why Lankot
          </Link>
          {userRole === 'buyer' && (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-blue-600 hover:bg-blue-50"
              >
                Client Dashboard
              </Link>
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
              >
                Order History
              </Link>
            </>
          )}
          {userRole === 'admin' && (
            <div className="pt-2 border-t border-slate-100 mt-2 space-y-1">
              <span className="text-xs font-bold text-amber-700 uppercase px-3">Admin Portal</span>
              <Link
                href="/admin/quotes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-amber-50"
              >
                Review Quotes ({pendingRfqsCount})
              </Link>
              <Link
                href="/admin/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-amber-50"
              >
                Order Queue
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
