import React from 'react';
import { notFound } from 'next/navigation';
import { getStandeeBySlug } from '@/lib/supabase/store';
import {
  CreditCard,
  MessageCircle,
  Globe,
  Phone,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Star,
} from 'lucide-react';

export default async function MobileProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const standee = await getStandeeBySlug(params.slug);

  if (!standee) {
    notFound();
  }

  // Derive target primary action link
  let primaryHref = standee.destination;
  let primaryButtonText = 'Connect Now';

  if (standee.qr_type === 'upi') {
    primaryHref = standee.destination.startsWith('upi://')
      ? standee.destination
      : `upi://pay?pa=${encodeURIComponent(standee.destination)}&pn=${encodeURIComponent(standee.name)}&cu=INR`;
    primaryButtonText = 'Pay via UPI App (GPay / PhonePe / Paytm)';
  } else if (standee.qr_type === 'whatsapp') {
    const num = standee.destination.replace(/\D/g, '');
    primaryHref = `https://wa.me/${num}`;
    primaryButtonText = 'Chat on WhatsApp';
  } else if (standee.qr_type === 'phone') {
    primaryHref = `tel:${standee.destination.replace(/[^\d+]/g, '')}`;
    primaryButtonText = 'Call Now';
  } else if (standee.qr_type === 'review') {
    primaryButtonText = 'Leave 5-Star Google Review';
  } else {
    primaryButtonText = standee.cta_text || 'Visit Website';
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 sm:p-6">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header Ribbon */}
        <div
          className="h-3 w-full"
          style={{ backgroundColor: standee.accent_color || '#2563eb' }}
        />

        <div className="p-6 sm:p-8 text-center">
          {/* Logo */}
          {standee.logo_url && (
            <div className="mx-auto mb-4 h-20 w-20 rounded-full border-2 border-slate-700 bg-white p-1 shadow-lg overflow-hidden">
              <img
                src={standee.logo_url}
                alt={standee.name}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          )}

          {/* Business Name */}
          <h1 className="text-2xl font-black text-white">{standee.name}</h1>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            {standee.category ? `${standee.category} • ` : ''}
            {standee.tagline}
          </p>

          {/* Main Action Button */}
          <div className="mt-6">
            <a
              href={primaryHref}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 px-6 text-sm sm:text-base font-black text-white shadow-xl hover:opacity-95 transition-all active:scale-[0.98]"
              style={{ backgroundColor: standee.accent_color || '#2563eb' }}
            >
              {standee.qr_type === 'upi' && <CreditCard className="h-5 w-5" />}
              {standee.qr_type === 'whatsapp' && <MessageCircle className="h-5 w-5" />}
              {standee.qr_type === 'review' && <Star className="h-5 w-5" />}
              <span>{primaryButtonText}</span>
            </a>
          </div>

          {/* Contact Details List */}
          <div className="mt-8 space-y-3 text-left border-t border-slate-800/80 pt-6">
            {standee.phone && (
              <a
                href={`tel:${standee.phone}`}
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs sm:text-sm text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-blue-400 shrink-0" />
                <span className="truncate">{standee.phone}</span>
              </a>
            )}

            {standee.website && (
              <a
                href={standee.website.startsWith('http') ? standee.website : `https://${standee.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs sm:text-sm text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
              >
                <Globe className="h-4 w-4 text-blue-400 shrink-0" />
                <span className="truncate">{standee.website}</span>
                <ExternalLink className="h-3 w-3 ml-auto text-slate-500" />
              </a>
            )}

            {standee.address && (
              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs sm:text-sm text-slate-300">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{standee.address}</span>
              </div>
            )}
          </div>

          {/* Verification Badge */}
          <div className="mt-8 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Verified Official Commercial Standee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
