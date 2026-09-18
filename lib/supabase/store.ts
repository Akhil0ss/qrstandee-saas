import { StandeeRecord, ScanRecord, PrivateFeedbackRecord } from '../types';
import { supabase, isSupabaseConfigured } from './client';

const LOCAL_STORAGE_KEY = 'qrstandee_saas_records_v1';
const LOCAL_FEEDBACK_KEY = 'qrstandee_saas_feedback_v1';

// Default initial standees for demo / offline preview
const DEFAULT_INITIAL_STANDEES: StandeeRecord[] = [
  {
    id: 'demo-1',
    slug: 'the-brew-corner',
    name: 'The Brew Corner & Cafe',
    tagline: 'Artisanal Coffee & Fresh Bakes',
    category: 'Cafe & Bakery',
    phone: '+91 98765 43210',
    website: 'https://instagram.com/thebrewcorner',
    address: '42 Connaught Place, New Delhi',
    extra_info: 'GST: 07AAAAA0000A1Z5',
    destination: 'https://thebrewcorner.com/menu',
    qr_type: 'multi_action',
    primary_action: 'multi_action',
    template_id: 'restaurant_menu',
    size: 'a4',
    orientation: 'portrait',
    qr_color: '#292524',
    accent_color: '#b45309',
    cta_text: 'SCAN TO EXPLORE OUR MENU',
    qr_shape: 'rounded',
    profile_style: 'luxury',
    scans_count: 342,
    last_scan_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
    smart_routing_enabled: true,
    lunch_url: 'https://thebrewcorner.com/lunch-specials',
    dinner_url: 'https://thebrewcorner.com/dinner-menu',
    wifi_ssid: 'BrewCorner_Guest',
    wifi_password: 'freshcoffee2026',
    action_links: [
      { id: '1', title: 'Food & Drinks Menu', url: 'https://thebrewcorner.com/menu', icon: 'menu', badge: 'Popular' },
      { id: '2', title: 'Pay via UPI', url: 'upi://pay?pa=brewcorner@hdfc&pn=Brew%20Corner', icon: 'upi', badge: 'Instant' },
      { id: '3', title: 'Connect Guest Wi-Fi', url: '#wifi', icon: 'wifi', badge: 'Free' },
      { id: '4', title: 'Follow Instagram', url: 'https://instagram.com/thebrewcorner', icon: 'instagram' },
      { id: '5', title: 'Rate Us on Google', url: '/review/the-brew-corner', icon: 'review', badge: '5 ★' }
    ]
  },
  {
    id: 'demo-2',
    slug: 'apex-dental-care',
    name: 'Apex Dental Care & Clinic',
    tagline: 'Dr. Sarah Verma (BDS, MDS)',
    category: 'Healthcare & Clinic',
    phone: '+91 91234 56789',
    website: 'https://apexdental.care',
    address: 'Suite 204, Metro Plaza, Sector 18',
    extra_info: 'Reg: DL-MED-9942',
    destination: 'https://g.page/r/example-review/review',
    qr_type: 'smart_review',
    primary_action: 'smart_review',
    template_id: 'google_review',
    size: '4x6',
    orientation: 'portrait',
    qr_color: '#0f172a',
    accent_color: '#2563eb',
    cta_text: 'SHARE YOUR CLINIC EXPERIENCE',
    qr_shape: 'rounded',
    profile_style: 'clean',
    scans_count: 89,
    last_scan_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    updated_at: new Date().toISOString(),
    smart_review_enabled: true,
    google_review_url: 'https://g.page/r/example-review/review',
  },
  {
    id: 'demo-3',
    slug: 'quickpay-counter',
    name: 'Royal Spices & Dry Fruits',
    tagline: 'Authentic Kashmiri Spices',
    category: 'Retail Store',
    phone: '+91 99887 76655',
    website: '',
    address: 'Shop 12, Grand Bazaar',
    extra_info: 'UPI ID: royalspices@icici',
    destination: 'upi://pay?pa=royalspices@icici&pn=Royal%20Spices&cu=INR',
    qr_type: 'upi',
    primary_action: 'upi',
    template_id: 'upi_counter',
    size: 'a5',
    orientation: 'portrait',
    qr_color: '#0f172a',
    accent_color: '#2563eb',
    cta_text: 'SCAN & PAY WITH ANY UPI APP',
    qr_shape: 'rounded',
    profile_style: 'modern',
    scans_count: 1240,
    last_scan_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 28).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

function getLocalStandees(): StandeeRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Get all standees belonging strictly to the authenticated tenant.
 * If user is not logged in, returns empty array (or demo items only on client side first-run).
 */
export async function getStandees(): Promise<StandeeRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('standees')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (!error && data) return data as StandeeRecord[];
      }
    } catch (e) {
      console.warn('Supabase fetch failed:', e);
    }
  }

  // Fallback to local storage if offline or not logged in
  const local = getLocalStandees();
  if (local.length > 0) return local;

  // On first load if nothing exists, return demo templates
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_STANDEES));
    return DEFAULT_INITIAL_STANDEES;
  }

  return DEFAULT_INITIAL_STANDEES;
}

/**
 * Public standee resolver by slug (Used by dynamic redirect routes /[slug], /review/[slug], /t/[slug])
 */
export async function getStandeeBySlug(slug: string): Promise<StandeeRecord | null> {
  const cleanSlug = slug.toLowerCase().trim();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('standees')
        .select('*')
        .eq('slug', cleanSlug)
        .maybeSingle();
      if (!error && data) return data as StandeeRecord;
    } catch {
      // Fallback
    }
  }

  // Check demo standees
  const demo = DEFAULT_INITIAL_STANDEES.find((s) => s.slug.toLowerCase() === cleanSlug);
  if (demo) return demo;

  // Check local storage
  const local = getLocalStandees();
  return local.find((s) => s.slug.toLowerCase() === cleanSlug) || null;
}

/**
 * Save or update a standee, automatically tagging it with the authenticated tenant's ID
 */
export async function saveStandee(standee: StandeeRecord): Promise<{ success: boolean; error?: string }> {
  let userId = standee.user_id;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      }

      const payload: any = {
        ...standee,
        user_id: userId || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('standees').upsert(payload, { onConflict: 'slug' });
      if (error) throw error;
    } catch (err: any) {
      console.error('Supabase save error:', err);
      return { success: false, error: err.message };
    }
  }

  // Sync to localStorage for offline access
  if (typeof window !== 'undefined') {
    const list = getLocalStandees();
    const idx = list.findIndex((s) => s.id === standee.id || s.slug === standee.slug);
    const updatedRecord = { ...standee, user_id: userId, updated_at: new Date().toISOString() };
    if (idx >= 0) {
      list[idx] = updatedRecord;
    } else {
      list.unshift(updatedRecord);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }

  return { success: true };
}

/**
 * Bulk save multiple table standees for the current tenant
 */
export async function saveBulkStandees(standeesList: StandeeRecord[]): Promise<boolean> {
  let userId: string | null = null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;

      const preparedList = standeesList.map((s) => ({
        ...s,
        user_id: userId || s.user_id || null,
        updated_at: new Date().toISOString(),
      }));

      await supabase.from('standees').upsert(preparedList, { onConflict: 'slug' });
    } catch (err) {
      console.error('Supabase bulk save error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const current = getLocalStandees();
    const combined = [...standeesList, ...current.filter((c) => !standeesList.some((s) => s.slug === c.slug))];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(combined));
  }
  return true;
}

/**
 * Delete a standee (enforced by RLS so tenants can only delete their own standees)
 */
export async function deleteStandee(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('standees').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const list = getLocalStandees();
    const filtered = list.filter((s) => s.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  }
  return true;
}

/**
 * Record a scan event for a standee
 */
export async function recordScan(slug: string, meta: { deviceType?: string; userAgent?: string; referer?: string }) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('scans').insert({
        slug,
        device_type: meta.deviceType || 'mobile',
        browser: meta.userAgent || '',
        referer: meta.referer || '',
      });
    } catch (err) {
      console.error('Scan logging error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const list = getLocalStandees();
      const target = list.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
      if (target) {
        target.scans_count = (target.scans_count || 0) + 1;
        target.last_scan_at = new Date().toISOString();
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
      }
    } catch {
      //
    }
  }
}

// ---------------- Private Feedback Store (Smart Review Shield) ----------------

/**
 * Submit private feedback (1-3 stars) from any customer
 */
export async function submitPrivateFeedback(record: Omit<PrivateFeedbackRecord, 'id' | 'created_at'>) {
  const item: PrivateFeedbackRecord = {
    ...record,
    id: 'fb-' + Date.now(),
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('private_feedback').insert(item);
    } catch (err) {
      console.error('Feedback submit error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const list: PrivateFeedbackRecord[] = JSON.parse(localStorage.getItem(LOCAL_FEEDBACK_KEY) || '[]');
      list.unshift(item);
      localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(list));
    } catch {
      //
    }
  }
  return item;
}

/**
 * Get private feedback (Strictly isolated by Supabase RLS so tenants only see feedback for their own standees)
 */
export async function getPrivateFeedback(slug?: string): Promise<PrivateFeedbackRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('private_feedback').select('*').order('created_at', { ascending: false });
      if (slug) query = query.eq('slug', slug);
      const { data, error } = await query;
      if (!error && data) return data as PrivateFeedbackRecord[];
    } catch (err) {
      console.error('Feedback fetch error:', err);
    }
  }

  if (typeof window === 'undefined') return [];
  try {
    const list: PrivateFeedbackRecord[] = JSON.parse(localStorage.getItem(LOCAL_FEEDBACK_KEY) || '[]');
    if (slug) return list.filter((f) => f.slug === slug);
    return list;
  } catch {
    return [];
  }
}
