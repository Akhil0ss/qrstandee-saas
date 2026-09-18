import React from 'react';
import Link from 'next/link';
import {
  QrCode,
  Sparkles,
  Printer,
  Smartphone,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  Layers,
  Palette,
  ExternalLink,
  Clock,
  Lock,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { TEMPLATES } from '@/lib/standee-templates';

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative px-4 pt-16 pb-24 sm:px-6 lg:px-8 lg:pt-24 lg:pb-32">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-md shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Next-Gen Multi-Tenant Standee & Dynamic QR SaaS</span>
          </div>

          {/* Headline */}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Print Beautiful Standees.{' '}
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Change Destinations Anytime.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            Create ultra-high-resolution, print-ready acrylic counter standees, table tents, and review shields in seconds. Powered by isolated multi-tenant vaults, dynamic redirect URLs, and real-time scan telemetry.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/studio"
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              Launch Standee Studio
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/dashboard"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/90 px-6 py-3.5 text-base font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
            >
              <BarChart3 className="h-5 w-5 text-blue-400" />
              Tenant Dashboard
            </Link>
          </div>

          {/* Feature Micro-Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>300 DPI Print Export</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Zero-Reprint Dynamic URLs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Multi-Tenant RLS Isolated</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Bulk 50+ Table Generator</span>
            </div>
          </div>
        </div>

        {/* Interactive Standee Preview Card Mockup */}
        <div className="relative mx-auto mt-16 max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-8 backdrop-blur-xl shadow-2xl shadow-blue-950/40">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left: Mini Standee Visual */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="w-64 rounded-2xl border-4 border-slate-700 bg-white p-6 text-center text-slate-900 shadow-2xl">
                <div className="mx-auto h-2 w-12 rounded-full bg-blue-600 mb-4" />
                <h3 className="text-xl font-black">The Gourmet Bistro</h3>
                <p className="text-xs text-slate-500 mt-1">Scan to Explore Our Menu</p>
                <div className="my-4 mx-auto flex h-36 w-36 items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 p-2 shadow-inner">
                  <QrCode className="h-28 w-28 text-slate-900" />
                </div>
                <div className="rounded-full bg-blue-600 py-1.5 px-3 text-[11px] font-extrabold text-white shadow-md">
                  SCAN FOR DIGITAL MENU
                </div>
                <p className="mt-3 text-[10px] text-slate-400">table-12.bistro.app</p>
              </div>
            </div>

            {/* Right: Pitch Points */}
            <div className="w-full md:w-1/2 space-y-4 text-left">
              <div className="inline-block rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-400">
                Why Dynamic QR Standees Win
              </div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Never waste money reprinting damaged acrylic standees
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                When you switch from your summer menu to winter specials, or update your payment UPI ID / Google review link, you don't throw away your physical acrylic hardware. Just change the destination in your dashboard in 3 seconds.
              </p>
              <div className="space-y-2 pt-2 text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  <span>Real-time scan counter, peak hours, and device telemetry</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  <span>Calibrated for A4, A5, acrylic table tents, and 18x24" boards</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  <span>Clean SVG vectors ready for industrial flex & laser printers</span>
                </div>
              </div>
              <div className="pt-3">
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300"
                >
                  Try designing your first standee free <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 360° PRO FEATURE SUITE */}
      <section className="border-t border-slate-800/80 bg-slate-900/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <Zap className="h-3.5 w-3.5" /> 360° Enterprise Pro Upgrades
            </span>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
              Engineered to Outperform Every Ordinary QR Generator
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400 text-sm sm:text-base">
              Built specifically for modern restaurants, clinics, retail counters, and corporate salons.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: Smart Review Shield */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition-all duration-300 hover:border-blue-500/40 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Star className="h-6 w-6 fill-amber-400" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Smart Review Shield</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                4-5★ happy customers are redirected straight to your Google Maps review page with celebratory confetti. 1-3★ unhappy feedback is privately sent to your dashboard so you can fix issues before they go public.
              </p>
            </div>

            {/* Feature 2: Multi-Action Table Tent */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Multi-Action Concierge Card</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Transform any table tent into a 5-in-1 hospitality concierge: Food & drinks menu, 1-tap UPI instant payments, 1-click Wi-Fi password copy, Google review link, and manager call.
              </p>
            </div>

            {/* Feature 3: Bulk Table Generator */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition-all duration-300 hover:border-purple-500/40 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Printer className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Bulk 50+ Table Generator</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Generate 10 to 50 table standees in 1 single click. Each table gets its own unique dynamic tracking slug, ready for high-speed batch ZIP download.
              </p>
            </div>

            {/* Feature 4: Time-Based Smart Routing */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Time-Based Smart Routing</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Automatically show Lunch specials from 11 AM to 4 PM, and seamlessly switch to Dinner menu from 4 PM to 11 PM. Zero manual QR code editing needed.
              </p>
            </div>

            {/* Feature 5: Multi-Tenant Enterprise Isolation */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition-all duration-300 hover:border-blue-500/40 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Strict Multi-Tenant Isolation</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Hardened with PostgreSQL Row-Level Security (RLS). Every business tenant has a protected vault — no tenant can ever see, modify, or leak another business’s standees, scans, or private customer feedback.
              </p>
            </div>

            {/* Feature 6: Real-Time Analytics & Feedback Inbox */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition-all duration-300 hover:border-pink-500/40 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Live Telemetry & Feedback Inbox</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Track hourly peak traffic, mobile vs desktop breakdown, and total scan volume across all counters. Respond directly to private customer reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TEMPLATES SHOWCASE */}
      <section className="border-t border-slate-800/80 bg-slate-900/40 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Ready-To-Print Presets</span>
            <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Engineered for every commercial counter
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400 text-sm sm:text-base">
              Select a pre-tuned layout designed by hospitality and retail experts to achieve maximum scan conversions.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.slice(0, 6).map((tmpl) => (
              <div
                key={tmpl.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all duration-300 hover:border-slate-700 hover:shadow-xl hover:shadow-blue-950/30"
              >
                <div>
                  <div className={`inline-block rounded-lg bg-gradient-to-r ${tmpl.preview_bg} px-3 py-1 text-xs font-bold text-white shadow-md`}>
                    {tmpl.category}
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {tmpl.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                  <span className="text-xs font-medium text-slate-500">
                    {tmpl.badge_text || 'Print-Ready'}
                  </span>
                  <Link
                    href={`/studio?template=${tmpl.id}`}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
                  >
                    Use Template <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-8 sm:p-12 text-center shadow-2xl relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to create your high-converting standees?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-blue-100 text-sm sm:text-base">
              Start in Studio right now. Create your isolated business account for cloud sync, or design offline instantly.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/studio"
                className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-base font-extrabold text-blue-900 shadow-lg hover:bg-blue-50 transition-colors"
              >
                Open Standee Studio
              </Link>
              <Link
                href="/login?tab=signup"
                className="w-full sm:w-auto rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-base font-bold text-white hover:bg-white/20 transition-colors"
              >
                Create Business Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
