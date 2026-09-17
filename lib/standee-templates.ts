import { StandeeTemplate } from './types';

export const TEMPLATES: StandeeTemplate[] = [
  {
    id: 'upi_counter',
    name: 'UPI Pay & Counter',
    category: 'Payment',
    description: 'Clean dual-accent retail counter standee optimized for instant mobile UPI scanning.',
    accent_color: '#2563eb',
    qr_color: '#0f172a',
    bg_color: '#ffffff',
    cta_text: 'SCAN & PAY WITH ANY UPI APP',
    default_qr_type: 'upi',
    qr_shape: 'rounded',
    profile_style: 'modern',
    badge_text: 'BHIM • GPay • PhonePe • Paytm',
    preview_bg: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'google_review',
    name: '5-Star Google Review',
    category: 'Reputation',
    description: 'High-trust gold badge standee engineered to maximize in-store Google customer reviews.',
    accent_color: '#d97706',
    qr_color: '#1e293b',
    bg_color: '#ffffff',
    cta_text: 'RATE US 5 STARS ON GOOGLE',
    default_qr_type: 'review',
    qr_shape: 'dots',
    profile_style: 'bold',
    badge_text: '★★★★★ Verified Google Reviews',
    preview_bg: 'from-amber-500 to-yellow-600'
  },
  {
    id: 'restaurant_menu',
    name: 'Gourmet Dining & Menu',
    category: 'Food & Beverage',
    description: 'Warm, sophisticated aesthetic for cafe tables, bars, and fine dining digital menus.',
    accent_color: '#b45309',
    qr_color: '#292524',
    bg_color: '#fffbeb',
    cta_text: 'SCAN TO EXPLORE OUR MENU',
    default_qr_type: 'website',
    qr_shape: 'rounded',
    profile_style: 'luxury',
    badge_text: 'Fresh Daily • Chef Specials',
    preview_bg: 'from-amber-700 to-orange-900'
  },
  {
    id: 'whatsapp_desk',
    name: 'WhatsApp Concierge',
    category: 'Customer Support',
    description: 'Instant customer support and booking desk standee for direct chat.',
    accent_color: '#16a34a',
    qr_color: '#064e3b',
    bg_color: '#ffffff',
    cta_text: 'CHAT WITH US ON WHATSAPP',
    default_qr_type: 'whatsapp',
    qr_shape: 'dots',
    profile_style: 'clean',
    badge_text: 'Fast Reply • 24/7 Support',
    preview_bg: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'corporate_clean',
    name: 'Executive Minimalist',
    category: 'Corporate & Tech',
    description: 'Ultra-crisp monochrome standee for professional clinics, law firms, and tech offices.',
    accent_color: '#0f172a',
    qr_color: '#020617',
    bg_color: '#ffffff',
    cta_text: 'SCAN TO CONNECT WITH US',
    default_qr_type: 'website',
    qr_shape: 'square',
    profile_style: 'clean',
    badge_text: 'Official Business Portal',
    preview_bg: 'from-slate-800 to-slate-950'
  },
  {
    id: 'salon_boutique',
    name: 'Luxury Salon & Spa',
    category: 'Beauty & Retail',
    description: 'Elegant soft-rose theme for salons, wellness spas, and luxury fashion boutiques.',
    accent_color: '#e11d48',
    qr_color: '#4c0519',
    bg_color: '#fff1f2',
    cta_text: 'SCAN TO BOOK AN APPOINTMENT',
    default_qr_type: 'website',
    qr_shape: 'rounded',
    profile_style: 'luxury',
    badge_text: 'Exclusive Care & Premium Services',
    preview_bg: 'from-rose-500 to-pink-700'
  },
  {
    id: 'wifi_guest',
    name: 'Guest High-Speed Wi-Fi',
    category: 'Hospitality',
    description: 'One-scan instant Wi-Fi connection standee for hotels, lounges, and co-working spaces.',
    accent_color: '#6366f1',
    qr_color: '#1e1b4b',
    bg_color: '#ffffff',
    cta_text: 'SCAN TO CONNECT WI-FI',
    default_qr_type: 'wifi',
    qr_shape: 'rounded',
    profile_style: 'modern',
    badge_text: 'Free High-Speed Guest Wi-Fi',
    preview_bg: 'from-indigo-600 to-violet-700'
  }
];

export const STANDARDS_SIZES: {
  id: string;
  name: string;
  category: string;
  widthMm: number;
  heightMm: number;
  popular?: boolean;
}[] = [
  { id: 'a4', name: 'A4 Standard Standee', category: 'Metric', widthMm: 210, heightMm: 297, popular: true },
  { id: 'a5', name: 'A5 Counter Card', category: 'Metric', widthMm: 148, heightMm: 210, popular: true },
  { id: 'a3', name: 'A3 Poster Stand', category: 'Metric', widthMm: 297, heightMm: 420 },
  { id: '4x6', name: 'Table Tent 4×6"', category: 'Tabletop', widthMm: 101.6, heightMm: 152.4, popular: true },
  { id: '5x7', name: 'Acrylic Stand 5×7"', category: 'Tabletop', widthMm: 127, heightMm: 177.8 },
  { id: '12x18', name: '12 × 18" Medium Board', category: 'Large Format', widthMm: 304.8, heightMm: 457.2 },
  { id: '18x24', name: '18 × 24" Promo Board', category: 'Large Format', widthMm: 457.2, heightMm: 609.6 },
  { id: '24x36', name: '24 × 36" Entrance Standee', category: 'Large Format', widthMm: 609.6, heightMm: 914.4 },
];
