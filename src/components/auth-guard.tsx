'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';

const protectedPaths = ['/dashboard', '/orders', '/rfq', '/saved-lists'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, authReady } = useApp();
  const requiresAuth = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  useEffect(() => {
    if (authReady && requiresAuth && !isAuthenticated) router.replace('/login');
  }, [authReady, isAuthenticated, requiresAuth, router]);

  if (requiresAuth && (!authReady || !isAuthenticated)) return null;
  return children;
}
