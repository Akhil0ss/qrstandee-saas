import React from 'react';
import Link from 'next/link';
import { QrCode, Heart, Sparkles, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 no-print">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Brand & Creator Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-md shadow-blue-600/30">
                <QrCode className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-black text-white">
                  QR<span className="text-blue-500">Standee</span>
                </span>
                <span className="ml-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                  360° PRO
                </span>
              </div>
            </div>

            <p className="max-w-md text-xs sm:text-sm leading-relaxed text-slate-400">
              The premier SaaS platform for high-converting commercial standees, acrylic table tents, contactless food menus, and Google 5-star review boosters.
            </p>

            <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-3 max-w-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <ShieldCheck className="h-4 w-4 text-blue-400" />
                <span>A Spotnet Services Product</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Engineered with high availability cloud sync for Indian retail & hospitality.
              </p>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-black tracking-wider text-white uppercase">Product & Studio</h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/studio" className="hover:text-blue-400 transition-colors">
                  Standee Studio
                </Link>
              </li>
              <li>
                <Link href="/dashboard/menu" className="hover:text-blue-400 transition-colors">
                  Digital Menu Builder
                </Link>
              </li>
              <li>
                <Link href="/bulk" className="hover:text-blue-400 transition-colors">
                  Bulk 50+ Table Tents
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-blue-400 transition-colors">
                  Plans & Pricing (₹ INR)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
                  Business Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Use Cases */}
          <div>
            <h4 className="text-xs font-black tracking-wider text-white uppercase">Solutions</h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <li>Restaurant Digital Menus</li>
              <li>Google 5-Star Review Shields</li>
              <li>Counter UPI Payment Tents</li>
              <li>Guest Wi-Fi Instant Connect</li>
              <li>Doctor Clinics & Salons</li>
            </ul>
          </div>

          {/* Legal & Spotnet Services Info */}
          <div>
            <h4 className="text-xs font-black tracking-wider text-white uppercase">Legal & Company</h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/terms" className="hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-400 transition-colors">
                  Business Sign In
                </Link>
              </li>
              <li>
                <Link href="/login?tab=signup" className="hover:text-blue-400 transition-colors">
                  Create Business Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-900 pt-8 sm:flex-row text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} QRStandee. Developed & operated by <strong className="text-slate-300">Spotnet Services</strong>. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-400">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-400">Terms</Link>
            <span>•</span>
            <Link href="/pricing" className="hover:text-slate-400">Pricing</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
