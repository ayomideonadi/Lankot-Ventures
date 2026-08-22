'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, userRole } = useApp();

  useEffect(() => {
    if (!isAuthenticated || userRole !== 'admin') router.replace('/login');
  }, [isAuthenticated, router, userRole]);

  if (!isAuthenticated || userRole !== 'admin') return null;
  return children;
}
