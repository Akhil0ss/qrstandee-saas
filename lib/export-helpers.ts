import { StandeeRecord } from './types';
import { generateStyledQR } from './qr-engine';

/**
 * Downloads a 300 DPI Ultra High Definition PNG of the standee
 */
export async function exportHighResPNG(standee: StandeeRecord, qrPayload: string) {
  // Target dimensions for 300 DPI high-res print export
  const scale = 3;
  const isLandscape = standee.orientation === 'landscape';
  const baseWidth = isLandscape ? 842 : 595;
  const baseHeight = isLandscape ? 595 : 842;

  const canvas = document.createElement('canvas');
  canvas.width = baseWidth * scale;
  canvas.height = baseHeight * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, baseWidth, baseHeight);

  // Accent Header Stripe / Ribbon
  ctx.fillStyle = standee.accent_color;
  ctx.fillRect(0, 0, baseWidth, 12);

  // Center alignment helper
  const cx = baseWidth / 2;

  // Render Business Logo if present
  let currentY = 55;
  if (standee.logo_url) {
    try {
      const logoImg = await loadImage(standee.logo_url);
      const lSize = 75;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, currentY + lSize / 2, lSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logoImg, cx - lSize / 2, currentY, lSize, lSize);
      ctx.restore();

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, currentY + lSize / 2, lSize / 2, 0, Math.PI * 2);
      ctx.stroke();

      currentY += lSize + 18;
    } catch {
      currentY += 10;
    }
  }

  // Business Name
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(standee.name || 'Your Business Name', cx, currentY + 30);
  currentY += 45;

  // Tagline or Category
  const sub = standee.category ? `${standee.category} • ${standee.tagline}` : standee.tagline;
  if (sub) {
    ctx.fillStyle = '#64748b';
    ctx.font = '500 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(sub, cx, currentY + 14);
    currentY += 32;
  } else {
    currentY += 15;
  }

  // Draw QR Card Container
  const qrCanvasSize = 270;
  const qrCardPadding = 16;
  const cardSize = qrCanvasSize + qrCardPadding * 2;
  const cardX = cx - cardSize / 2;
  const cardY = currentY;

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardSize, cardSize, 20);
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Render QR
  const qrCanvas = await generateStyledQR({
    text: qrPayload,
    size: qrCanvasSize,
    qrColor: standee.qr_color,
    shape: standee.qr_shape,
    logoUrl: standee.logo_url,
  });
  ctx.drawImage(qrCanvas, cardX + qrCardPadding, cardY + qrCardPadding, qrCanvasSize, qrCanvasSize);

  currentY = cardY + cardSize + 32;

  // Call To Action (CTA) Pill
  const ctaText = standee.cta_text || 'SCAN WITH ANY CAMERA';
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const ctaWidth = ctx.measureText(ctaText).width + 36;
  const ctaHeight = 42;

  ctx.fillStyle = standee.accent_color;
  ctx.beginPath();
  ctx.roundRect(cx - ctaWidth / 2, currentY, ctaWidth, ctaHeight, 21);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(ctaText, cx, currentY + 26);
  currentY += ctaHeight + 24;

  // Business Details (Phone, Website, Address)
  const detailLines = [standee.phone, standee.website, standee.address].filter(Boolean);
  ctx.fillStyle = '#475569';
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  detailLines.forEach((line) => {
    ctx.fillText(line, cx, currentY);
    currentY += 22;
  });

  // Footer Branding Badge
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('⚡ POWERED BY QRSTANDEE SAAS', cx, baseHeight - 24);

  // Trigger Download
  const link = document.createElement('a');
  link.download = `${(standee.slug || 'standee').toLowerCase()}-print-ready.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Downloads a scalable vector SVG standee
 */
export async function exportStandeeSVG(standee: StandeeRecord, qrPayload: string) {
  const qrCanvas = await generateStyledQR({
    text: qrPayload,
    size: 500,
    qrColor: standee.qr_color,
    shape: standee.qr_shape,
    logoUrl: standee.logo_url,
  });
  const qrDataUrl = qrCanvas.toDataURL('image/png');

  const name = escapeXml(standee.name || 'Business Name');
  const tag = escapeXml(standee.tagline || '');
  const cta = escapeXml(standee.cta_text || 'SCAN TO VISIT');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 595 842" width="210mm" height="297mm">
  <defs>
    <style>
      .title { font-family: -apple-system, sans-serif; font-size: 36px; font-weight: 800; fill: #0f172a; text-anchor: middle; }
      .tagline { font-family: -apple-system, sans-serif; font-size: 16px; font-weight: 500; fill: #64748b; text-anchor: middle; }
      .cta { font-family: -apple-system, sans-serif; font-size: 16px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
      .meta { font-family: -apple-system, sans-serif; font-size: 13px; fill: #475569; text-anchor: middle; }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="#ffffff"/>
  <rect width="100%" height="12" fill="${standee.accent_color}"/>
  <text x="297.5" y="110" class="title">${name}</text>
  <text x="297.5" y="145" class="tagline">${tag}</text>
  
  <!-- QR Container Card -->
  <rect x="157.5" y="180" width="280" height="280" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
  <image href="${qrDataUrl}" x="177.5" y="200" width="240" height="240"/>
  
  <!-- CTA Button -->
  <rect x="187.5" y="490" width="220" height="44" rx="22" fill="${standee.accent_color}"/>
  <text x="297.5" y="518" class="cta">${cta}</text>
  
  <!-- Business Details -->
  <text x="297.5" y="570" class="meta">${escapeXml(standee.phone || '')}</text>
  <text x="297.5" y="594" class="meta">${escapeXml(standee.website || '')}</text>
  <text x="297.5" y="618" class="meta">${escapeXml(standee.address || '')}</text>
  
  <text x="297.5" y="810" font-family="sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">⚡ POWERED BY QRSTANDEE SAAS</text>
</svg>`;

  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${(standee.slug || 'standee').toLowerCase()}-vector.svg`;
  link.href = url;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function escapeXml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
