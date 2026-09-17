import { NextRequest, NextResponse } from 'next/server';
import { getStandeeBySlug, recordScan } from '@/lib/supabase/store';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // Ignore static Next.js assets
  if (slug.startsWith('_next') || slug.includes('.')) {
    return new NextResponse('Not found', { status: 404 });
  }

  const standee = await getStandeeBySlug(slug);

  if (!standee) {
    // If slug not registered, redirect to Studio with prefilled slug
    return NextResponse.redirect(new URL(`/studio?slug=${encodeURIComponent(slug)}`, request.url));
  }

  // Telemetry: Record scan
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /mobile|iphone|ipod|android|blackberry|opera mini|windows ce|palm/i.test(userAgent);
  const referer = request.headers.get('referer') || '';

  try {
    await recordScan(slug, {
      deviceType: isMobile ? 'mobile' : 'desktop',
      userAgent,
      referer,
    });
  } catch (err) {
    console.error('Failed to log scan:', err);
  }

  // 1. Smart Review Shield Route
  if (standee.qr_type === 'smart_review' || standee.smart_review_enabled) {
    return NextResponse.redirect(new URL(`/review/${encodeURIComponent(slug)}`, request.url));
  }

  // 2. Multi-Action Table Tent Route
  if (standee.qr_type === 'multi_action') {
    return NextResponse.redirect(new URL(`/t/${encodeURIComponent(slug)}`, request.url));
  }

  // 3. Time-Based Smart Routing (Lunch vs Dinner)
  if (standee.smart_routing_enabled) {
    const currentHour = new Date().getHours(); // 0 to 23
    // Lunch window: 11 AM to 4 PM (11:00 - 16:00)
    if (currentHour >= 11 && currentHour < 16 && standee.lunch_url) {
      return NextResponse.redirect(standee.lunch_url, 302);
    }
    // Dinner window: 4 PM to 11 PM (16:00 - 23:00)
    if (currentHour >= 16 && currentHour < 23 && standee.dinner_url) {
      return NextResponse.redirect(standee.dinner_url, 302);
    }
  }

  const destination = standee.destination?.trim() || '';

  // 4. If destination is standard http/https web link, redirect directly
  if (/^https?:\/\//i.test(destination)) {
    return NextResponse.redirect(destination, 302);
  }

  // 5. If destination is a deep link (like upi://, tel:, etc.) or empty, redirect to Smart Mobile Card
  return NextResponse.redirect(new URL(`/p/${encodeURIComponent(slug)}`, request.url));
}
