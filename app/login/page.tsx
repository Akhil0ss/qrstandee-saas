'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import {
  QrCode,
  Sparkles,
  Lock,
  Mail,
  Building2,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signInWithPassword, signUp, signInWithMagicLink, isLoading } = useAuth();

  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const [authMethod, setAuthMethod] = useState<'password' | 'magic-link'>('password');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirectUrl);
    }
  }, [user, isLoading, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSubmitting(true);

    if (activeTab === 'login') {
      if (authMethod === 'magic-link') {
        const { error } = await signInWithMagicLink(email);
        if (error) {
          setErrorMessage(error);
        } else {
          setSuccessMessage('Magic sign-in link sent! Please check your email inbox.');
        }
      } else {
        const { error } = await signInWithPassword(email, password);
        if (error) {
          setErrorMessage(error);
        } else {
          router.push(redirectUrl);
        }
      }
    } else {
      // Signup
      if (!businessName.trim()) {
        setErrorMessage('Please enter your Business or Brand name.');
        setSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        setSubmitting(false);
        return;
      }

      const { error, confirmationRequired } = await signUp(email, password, {
        business_name: businessName,
        full_name: fullName,
      });

      if (error) {
        setErrorMessage(error);
      } else if (confirmationRequired) {
        setSuccessMessage('Account created! Please check your email to confirm your account, then sign in.');
        setActiveTab('login');
      } else {
        router.push(redirectUrl);
      }
    }

    setSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Brand & Heading */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              <QrCode className="h-6 w-6 text-white" />
            </div>
          </Link>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Your Business Tenant'}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {activeTab === 'login'
              ? 'Access your isolated dynamic QR standees, feedback, and scan telemetry'
              : 'Launch your 360° QR Standee studio with isolated tenant storage'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {/* Tab Switcher */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-950/80 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`rounded-lg py-2 text-sm font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setAuthMethod('password');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`rounded-lg py-2 text-sm font-bold transition-all ${
                activeTab === 'signup'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Status Alerts */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-sm text-rose-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-400">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Business Name (Only in Signup) */}
            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Business / Brand Name <span className="text-blue-400">*</span>
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. The Brew Corner, Urban Cafe, Apex Clinic"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Full Name (Optional in Signup) */}
            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Owner / Manager Name <span className="text-slate-500">(Optional)</span>
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Business Email Address <span className="text-blue-400">*</span>
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password (if not magic link) */}
            {(activeTab === 'signup' || authMethod === 'password') && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Password <span className="text-blue-400">*</span>
                  </label>
                </div>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : activeTab === 'login' ? (
                authMethod === 'magic-link' ? (
                  <>
                    <Mail className="h-4 w-4" />
                    <span>Send Magic Link</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )
              ) : (
                <>
                  <span>Create Tenant Account</span>
                  <Sparkles className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Alternative Auth Mode in Login (Password vs Magic Link) */}
          {activeTab === 'login' && (
            <div className="mt-5 border-t border-slate-800/80 pt-4 text-center">
              {authMethod === 'password' ? (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('magic-link');
                    setErrorMessage(null);
                  }}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  ⚡ Prefer passwordless? Sign in with Magic Link
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('password');
                    setErrorMessage(null);
                  }}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  🔑 Return to Password Sign In
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tenant Isolation Guarantee Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-blue-400" />
          <span>Enterprise Row-Level Security & Tenant Data Isolation Active</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
