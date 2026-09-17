export type QRType =
  | 'upi'
  | 'whatsapp'
  | 'website'
  | 'maps'
  | 'review'
  | 'smart_review'
  | 'phone'
  | 'instagram'
  | 'wifi'
  | 'email'
  | 'vcard'
  | 'menu'
  | 'multi_action';

export type StandeeSize =
  | 'a4'
  | 'a3'
  | 'a5'
  | '4x6'
  | '5x7'
  | '12x18'
  | '18x24'
  | '24x36';

export type Orientation = 'portrait' | 'landscape';
export type QRShape = 'square' | 'rounded' | 'dots';
export type ProfileStyle = 'clean' | 'bold' | 'minimal' | 'modern' | 'luxury';

export interface ActionLinkItem {
  id: string;
  title: string;
  url: string;
  icon: 'menu' | 'upi' | 'wifi' | 'instagram' | 'review' | 'phone' | 'website';
  badge?: string;
}

export interface StandeeRecord {
  id: string;
  user_id?: string | null;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  phone: string;
  website: string;
  address: string;
  extra_info: string;
  destination: string;
  qr_type: QRType;
  primary_action: string;
  template_id: string;
  size: StandeeSize;
  orientation: Orientation;
  qr_color: string;
  accent_color: string;
  cta_text: string;
  logo_url?: string;
  qr_shape: QRShape;
  profile_style: ProfileStyle;
  scans_count: number;
  last_scan_at?: string | null;
  created_at: string;
  updated_at: string;

  // 360-Degree Pro Upgrades:
  table_number?: string;
  smart_review_enabled?: boolean;
  google_review_url?: string;
  smart_routing_enabled?: boolean;
  lunch_url?: string;
  dinner_url?: string;
  wifi_ssid?: string;
  wifi_password?: string;
  action_links?: ActionLinkItem[];
}

export interface StandeeTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  accent_color: string;
  qr_color: string;
  bg_color: string;
  cta_text: string;
  default_qr_type: QRType;
  qr_shape: QRShape;
  profile_style: ProfileStyle;
  badge_text?: string;
  preview_bg: string;
}

export interface ScanRecord {
  id: string;
  standee_id: string;
  slug: string;
  device_type: 'mobile' | 'desktop' | 'tablet' | 'bot';
  browser?: string;
  os?: string;
  ip_hash?: string;
  referer?: string;
  created_at: string;
}

export interface PrivateFeedbackRecord {
  id: string;
  slug: string;
  rating: number; // 1, 2, or 3
  feedback: string;
  customer_contact?: string;
  created_at: string;
}
