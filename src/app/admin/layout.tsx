'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, authReady, userRole } = useApp();

  useEffect(() => {
    if (authReady && (!isAuthenticated || userRole !== 'admin')) router.replace('/login');
  }, [authReady, isAuthenticated, router, userRole]);

  if (!authReady || !isAuthenticated || userRole !== 'admin') return null;
  return children;
}
