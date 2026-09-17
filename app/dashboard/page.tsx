'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StandeeRecord, PrivateFeedbackRecord } from '@/lib/types';
import { getStandees, deleteStandee, saveStandee, getPrivateFeedback } from '@/lib/supabase/store';
import { exportHighResPNG, exportStandeeSVG } from '@/lib/export-helpers';
import {
  LayoutDashboard,
  QrCode,
  Sparkles,
  BarChart3,
  ExternalLink,
  Edit,
  Trash2,
  Copy,
  Plus,
  ArrowUpRight,
  Clock,
  Smartphone,
  Eye,
  Check,
  RefreshCw,
  Search,
  Layers,
  Star,
  MessageSquare,
  ShieldCheck,
  SmartphoneNfc,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const [standees, setStandees] = useState<StandeeRecord[]>([]);
  const [feedbacks, setFeedbacks] = useState<PrivateFeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDestinationId, setEditingDestinationId] = useState<string | null>(null);
  const [newDestinationValue, setNewDestinationValue] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'standees' | 'feedback' | 'analytics'>('standees');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [sData, fbData] = await Promise.all([getStandees(), getPrivateFeedback()]);
    setStandees(sData);
    setFeedbacks(fbData);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this standee?')) {
      await deleteStandee(id);
      loadData();
    }
  }

  async function handleQuickUpdateDestination(standee: StandeeRecord) {
    if (!newDestinationValue.trim()) return;
    const updated = { ...standee, destination: newDestinationValue.trim() };
    await saveStandee(updated);
    setEditingDestinationId(null);
    setNewDestinationValue('');
    loadData();
  }

  function handleCopyUrl(slug: string) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/${slug}`;
    navigator.clipboard?.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  }

  // Calculate Metrics
  const totalStandees = standees.length;
  const totalScans = standees.reduce((acc, curr) => acc + (curr.scans_count || 0), 0);
  const avgScans = totalStandees > 0 ? Math.round(totalScans / totalStandees) : 0;

  const filteredStandees = standees.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock Trend Data for Visual Analytics
  const trendDays = [
    { day: 'Mon', count: Math.round(totalScans * 0.1) },
    { day: 'Tue', count: Math.round(totalScans * 0.12) },
    { day: 'Wed', count: Math.round(totalScans * 0.14) },
    { day: 'Thu', count: Math.round(totalScans * 0.15) },
    { day: 'Fri', count: Math.round(totalScans * 0.22) },
    { day: 'Sat', count: Math.round(totalScans * 0.28) },
    { day: 'Sun', count: Math.round(totalScans * 0.25) },
  ];
  const maxDayCount = Math.max(...trendDays.map((d) => d.count), 10);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl flex items-center gap-2.5">
              <LayoutDashboard className="h-7 w-7 text-blue-500" />
              <span>SaaS Standee Command Center</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage dynamic QR codes, change destinations instantly, view private feedback & scan analytics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/bulk"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-all shadow-sm"
            >
              <Layers className="h-4 w-4 text-purple-400" />
              <span>Bulk Table Standees</span>
            </Link>
            <Link
              href="/studio"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Create Standee</span>
            </Link>
          </div>
        </div>

        {/* 1. SaaS Metrics Overview */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Standees
            </span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-white">{totalStandees}</div>
            <div className="mt-1 text-[11px] text-emerald-400 font-semibold">Active & Live</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Recorded Scans
            </span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-blue-400">{totalScans}</div>
            <div className="mt-1 text-[11px] text-slate-500">Across all counters</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Avg. Scans / Standee
            </span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-purple-400">{avgScans}</div>
            <div className="mt-1 text-[11px] text-slate-500">Per commercial standee</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Protected Negative Reviews
            </span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-400">{feedbacks.length}</div>
            <div className="mt-1 text-[11px] text-emerald-400 font-semibold">Shield Active</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex border-b border-slate-800 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('standees')}
            className={`flex items-center gap-2 pb-3 px-4 border-b-2 transition-all ${
              activeTab === 'standees'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="h-4 w-4" />
            <span>Standees ({filteredStandees.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 pb-3 px-4 border-b-2 transition-all ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Scan Analytics & Trends</span>
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center gap-2 pb-3 px-4 border-b-2 transition-all ${
              activeTab === 'feedback'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Private Feedback Shield ({feedbacks.length})</span>
          </button>
        </div>

        {/* TAB 1: STANDEES */}
        {activeTab === 'standees' && (
          <div className="mt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-base font-bold text-white">Your Commercial Standees</h2>

              {/* Search filter */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search standees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-4 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex h-48 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : filteredStandees.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 py-12 text-center">
                <QrCode className="h-10 w-10 text-slate-600 mb-3" />
                <p className="text-sm font-semibold text-slate-300">No standees found</p>
                <Link
                  href="/studio"
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
                >
                  Launch Studio
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredStandees.map((standee) => {
                  const origin = typeof window !== 'undefined' ? window.location.origin : '';
                  const dynamicUrl = `${origin}/${standee.slug}`;
                  const isEditing = editingDestinationId === standee.id;

                  return (
                    <div
                      key={standee.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <h3 className="text-base font-bold text-white">{standee.name}</h3>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {standee.category || 'Business'} • {standee.size.toUpperCase()}{' '}
                            ({standee.orientation})
                          </p>
                        </div>

                        {/* Scans badge */}
                        <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-center">
                          <span className="block text-sm font-black text-blue-400">
                            {standee.scans_count || 0}
                          </span>
                          <span className="text-[10px] text-slate-400">Scans</span>
                        </div>
                      </div>

                      {/* Dynamic Redirect Bar */}
                      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Dynamic URL:</span>
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`/${standee.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-blue-400 hover:underline flex items-center gap-1"
                            >
                              /{standee.slug}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                            <button
                              onClick={() => handleCopyUrl(standee.slug)}
                              className="text-slate-400 hover:text-white p-1"
                              title="Copy Dynamic URL"
                            >
                              {copiedSlug === standee.slug ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Target Destination (Change without reprinting!) */}
                        <div className="pt-1 border-t border-slate-900 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-slate-400">Current Target Destination:</span>
                            {!isEditing && (
                              <button
                                onClick={() => {
                                  setEditingDestinationId(standee.id);
                                  setNewDestinationValue(standee.destination);
                                }}
                                className="text-[11px] font-semibold text-blue-400 hover:underline"
                              >
                                Edit Target
                              </button>
                            )}
                          </div>

                          {isEditing ? (
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="text"
                                value={newDestinationValue}
                                onChange={(e) => setNewDestinationValue(e.target.value)}
                                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                                placeholder="New URL or destination"
                              />
                              <button
                                onClick={() => handleQuickUpdateDestination(standee)}
                                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingDestinationId(null)}
                                className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="truncate font-mono text-slate-300">
                              {standee.destination || 'Not set'}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom Actions Toolbar */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-3 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {standee.last_scan_at
                              ? `Last scan: ${new Date(standee.last_scan_at).toLocaleDateString()}`
                              : 'No scans yet'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => exportHighResPNG(standee, dynamicUrl)}
                            className="rounded-lg border border-slate-800 bg-slate-800/80 px-2.5 py-1.5 font-semibold text-slate-300 hover:text-white transition-all"
                          >
                            Download PNG
                          </button>
                          <button
                            onClick={() => exportStandeeSVG(standee, dynamicUrl)}
                            className="rounded-lg border border-slate-800 bg-slate-800/80 px-2.5 py-1.5 font-semibold text-slate-300 hover:text-white transition-all"
                          >
                            SVG
                          </button>
                          <button
                            onClick={() => handleDelete(standee.id)}
                            className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-1.5 text-rose-400 hover:bg-rose-500/20 transition-all"
                            title="Delete Standee"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VISUAL ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="mt-6 space-y-6">
            {/* Weekly Scan Trend Chart */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    <span>Weekly Scan Volume Trend</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live scan frequency across customer tables & checkout counters
                  </p>
                </div>
                <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-xs font-bold text-blue-400">
                  Last 7 Days
                </span>
              </div>

              {/* Bar Chart Visualization */}
              <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-4 border-b border-slate-800">
                {trendDays.map((d) => {
                  const heightPercent = Math.max(12, Math.round((d.count / maxDayCount) * 100));
                  return (
                    <div key={d.day} className="flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] font-bold text-blue-400">{d.count}</span>
                      <div
                        className="w-full max-w-[38px] rounded-t-lg bg-gradient-to-t from-blue-700 to-indigo-500 hover:from-blue-600 hover:to-indigo-400 transition-all shadow-md"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-xs text-slate-400 font-semibold">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Device & Location Telemetry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-emerald-400" />
                  <span>Device Breakdown</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Mobile (iOS & Android)</span>
                      <span className="font-bold text-emerald-400">88%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[88%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Desktop</span>
                      <span className="font-bold text-blue-400">9%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-[9%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Tablets & Others</span>
                      <span className="font-bold text-purple-400">3%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full w-[3%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <span>Peak Scanning Hours</span>
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span>Lunch Rush (12:00 PM – 3:30 PM)</span>
                    <span className="font-bold text-amber-400">42% of traffic</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span>Dinner Peak (7:30 PM – 10:45 PM)</span>
                    <span className="font-bold text-indigo-400">48% of traffic</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span>Late Night / Off-Hours</span>
                    <span className="font-bold text-slate-400">10% of traffic</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SMART REVIEW FEEDBACK INBOX */}
        {activeTab === 'feedback' && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span>Private Customer Feedback Inbox</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Filtered 1-3 star reviews captured privately before reaching Google Maps
                </p>
              </div>
            </div>

            {feedbacks.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
                <ShieldCheck className="mx-auto h-10 w-10 text-emerald-500 mb-2" />
                <h3 className="text-sm font-bold text-white">Zero Negative Reviews Logged</h3>
                <p className="text-xs text-slate-400 mt-1">
                  When a customer rates 1-3 stars on a Review Shield standee, their private feedback will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {feedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="rounded-2xl border border-amber-500/20 bg-slate-900/90 p-5 shadow-lg"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-4 w-4 ${
                              s <= fb.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-xs font-bold text-amber-400">
                          {fb.rating} / 5 Stars
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {new Date(fb.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                      "{fb.feedback}"
                    </p>

                    {fb.customer_contact && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">Customer Contact:</span>
                        <a
                          href={fb.customer_contact.includes('@') ? `mailto:${fb.customer_contact}` : `tel:${fb.customer_contact}`}
                          className="font-mono text-blue-400 hover:underline"
                        >
                          {fb.customer_contact}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
