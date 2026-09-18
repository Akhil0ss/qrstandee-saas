-- =======================================================
-- QRStandee SaaS: Production Supabase Schema
-- Run this script in the Supabase SQL Editor
-- =======================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Users & Subscriptions)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT '',
  business_name TEXT DEFAULT '',
  plan TEXT NOT NULL DEFAULT 'free', -- 'free', 'pro', 'enterprise'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Standees / Dynamic QR Codes Table
CREATE TABLE IF NOT EXISTS public.standees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  category TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  website TEXT DEFAULT '',
  address TEXT DEFAULT '',
  extra_info TEXT DEFAULT '',
  destination TEXT NOT NULL,
  qr_type TEXT NOT NULL DEFAULT 'website', -- 'upi', 'whatsapp', 'website', 'maps', 'review', 'smart_review', 'multi_action', 'phone', etc.
  primary_action TEXT DEFAULT 'website',
  template_id TEXT NOT NULL DEFAULT 'classic',
  size TEXT NOT NULL DEFAULT 'a4', -- 'a4', 'a3', 'a5', '4x6', '5x7', '12x18', '18x24'
  orientation TEXT NOT NULL DEFAULT 'portrait', -- 'portrait', 'landscape'
  qr_color TEXT NOT NULL DEFAULT '#111827',
  accent_color TEXT NOT NULL DEFAULT '#2563eb',
  cta_text TEXT NOT NULL DEFAULT 'SCAN TO VISIT',
  logo_url TEXT DEFAULT '',
  qr_shape TEXT NOT NULL DEFAULT 'square', -- 'square', 'rounded', 'dots'
  profile_style TEXT NOT NULL DEFAULT 'clean', -- 'clean', 'bold', 'minimal', 'modern'
  scans_count INTEGER NOT NULL DEFAULT 0,
  last_scan_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- 360 Pro Features
  table_number TEXT DEFAULT '',
  smart_review_enabled BOOLEAN DEFAULT false,
  google_review_url TEXT DEFAULT '',
  smart_routing_enabled BOOLEAN DEFAULT false,
  lunch_url TEXT DEFAULT '',
  dinner_url TEXT DEFAULT '',
  wifi_ssid TEXT DEFAULT '',
  wifi_password TEXT DEFAULT '',
  action_links JSONB DEFAULT '[]'::jsonb
);

-- 3. Scans Analytics Table
CREATE TABLE IF NOT EXISTS public.scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  standee_id UUID REFERENCES public.standees(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  device_type TEXT DEFAULT 'mobile', -- 'mobile', 'desktop', 'tablet', 'bot'
  browser TEXT DEFAULT '',
  os TEXT DEFAULT '',
  ip_hash TEXT DEFAULT '',
  referer TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Private Feedback Table (Smart Review Shield)
CREATE TABLE IF NOT EXISTS public.private_feedback (
  id TEXT PRIMARY KEY DEFAULT ('fb-' || extract(epoch from now())::text),
  slug TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT NOT NULL,
  customer_contact TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Digital Menus Tables (Restaurant & Cafe Menu Engine)
CREATE TABLE IF NOT EXISTS public.menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  currency TEXT DEFAULT 'INR',
  banner_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id UUID REFERENCES public.menus(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  menu_id UUID REFERENCES public.menus(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  is_veg BOOLEAN DEFAULT true,
  is_bestseller BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  image_url TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Fast Lookups & Indexes
CREATE INDEX IF NOT EXISTS idx_standees_slug ON public.standees(slug);
CREATE INDEX IF NOT EXISTS idx_standees_user_id ON public.standees(user_id);
CREATE INDEX IF NOT EXISTS idx_standees_updated_at ON public.standees(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_slug ON public.scans(slug);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON public.scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_standee_id ON public.scans(standee_id);
CREATE INDEX IF NOT EXISTS idx_feedback_slug ON public.private_feedback(slug);
CREATE INDEX IF NOT EXISTS idx_menus_user_id ON public.menus(user_id);
CREATE INDEX IF NOT EXISTS idx_menus_slug ON public.menus(slug);
CREATE INDEX IF NOT EXISTS idx_menu_categories_menu_id ON public.menu_categories(menu_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_menu_id ON public.menu_items(menu_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON public.menu_items(category_id);

-- 7. Row Level Security (RLS) & Multi-Tenant Isolation
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Profiles: Strict Tenant Access
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Tenants can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Tenants can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Tenants can insert own profile" ON public.profiles;

CREATE POLICY "Tenants can view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Tenants can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Tenants can insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Standees: Strict Tenant Isolation
DROP POLICY IF EXISTS "Public can view standee by slug" ON public.standees;
DROP POLICY IF EXISTS "Users can insert standees" ON public.standees;
DROP POLICY IF EXISTS "Users can update own standees" ON public.standees;
DROP POLICY IF EXISTS "Users can delete own standees" ON public.standees;
DROP POLICY IF EXISTS "Tenants can insert standees" ON public.standees;
DROP POLICY IF EXISTS "Tenants can update standees" ON public.standees;
DROP POLICY IF EXISTS "Tenants can delete standees" ON public.standees;

-- Allow public read of standees by slug (necessary for QR scans and dynamic redirect routes)
CREATE POLICY "Public can view standee by slug" ON public.standees
  FOR SELECT USING (true);

-- Authenticated tenants can insert their own standees
CREATE POLICY "Tenants can insert standees" ON public.standees
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authenticated tenants can update ONLY their own standees
CREATE POLICY "Tenants can update standees" ON public.standees
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Authenticated tenants can delete ONLY their own standees
CREATE POLICY "Tenants can delete standees" ON public.standees
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Scans: Strict Tenant Analytics Isolation
DROP POLICY IF EXISTS "Edge can insert scans" ON public.scans;
DROP POLICY IF EXISTS "Users can view scans of own standees" ON public.scans;
DROP POLICY IF EXISTS "Anyone can insert scans" ON public.scans;
DROP POLICY IF EXISTS "Tenants can view own scans" ON public.scans;

CREATE POLICY "Anyone can insert scans" ON public.scans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Tenants can view own scans" ON public.scans
  FOR SELECT TO authenticated
  USING (
    slug IN (
      SELECT s.slug FROM public.standees s WHERE s.user_id = auth.uid()
    )
  );

-- Private Feedback: Strict Tenant Shield Isolation
DROP POLICY IF EXISTS "Anyone can insert private feedback" ON public.private_feedback;
DROP POLICY IF EXISTS "Users can read feedback" ON public.private_feedback;
DROP POLICY IF EXISTS "Tenants can read own feedback" ON public.private_feedback;

CREATE POLICY "Anyone can insert private feedback" ON public.private_feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Tenants can read own feedback" ON public.private_feedback
  FOR SELECT TO authenticated
  USING (
    slug IN (
      SELECT s.slug FROM public.standees s WHERE s.user_id = auth.uid()
    )
  );

-- 7. Triggers

-- Auto-create profile upon auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, business_name, plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'business_name', 'My Business'),
    'free'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = CASE WHEN EXCLUDED.full_name <> '' THEN EXCLUDED.full_name ELSE public.profiles.full_name END,
    business_name = CASE WHEN EXCLUDED.business_name <> '' THEN EXCLUDED.business_name ELSE public.profiles.business_name END,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_standees_updated_at ON public.standees;
CREATE TRIGGER set_standees_updated_at
  BEFORE UPDATE ON public.standees
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
