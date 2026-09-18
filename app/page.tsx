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
  Utensils,
  CreditCard,
  Wifi,
  PhoneCall,
  HeartHandshake,
} from 'lucide-react';
import { TEMPLATES } from '@/lib/standee-templates';

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-slate-950 text-white">
      {/* 1. HERO SECTION */}
      <section className="relative px-4 pt-16 pb-24 sm:px-6 lg:px-8 lg:pt-24 lg:pb-32">
        {/* Dynamic Vibrant Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-purple-600/20 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-orange-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Creator & Trust Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-400 backdrop-blur-md shadow-lg shadow-blue-500/10">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Engineered by Spotnet Services • India's #1 Dynamic Standee SaaS</span>
          </div>

          {/* Headline */}
          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
            Print High-Converting Standees.{' '}
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Update Destinations Anytime Without Reprints.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            Create ultra-high-resolution, print-ready acrylic counter standees, restaurant digital menus, and Google 5-star review boosters in seconds. When your menu, UPI ID, or offers change, update instantly in your dashboard with zero reprint costs.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login?tab=signup"
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-4 text-base font-black text-white shadow-xl shadow-blue-600/30 hover:brightness-110 transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/pricing"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/90 px-7 py-4 text-base font-bold text-slate-200 hover:border-slate-600 hover:text-white transition-all shadow-sm"
            >
              <span>View Pricing (From ₹0)</span>
            </Link>

            <Link
              href="/studio"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-blue-500/30 bg-blue-600/10 px-6 py-4 text-base font-bold text-blue-400 hover:bg-blue-600/20 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Try Studio Demo</span>
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>300 DPI Industrial Print PDFs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Smart Google Review Booster</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Digital Food & Drinks Menu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Bulk 50+ Table Generator</span>
            </div>
          </div>
        </div>

        {/* Visual Standee Mockup Card */}
        <div className="relative mx-auto mt-16 max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-10 backdrop-blur-xl shadow-2xl shadow-blue-950/40">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left: Standee Preview */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="w-64 rounded-3xl border-4 border-slate-700 bg-white p-6 text-center text-slate-900 shadow-2xl">
                <div className="mx-auto h-2 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mb-4" />
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-extrabold text-orange-700 uppercase">
                  Table #07
                </span>
                <h3 className="mt-2 text-xl font-black text-slate-900 leading-tight">
                  The Royal Bistro
                </h3>
                <p className="text-xs text-slate-500 mt-1">Scan for Live Menu & Instant UPI</p>
                <div className="my-4 mx-auto flex h-36 w-36 items-center justify-center rounded-2xl border-2 border-slate-200 bg-slate-50 p-2 shadow-inner">
                  <QrCode className="h-28 w-28 text-slate-950" />
                </div>
                <div className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 py-2 px-3 text-[11px] font-black text-white shadow-md">
                  SCAN FOR CHEF SPECIALS
                </div>
                <p className="mt-3 text-[10px] text-slate-400 font-mono">bistro.qrstandee.com/m/bistro-07</p>
              </div>
            </div>

            {/* Right: Commercial Value Points */}
            <div className="w-full md:w-1/2 space-y-4 text-left">
              <div className="inline-block rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-xs font-bold text-blue-400">
                Stop Reprinting Hardware
              </div>
              <h2 className="text-2xl font-black text-white sm:text-3xl leading-snug">
                One acrylic standee. Infinite destinations forever.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                When you switch from your summer menu to winter specials, update your UPI payment QR, or run festival discounts, your physical standee stays on the counter. Simply redirect the target link from your Spotnet Cloud dashboard in 3 seconds.
              </p>
              <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Real-time scan counter, peak hours, and device analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  <span>Calibrated for A4, A5, acrylic table tents & checkout stands</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-400" />
                  <span>Clean SVG vectors ready for commercial flex & laser signage</span>
                </div>
              </div>
              <div className="pt-4">
                <Link
                  href="/login?tab=signup"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300"
                >
                  Create your free account today <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES SUITE */}
      <section className="border-t border-slate-800/80 bg-slate-900/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <Zap className="h-3.5 w-3.5" /> Built For High-Growth Businesses
            </span>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
              Everything Your Counter & Tables Need to Succeed
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400 text-sm sm:text-base">
              Engineered by Spotnet Services for restaurants, cafes, salons, clinics, and retail counters.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: Digital Food Menu */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition-all duration-300 hover:border-orange-500/40 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Utensils className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Contactless Digital Food Menu</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Guests scan the table tent and view your live food menu instantly on their phone. Categorize starters, mains, and drinks with veg/non-veg tags, bestsellers, and prices in ₹ INR.
              </p>
            </div>

            {/* Feature 2: Smart Review Shield */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Star className="h-6 w-6 fill-amber-400" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Smart Google Review Shield</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                4-5★ happy customers are redirected straight to your Google Maps review page. 1-3★ unhappy feedback is privately routed to your dashboard so you can fix issues before they go public.
              </p>
            </div>

            {/* Feature 3: Multi-Action Concierge Card */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">5-in-1 Concierge Table Tent</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Transform any table standee into a 5-in-1 guest concierge: Food & drinks menu, 1-tap instant UPI payments, 1-click Wi-Fi connect, Google review link, and waiter call.
              </p>
            </div>

            {/* Feature 4: Bulk 50+ Table Generator */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition-all duration-300 hover:border-purple-500/40 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Printer className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Bulk 50+ Table Standees (ZIP)</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Generate 10 to 50 table standees in 1 single click. Each table gets its own unique dynamic tracking slug, ready for batch ZIP download.
              </p>
            </div>

            {/* Feature 5: Time-Based Smart Routing */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Time-Based Smart Routing</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Automatically show Lunch specials from 11 AM to 4 PM, and seamlessly switch to Dinner specials from 4 PM to 11 PM. Zero manual QR code updates needed.
              </p>
            </div>

            {/* Feature 6: Real-Time Analytics */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition-all duration-300 hover:border-pink-500/40 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Live Scan Analytics & Hourly Peaks</h3>
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
              Engineered for Every Commercial Counter
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400 text-sm sm:text-base">
              Select a pre-tuned layout designed by hospitality and retail experts to achieve maximum scan conversions.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.slice(0, 6).map((tmpl) => (
              <div
                key={tmpl.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition-all duration-300 hover:border-slate-700 hover:shadow-xl hover:shadow-blue-950/30"
              >
                <div>
                  <div className={`inline-block rounded-xl bg-gradient-to-r ${tmpl.preview_bg} px-3 py-1 text-xs font-bold text-white shadow-md`}>
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
                    Customize in Studio <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-8 sm:p-14 text-center shadow-2xl relative">
          <div className="relative z-10">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-white mb-4">
              Proudly Made by Spotnet Services
            </span>
            <h2 className="text-3xl font-black text-white sm:text-5xl">
              Ready to create your high-converting standees?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-blue-100 text-sm sm:text-base leading-relaxed">
              Create your free business account in 30 seconds. Print ultra-crisp acrylic standees, launch mobile food menus, and protect your Google reviews.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login?tab=signup"
                className="w-full sm:w-auto rounded-2xl bg-white px-8 py-4 text-base font-black text-blue-900 shadow-xl hover:bg-blue-50 transition-colors"
              >
                Create Free Account
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto rounded-2xl border border-white/30 bg-white/10 px-7 py-4 text-base font-bold text-white hover:bg-white/20 transition-colors"
              >
                View Plans & Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
