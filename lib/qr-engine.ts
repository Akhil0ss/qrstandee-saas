import QRCode from 'qrcode';
import { QRShape } from './types';

export interface QROptions {
  text: string;
  size?: number;
  qrColor?: string;
  bgColor?: string;
  shape?: QRShape;
  logoUrl?: string;
  margin?: number;
}

/**
 * Generates an ultra high-quality styled QR canvas
 */
export async function generateStyledQR(options: QROptions): Promise<HTMLCanvasElement> {
  const {
    text,
    size = 400,
    qrColor = '#0f172a',
    bgColor = '#ffffff',
    shape = 'square',
    logoUrl,
    margin = 2,
  } = options;

  // Generate QR raw matrix
  const qrData = QRCode.create(text, {
    errorCorrectionLevel: 'H', // High error correction (30% recovery) to support center logos
  });

  const modules = qrData.modules;
  const count = modules.size;
  const moduleSize = size / (count + margin * 2);

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2D canvas context');

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = qrColor;

  const isEye = (row: number, col: number) => {
    // Top-left
    if (row < 7 && col < 7) return true;
    // Top-right
    if (row < 7 && col >= count - 7) return true;
    // Bottom-left
    if (row >= count - 7 && col < 7) return true;
    return false;
  };

  // Draw modules
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!modules.get(r, c)) continue;

      const x = (c + margin) * moduleSize;
      const y = (r + margin) * moduleSize;
      const inEye = isEye(r, c);

      if (inEye) {
        // Eye modules: draw clean rounded blocks
        ctx.beginPath();
        const eyeRadius = moduleSize * 0.25;
        ctx.roundRect(x, y, moduleSize + 0.3, moduleSize + 0.3, eyeRadius);
        ctx.fill();
      } else if (shape === 'dots') {
        ctx.beginPath();
        const radius = (moduleSize * 0.45);
        ctx.arc(x + moduleSize / 2, y + moduleSize / 2, radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape === 'rounded') {
        ctx.beginPath();
        const radius = moduleSize * 0.35;
        ctx.roundRect(x, y, moduleSize + 0.3, moduleSize + 0.3, radius);
        ctx.fill();
      } else {
        // Square
        ctx.fillRect(x, y, moduleSize + 0.3, moduleSize + 0.3);
      }
    }
  }

  // Draw Center Logo if provided
  if (logoUrl) {
    try {
      const logoImg = await loadImage(logoUrl);
      const logoBoxSize = size * 0.24; // 24% of QR code
      const logoPos = (size - logoBoxSize) / 2;

      // Draw white backing badge with soft shadow
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(logoPos - 4, logoPos - 4, logoBoxSize + 8, logoBoxSize + 8, logoBoxSize * 0.22);
      ctx.fill();
      ctx.restore();

      // Border around logo
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(logoPos - 4, logoPos - 4, logoBoxSize + 8, logoBoxSize + 8, logoBoxSize * 0.22);
      ctx.stroke();

      // Clip and draw image
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(logoPos, logoPos, logoBoxSize, logoBoxSize, logoBoxSize * 0.2);
      ctx.clip();
      ctx.drawImage(logoImg, logoPos, logoPos, logoBoxSize, logoBoxSize);
      ctx.restore();
    } catch {
      // Graceful fallback if logo fails to load
    }
  }

  return canvas;
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
