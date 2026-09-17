'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getStandeeBySlug, submitPrivateFeedback } from '@/lib/supabase/store';
import { StandeeRecord } from '@/lib/types';
import {
  Star,
  ShieldCheck,
  Heart,
  Send,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SmartReviewShieldPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [standee, setStandee] = useState<StandeeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPrivate, setSubmittedPrivate] = useState(false);

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
        <h1 className="text-xl font-bold">Business Not Found</h1>
        <p className="text-xs text-slate-400 mt-2">This review link may be inactive or expired.</p>
      </div>
    );
  }

  const googleReviewUrl =
    standee.google_review_url ||
    (standee.destination.startsWith('http') ? standee.destination : `https://www.google.com/search?q=${encodeURIComponent(standee.name)}+reviews`);

  function handleSelectRating(stars: number) {
    setSelectedRating(stars);

    if (stars >= 4) {
      // 4 or 5 Stars: Celebrate and forward to Google!
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = googleReviewUrl;
        }
      }, 1400);
    }
  }

  async function handlePrivateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!standee || !feedbackText.trim() || !selectedRating) return;

    setIsSubmitting(true);
    await submitPrivateFeedback({
      slug: standee.slug,
      rating: selectedRating,
      feedback: feedbackText.trim(),
      customer_contact: contactInfo.trim(),
    });
    setIsSubmitting(false);
    setSubmittedPrivate(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 sm:p-6">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Accent Bar */}
        <div
          className="h-3 w-full"
          style={{ backgroundColor: standee.accent_color || '#d97706' }}
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

          <h1 className="text-2xl font-black text-white">{standee.name}</h1>
          <p className="mt-1 text-xs text-slate-400">
            {standee.category ? `${standee.category} • ` : ''}Customer Experience Portal
          </p>

          {/* ==================================================== */}
          {/* STEP 1: RATING SELECTION */}
          {/* ==================================================== */}
          {selectedRating === null && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-white">How was your visit today?</h2>
              <p className="mt-1 text-xs text-slate-400">Tap a star to rate your overall experience</p>

              <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || 0) >= star;
                  return (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => handleSelectRating(star)}
                      className="p-1 transition-transform duration-150 hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`h-10 w-10 sm:h-12 sm:w-12 transition-colors ${
                          active
                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                            : 'fill-slate-800 text-slate-700 hover:fill-amber-400/50'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Verified Direct Feedback System</span>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 2A: 4-5 STARS (REDIRECT TO GOOGLE) */}
          {/* ==================================================== */}
          {selectedRating !== null && selectedRating >= 4 && (
            <div className="mt-8 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="h-8 w-8" />
              </div>

              <h2 className="text-xl font-black text-white">You made our day! 🎉</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Thank you so much! Please take 10 seconds to share your review on Google. It helps our local business tremendously!
              </p>

              <div className="pt-2">
                <a
                  href={googleReviewUrl}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 py-4 px-6 text-sm font-black text-slate-950 shadow-xl hover:from-amber-400 hover:to-yellow-400 transition-all active:scale-[0.98]"
                >
                  <span>Post on Google Reviews</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <p className="text-[11px] text-slate-500 pt-2">
                Redirecting automatically in a moment...
              </p>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 2B: 1-3 STARS (PRIVATE FEEDBACK SHIELD) */}
          {/* ==================================================== */}
          {selectedRating !== null && selectedRating <= 3 && !submittedPrivate && (
            <form onSubmit={handlePrivateSubmit} className="mt-6 text-left animate-in fade-in duration-200">
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 mb-4">
                <h3 className="text-sm font-bold text-amber-400">We want to make this right</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  We are sincerely sorry your experience didn't meet your expectations. Your feedback goes directly to senior management.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    What went wrong? How can we improve? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us about food, staff, waiting time, cleanliness, etc..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Phone / Email (optional, so manager can follow up)
                  </label>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="+91 98765 43210 or your email"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-600 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-amber-500 transition-all disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? 'Sending...' : 'Send Private Feedback to Owner'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 2C: SUBMITTED SUCCESS */}
          {submittedPrivate && (
            <div className="mt-8 space-y-3 animate-in fade-in zoom-in-95">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-lg font-black text-white">Thank You for Your Honesty</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your private feedback has been logged directly with the business management. We appreciate you helping us improve!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
