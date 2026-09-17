import React from 'react';
import Link from 'next/link';
import { QrCode, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 no-print">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/30">
                <QrCode className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black text-white">
                QR<span className="text-blue-500">Standee</span>
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
              The modern B2B SaaS platform for business standees, acrylic table tents, and dynamic QR codes. Built for restaurants, retail counters, clinics, and modern businesses.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <span>Ready for deployment on</span>
              <span className="font-semibold text-slate-300">Vercel</span>
              <span>• Database by</span>
              <span className="font-semibold text-slate-300">Supabase</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">Product</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/studio" className="hover:text-blue-400 transition-colors">
                  Standee Studio
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
                  Live Analytics
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-blue-400 transition-colors">
                  Templates & Sizes
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-blue-400 transition-colors">
                  Dynamic Redirects
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">Use Cases</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>UPI Payment Counters</li>
              <li>Google 5-Star Reviews</li>
              <li>Restaurant Digital Menus</li>
              <li>WhatsApp Support Tents</li>
              <li>Guest Wi-Fi Signage</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-900 pt-8 sm:flex-row text-xs text-slate-500">
          <p>© {new Date().getFullYear()} QRStandee. All rights reserved.</p>
          <p className="mt-4 sm:mt-0 flex items-center gap-1">
            Engineered for high-converting physical-to-digital retail.
          </p>
        </div>
      </div>
    </footer>
  );
}
