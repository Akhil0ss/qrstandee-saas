'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  StandeeRecord,
  QRType,
  StandeeSize,
  Orientation,
  QRShape,
  ProfileStyle,
} from '@/lib/types';
import { TEMPLATES, STANDARDS_SIZES } from '@/lib/standee-templates';
import { generateStyledQR } from '@/lib/qr-engine';
import { exportHighResPNG, exportStandeeSVG } from '@/lib/export-helpers';
import { saveStandee, getStandeeBySlug } from '@/lib/supabase/store';
import { useAuth } from '@/components/AuthProvider';
import {
  Sparkles,
  Printer,
  Download,
  Save,
  Share2,
  Image as ImageIcon,
  Check,
  Smartphone,
  Eye,
  Settings2,
  RefreshCw,
  ExternalLink,
  Layers,
  Palette,
  CreditCard,
  MessageCircle,
  Globe,
  MapPin,
  Star,
  Phone,
  Wifi,
  Copy,
  Sliders,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const QR_ACTION_TYPES: { id: QRType; label: string; icon: any; defaultPlaceholder: string }[] = [
  { id: 'smart_review', label: '★ Review Shield', icon: ShieldCheck, defaultPlaceholder: 'Google Maps Review link' },
  { id: 'multi_action', label: 'Smart Table Tent', icon: Layers, defaultPlaceholder: 'https://yourwebsite.com/menu' },
  { id: 'upi', label: 'UPI Payment', icon: CreditCard, defaultPlaceholder: 'merchant@upi' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, defaultPlaceholder: '919876543210' },
  { id: 'website', label: 'Website URL', icon: Globe, defaultPlaceholder: 'https://yourwebsite.com' },
  { id: 'maps', label: 'Google Maps', icon: MapPin, defaultPlaceholder: 'https://maps.app.goo.gl/...' },
  { id: 'wifi', label: 'Guest Wi-Fi', icon: Wifi, defaultPlaceholder: 'WIFI:T:WPA;S:MyWiFi;P:pass;;' },
];

export default function StudioPage() {
  const { user, profile } = useAuth();
  const businessName = profile?.business_name || user?.user_metadata?.business_name;

  // Mobile Tab State: 'editor' or 'preview'
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  // Studio Form State
  const [standee, setStandee] = useState<StandeeRecord>({
    id: 'standee-' + Date.now(),
    slug: 'my-business',
    name: businessName || 'Your Business Name',
    tagline: 'Scan to connect with us',
    category: 'Restaurant & Cafe',
    phone: '+91 98765 43210',
    website: 'https://example.com',
    address: '42 Market Street, Central City',
    extra_info: 'GST: 07AAAAA0000A1Z5',
    destination: 'https://example.com/menu',
    qr_type: 'multi_action',
    primary_action: 'multi_action',
    template_id: 'restaurant_menu',
    size: 'a4',
    orientation: 'portrait',
    qr_color: '#0f172a',
    accent_color: '#2563eb',
    cta_text: 'SCAN FOR MENU & SERVICES',
    qr_shape: 'rounded',
    profile_style: 'clean',
    scans_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),

    // 360 Features
    smart_review_enabled: false,
    google_review_url: '',
    smart_routing_enabled: false,
    lunch_url: '',
    dinner_url: '',
    wifi_ssid: 'Business_Guest_WiFi',
    wifi_password: 'welcome2026',
  });

  const [useDynamicUrl, setUseDynamicUrl] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [qrCanvasUrl, setQrCanvasUrl] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Derive target QR Payload (safe for SSR hydration)
  const baseUrl = mounted && typeof window !== 'undefined' ? window.location.origin : 'https://qrstandee.app';
  const dynamicTargetUrl = `${baseUrl}/${standee.slug || 'my-business'}`;

  function getRawDestinationPayload(): string {
    const d = standee.destination.trim();
    if (standee.qr_type === 'upi') {
      return d ? `upi://pay?pa=${encodeURIComponent(d)}&pn=${encodeURIComponent(standee.name)}` : 'upi://pay?pa=merchant@upi';
    }
    if (standee.qr_type === 'whatsapp') {
      const num = d.replace(/\D/g, '');
      return num ? `https://wa.me/${num}` : 'https://wa.me/919876543210';
    }
    if (standee.qr_type === 'smart_review') {
      return `${baseUrl}/review/${standee.slug}`;
    }
    if (standee.qr_type === 'multi_action') {
      return `${baseUrl}/t/${standee.slug}`;
    }
    return d || 'https://example.com';
  }

  const effectiveQRPayload = useDynamicUrl ? dynamicTargetUrl : getRawDestinationPayload();

  // Re-generate QR whenever visual properties change
  useEffect(() => {
    let isCurrent = true;

    async function draw() {
      try {
        const canvas = await generateStyledQR({
          text: effectiveQRPayload,
          size: 320,
          qrColor: standee.qr_color,
          shape: standee.qr_shape,
          logoUrl: standee.logo_url,
        });
        if (isCurrent) {
          setQrCanvasUrl(canvas.toDataURL('image/png'));
        }
      } catch (err) {
        console.error('QR Render Error:', err);
      }
    }

    draw();
    return () => {
      isCurrent = false;
    };
  }, [
    effectiveQRPayload,
    standee.qr_color,
    standee.qr_shape,
    standee.logo_url,
  ]);

  // Apply template
  function handleSelectTemplate(tmplId: string) {
    const tmpl = TEMPLATES.find((t) => t.id === tmplId);
    if (!tmpl) return;

    setStandee((prev) => ({
      ...prev,
      template_id: tmpl.id,
      accent_color: tmpl.accent_color,
      qr_color: tmpl.qr_color,
      cta_text: tmpl.cta_text,
      qr_shape: tmpl.qr_shape,
      profile_style: tmpl.profile_style,
      qr_type: tmpl.default_qr_type,
    }));
  }

  // Handle Logo Upload
  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setStandee((prev) => ({ ...prev, logo_url: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  // Save standee
  async function handleSave() {
    setIsSaving(true);
    await saveStandee(standee);
    setIsSaving(false);
    setSaveToast(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setSaveToast(false), 3000);
  }

  // Dimension scaling calculation for preview
  const currentSizeObj = STANDARDS_SIZES.find((s) => s.id === standee.size) || STANDARDS_SIZES[0];
  const isLandscape = standee.orientation === 'landscape';

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Top Studio Bar */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
              <Sliders className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-base font-bold text-white sm:text-lg">Standee Design Studio</h1>
              <p className="text-xs text-slate-400">Real-time vector preview & 300 DPI export suite</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="max-w-[130px] truncate">{businessName || 'Tenant'}</span> Vault
              </span>
            ) : null}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Design'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Toggle (< md) */}
      <div className="md:hidden sticky top-[61px] z-40 flex border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 py-2">
        <div className="grid w-full grid-cols-2 rounded-xl bg-slate-900 p-1">
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
              mobileTab === 'editor'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings2 className="h-4 w-4" />
            Customize Controls
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
              mobileTab === 'preview'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="h-4 w-4" />
            Live Preview
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* ==================================================== */}
          {/* LEFT: CONTROLS PANEL */}
          {/* ==================================================== */}
          <div
            className={`space-y-6 lg:col-span-6 xl:col-span-5 ${
              mobileTab === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* 1. Dynamic URL & Routing */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-white">Dynamic Redirect Engine</h3>
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useDynamicUrl}
                    onChange={(e) => setUseDynamicUrl(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
                  />
                  <span>Enable Dynamic URL</span>
                </label>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Permanent Standee Slug
                  </label>
                  <div className="flex rounded-lg border border-slate-700 bg-slate-800/80 overflow-hidden text-xs">
                    <span className="bg-slate-900 px-3 py-2 text-slate-500 border-r border-slate-700">
                      /
                    </span>
                    <input
                      type="text"
                      value={standee.slug}
                      onChange={(e) =>
                        setStandee({
                          ...standee,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, '-')
                            .replace(/-+/g, '-'),
                        })
                      }
                      className="w-full bg-transparent px-3 py-2 text-white focus:outline-none"
                      placeholder="my-business"
                    />
                  </div>
                </div>

                <div className="rounded-lg bg-slate-950 p-2.5 text-xs text-slate-400 flex items-center justify-between gap-2 border border-slate-800/80">
                  <span className="truncate font-mono text-blue-400" suppressHydrationWarning>
                    {dynamicTargetUrl}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(dynamicTargetUrl);
                      alert('Dynamic URL copied to clipboard!');
                    }}
                    className="text-slate-400 hover:text-white"
                    title="Copy URL"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Target Action & QR Type */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-400" />
                <span>Primary Customer Action</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {QR_ACTION_TYPES.map((t) => {
                  const Icon = t.icon;
                  const active = standee.qr_type === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() =>
                        setStandee({
                          ...standee,
                          qr_type: t.id,
                          primary_action: t.id,
                          smart_review_enabled: t.id === 'smart_review',
                        })
                      }
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        active
                          ? 'border-blue-500 bg-blue-600/15 text-blue-400 font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4 mb-1.5" />
                      <span className="text-xs">{t.label}</span>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Primary Destination / Link
                </label>
                <input
                  type="text"
                  value={standee.destination}
                  onChange={(e) => setStandee({ ...standee, destination: e.target.value })}
                  placeholder={
                    QR_ACTION_TYPES.find((t) => t.id === standee.qr_type)?.defaultPlaceholder
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Smart Review Shield Settings */}
              {standee.qr_type === 'smart_review' && (
                <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs space-y-2">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Review Shield Protection Enabled</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Customers who give 4-5 stars are forwarded to Google. Customers rating 1-3 stars are kept private.
                  </p>
                  <label className="block text-slate-400 text-[11px] font-semibold">
                    Public Google Reviews Page Link:
                  </label>
                  <input
                    type="text"
                    value={standee.google_review_url || ''}
                    onChange={(e) => setStandee({ ...standee, google_review_url: e.target.value })}
                    placeholder="https://g.page/r/... or Google Maps place link"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              )}

              {/* Time-Based Smart Routing Toggle */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-blue-400" />
                    <span>Time-Based Smart Routing</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={standee.smart_routing_enabled || false}
                    onChange={(e) =>
                      setStandee({ ...standee, smart_routing_enabled: e.target.checked })
                    }
                    className="rounded border-slate-700 bg-slate-800 text-blue-600"
                  />
                </div>

                {standee.smart_routing_enabled && (
                  <div className="space-y-2 mt-2 text-xs">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">
                        Lunch URL (11:00 AM – 4:00 PM):
                      </label>
                      <input
                        type="text"
                        value={standee.lunch_url || ''}
                        onChange={(e) => setStandee({ ...standee, lunch_url: e.target.value })}
                        placeholder="https://yourrestaurant.com/lunch"
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">
                        Dinner URL (4:00 PM – 11:00 PM):
                      </label>
                      <input
                        type="text"
                        value={standee.dinner_url || ''}
                        onChange={(e) => setStandee({ ...standee, dinner_url: e.target.value })}
                        placeholder="https://yourrestaurant.com/dinner"
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Business Details */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-3">Business Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={standee.name}
                    onChange={(e) => setStandee({ ...standee, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={standee.category}
                      onChange={(e) => setStandee({ ...standee, category: e.target.value })}
                      placeholder="Cafe, Salon, Clinic..."
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Tagline / Subtext
                    </label>
                    <input
                      type="text"
                      value={standee.tagline}
                      onChange={(e) => setStandee({ ...standee, tagline: e.target.value })}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={standee.phone}
                      onChange={(e) => setStandee({ ...standee, phone: e.target.value })}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Website / Social
                    </label>
                    <input
                      type="text"
                      value={standee.website}
                      onChange={(e) => setStandee({ ...standee, website: e.target.value })}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Physical Address
                  </label>
                  <input
                    type="text"
                    value={standee.address}
                    onChange={(e) => setStandee({ ...standee, address: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Standee Size & Orientation */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Printer className="h-4 w-4 text-blue-400" />
                <span>Print Dimensions & Format</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Standard Size
                  </label>
                  <select
                    value={standee.size}
                    onChange={(e) =>
                      setStandee({ ...standee, size: e.target.value as StandeeSize })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    {STANDARDS_SIZES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.widthMm} × {s.heightMm} mm)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Orientation
                  </label>
                  <select
                    value={standee.orientation}
                    onChange={(e) =>
                      setStandee({ ...standee, orientation: e.target.value as Orientation })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 5. QR Code Styling & Colors */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4 text-blue-400" />
                <span>QR Styling & Brand Palette</span>
              </h3>

              {/* QR Shapes */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  QR Pattern Shape
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['square', 'rounded', 'dots'] as QRShape[]).map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setStandee({ ...standee, qr_shape: shape })}
                      className={`rounded-lg border py-2 text-xs font-bold capitalize transition-all ${
                        standee.qr_shape === shape
                          ? 'border-blue-500 bg-blue-600/15 text-blue-400'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Accent / Brand Color
                  </label>
                  <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 p-1.5">
                    <input
                      type="color"
                      value={standee.accent_color}
                      onChange={(e) => setStandee({ ...standee, accent_color: e.target.value })}
                      className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
                    />
                    <span className="font-mono text-xs text-slate-300">
                      {standee.accent_color}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    QR Code Color
                  </label>
                  <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 p-1.5">
                    <input
                      type="color"
                      value={standee.qr_color}
                      onChange={(e) => setStandee({ ...standee, qr_color: e.target.value })}
                      className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
                    />
                    <span className="font-mono text-xs text-slate-300">{standee.qr_color}</span>
                  </div>
                </div>
              </div>

              {/* CTA Text */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Call-to-Action (CTA) Ribbon
                </label>
                <input
                  type="text"
                  value={standee.cta_text}
                  onChange={(e) => setStandee({ ...standee, cta_text: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Center Logo Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Embed Center Logo (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700 bg-slate-950 p-3 text-xs text-slate-400 hover:border-blue-500 hover:text-white transition-all">
                    <ImageIcon className="h-4 w-4" />
                    <span>{standee.logo_url ? 'Change Logo' : 'Upload PNG / SVG Logo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {standee.logo_url && (
                    <button
                      onClick={() => setStandee({ ...standee, logo_url: '' })}
                      className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-3 text-xs font-bold text-rose-400 hover:bg-rose-500/20"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 6. Presets / Templates */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-3">Switch Template Preset</h3>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl.id)}
                    className={`rounded-xl border p-2.5 text-left text-xs transition-all ${
                      standee.template_id === tmpl.id
                        ? 'border-blue-500 bg-blue-600/15 text-white font-bold'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold text-slate-200">{tmpl.name}</div>
                    <div className="text-[10px] text-slate-500">{tmpl.category}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* RIGHT: LIVE PREVIEW & EXPORT */}
          {/* ==================================================== */}
          <div
            className={`space-y-6 lg:col-span-6 xl:col-span-7 ${
              mobileTab === 'editor' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Sticky Preview Header Toolbar */}
            <div className="sticky top-20 z-30 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 backdrop-blur-xl shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {currentSizeObj.name} ({standee.orientation})
                  </span>
                  <div className="text-sm font-extrabold text-white">Interactive Standee Preview</div>
                </div>

                {/* Export Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => exportHighResPNG(standee, effectiveQRPayload)}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>300 DPI PNG</span>
                  </button>
                  <button
                    onClick={() => exportStandeeSVG(standee, effectiveQRPayload)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Vector SVG</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Standee Canvas Preview Area */}
            <div className="flex justify-center items-start rounded-3xl border border-slate-800 bg-slate-950/80 p-4 sm:p-10 canvas-grid min-h-[620px] overflow-hidden">
              <div
                id="printable-standee"
                className="relative bg-white text-slate-900 rounded-lg shadow-2xl transition-all duration-300 flex flex-col items-center justify-between text-center overflow-hidden border border-slate-200 print-area"
                style={{
                  width: isLandscape ? 'min(100%, 540px)' : 'min(100%, 390px)',
                  minHeight: isLandscape ? '380px' : '550px',
                  padding: '28px 24px',
                }}
              >
                {/* Top Accent Ribbon */}
                <div
                  className="absolute top-0 left-0 right-0 h-2.5"
                  style={{ backgroundColor: standee.accent_color }}
                />

                {/* Header Content */}
                <div className="w-full flex flex-col items-center pt-2">
                  {standee.logo_url && (
                    <div className="mb-3 h-14 w-14 rounded-full border border-slate-200 shadow-md overflow-hidden bg-white p-0.5">
                      <img
                        src={standee.logo_url}
                        alt="Logo"
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                  )}
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {standee.name || 'Your Business Name'}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
                    {standee.category ? `${standee.category} • ` : ''}
                    {standee.tagline || 'Scan to connect with us'}
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="my-6 rounded-2xl bg-white p-3 shadow-xl border border-slate-200/80">
                  {qrCanvasUrl ? (
                    <img
                      src={qrCanvasUrl}
                      alt="QR Code"
                      className="h-48 w-48 sm:h-56 sm:w-56 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="h-48 w-48 sm:h-56 sm:w-56 flex items-center justify-center bg-slate-50">
                      <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                  )}
                </div>

                {/* CTA Button Badge */}
                <div
                  className="rounded-full px-5 py-2 text-xs sm:text-sm font-black text-white shadow-md tracking-wider uppercase"
                  style={{ backgroundColor: standee.accent_color }}
                >
                  {standee.cta_text || 'SCAN TO VISIT'}
                </div>

                {/* Footer Business Details */}
                <div className="mt-5 space-y-0.5 text-[11px] sm:text-xs text-slate-600 font-medium">
                  {standee.phone && <div>📞 {standee.phone}</div>}
                  {standee.website && <div>🌐 {standee.website}</div>}
                  {standee.address && <div>📍 {standee.address}</div>}
                  {standee.extra_info && <div className="text-[10px] text-slate-400">{standee.extra_info}</div>}
                </div>

                {/* Micro Brand Stamp */}
                <div className="mt-4 text-[9px] font-bold text-slate-400 tracking-widest uppercase">
                  ⚡ POWERED BY QRSTANDEE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Success Floating Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-2xl animate-bounce">
          <Check className="h-5 w-5" />
          <span>Standee design saved to dashboard successfully!</span>
        </div>
      )}
    </div>
  );
}
