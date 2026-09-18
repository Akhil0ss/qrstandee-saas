import {
  StandeeRecord,
  ScanRecord,
  PrivateFeedbackRecord,
  MenuRecord,
  MenuCategoryRecord,
  MenuItemRecord,
} from '../types';
import { supabase, isSupabaseConfigured } from './client';

const LOCAL_STORAGE_KEY = 'qrstandee_saas_records_v1';
const LOCAL_FEEDBACK_KEY = 'qrstandee_saas_feedback_v1';

function getLocalStandees(): StandeeRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const list: StandeeRecord[] = JSON.parse(raw);
    return list.filter((s) => s && !s.id?.startsWith('demo-'));
  } catch {
    return [];
  }
}

/**
 * Get all standees belonging strictly to the authenticated tenant.
 * Returns empty array if none exist or if user is not authenticated.
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

  // Fallback to local storage if offline
  return getLocalStandees();
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

// ---------------- Digital Menu Store Engine ----------------

const LOCAL_MENUS_KEY = 'qrstandee_menus_v1';

/**
 * Fetch all digital menus created by current business
 */
export async function getMenus(): Promise<MenuRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('menus')
          .select('*, categories:menu_categories(*, items:menu_items(*))')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) return data as MenuRecord[];
      }
    } catch (err) {
      console.error('Error fetching menus:', err);
    }
  }

  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_MENUS_KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * Public Menu resolver for QR scanners viewing /m/[slug]
 */
export async function getMenuBySlug(slug: string): Promise<MenuRecord | null> {
  const cleanSlug = slug.toLowerCase().trim();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('menus')
        .select('*, categories:menu_categories(*, items:menu_items(*))')
        .eq('slug', cleanSlug)
        .eq('is_active', true)
        .maybeSingle();

      if (!error && data) return data as MenuRecord;
    } catch (err) {
      console.error('Error fetching public menu:', err);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const list: MenuRecord[] = JSON.parse(localStorage.getItem(LOCAL_MENUS_KEY) || '[]');
      return list.find((m) => m.slug.toLowerCase() === cleanSlug) || null;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Save or update digital menu
 */
export async function saveMenu(menu: Partial<MenuRecord>): Promise<{ success: boolean; data?: MenuRecord; error?: string }> {
  let userId = menu.user_id;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;

      const payload = {
        ...menu,
        user_id: userId || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('menus')
        .upsert(payload, { onConflict: 'slug' })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: data as MenuRecord };
    } catch (err: any) {
      console.error('Error saving menu:', err);
      return { success: false, error: err.message };
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const list: MenuRecord[] = JSON.parse(localStorage.getItem(LOCAL_MENUS_KEY) || '[]');
      const newMenu: MenuRecord = {
        id: menu.id || 'menu-' + Date.now(),
        user_id: userId || null,
        slug: menu.slug || 'menu-' + Date.now(),
        name: menu.name || 'My Menu',
        currency: menu.currency || 'INR',
        is_active: menu.is_active ?? true,
        categories: menu.categories || [],
        created_at: menu.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const idx = list.findIndex((m) => m.id === newMenu.id || m.slug === newMenu.slug);
      if (idx >= 0) list[idx] = newMenu;
      else list.unshift(newMenu);
      localStorage.setItem(LOCAL_MENUS_KEY, JSON.stringify(list));
      return { success: true, data: newMenu };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  return { success: true };
}

/**
 * Delete digital menu
 */
export async function deleteMenu(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('menus').delete().eq('id', id);
    } catch (err) {
      console.error('Delete menu error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const list: MenuRecord[] = JSON.parse(localStorage.getItem(LOCAL_MENUS_KEY) || '[]');
      const filtered = list.filter((m) => m.id !== id);
      localStorage.setItem(LOCAL_MENUS_KEY, JSON.stringify(filtered));
    } catch {}
  }
  return true;
}

/**
 * Add or update a menu category
 */
export async function saveMenuCategory(category: Partial<MenuCategoryRecord>): Promise<{ success: boolean; data?: any; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .upsert(category)
        .select()
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
  return { success: true };
}

/**
 * Delete a category
 */
export async function deleteMenuCategory(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('menu_categories').delete().eq('id', id);
      return true;
    } catch {
      return false;
    }
  }
  return true;
}

/**
 * Add or update a menu item
 */
export async function saveMenuItem(item: Partial<MenuItemRecord>): Promise<{ success: boolean; data?: any; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .upsert(item)
        .select()
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
  return { success: true };
}

/**
 * Delete a menu item
 */
export async function deleteMenuItem(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('menu_items').delete().eq('id', id);
      return true;
    } catch {
      return false;
    }
  }
  return true;
}
