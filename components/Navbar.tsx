'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import {
  QrCode,
  LayoutDashboard,
  Sparkles,
  Layers,
  ArrowRight,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Building2,
  ShieldCheck,
  PlusCircle,
  Utensils,
  Tag,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut, isLoading } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/studio', label: 'Standee Studio', icon: Sparkles },
    { href: '/dashboard/menu', label: 'Digital Menu', icon: Utensils },
    { href: '/bulk', label: 'Bulk Tables', icon: Layers },
    { href: '/pricing', label: 'Pricing', icon: Tag },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    router.push('/');
  };

  const businessName = profile?.business_name || user?.user_metadata?.business_name || 'My Business';
  const userInitial = (businessName?.[0] || user?.email?.[0] || 'B').toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl no-print">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo & Spotnet Attribution */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <QrCode className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">
                QR<span className="text-blue-500">Standee</span>
              </span>
              <span className="hidden rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400 sm:inline-block">
                360° PRO
              </span>
            </div>
            <div className="text-[10px] font-semibold text-slate-400 tracking-wide">
              by <span className="text-slate-300 font-bold">Spotnet Services</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs lg:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action / Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoading && user ? (
            /* Logged In Business Avatar & Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 rounded-2xl border border-slate-700/80 bg-slate-900/90 px-3 py-1.5 text-left text-sm text-white hover:border-slate-600 transition-all shadow-sm"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-black text-white">
                  {userInitial}
                </div>
                <div className="max-w-[120px] truncate">
                  <div className="truncate text-xs font-bold leading-tight text-white">{businessName}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                    {profile?.plan ? `${profile.plan} Plan` : 'Pro Active'}
                  </div>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="border-b border-slate-800 px-3 py-2.5">
                    <p className="text-xs font-bold text-white truncate">{businessName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      <ShieldCheck className="h-3 w-3" />
                      Spotnet Cloud Active
                    </div>
                  </div>

                  <div className="py-1 space-y-0.5 text-xs">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-slate-200 hover:bg-slate-800 hover:text-white"
                    >
                      <LayoutDashboard className="h-4 w-4 text-blue-400" />
                      Business Dashboard
                    </Link>
                    <Link
                      href="/dashboard/menu"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-slate-200 hover:bg-slate-800 hover:text-white"
                    >
                      <Utensils className="h-4 w-4 text-orange-400" />
                      Digital Menu Studio
                    </Link>
                    <Link
                      href="/studio"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-slate-200 hover:bg-slate-800 hover:text-white"
                    >
                      <Sparkles className="h-4 w-4 text-indigo-400" />
                      Design Standee
                    </Link>
                    <Link
                      href="/bulk"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-slate-200 hover:bg-slate-800 hover:text-white"
                    >
                      <Layers className="h-4 w-4 text-purple-400" />
                      Bulk Multi-Table Tent
                    </Link>
                  </div>

                  <div className="border-t border-slate-800 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out CTAs */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/login?tab=signup"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-2 text-xs sm:text-sm font-black text-white shadow-lg shadow-blue-600/25 hover:brightness-110 transition-all duration-200"
              >
                Register Free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* Quick Create CTA */}
          <Link
            href="/studio"
            className="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-600/10 px-3.5 py-2 text-xs sm:text-sm font-bold text-blue-400 hover:bg-blue-600/20 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden lg:inline">Create</span> Standee
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 md:hidden hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 md:hidden">
          {/* User Info if logged in */}
          {user && (
            <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-black text-white">
                  {userInitial}
                </div>
                <div className="truncate">
                  <div className="text-sm font-bold text-white truncate">{businessName}</div>
                  <div className="text-xs text-slate-400 truncate">{user.email}</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 text-blue-400" />
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <Link
                href="/studio"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-600/30"
              >
                Design New Standee
                <ArrowRight className="h-4 w-4" />
              </Link>

              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2 text-center text-sm font-bold text-rose-400"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl border border-slate-700 bg-slate-900 py-2 text-center text-sm font-bold text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login?tab=signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl bg-blue-600 py-2 text-center text-sm font-bold text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
