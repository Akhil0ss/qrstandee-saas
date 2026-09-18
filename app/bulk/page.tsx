'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StandeeRecord, StandeeSize, Orientation } from '@/lib/types';
import { STANDARDS_SIZES } from '@/lib/standee-templates';
import { generateStyledQR } from '@/lib/qr-engine';
import { saveBulkStandees } from '@/lib/supabase/store';
import JSZip from 'jszip';
import { useAuth } from '@/components/AuthProvider';
import {
  Layers,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Utensils,
  Plus,
  ShieldCheck,
} from 'lucide-react';

export default function BulkGeneratorPage() {
  const { user, profile } = useAuth();
  const [baseName, setBaseName] = useState(profile?.business_name || 'The Brew Corner');
  const [baseSlug, setBaseSlug] = useState('brew-corner');
  const [tableCount, setTableCount] = useState(10);
  const [tablePrefix, setTablePrefix] = useState('Table');
  const [size, setSize] = useState<StandeeSize>('4x6');
  const [accentColor, setAccentColor] = useState('#2563eb');
  const [ctaText, setCtaText] = useState('SCAN FOR MENU & UPI PAY');
  const [destinationPattern, setDestinationPattern] = useState('https://thebrewcorner.com/menu');

  const [generatedTables, setGeneratedTables] = useState<StandeeRecord[]>([]);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  React.useEffect(() => {
    if (profile?.business_name) {
      setBaseName(profile.business_name);
      const slug = profile.business_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setBaseSlug(slug);
    }
  }, [profile]);

  function handleGenerate() {
    const list: StandeeRecord[] = [];
    const cleanBase = baseSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    for (let i = 1; i <= tableCount; i++) {
      const slug = `${cleanBase}-table-${i}`;
      list.push({
        id: `bulk-${Date.now()}-${i}`,
        slug,
        name: baseName,
        tagline: `${tablePrefix} #${i}`,
        category: 'Restaurant & Bar',
        phone: '+91 98765 43210',
        website: 'https://example.com',
        address: '',
        extra_info: `${tablePrefix} ${i}`,
        destination: destinationPattern,
        qr_type: 'multi_action',
        primary_action: 'multi_action',
        template_id: 'restaurant_menu',
        size,
        orientation: 'portrait',
        qr_color: '#0f172a',
        accent_color: accentColor,
        cta_text: ctaText,
        qr_shape: 'rounded',
        profile_style: 'clean',
        table_number: `${tablePrefix} #${i}`,
        scans_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    setGeneratedTables(list);
    saveBulkStandees(list);
  }

  async function handleDownloadZip() {
    if (generatedTables.length === 0) return;
    setIsGeneratingZip(true);
    setZipProgress(0);

    const zip = new JSZip();
    const folder = zip.folder(`${baseSlug}-table-standees`) || zip;

    for (let i = 0; i < generatedTables.length; i++) {
      const table = generatedTables[i];
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://qrstandee.app';
      const qrPayload = `${origin}/${table.slug}`;

      // Render 300 DPI Canvas
      const canvas = await renderTableStandeeCanvas(table, qrPayload);
      const dataUrl = canvas.toDataURL('image/png');
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

      folder.file(`${table.slug}.png`, base64Data, { base64: true });
      setZipProgress(Math.round(((i + 1) / generatedTables.length) * 100));
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${baseSlug}-tables-pack.zip`;
    link.click();

    setIsGeneratingZip(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-2">
              <Layers className="h-3.5 w-3.5" />
              <span>Multi-Location & Table Automation</span>
            </div>
            <h1 className="text-2xl font-black text-white sm:text-3xl">
              Bulk Multi-Table Standee Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Generate 10 to 100 table standees with distinct numbers, dynamic QR codes, and 1-click ZIP export.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {generatedTables.length > 0 && (
              <button
                onClick={handleDownloadZip}
                disabled={isGeneratingZip}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 transition-all"
              >
                {isGeneratingZip ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Zipping {zipProgress}%</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download All Standees (.ZIP)</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => window.print()}
              disabled={generatedTables.length === 0}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-40"
            >
              <Printer className="h-4 w-4" />
              <span>Batch Print</span>
            </button>
          </div>
        </div>

        {/* Generator Controls Card */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Restaurant / Business Name
              </label>
              <input
                type="text"
                value={baseName}
                onChange={(e) => setBaseName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Base Slug
              </label>
              <input
                type="text"
                value={baseSlug}
                onChange={(e) => setBaseSlug(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Number of Tables (1 to 50)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={tableCount}
                onChange={(e) => setTableCount(Math.min(50, Math.max(1, Number(e.target.value))))}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Standee Size Format
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as StandeeSize)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {STANDARDS_SIZES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.widthMm} × {s.heightMm} mm)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-5">
            <p className="text-xs text-slate-400">
              Each table will receive a permanent unique QR slug: <code className="text-blue-400 font-mono">/{baseSlug}-table-1</code>, <code className="text-blue-400 font-mono">/{baseSlug}-table-2</code>...
            </p>

            <button
              onClick={handleGenerate}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-blue-500 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate {tableCount} Table Standees</span>
            </button>
          </div>
        </div>

        {/* Generated Grid Showcase */}
        {generatedTables.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">
                Generated {generatedTables.length} Table Standees Ready for Printing
              </h2>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Saved to Dashboard
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {generatedTables.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center shadow-lg hover:border-slate-700 transition-all"
                >
                  <div className="inline-block rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[11px] font-black text-blue-400 mb-2">
                    {t.table_number}
                  </div>
                  <h3 className="text-xs font-bold text-white truncate">{t.name}</h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">/{t.slug}</p>

                  <div className="my-3 mx-auto flex h-24 w-24 items-center justify-center rounded-xl bg-white p-2 shadow-inner">
                    <span className="text-slate-900 font-black text-xs">QR READY</span>
                  </div>

                  <div className="rounded-lg bg-slate-950 py-1 text-[10px] font-bold text-slate-400">
                    {t.size.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

async function renderTableStandeeCanvas(standee: StandeeRecord, qrPayload: string): Promise<HTMLCanvasElement> {
  const scale = 3;
  const baseWidth = 400;
  const baseHeight = 560;

  const canvas = document.createElement('canvas');
  canvas.width = baseWidth * scale;
  canvas.height = baseHeight * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.scale(scale, scale);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, baseWidth, baseHeight);

  // Top accent stripe
  ctx.fillStyle = standee.accent_color || '#2563eb';
  ctx.fillRect(0, 0, baseWidth, 10);

  const cx = baseWidth / 2;

  // Table Pill Badge
  ctx.fillStyle = '#eff6ff';
  ctx.beginPath();
  ctx.roundRect(cx - 50, 25, 100, 26, 13);
  ctx.fill();

  ctx.fillStyle = standee.accent_color || '#2563eb';
  ctx.font = 'bold 12px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(standee.table_number || 'Table #1', cx, 42);

  // Name
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 24px -apple-system, sans-serif';
  ctx.fillText(standee.name, cx, 80);

  ctx.fillStyle = '#64748b';
  ctx.font = '12px -apple-system, sans-serif';
  ctx.fillText('Digital Table Concierge', cx, 100);

  // Render QR
  const qr = await generateStyledQR({
    text: qrPayload,
    size: 210,
    qrColor: '#0f172a',
    shape: 'rounded',
  });
  ctx.drawImage(qr, cx - 105, 125, 210, 210);

  // CTA
  ctx.fillStyle = standee.accent_color || '#2563eb';
  ctx.beginPath();
  ctx.roundRect(cx - 110, 360, 220, 34, 17);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px -apple-system, sans-serif';
  ctx.fillText(standee.cta_text || 'SCAN FOR MENU & UPI PAY', cx, 381);

  // Bottom note
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px -apple-system, sans-serif';
  ctx.fillText('⚡ POWERED BY QRSTANDEE SAAS', cx, 530);

  return canvas;
}
