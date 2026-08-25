'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';

const clientPaths = ['/dashboard', '/orders', '/rfq', '/saved-lists'];
const adminPaths = ['/admin'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, authReady, userRole } = useApp();
  const isClientPath = clientPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isAdminPath = adminPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const requiresAuth = isClientPath || isAdminPath;
  const hasRouteAccess = isAuthenticated && (isClientPath ? userRole === 'buyer' : userRole === 'admin');

  useEffect(() => {
    if (!authReady || !requiresAuth) return;
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (isClientPath && userRole === 'admin') {
      router.replace('/admin/quotes');
    } else if (isAdminPath && userRole !== 'admin') {
      router.replace('/dashboard');
    }
  }, [authReady, isAuthenticated, isClientPath, isAdminPath, requiresAuth, router, userRole]);

  if (requiresAuth && (!authReady || !hasRouteAccess)) return null;
  return children;
}
