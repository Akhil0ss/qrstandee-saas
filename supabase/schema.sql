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
  qr_type TEXT NOT NULL DEFAULT 'website', -- 'upi', 'whatsapp', 'website', 'maps', 'review', 'phone', etc.
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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

-- 4. Fast Lookups & Indexes
CREATE INDEX IF NOT EXISTS idx_standees_slug ON public.standees(slug);
CREATE INDEX IF NOT EXISTS idx_standees_user_id ON public.standees(user_id);
CREATE INDEX IF NOT EXISTS idx_standees_updated_at ON public.standees(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_slug ON public.scans(slug);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON public.scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_standee_id ON public.scans(standee_id);

-- 5. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Standees: Anyone can read public standee by slug (needed for dynamic redirects)
CREATE POLICY "Public can view standee by slug" ON public.standees
  FOR SELECT USING (true);

-- Authenticated users can insert their own standees (or allow anon with session in free mode)
CREATE POLICY "Users can insert standees" ON public.standees
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own standees" ON public.standees
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own standees" ON public.standees
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Scans: Can be inserted by redirect edge/serverless handler
CREATE POLICY "Edge can insert scans" ON public.scans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view scans of own standees" ON public.scans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.standees
      WHERE public.standees.id = public.scans.standee_id
      AND (public.standees.user_id = auth.uid() OR public.standees.user_id IS NULL)
    )
  );

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
