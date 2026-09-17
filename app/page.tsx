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
            <span>Next-Gen Business Standee & Dynamic QR SaaS</span>
          </div>

          {/* Headline */}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Print Beautiful Standees.{' '}
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Change Destinations Anytime.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            Create ultra-high-resolution, print-ready acrylic counter standees and table tents in seconds. Powered by dynamic redirect URLs and real-time scan analytics.
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
              Live Dashboard Demo
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
              <span>Supabase Database Ready</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Vercel 1-Click Deploy</span>
            </div>
          </div>
        </div>

        {/* Interactive Standee Preview Card Mockup */}
        <div className="relative mx-auto mt-16 max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-8 backdrop-blur-xl shadow-2xl shadow-blue-950/40">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left: Mini Standee Visual */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="w-64 rounded-xl border-4 border-slate-700 bg-white p-6 text-center text-slate-900 shadow-2xl">
                <div className="mx-auto h-2 w-12 rounded-full bg-blue-600 mb-4" />
                <h3 className="text-xl font-black">The Gourmet Bistro</h3>
                <p className="text-xs text-slate-500 mt-1">Scan to Explore Our Menu</p>
                <div className="my-4 mx-auto flex h-36 w-36 items-center justify-center rounded-lg border-2 border-slate-200 bg-slate-50 p-2 shadow-inner">
                  <QrCode className="h-28 w-28 text-slate-900" />
                </div>
                <div className="rounded-full bg-blue-600 py-1.5 px-3 text-[11px] font-extrabold text-white">
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
                When you switch from your summer menu to winter specials, or update your payment QR / Google review link, you don't throw away your physical hardware. Just change the destination in your dashboard in 3 seconds.
              </p>
              <div className="space-y-2 pt-2 text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  <span>Real-time scan counter and device telemetry</span>
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

      {/* 2. TEMPLATES SHOWCASE */}
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

      {/* 3. HOW IT WORKS */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              From Concept to Counter in 4 Steps
            </h2>
            <p className="mt-3 text-slate-400 text-sm">
              The modern streamlined workflow built for local commerce.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 text-lg font-black border border-blue-500/20">
                1
              </div>
              <h3 className="mt-4 text-base font-bold text-white">Pick Size & Action</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Choose A4, A5, acrylic table tent, or promo board. Set UPI, Menu, Review, or Website.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400 text-lg font-black border border-indigo-500/20">
                2
              </div>
              <h3 className="mt-4 text-base font-bold text-white">Add Brand Logo</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Embed your company logo in the center of the QR with automatic 30% error-correction recovery.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/10 text-purple-400 text-lg font-black border border-purple-500/20">
                3
              </div>
              <h3 className="mt-4 text-base font-bold text-white">Export 300 DPI</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Download print-ready PNG, vector SVG, or hit Print for instant printer calibration.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-400 text-lg font-black border border-emerald-500/20">
                4
              </div>
              <h3 className="mt-4 text-base font-bold text-white">Dynamic Control</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Change your QR target destination in your dashboard without touching the printed standee.
              </p>
            </div>
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
              Start in Studio right now. Works 100% locally during testing, and syncs automatically with Vercel and Supabase in production.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/studio"
                className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-base font-extrabold text-blue-900 shadow-lg hover:bg-blue-50 transition-colors"
              >
                Open Standee Studio
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-base font-bold text-white hover:bg-white/20 transition-colors"
              >
                View Analytics Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
