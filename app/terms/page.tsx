import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | QRStandee by Spotnet Services',
  description: 'Terms of Service and Customer Agreement for QRStandee SaaS platform by Spotnet Services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16 sm:px-6 lg:px-8 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-400">
            <Scale className="h-4 w-4" />
            Spotnet Services Master Agreement
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black text-white">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Last updated: September 18, 2026 • Published by <strong>Spotnet Services</strong>
          </p>
        </div>

        <div className="mt-8 space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              1. Acceptance of Terms
            </h2>
            <p>
              By signing up, accessing, or using the <strong>QRStandee SaaS Platform</strong>, you enter into a legally binding agreement with <strong>Spotnet Services</strong>. If you are creating an account on behalf of a restaurant, cafe, clinic, or corporate organization, you warrant that you have full legal authority to bind said entity to these Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              2. Permitted SaaS Use
            </h2>
            <p>
              QRStandee provides dynamic QR code generation, acrylic standee design tools, digital food menu hosting, and scan telemetry. You agree to use the platform exclusively for lawful commercial purposes. You must not use dynamic QR redirects to distribute malware, phishing links, counterfeit products, or defamatory material.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
              3. Dynamic Standee Uptime & Service Reliability
            </h2>
            <p>
              Spotnet Services commits to maintaining high availability (99.9% target uptime) for all live dynamic QR slug redirection and digital menu endpoints. We ensure that once a physical standee is manufactured and printed, its underlying QR code will resolve reliably without interruptions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Subscriptions, Fees & Billing</h2>
            <p>
              Paid subscription plans (Business Pro and Enterprise) are billed on a monthly or annual recurring cycle. All fees are priced in Indian Rupees (₹ INR) and include applicable taxes as specified. You can upgrade, downgrade, or cancel your active subscription at any time without punitive penalties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Intellectual Property Rights</h2>
            <p>
              All code, user interface designs, templates, and trademarks associated with QRStandee remain the exclusive intellectual property of <strong>Spotnet Services</strong>. You retain full ownership of your uploaded logos, brand graphics, menus, and custom standee graphics created using our platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">6. Governing Law & Jurisdiction</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with the QRStandee platform shall be subject to the exclusive jurisdiction of the courts of India.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">7. Provider Contact</h2>
            <p>
              For legal inquiries, billing questions, or commercial enterprise contracts, please reach out to:
            </p>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 font-mono text-xs text-blue-400">
              Spotnet Services Legal Affairs<br />
              Email: legal@spotnetservices.com<br />
              Brand: QRStandee Physical-to-Digital SaaS
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
