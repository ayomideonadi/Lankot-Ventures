'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { Building2, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent, role: 'buyer' | 'admin') => {
    e.preventDefault();
    const result = await signIn(email, password, role);
    if (!result.success) {
      setError(result.error || 'Unable to sign in.');
      return;
    }
    router.push(role === 'buyer' ? '/dashboard' : '/admin/quotes');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto shadow-md">
            L
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Sign In to Lankot B2B</h1>
          <p className="text-slate-500 text-xs">Enter your corporate credentials to access portal</p>
        </div>

        <form onSubmit={(e) => handleLogin(e, 'buyer')} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Corporate Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors text-sm"
          >
            Sign In as Corporate Buyer
          </button>

          {error && <p role="alert" className="text-xs font-medium text-red-600">{error}</p>}

          <button
            type="button"
            onClick={(e) => handleLogin(e, 'admin')}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-md transition-colors text-xs flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" /> Direct Sign In as Lankot Admin
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Need a corporate account?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            Register Company
          </Link>
        </div>
      </div>
    </div>
  );
}
