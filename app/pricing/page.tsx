'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  Star,
  Layers,
  Utensils,
  Printer,
  TrendingUp,
  Clock,
  HelpCircle,
  ArrowRight,
  IndianRupee,
  Building2,
  HeartHandshake,
} from 'lucide-react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      id: 'free',
      name: 'Free Starter',
      badge: 'Zero Risk',
      description: 'Ideal for single retail shops or individuals wanting to test dynamic standees.',
      monthlyPrice: 0,
      annualPrice: 0,
      ctaText: 'Start Free Forever',
      ctaHref: '/login?tab=signup&plan=free',
      popular: false,
      features: [
        '1 Active Dynamic Standee',
        'Unlimited Scan Volume',
        'Instant Destination Redirect',
        'Standard PNG & SVG Export',
        'Standard QR Customization',
        'Community Support',
      ],
      notIncluded: [
        'Smart Google Review Shield',
        'Digital Food Menu Engine',
        'Multi-Action Concierge Card',
        'Bulk Table Tent Generator',
        '300 DPI Industrial Print PDF',
        'Time-Based Menu Switching',
      ],
    },
    {
      id: 'pro',
      name: 'Business Pro',
      badge: 'Most Popular for Restaurants',
      description: 'The ultimate physical-to-digital growth engine for cafes, restaurants, salons & clinics.',
      monthlyPrice: 499,
      annualPrice: 399,
      ctaText: 'Start 14-Day Free Pro Trial',
      ctaHref: '/login?tab=signup&plan=pro',
      popular: true,
      features: [
        'Up to 25 Dynamic QR Standees',
        'Unlimited Scans & Zero Throttling',
        'Smart Google 5-Star Review Booster',
        'Private 1-3★ Feedback Shield Inbox',
        'Full Digital Food & Drinks Menu Studio',
        '5-in-1 Multi-Action Table Concierge',
        'Time-Based Routing (Lunch & Dinner)',
        '300 DPI High-Res Print Export (A4, A5)',
        'Hourly Scan Telemetry & Peak Traffic',
        'Zero Spotnet Watermark',
        'Priority WhatsApp & Email Support',
      ],
      notIncluded: [
        'Bulk 50+ Table Generator in 1-Click',
        'Multi-Outlet Franchise Management',
        'Custom Domain & Dedicated SLA',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise Agency',
      badge: 'Multi-Outlet & Chains',
      description: 'For hotel chains, restaurant franchises, event organizers, and agency partners.',
      monthlyPrice: 1499,
      annualPrice: 1199,
      ctaText: 'Get Enterprise Access',
      ctaHref: '/login?tab=signup&plan=enterprise',
      popular: false,
      features: [
        'Unlimited Dynamic QR Standees',
        'Unlimited Scans across all Outlets',
        'Bulk 50+ Multi-Table Tent Generator',
        'Batch ZIP Print-Ready High-Res Export',
        'Multi-Location Franchise Sub-Accounts',
        'Smart Review Shield on all Outlets',
        'Unlimited Digital Restaurant Menus',
        'Custom Domain & Custom White-Label',
        'Dedicated Account Manager by Spotnet Services',
        'Industrial Flex & Acrylic Print Guidance',
        '99.95% Enterprise SLA Guarantee',
      ],
      notIncluded: [],
    },
  ];

  const faqs = [
    {
      q: 'Why should I use QRStandee instead of a free QR code generator?',
      a: 'Free QR code generators create static links. If your payment UPI ID changes, or if you update your menu or Google Maps URL, you are forced to throw away and reprint expensive physical acrylic standees. With QRStandee by Spotnet Services, your physical standee remains the same while you update the digital destination anytime in 3 seconds.',
    },
    {
      q: 'How does the Smart Review Shield protect my business reputation?',
      a: 'When customers scan your review standee, they are asked to give an honest star rating. Happy customers giving 4 or 5 stars are immediately redirected to your Google Maps review page with celebratory confetti. Unhappy customers giving 1 to 3 stars are routed to a private feedback form on your dashboard, allowing you to solve their grievance before it damages your public rating.',
    },
    {
      q: 'Can I print these standees on real acrylic or foam boards?',
      a: 'Yes! Our studio exports print-ready 300 DPI vector graphics calibrated precisely for standard commercial paper and acrylic tent sizes including A4, A5, and table tents. Any local printer or signage shop can print them directly.',
    },
    {
      q: 'What is the Digital Menu Builder included in Pro?',
      a: 'It lets cafes, food trucks, and restaurants build a beautiful mobile menu with food categories, dish photos, descriptions, veg/non-veg green/red indicators, bestsellers, and prices in ₹ INR. Diners scan the table standee and view the live menu instantly on their smartphone with zero app download.',
    },
    {
      q: 'Can I cancel or switch plans at any time?',
      a: 'Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time directly from your account settings with zero cancellation penalties.',
    },
    {
      q: 'Who is behind QRStandee?',
      a: 'QRStandee is engineered and maintained by Spotnet Services, India’s leading software solutions provider for smart retail and hospitality technology.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16 sm:px-6 lg:px-8 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Honest, Transparent & Ultra-Competitive Indian Pricing</span>
          </div>

          <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Supercharge Your Counters.{' '}
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Never Waste Money on Reprints.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Upgrade your physical table tents, Google review stands, and food menus with smart dynamic QR technology by <strong className="text-white">Spotnet Services</strong>.
          </p>

          {/* Monthly / Annual Toggle Switch */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-1.5 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-xl px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="rounded-full bg-emerald-950/80 px-2 py-0.5 text-[10px] font-black text-emerald-300 border border-emerald-500/40">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3 items-stretch">
          {plans.map((plan) => {
            const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl p-8 backdrop-blur-xl transition-all duration-300 ${
                  plan.popular
                    ? 'border-2 border-blue-500 bg-gradient-to-b from-blue-950/40 via-slate-900/90 to-slate-950 shadow-2xl shadow-blue-600/20 lg:-translate-y-2'
                    : 'border border-slate-800 bg-slate-900/60 shadow-xl hover:border-slate-700'
                }`}
              >
                {/* Popular Pill */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-blue-600/40">
                    ⭐ {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-white">{plan.name}</h3>
                    {!plan.popular && (
                      <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-400">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-6 flex items-baseline gap-1 border-b border-slate-800 pb-6">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                      ₹{price}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {price === 0 ? 'forever' : billingCycle === 'annual' ? '/month (billed annually)' : '/month'}
                    </span>
                  </div>

                  {/* Feature checklist */}
                  <div className="mt-6 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      What's Included:
                    </p>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                        <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}

                    {plan.notIncluded.length > 0 && (
                      <div className="pt-2 space-y-2 opacity-50">
                        {plan.notIncluded.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-400">
                            <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-500">
                              <X className="h-3 w-3 stroke-[2]" />
                            </div>
                            <span className="line-through">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-8 pt-4 border-t border-slate-800">
                  <Link
                    href={plan.ctaHref}
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black transition-all duration-200 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                        : 'border border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="mt-24 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Full Feature Comparison
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Everything you need to modernize your physical counter signage.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                  <th className="py-4 px-4">Core SaaS Capability</th>
                  <th className="py-4 px-4 text-center">Free Starter</th>
                  <th className="py-4 px-4 text-center text-blue-400">Business Pro (₹499)</th>
                  <th className="py-4 px-4 text-center text-purple-400">Enterprise (₹1,499)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Dynamic Active Standees</td>
                  <td className="py-3.5 px-4 text-center">1</td>
                  <td className="py-3.5 px-4 text-center font-bold text-blue-400">25 Standees</td>
                  <td className="py-3.5 px-4 text-center font-bold text-purple-400">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Reprint-Free Target Destination Editing</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Digital Food & Drinks Menu Studio</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">—</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓ Full Access</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓ Unlimited Menus</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Smart Google Review Shield (1-3★ Filter)</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">—</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓ Included</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓ Included</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">5-in-1 Concierge Table Tent Card</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">—</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓ Included</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓ Included</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Bulk 50+ Table Standee ZIP Generator</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">—</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">—</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓ 1-Click ZIP</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">300 DPI Print Export (A4, A5, Acrylic)</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">—</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Support SLA</td>
                  <td className="py-3.5 px-4 text-center">Community</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-blue-400">Priority WhatsApp</td>
                  <td className="py-3.5 px-4 text-center font-bold text-purple-400">Dedicated Manager</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Common Queries</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 transition-all hover:border-slate-700"
              >
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Spotnet Trust Badge */}
        <div className="mt-20 rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-slate-900/90 to-indigo-950/40 p-8 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-white">
            100% Satisfaction Guarantee by Spotnet Services
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-slate-400">
            Join over 2,500+ Indian businesses streamlining their counter operations. Our team is dedicated to your success.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
            <span>✓ Instant Online Activation</span>
            <span>•</span>
            <span>✓ GST Invoicing Available</span>
            <span>•</span>
            <span>✓ UPI & Netbanking Accepted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
