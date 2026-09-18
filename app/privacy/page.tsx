import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, Eye, Server, FileText } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | QRStandee by Spotnet Services',
  description: 'Privacy Policy and Data Protection standards for QRStandee SaaS platform by Spotnet Services.',
};

export default function PrivacyPage() {
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
            <ShieldCheck className="h-4 w-4" />
            Spotnet Services Legal Documentation
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black text-white">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Last updated: September 18, 2026 • Issued by <strong>Spotnet Services</strong>
          </p>
        </div>

        <div className="mt-8 space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              1. Commitment to Privacy
            </h2>
            <p>
              Spotnet Services ("we", "our", or "us"), the developer and operator of the <strong>QRStandee SaaS Platform</strong>, respects your personal and business privacy. This Privacy Policy outlines how we collect, safeguard, and process your information when you access our standee designer, dynamic QR redirection system, digital menu builder, and analytics telemetry.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-emerald-400" />
              2. Strict Tenant Data Isolation
            </h2>
            <p>
              Every business account registered on QRStandee operates within an isolated tenant environment protected by PostgreSQL Row-Level Security (RLS). Under no circumstances will your physical standee templates, visitor scan logs, digital menu recipes, or private customer review feedback ever be shared with, visible to, or accessible by other businesses or third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-400" />
              3. Information We Collect
            </h2>
            <p>We collect only the essential data necessary to deliver enterprise standee operations:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li><strong>Account Credentials:</strong> Email address, business name, and manager contact information for tenant authentication.</li>
              <li><strong>Standee Configurations:</strong> Target URLs, brand colors, QR logos, menu catalogs, and Wi-Fi credentials entered into table tent configurations.</li>
              <li><strong>Scan Telemetry:</strong> Aggregated, anonymized device categories (Mobile/Desktop), timestamp of scans, and total scan counts. We do NOT track individual consumer identities or GPS locations.</li>
              <li><strong>Review Shield Feedback:</strong> Rating scores and feedback messages submitted by diners or shoppers who scan your review stands.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="h-5 w-5 text-amber-400" />
              4. Data Storage & Cloud Security
            </h2>
            <p>
              All customer database records, digital menu assets, and scan metrics are securely stored in ISO/IEC 27001-certified enterprise cloud infrastructure with end-to-end SSL/TLS 256-bit encryption in transit and at rest.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Third-Party Integrations</h2>
            <p>
              QRStandee facilitates direct customer routing to third-party services such as Google Maps (for reviews), UPI apps (Google Pay, PhonePe, Paytm for payments), and WhatsApp. Once a customer redirects to an external destination, their interaction is governed by the respective provider's privacy policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">6. Contacting the Spotnet Services Privacy Team</h2>
            <p>
              For data access requests, deletion of account data, or privacy compliance inquiries, please contact our data privacy officer at:
            </p>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 font-mono text-xs text-blue-400">
              Spotnet Services Data Protection Office<br />
              Email: support@spotnetservices.com<br />
              Platform: QRStandee Cloud Solutions
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
