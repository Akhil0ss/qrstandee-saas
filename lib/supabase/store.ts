import { StandeeRecord, ScanRecord, PrivateFeedbackRecord } from '../types';
import { supabase, isSupabaseConfigured } from './client';

const LOCAL_STORAGE_KEY = 'qrstandee_saas_records_v1';
const LOCAL_FEEDBACK_KEY = 'qrstandee_saas_feedback_v1';

// Default initial standees for great first-run experience
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
    qr_color: '#1e293b',
    accent_color: '#d97706',
    cta_text: 'RATE US 5 STARS ON GOOGLE',
    qr_shape: 'dots',
    profile_style: 'bold',
    scans_count: 519,
    last_scan_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    updated_at: new Date().toISOString(),
    smart_review_enabled: true,
    google_review_url: 'https://maps.google.com/?cid=123456789'
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

export async function getStandees(): Promise<StandeeRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('standees')
        .select('*')
        .order('updated_at', { ascending: false });
      if (!error && data) return data as StandeeRecord[];
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local store:', e);
    }
  }

  if (typeof window === 'undefined') return DEFAULT_INITIAL_STANDEES;

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_STANDEES));
      return DEFAULT_INITIAL_STANDEES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_INITIAL_STANDEES;
  }
}

export async function getStandeeBySlug(slug: string): Promise<StandeeRecord | null> {
  const cleanSlug = slug.toLowerCase().trim();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('standees')
        .select('*')
        .eq('slug', cleanSlug)
        .single();
      if (!error && data) return data as StandeeRecord;
    } catch {
      // Fallback
    }
  }

  const all = await getStandees();
  return all.find((s) => s.slug.toLowerCase() === cleanSlug) || null;
}

export async function saveStandee(standee: StandeeRecord): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('standees').upsert({
        ...standee,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Supabase save error:', err);
    }
  }

  // Always sync to localStorage as well for offline/resilience
  if (typeof window !== 'undefined') {
    const list = await getStandees();
    const idx = list.findIndex((s) => s.id === standee.id || s.slug === standee.slug);
    if (idx >= 0) {
      list[idx] = { ...standee, updated_at: new Date().toISOString() };
    } else {
      list.unshift(standee);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }

  return { success: true };
}

export async function saveBulkStandees(standeesList: StandeeRecord[]): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('standees').upsert(standeesList);
    } catch (err) {
      console.error('Supabase bulk save error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const current = await getStandees();
    const combined = [...standeesList, ...current.filter((c) => !standeesList.some((s) => s.slug === c.slug))];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(combined));
  }
  return true;
}

export async function deleteStandee(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('standees').delete().eq('id', id);
    } catch {
      //
    }
  }

  if (typeof window !== 'undefined') {
    const list = await getStandees();
    const filtered = list.filter((s) => s.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  }
  return true;
}

export async function recordScan(slug: string, meta: { deviceType?: string; userAgent?: string; referer?: string }) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.rpc('increment_scans', { standee_slug: slug });
      await supabase.from('scans').insert({
        slug,
        device_type: meta.deviceType || 'mobile',
        browser: meta.userAgent || '',
        referer: meta.referer || '',
      });
    } catch {
      //
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const list = await getStandees();
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
export async function submitPrivateFeedback(record: Omit<PrivateFeedbackRecord, 'id' | 'created_at'>) {
  const item: PrivateFeedbackRecord = {
    ...record,
    id: 'fb-' + Date.now(),
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('private_feedback').insert(item);
    } catch {
      //
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

export async function getPrivateFeedback(slug?: string): Promise<PrivateFeedbackRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('private_feedback').select('*').order('created_at', { ascending: false });
      if (slug) query = query.eq('slug', slug);
      const { data } = await query;
      if (data) return data;
    } catch {
      //
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
