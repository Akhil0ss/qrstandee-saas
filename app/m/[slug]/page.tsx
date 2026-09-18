'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MenuRecord, MenuItemRecord } from '@/lib/types';
import { getMenuBySlug } from '@/lib/supabase/store';
import {
  Utensils,
  Search,
  Sparkles,
  Star,
  PhoneCall,
  CreditCard,
  CheckCircle2,
  Share2,
  ChevronDown,
  Info,
  Clock,
  Heart,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function PublicMenuPage() {
  const params = useParams();
  const slug = String(params?.slug || '');

  const [menu, setMenu] = useState<MenuRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [waiterCalled, setWaiterCalled] = useState(false);

  useEffect(() => {
    async function loadMenu() {
      if (!slug) return;
      setLoading(true);
      const data = await getMenuBySlug(slug);
      setMenu(data);
      setLoading(false);
    }
    loadMenu();
  }, [slug]);

  const handleCallWaiter = () => {
    setWaiterCalled(true);
    setTimeout(() => setWaiterCalled(false), 4000);
  };

  const handleShareMenu = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: menu?.name || 'Digital Menu',
        text: `Check out the live menu for ${menu?.name || 'our restaurant'}!`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Menu link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-white">
        <div className="relative">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <Utensils className="absolute inset-0 m-auto h-6 w-6 text-orange-400 animate-pulse" />
        </div>
        <p className="mt-4 text-sm font-bold text-slate-300">Loading Chef's Digital Menu...</p>
        <span className="mt-1 text-xs text-slate-500">Powered by Spotnet Services</span>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-white">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500">
          <Utensils className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-2xl font-black text-white">Menu Not Found</h2>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          The digital menu for <span className="font-mono text-orange-400 font-bold">"{slug}"</span> does not exist or has been paused by the restaurant manager.
        </p>
        <a
          href="/"
          className="mt-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-orange-500/25"
        >
          Return to QRStandee Home
        </a>
      </div>
    );
  }

  const categories = menu.categories || [];
  const currency = menu.currency || '₹';

  // Filter items
  const filteredCategories = categories
    .filter((cat) => selectedCategory === 'all' || cat.id === selectedCategory)
    .map((cat) => {
      const items = (cat.items || []).filter((item) => {
        // Search filter
        const matchesQuery =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

        // Diet filter
        const matchesDiet =
          dietFilter === 'all' ? true : dietFilter === 'veg' ? item.is_veg : !item.is_veg;

        return matchesQuery && matchesDiet;
      });
      return { ...cat, items };
    })
    .filter((cat) => cat.items.length > 0);

  const totalFilteredDishes = filteredCategories.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <div className="min-h-screen bg-slate-950 pb-28 text-white font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Top Banner / Restaurant Cover */}
      <header className="relative border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 px-4 pt-8 pb-6 sm:px-6">
        <div className="mx-auto max-w-2xl">
          {/* Action Row */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[11px] font-extrabold text-orange-400">
              <Sparkles className="h-3 w-3" />
              <span>LIVE DIGITAL MENU</span>
            </div>
            <button
              onClick={handleShareMenu}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
          </div>

          {/* Restaurant Title & Bio */}
          <div className="mt-4">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {menu.name}
            </h1>
            {menu.bio && (
              <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {menu.bio}
              </p>
            )}
          </div>

          {/* Search Bar */}
          <div className="mt-5 relative">
            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pizza, paneer, pasta, shakes..."
              className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/90 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-500 shadow-inner focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Veg / Non-Veg Quick Dietary Pills */}
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDietFilter('all')}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                dietFilter === 'all'
                  ? 'bg-slate-200 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              All Items
            </button>
            <button
              type="button"
              onClick={() => setDietFilter('veg')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                dietFilter === 'veg'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'bg-slate-900 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Veg Only
            </button>
            <button
              type="button"
              onClick={() => setDietFilter('non-veg')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                dietFilter === 'non-veg'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'bg-slate-900 text-rose-400 border border-rose-500/30 hover:bg-rose-500/10'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              Non-Veg
            </button>
          </div>
        </div>
      </header>

      {/* Horizontal Sticky Category Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-slate-800/90 bg-slate-950/95 backdrop-blur-md px-4 py-2.5">
        <div className="mx-auto flex max-w-2xl items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
                }`}
              >
                {cat.name} ({cat.items?.length || 0})
              </button>
            );
          })}
        </div>
      </nav>

      {/* Waiter Alert Toast */}
      {waiterCalled && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-emerald-950/95 px-5 py-3 text-xs sm:text-sm font-bold text-emerald-300 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          <span>Server notified! A waiter is heading to your table.</span>
        </div>
      )}

      {/* Food Menu Catalog Items */}
      <main className="mx-auto max-w-2xl px-4 pt-6">
        {totalFilteredDishes === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 py-16 px-4 text-center">
            <Utensils className="mx-auto h-10 w-10 text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-white">No dishes found</h3>
            <p className="mt-1 text-xs text-slate-400">
              Try adjusting your search query or dietary filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDietFilter('all');
                setSelectedCategory('all');
              }}
              className="mt-4 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((cat) => (
              <section key={cat.id} className="space-y-3">
                {/* Category Header */}
                <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
                  <h2 className="text-lg font-black tracking-tight text-white">
                    {cat.name}
                  </h2>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-400">
                    {cat.items.length}
                  </span>
                </div>

                {/* Items in Category */}
                <div className="space-y-3">
                  {cat.items.map((item) => (
                    <article
                      key={item.id}
                      className="group rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 transition-all hover:border-slate-700 hover:bg-slate-900/90 shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {/* Veg / Non-Veg Icon */}
                          <div
                            className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${
                              item.is_veg
                                ? 'border-emerald-500 bg-emerald-500/10'
                                : 'border-rose-500 bg-rose-500/10'
                            }`}
                            title={item.is_veg ? 'Vegetarian' : 'Non-Vegetarian'}
                          >
                            <div
                              className={`h-2 w-2 rounded-full ${
                                item.is_veg ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm sm:text-base font-bold text-white">
                                {item.name}
                              </h3>
                              {item.is_bestseller && (
                                <span className="inline-flex items-center gap-0.5 rounded-md border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[10px] font-black text-amber-400">
                                  <Sparkles className="h-2.5 w-2.5" /> BESTSELLER
                                </span>
                              )}
                            </div>

                            {item.description && (
                              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Price & Stock */}
                        <div className="text-right flex-shrink-0">
                          <div className="text-base font-black text-emerald-400">
                            {currency}
                            {item.price}
                          </div>
                          {!item.is_available && (
                            <span className="mt-1 inline-block text-[10px] font-bold text-rose-400">
                              Sold Out
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-14 border-t border-slate-800/80 pt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-orange-400" />
            <span>
              Official Digital Food Menu created by{' '}
              <strong className="text-white">Spotnet Services</strong>
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-600">
            Prices are subject to applicable taxes. Images and descriptions are for illustrative purposes.
          </p>
        </div>
      </main>

      {/* Floating Bottom Quick Action Dock */}
      <div className="fixed bottom-3 left-0 right-0 z-50 px-4">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl">
          <button
            type="button"
            onClick={handleCallWaiter}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
          >
            <PhoneCall className="h-3.5 w-3.5 text-orange-400" />
            <span>Call Waiter</span>
          </button>

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-orange-500/25 hover:brightness-110 transition-all"
          >
            <Star className="h-3.5 w-3.5 fill-slate-950" />
            <span>Rate 5★</span>
          </a>
        </div>
      </div>
    </div>
  );
}
