'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MenuRecord,
  MenuCategoryRecord,
  MenuItemRecord,
} from '@/lib/types';
import {
  getMenus,
  saveMenu,
  deleteMenu,
  saveMenuCategory,
  deleteMenuCategory,
  saveMenuItem,
  deleteMenuItem,
} from '@/lib/supabase/store';
import { useAuth } from '@/components/AuthProvider';
import {
  Utensils,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Eye,
  Check,
  Save,
  Sparkles,
  ArrowLeft,
  QrCode,
  Flame,
  Leaf,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  IndianRupee,
  Share2,
  Copy,
  ChevronRight,
  ShieldCheck,
  Lock,
  ArrowRight,
} from 'lucide-react';

const SAMPLE_STARTER_MENU = {
  name: 'Grand Gourmet Cafe & Bistro',
  slug: 'grand-cafe-' + Math.floor(1000 + Math.random() * 9000),
  currency: '₹',
  bio: 'Artisanal coffee, wood-fired pizzas, gourmet pastas & handcrafted desserts.',
  categories: [
    {
      id: 'cat-1',
      name: 'Signature Starters & Appetizers',
      items: [
        {
          id: 'item-1',
          name: 'Crispy Peri Peri Paneer Bites',
          description: 'Spiced cottage cheese cubes tossed in chef special African peri peri glaze with garlic herb dip.',
          price: 249,
          is_veg: true,
          is_bestseller: true,
          is_available: true,
        },
        {
          id: 'item-2',
          name: 'Smoked BBQ Chicken Wings',
          description: 'Juicy wood-smoked chicken wings tossed in hickory barbecue sauce with ranch dipping.',
          price: 329,
          is_veg: false,
          is_bestseller: true,
          is_available: true,
        },
        {
          id: 'item-3',
          name: 'Loaded Truffle Parmesan Fries',
          description: 'Hand-cut golden fries drizzled with aromatic white truffle oil and freshly grated aged parmesan.',
          price: 199,
          is_veg: true,
          is_bestseller: false,
          is_available: true,
        },
      ],
    },
    {
      id: 'cat-2',
      name: 'Wood-Fired Gourmet Pizzas',
      items: [
        {
          id: 'item-4',
          name: 'Margherita Burrata Special (11")',
          description: 'San Marzano tomato sauce, fresh buffalo mozzarella, fresh basil, and creamy artisan burrata.',
          price: 449,
          is_veg: true,
          is_bestseller: true,
          is_available: true,
        },
        {
          id: 'item-5',
          name: 'Fiery Chicken Tikka Pizza (11")',
          description: 'Tandoor-charred chicken chunks, red paprika, bell peppers, mozzarella, and mint swirl.',
          price: 499,
          is_veg: false,
          is_bestseller: false,
          is_available: true,
        },
      ],
    },
    {
      id: 'cat-3',
      name: 'Craft Beverages & Shakes',
      items: [
        {
          id: 'item-6',
          name: 'Belgian Dark Chocolate Thickshake',
          description: 'Rich 70% dark Belgian chocolate ganache blended with creamy vanilla bean gelato.',
          price: 219,
          is_veg: true,
          is_bestseller: true,
          is_available: true,
        },
        {
          id: 'item-7',
          name: 'Zesty Passionfruit Mint Mojito',
          description: 'Fresh muddled garden mint, sparkling soda, crushed ice, and tropical passionfruit nectar.',
          price: 179,
          is_veg: true,
          is_bestseller: false,
          is_available: true,
        },
      ],
    },
  ],
};

export default function MenuDashboardPage() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading } = useAuth();

  const [menus, setMenus] = useState<MenuRecord[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<MenuRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // New Category / Item modal or inline states
  const [editingCategory, setEditingCategory] = useState<Partial<MenuCategoryRecord> | null>(null);
  const [editingItem, setEditingItem] = useState<{ categoryId: string; item: Partial<MenuItemRecord> } | null>(null);

  // Quick message
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading) {
      fetchMenus();
    }
  }, [authLoading, user]);

  async function fetchMenus() {
    setLoading(true);
    const data = await getMenus();
    setMenus(data);
    if (data.length > 0 && !selectedMenu) {
      setSelectedMenu(data[0]);
    }
    setLoading(false);
  }

  function showStatus(text: string, type: 'success' | 'error' = 'success') {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3500);
  }

  // Create or load sample menu
  async function handleCreateStarterMenu() {
    setSaving(true);
    const brandName = profile?.business_name || user?.user_metadata?.business_name || 'My Restaurant';
    const slugBase = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 18) || 'menu';
    const newSlug = `${slugBase}-${Math.floor(100 + Math.random() * 900)}`;

    const newMenuData: Partial<MenuRecord> = {
      name: `${brandName} Digital Menu`,
      slug: newSlug,
      currency: '₹',
      bio: 'Explore our chef-curated selection of fresh dishes, specials, and handcrafted drinks.',
      is_active: true,
      categories: SAMPLE_STARTER_MENU.categories.map((c, cIdx) => ({
        id: 'cat-' + Date.now() + '-' + cIdx,
        menu_id: '',
        name: c.name,
        sort_order: cIdx,
        items: c.items.map((it, itIdx) => ({
          id: 'item-' + Date.now() + '-' + cIdx + '-' + itIdx,
          category_id: 'cat-' + Date.now() + '-' + cIdx,
          menu_id: '',
          name: it.name,
          description: it.description,
          price: it.price,
          is_veg: it.is_veg,
          is_bestseller: it.is_bestseller,
          is_available: it.is_available,
          sort_order: itIdx,
        })),
      })),
    };

    const res = await saveMenu(newMenuData);
    if (res.success && res.data) {
      await fetchMenus();
      setSelectedMenu(res.data);
      showStatus('Sample menu loaded with starter items! Customize dishes anytime.');
    } else {
      showStatus(res.error || 'Failed to initialize menu', 'error');
    }
    setSaving(false);
  }

  async function handleSaveMenuHeader(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMenu) return;
    setSaving(true);
    const res = await saveMenu(selectedMenu);
    if (res.success && res.data) {
      setSelectedMenu(res.data);
      await fetchMenus();
      showStatus('Menu settings updated successfully!');
    } else {
      showStatus(res.error || 'Failed to save menu', 'error');
    }
    setSaving(false);
  }

  async function handleDeleteMenu(id: string) {
    if (!confirm('Are you sure you want to delete this menu? Scanners visiting this QR code will not be able to view it.')) return;
    await deleteMenu(id);
    const remaining = menus.filter((m) => m.id !== id);
    setMenus(remaining);
    setSelectedMenu(remaining[0] || null);
    showStatus('Menu removed.');
  }

  // Categories & Items
  async function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMenu || !editingCategory?.name?.trim()) return;

    const catId = editingCategory.id || 'cat-' + Date.now();
    const isNew = !editingCategory.id;

    let updatedCategories = [...(selectedMenu.categories || [])];
    if (isNew) {
      updatedCategories.push({
        id: catId,
        menu_id: selectedMenu.id,
        name: editingCategory.name.trim(),
        sort_order: updatedCategories.length,
        items: [],
      });
    } else {
      updatedCategories = updatedCategories.map((c) =>
        c.id === catId ? { ...c, name: editingCategory.name!.trim() } : c
      );
    }

    const updatedMenu = { ...selectedMenu, categories: updatedCategories };
    setSelectedMenu(updatedMenu);
    await saveMenu(updatedMenu);
    await saveMenuCategory({
      id: catId,
      menu_id: selectedMenu.id,
      name: editingCategory.name.trim(),
      sort_order: updatedCategories.length,
    });
    setEditingCategory(null);
    showStatus('Category saved!');
  }

  async function handleDeleteCategory(catId: string) {
    if (!confirm('Delete this category and all its items?')) return;
    if (!selectedMenu) return;

    const updatedCategories = (selectedMenu.categories || []).filter((c) => c.id !== catId);
    const updatedMenu = { ...selectedMenu, categories: updatedCategories };
    setSelectedMenu(updatedMenu);
    await saveMenu(updatedMenu);
    await deleteMenuCategory(catId);
    showStatus('Category removed.');
  }

  async function handleSaveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMenu || !editingItem) return;

    const { categoryId, item } = editingItem;
    if (!item.name?.trim()) return;

    const itemId = item.id || 'item-' + Date.now();
    const isNew = !item.id;

    const updatedCategories = (selectedMenu.categories || []).map((cat) => {
      if (cat.id !== categoryId) return cat;
      let items = [...(cat.items || [])];
      if (isNew) {
        items.push({
          id: itemId,
          category_id: categoryId,
          menu_id: selectedMenu.id,
          name: item.name!.trim(),
          description: item.description || '',
          price: Number(item.price) || 0,
          is_veg: item.is_veg ?? true,
          is_bestseller: item.is_bestseller ?? false,
          is_available: item.is_available ?? true,
          sort_order: items.length,
        });
      } else {
        items = items.map((it) =>
          it.id === itemId
            ? {
                ...it,
                name: item.name!.trim(),
                description: item.description || '',
                price: Number(item.price) || 0,
                is_veg: item.is_veg ?? true,
                is_bestseller: item.is_bestseller ?? false,
                is_available: item.is_available ?? true,
              }
            : it
        );
      }
      return { ...cat, items };
    });

    const updatedMenu = { ...selectedMenu, categories: updatedCategories };
    setSelectedMenu(updatedMenu);
    await saveMenu(updatedMenu);
    await saveMenuItem({
      id: itemId,
      category_id: categoryId,
      menu_id: selectedMenu.id,
      name: item.name!.trim(),
      description: item.description || '',
      price: Number(item.price) || 0,
      is_veg: item.is_veg ?? true,
      is_bestseller: item.is_bestseller ?? false,
      is_available: item.is_available ?? true,
    });
    setEditingItem(null);
    showStatus('Menu item saved!');
  }

  async function handleDeleteItem(catId: string, itemId: string) {
    if (!confirm('Remove this food item?')) return;
    if (!selectedMenu) return;

    const updatedCategories = (selectedMenu.categories || []).map((cat) => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: (cat.items || []).filter((it) => it.id !== itemId) };
    });

    const updatedMenu = { ...selectedMenu, categories: updatedCategories };
    setSelectedMenu(updatedMenu);
    await saveMenu(updatedMenu);
    await deleteMenuItem(itemId);
    showStatus('Item removed.');
  }

  function handleCopyMenuLink(slug: string) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/m/${slug}`;
    navigator.clipboard?.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center bg-slate-950 px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center backdrop-blur-xl shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-600 shadow-xl shadow-orange-500/25">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Spotnet Services Cloud
          </div>
          <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">
            Business Account Required
          </h2>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Please sign in or register your business account to manage your restaurant's digital menus, edit dishes, update prices, and view live QR orders.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/login?tab=signup&redirect=/dashboard/menu"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 py-3.5 text-sm font-black text-slate-950 shadow-xl shadow-orange-500/30 hover:brightness-110 transition-all"
            >
              <span>Create Free Business Account</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login?redirect=/dashboard/menu"
              className="rounded-2xl border border-slate-700 bg-slate-950 py-3 text-sm font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition-all"
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-bold text-slate-300 hover:border-slate-700 hover:text-white transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
              <Utensils className="h-3.5 w-3.5" />
              Digital Food & Drinks Menu Studio
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/studio?template=restaurant_menu_deluxe"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-orange-500/20 hover:brightness-110 transition-all"
            >
              <QrCode className="h-4 w-4" />
              Design Standee For Menu
            </Link>
          </div>
        </div>

        {/* Status Toast */}
        {statusMsg && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl border p-4 text-sm font-semibold shadow-xl transition-all ${
              statusMsg.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Header Hero */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-blue-950/50 via-slate-900/80 to-purple-950/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400">
                <Utensils className="h-3.5 w-3.5" />
                Live Digital QR Menu Engine
              </div>
              <h1 className="mt-3 text-2xl font-black sm:text-3xl text-white">
                Contactless Smartphone Food Menus
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Guests scan your standee on their table and view your live food menu instantly on their phone. Update prices, veg/non-veg status, and bestsellers with zero reprint costs.
              </p>
            </div>

            {/* Quick Action */}
            <div className="flex flex-col sm:flex-row gap-3">
              {menus.length === 0 ? (
                <button
                  type="button"
                  onClick={handleCreateStarterMenu}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-500/25 hover:brightness-110 transition-all disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  Load Complete Ready Menu
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateStarterMenu}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-xs font-bold text-slate-200 hover:border-slate-600 transition-all"
                >
                  <Plus className="h-4 w-4 text-emerald-400" />
                  Create Another Menu
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="mt-8 flex h-64 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              <p className="mt-3 text-xs text-slate-400">Loading your menus...</p>
            </div>
          </div>
        ) : menus.length === 0 ? (
          /* Empty State */
          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/40 p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-xl shadow-orange-500/20">
              <Utensils className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-white">You haven't created a digital menu yet</h2>
            <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-slate-400">
              Start with our pre-populated restaurant cafe starter template featuring Starters, Gourmet Pizzas, and Craft Beverages with veg/non-veg tags and pricing in ₹ INR.
            </p>
            <button
              type="button"
              onClick={handleCreateStarterMenu}
              disabled={saving}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Initialize Ready-To-Use Menu (1-Click)
            </button>
          </div>
        ) : (
          /* Main Menu Editor Workspace */
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Menu Selector & Settings */}
            <div className="lg:col-span-4 space-y-6">
              {/* Menu Selector Cards */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Active Menus ({menus.length})
                  </h3>
                  <button
                    onClick={handleCreateStarterMenu}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> New
                  </button>
                </div>

                <div className="space-y-2">
                  {menus.map((m) => {
                    const isSelected = selectedMenu?.id === m.id;
                    const totalItems = (m.categories || []).reduce(
                      (acc, c) => acc + (c.items?.length || 0),
                      0
                    );
                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMenu(m)}
                        className={`cursor-pointer rounded-xl p-3 border transition-all ${
                          isSelected
                            ? 'border-blue-500/60 bg-blue-600/10 text-white shadow-md'
                            : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-bold text-sm truncate">{m.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              /m/{m.slug}
                            </div>
                          </div>
                          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                            {totalItems} items
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Menu Config & Live Link */}
              {selectedMenu && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                      <Share2 className="h-4 w-4 text-emerald-400" />
                      Live Customer Link
                    </h3>
                    <a
                      href={`/m/${selectedMenu.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      Open Menu
                    </a>
                  </div>

                  {/* Public Link Copy Bar */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <div className="text-[11px] text-slate-400 mb-1 font-semibold">
                      Public Mobile Menu URL:
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-blue-400 truncate">
                        /m/{selectedMenu.slug}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyMenuLink(selectedMenu.slug)}
                        className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-200 hover:bg-slate-700 flex items-center gap-1 transition-all"
                      >
                        {copiedUrl ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quick Settings Form */}
                  <form onSubmit={handleSaveMenuHeader} className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Restaurant / Menu Title
                      </label>
                      <input
                        type="text"
                        value={selectedMenu.name}
                        onChange={(e) => setSelectedMenu({ ...selectedMenu, name: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        URL Slug (/m/[slug])
                      </label>
                      <input
                        type="text"
                        value={selectedMenu.slug}
                        onChange={(e) =>
                          setSelectedMenu({
                            ...selectedMenu,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                          })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Currency Symbol
                      </label>
                      <input
                        type="text"
                        value={selectedMenu.currency || '₹'}
                        onChange={(e) => setSelectedMenu({ ...selectedMenu, currency: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Subtitle / Short Bio
                      </label>
                      <textarea
                        rows={2}
                        value={selectedMenu.bio || ''}
                        onChange={(e) => setSelectedMenu({ ...selectedMenu, bio: e.target.value })}
                        placeholder="Tagline or culinary specialties..."
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 transition-all"
                      >
                        <Save className="h-3.5 w-3.5" />
                        Save Menu Info
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMenu(selectedMenu.id)}
                        className="text-xs font-bold text-rose-400 hover:text-rose-300"
                      >
                        Delete Menu
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Right Column: Menu Categories & Food Items */}
            <div className="lg:col-span-8 space-y-6">
              {selectedMenu && (
                <>
                  {/* Category Action Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>Menu Catalog Editor</span>
                        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-400">
                          {selectedMenu.categories?.length || 0} Categories
                        </span>
                      </h2>
                      <p className="text-xs text-slate-400">
                        Add categories like Starters, Main Course, Drinks, then add dishes with prices.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditingCategory({ name: '' })}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      Add Food Category
                    </button>
                  </div>

                  {/* Add / Edit Category Dialog Inline */}
                  {editingCategory && (
                    <form
                      onSubmit={handleSaveCategory}
                      className="rounded-2xl border border-blue-500/50 bg-slate-900 p-4 shadow-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase text-blue-400">
                          {editingCategory.id ? 'Edit Category Name' : 'New Category'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingCategory(null)}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={editingCategory.name || ''}
                          onChange={(e) =>
                            setEditingCategory({ ...editingCategory, name: e.target.value })
                          }
                          placeholder="e.g. Sizzlers, Tandoor Kebabs, Mocktails"
                          className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
                        >
                          Save Category
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Add / Edit Item Modal / Inline */}
                  {editingItem && (
                    <form
                      onSubmit={handleSaveItem}
                      className="rounded-2xl border border-indigo-500/50 bg-slate-900 p-5 shadow-2xl space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Flame className="h-4 w-4 text-orange-400" />
                          <span>{editingItem.item.id ? 'Edit Food Item' : 'Add New Food Item'}</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingItem(null)}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase">
                            Dish / Item Name <span className="text-blue-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={editingItem.item.name || ''}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                item: { ...editingItem.item, name: e.target.value },
                              })
                            }
                            placeholder="e.g. Butter Chicken Handi"
                            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase">
                            Price ({selectedMenu.currency || '₹'}) <span className="text-blue-400">*</span>
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="any"
                            value={editingItem.item.price ?? ''}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                item: { ...editingItem.item, price: Number(e.target.value) },
                              })
                            }
                            placeholder="299"
                            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase">
                          Description (Ingredients, Flavor, Allergens)
                        </label>
                        <textarea
                          rows={2}
                          value={editingItem.item.description || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              item: { ...editingItem.item, description: e.target.value },
                            })
                          }
                          placeholder="Slow-cooked rich tomato cream gravy with fenugreek and butter..."
                          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none resize-none"
                        />
                      </div>

                      {/* Toggles: Veg/Non-Veg & Bestseller */}
                      <div className="flex flex-wrap items-center gap-6 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingItem.item.is_veg ?? true}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                item: { ...editingItem.item, is_veg: e.target.checked },
                              })
                            }
                            className="h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-0"
                          />
                          <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                editingItem.item.is_veg ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            {editingItem.item.is_veg ? 'Vegetarian (Green)' : 'Non-Veg (Red)'}
                          </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingItem.item.is_bestseller ?? false}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                item: { ...editingItem.item, is_bestseller: e.target.checked },
                              })
                            }
                            className="h-4 w-4 rounded border-slate-700 text-amber-500 focus:ring-0"
                          />
                          <span className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                            Bestseller Tag
                          </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingItem.item.is_available ?? true}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                item: { ...editingItem.item, is_available: e.target.checked },
                              })
                            }
                            className="h-4 w-4 rounded border-slate-700 text-blue-500 focus:ring-0"
                          />
                          <span className="text-xs font-semibold text-slate-200">
                            In Stock & Available
                          </span>
                        </label>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setEditingItem(null)}
                          className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-xs font-black text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/25"
                        >
                          Save Item
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Categories & Items Accordion / Cards */}
                  {(!selectedMenu.categories || selectedMenu.categories.length === 0) ? (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
                      <p className="text-sm text-slate-400 font-semibold">
                        No food categories in this menu yet. Click "Add Food Category" above to begin.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {selectedMenu.categories.map((cat) => (
                        <div
                          key={cat.id}
                          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl"
                        >
                          {/* Category Header */}
                          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                            <div className="flex items-center gap-2.5">
                              <h3 className="text-base font-black text-white">{cat.name}</h3>
                              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                                {cat.items?.length || 0} items
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingItem({
                                    categoryId: cat.id,
                                    item: {
                                      is_veg: true,
                                      is_bestseller: false,
                                      is_available: true,
                                    },
                                  })
                                }
                                className="rounded-lg bg-blue-600/10 border border-blue-500/30 px-2.5 py-1 text-xs font-bold text-blue-400 hover:bg-blue-600/20 transition-all flex items-center gap-1"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Add Dish
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCategory(cat)}
                                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
                                title="Edit Category Name"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-500/10"
                                title="Delete Category"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Items Grid */}
                          {(!cat.items || cat.items.length === 0) ? (
                            <div className="py-6 text-center text-xs text-slate-500">
                              No items in this category yet. Click "Add Dish" to add one.
                            </div>
                          ) : (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                              {cat.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="group relative rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 transition-all hover:border-slate-700"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2.5">
                                      {/* Veg / Non-Veg Icon */}
                                      <div
                                        className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded border ${
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
                                        <div className="flex items-center gap-1.5">
                                          <h4 className="font-bold text-sm text-white">
                                            {item.name}
                                          </h4>
                                          {item.is_bestseller && (
                                            <span className="inline-flex items-center gap-0.5 rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-black text-amber-400 border border-amber-500/20">
                                              <Sparkles className="h-2.5 w-2.5" /> BESTSELLER
                                            </span>
                                          )}
                                        </div>

                                        {item.description && (
                                          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                            {item.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="text-right flex-shrink-0">
                                      <div className="text-sm font-black text-emerald-400">
                                        {selectedMenu.currency || '₹'}
                                        {item.price}
                                      </div>
                                      {!item.is_available && (
                                        <span className="text-[10px] font-semibold text-rose-400">
                                          Out of stock
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Item Toolbar */}
                                  <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-900 pt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setEditingItem({ categoryId: cat.id, item })
                                      }
                                      className="rounded p-1 text-slate-400 hover:text-white"
                                      title="Edit Dish"
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteItem(cat.id, item.id)}
                                      className="rounded p-1 text-rose-400 hover:text-rose-300"
                                      title="Remove Dish"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Spotnet Services Guarantee Banner */}
        <div className="mt-12 rounded-2xl border border-slate-800/80 bg-slate-900/30 p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-400" />
          <span>
            Digital Menu Engine powered by <strong className="text-white">Spotnet Services</strong>. Instant cloud sync, zero printing delays.
          </span>
        </div>
      </div>
    </div>
  );
}
