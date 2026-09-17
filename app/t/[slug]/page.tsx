'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getStandeeBySlug } from '@/lib/supabase/store';
import { StandeeRecord } from '@/lib/types';
import {
  Utensils,
  CreditCard,
  Wifi,
  Star,
  Instagram,
  Phone,
  Copy,
  Check,
  Globe,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function SmartTableTentPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [standee, setStandee] = useState<StandeeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [wifiCopied, setWifiCopied] = useState(false);
  const [wifiModalOpen, setWifiModalOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      getStandeeBySlug(slug).then((data) => {
        setStandee(data);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!standee) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 text-center text-white">
        <h1 className="text-xl font-bold">Table Standee Not Found</h1>
        <p className="text-xs text-slate-400 mt-2">This standee link is inactive.</p>
      </div>
    );
  }

  const wifiPassword = standee.wifi_password || 'welcome123';
  const wifiSSID = standee.wifi_ssid || `${standee.name}_Guest`;

  function copyWifi() {
    navigator.clipboard?.writeText(wifiPassword);
    setWifiCopied(true);
    setTimeout(() => setWifiCopied(false), 2500);
  }

  // Pre-configured actions
  const upiLink = standee.destination.startsWith('upi://')
    ? standee.destination
    : `upi://pay?pa=${encodeURIComponent(standee.destination || 'merchant@upi')}&pn=${encodeURIComponent(standee.name)}&cu=INR`;

  const menuLink = standee.lunch_url || standee.destination || '#';
  const reviewLink = `/review/${standee.slug}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 sm:p-6">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Accent Bar */}
        <div
          className="h-3 w-full"
          style={{ backgroundColor: standee.accent_color || '#2563eb' }}
        />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center">
            {standee.logo_url && (
              <div className="mx-auto mb-3 h-16 w-16 rounded-full border-2 border-slate-700 bg-white p-0.5 shadow-lg overflow-hidden">
                <img
                  src={standee.logo_url}
                  alt={standee.name}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            )}

            {standee.table_number && (
              <div className="inline-block rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 text-xs font-black text-blue-400 mb-2">
                {standee.table_number}
              </div>
            )}

            <h1 className="text-2xl font-black text-white">{standee.name}</h1>
            <p className="mt-1 text-xs text-slate-400 font-medium">
              {standee.category ? `${standee.category} • ` : ''}Digital Table Concierge
            </p>
          </div>

          {/* Action Cards List */}
          <div className="mt-6 space-y-3">
            {/* 1. Explore Menu */}
            <a
              href={menuLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 text-white hover:border-amber-500/50 transition-all group active:scale-[0.98]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20">
                <Utensils className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">Food & Drinks Menu</span>
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-400">
                    Live
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">Browse digital menu & specials</div>
              </div>
              <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-white" />
            </a>

            {/* 2. Pay Bill via UPI */}
            <a
              href={upiLink}
              className="flex items-center gap-3.5 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-4 text-white hover:border-blue-500/50 transition-all group active:scale-[0.98]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">Pay via Any UPI App</span>
                  <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-extrabold text-blue-400">
                    0 Fee
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">GPay, PhonePe, Paytm, BHIM</div>
              </div>
              <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-white" />
            </a>

            {/* 3. Free Guest Wi-Fi */}
            <div
              onClick={() => setWifiModalOpen(!wifiModalOpen)}
              className="cursor-pointer flex items-center gap-3.5 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 text-white hover:border-indigo-500/50 transition-all group active:scale-[0.98]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20">
                <Wifi className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">Connect Guest Wi-Fi</span>
                  <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-extrabold text-indigo-400">
                    Free
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">Network: {wifiSSID}</div>
              </div>
              <span className="text-xs font-bold text-indigo-400">
                {wifiModalOpen ? 'Hide' : 'Password'}
              </span>
            </div>

            {/* Wi-Fi Password Accordion */}
            {wifiModalOpen && (
              <div className="rounded-xl border border-indigo-500/20 bg-slate-950 p-3 text-xs flex items-center justify-between animate-in fade-in">
                <div>
                  <div className="text-[10px] text-slate-500">Wi-Fi Password:</div>
                  <div className="font-mono font-bold text-white text-sm mt-0.5">
                    {wifiPassword}
                  </div>
                </div>
                <button
                  onClick={copyWifi}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600/30 border border-indigo-500/40 px-3 py-1.5 text-xs font-bold text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all"
                >
                  {wifiCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{wifiCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}

            {/* 4. Google Review */}
            <a
              href={reviewLink}
              className="flex items-center gap-3.5 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-white hover:border-slate-700 transition-all group active:scale-[0.98]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                <Star className="h-5 w-5 fill-amber-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">Rate Your Experience</div>
                <div className="text-[11px] text-slate-400">Takes only 10 seconds</div>
              </div>
              <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-white" />
            </a>

            {/* 5. Contact Phone */}
            {standee.phone && (
              <a
                href={`tel:${standee.phone}`}
                className="flex items-center gap-3.5 rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 text-white hover:border-slate-700 transition-all group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="flex-1 text-xs font-medium text-slate-300 truncate">
                  Call Front Desk / Manager ({standee.phone})
                </div>
              </a>
            )}
          </div>

          <div className="mt-8 text-center text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
            ⚡ Powered by QRStandee SaaS
          </div>
        </div>
      </div>
    </div>
  );
}
