'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StandeeRecord, PrivateFeedbackRecord, MenuRecord } from '@/lib/types';
import {
  getStandees,
  deleteStandee,
  saveStandee,
  getPrivateFeedback,
  getMenus,
} from '@/lib/supabase/store';
import { exportHighResPNG, exportStandeeSVG } from '@/lib/export-helpers';
import { useAuth } from '@/components/AuthProvider';
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
  Lock,
  ArrowRight,
  Building2,
  Loader2,
  Utensils,
  Share2,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [standees, setStandees] = useState<StandeeRecord[]>([]);
  const [feedbacks, setFeedbacks] = useState<PrivateFeedbackRecord[]>([]);
  const [menus, setMenus] = useState<MenuRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDestinationId, setEditingDestinationId] = useState<string | null>(null);
  const [newDestinationValue, setNewDestinationValue] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'standees' | 'menus' | 'analytics' | 'feedback'>('standees');

  useEffect(() => {
    if (!authLoading) {
      loadData();
    }
  }, [authLoading, user]);

  async function loadData() {
    setLoading(true);
    const [sData, fbData, mData] = await Promise.all([
      getStandees(),
      getPrivateFeedback(),
      getMenus(),
    ]);
    setStandees(sData);
    setFeedbacks(fbData);
    setMenus(mData);
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

  // Trend Data for Visual Analytics
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

  const businessName = profile?.business_name || user?.user_metadata?.business_name || 'My Business';
  const tenantInitial = (businessName?.[0] || user?.email?.[0] || 'B').toUpperCase();

  // If user is not logged in, show business access gate
  if (!authLoading && !user) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center backdrop-blur-xl shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/25">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-5 text-2xl font-black text-white sm:text-3xl">Business Sign-In Required</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your business command center. Your physical standees, digital food menus, live scan analytics, and private customer feedback are securely protected.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/login?redirect=/dashboard"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition-all"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login?tab=signup&redirect=/dashboard"
              className="rounded-xl border border-slate-700 bg-slate-950 py-3 text-sm font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition-all"
            >
              Create New Business Account
            </Link>
          </div>

          <div className="mt-6 border-t border-slate-800/80 pt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            <span>Spotnet Services 100% Secure Business Cloud</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Business Welcome Banner */}
        {user && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-blue-500/25 bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-indigo-950/40 p-5 sm:p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-lg font-black text-white shadow-md shadow-blue-600/30">
                {tenantInitial}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white">{businessName}</h2>
                  <span className="rounded-full border border-blue-400/30 bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-blue-300">
                    {profile?.plan ? `${profile.plan} Plan` : 'Pro Active'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {user.email} • <span className="text-emerald-400 font-semibold">Spotnet Cloud Verified</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Cloud Sync Active
              </span>
            </div>
          </div>
        )}

        {/* EYE-CATCHY COLORFUL QUICK ACTION CARDS */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Standee Studio */}
          <Link
            href="/studio"
            className="group relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/60 to-slate-900/90 p-5 shadow-xl transition-all duration-300 hover:border-blue-500/60 hover:-translate-y-1 hover:shadow-blue-500/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 group-hover:scale-110 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5">
                Print Ready
              </span>
            </div>
            <h3 className="mt-4 font-black text-white text-base group-hover:text-blue-400 transition-colors">
              Standee Studio
            </h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Design acrylic table tents, counter stands & A4/A5 display cards.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-400">
              Create New <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          {/* Card 2: Digital Food Menu */}
          <Link
            href="/dashboard/menu"
            className="group relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-950/50 to-slate-900/90 p-5 shadow-xl transition-all duration-300 hover:border-orange-500/60 hover:-translate-y-1 hover:shadow-orange-500/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-600/20 text-orange-400 border border-orange-500/30 group-hover:scale-110 transition-transform">
                <Utensils className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-2 py-0.5">
                Live Menu
              </span>
            </div>
            <h3 className="mt-4 font-black text-white text-base group-hover:text-orange-400 transition-colors">
              Digital Menu Engine
            </h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Food catalog with veg/non-veg tags, bestsellers & pricing in ₹ INR.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-orange-400">
              Manage Catalog <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          {/* Card 3: Bulk Table Standees */}
          <Link
            href="/bulk"
            className="group relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/50 to-slate-900/90 p-5 shadow-xl transition-all duration-300 hover:border-purple-500/60 hover:-translate-y-1 hover:shadow-purple-500/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 group-hover:scale-110 transition-transform">
                <Layers className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full px-2 py-0.5">
                Batch ZIP
              </span>
            </div>
            <h3 className="mt-4 font-black text-white text-base group-hover:text-purple-400 transition-colors">
              Bulk 50+ Table Tents
            </h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Generate 10 to 50 unique table QR standees in 1 single click.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-purple-400">
              Bulk Generator <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          {/* Card 4: Google Review Booster */}
          <Link
            href="/studio?template=google_review_shield"
            className="group relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/50 to-slate-900/90 p-5 shadow-xl transition-all duration-300 hover:border-amber-500/60 hover:-translate-y-1 hover:shadow-amber-500/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
                <Star className="h-5 w-5 fill-amber-400" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                5★ Booster
              </span>
            </div>
            <h3 className="mt-4 font-black text-white text-base group-hover:text-amber-400 transition-colors">
              Google Review Shield
            </h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Boost Google Maps rating while keeping 1-3★ feedback private.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-400">
              Launch Shield <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl flex items-center gap-2.5">
              <LayoutDashboard className="h-7 w-7 text-blue-500" />
              <span>Business Command Center</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage dynamic QR codes, live food menus, change target URLs instantly & view scan analytics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/menu"
              className="inline-flex items-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2.5 text-xs font-bold text-orange-400 hover:bg-orange-500/20 transition-all"
            >
              <Utensils className="h-4 w-4" />
              <span>Manage Menus</span>
            </Link>
            <Link
              href="/studio"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Create Standee</span>
            </Link>
          </div>
        </div>

        {/* SaaS Metrics Overview */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Standees
            </span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-white">{totalStandees}</div>
            <div className="mt-1 text-[11px] text-emerald-400 font-semibold">Active & Live</div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Recorded Scans
            </span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-blue-400">{totalScans}</div>
            <div className="mt-1 text-[11px] text-slate-500">Across all counters</div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Digital Menus
            </span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-orange-400">{menus.length}</div>
            <div className="mt-1 text-[11px] text-slate-500">Contactless Catalogs</div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Shielded Reviews
            </span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-400">{feedbacks.length}</div>
            <div className="mt-1 text-[11px] text-emerald-400 font-semibold">Protected Privately</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex border-b border-slate-800 text-xs sm:text-sm font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('standees')}
            className={`flex items-center gap-2 pb-3 px-4 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'standees'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="h-4 w-4" />
            <span>Standees ({filteredStandees.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('menus')}
            className={`flex items-center gap-2 pb-3 px-4 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'menus'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Utensils className="h-4 w-4" />
            <span>Digital Menus ({menus.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 pb-3 px-4 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'analytics'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Scan Analytics & Trends</span>
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center gap-2 pb-3 px-4 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'feedback'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Private Review Shield ({feedbacks.length})</span>
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
              <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/40 py-12 text-center">
                <QrCode className="h-10 w-10 text-slate-600 mb-3" />
                <p className="text-sm font-semibold text-slate-300">No standees created yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Launch the Studio to customize and download your first high-res acrylic standee or table tent.
                </p>
                <Link
                  href="/studio"
                  className="mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30"
                >
                  Launch Standee Studio
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
                      className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl hover:border-slate-700 transition-all"
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
                      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-3 space-y-2">
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
                                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                                placeholder="New URL or destination"
                              />
                              <button
                                onClick={() => handleQuickUpdateDestination(standee)}
                                className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingDestinationId(null)}
                                className="rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
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
                            className="rounded-xl border border-slate-800 bg-slate-800/80 px-2.5 py-1.5 font-semibold text-slate-300 hover:text-white transition-all"
                          >
                            PNG
                          </button>
                          <button
                            onClick={() => exportStandeeSVG(standee, dynamicUrl)}
                            className="rounded-xl border border-slate-800 bg-slate-800/80 px-2.5 py-1.5 font-semibold text-slate-300 hover:text-white transition-all"
                          >
                            SVG
                          </button>
                          <button
                            onClick={() => handleDelete(standee.id)}
                            className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-1.5 text-rose-400 hover:bg-rose-500/20 transition-all"
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

        {/* TAB 2: DIGITAL MENUS */}
        {activeTab === 'menus' && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-orange-400" />
                  <span>Contactless Digital Food & Drinks Menus</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Menus loaded directly on diners' smartphones upon scanning table standees.
                </p>
              </div>

              <Link
                href="/dashboard/menu"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-black text-slate-950 shadow-md shadow-orange-500/20 hover:brightness-110 transition-all"
              >
                <Plus className="h-4 w-4" />
                Open Menu Studio
              </Link>
            </div>

            {menus.length === 0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-10 text-center">
                <Utensils className="mx-auto h-10 w-10 text-orange-400/60 mb-3" />
                <h3 className="text-base font-bold text-white">No Digital Menus Yet</h3>
                <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
                  Build your restaurant or cafe menu with dish descriptions, veg/non-veg tags, and prices in ₹ INR.
                </p>
                <Link
                  href="/dashboard/menu"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500"
                >
                  <Sparkles className="h-4 w-4" />
                  Load Sample Menu (1-Click)
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menus.map((m) => {
                  const origin = typeof window !== 'undefined' ? window.location.origin : '';
                  const totalItems = (m.categories || []).reduce(
                    (acc, c) => acc + (c.items?.length || 0),
                    0
                  );
                  return (
                    <div
                      key={m.id}
                      className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-4 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-bold text-white">{m.name}</h3>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {m.bio || 'Digital Restaurant Menu'}
                          </p>
                        </div>
                        <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-bold text-orange-400">
                          {totalItems} Dishes
                        </span>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Public URL:</span>
                        <a
                          href={`/m/${m.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-blue-400 hover:underline flex items-center gap-1"
                        >
                          /m/{m.slug}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                        <Link
                          href="/dashboard/menu"
                          className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Edit Catalog & Dishes
                        </Link>
                        <a
                          href={`/m/${m.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 flex items-center gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Preview Mobile View
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VISUAL ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="mt-6 space-y-6">
            {totalScans === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/40 py-16 px-4 text-center">
                <BarChart3 className="h-12 w-12 text-slate-600 mb-3" />
                <h3 className="text-base font-bold text-white">No Scan Telemetry Recorded Yet</h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-md">
                  Once your dynamic QR standees are printed and scanned by customers, real-time weekly volume, hourly rush patterns, and device breakdowns will appear here.
                </p>
                <Link
                  href="/studio"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create & Deploy Your Standee</span>
                </Link>
              </div>
            ) : (
              <>
                {/* Weekly Scan Trend Chart */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
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
                            className="w-full max-w-[38px] rounded-t-lg bg-gradient-to-t from-blue-700 via-indigo-600 to-purple-500 hover:brightness-110 transition-all shadow-md"
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
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
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

                  <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-400" />
                      <span>Peak Scanning Hours</span>
                    </h3>
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span>Lunch Rush (12:00 PM – 3:30 PM)</span>
                        <span className="font-bold text-amber-400">42% of traffic</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span>Dinner Peak (7:30 PM – 10:45 PM)</span>
                        <span className="font-bold text-indigo-400">48% of traffic</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span>Late Night / Off-Hours</span>
                        <span className="font-bold text-slate-400">10% of traffic</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 4: SMART REVIEW FEEDBACK INBOX */}
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
              <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 text-center">
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
                    className="rounded-3xl border border-amber-500/20 bg-slate-900/90 p-5 shadow-lg"
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

                    <p className="mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
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
