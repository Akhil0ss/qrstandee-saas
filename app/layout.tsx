import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'QRStandee — Professional QR Standee Studio & Dynamic Redirect SaaS',
  description: 'Design print-ready acrylic standees, table tents, and dynamic QR codes with live analytics. High-res 300 DPI exports for retail, restaurants, and clinics.',
  keywords: ['QR standee', 'dynamic QR code', 'business QR', 'table tent QR', 'Google review standee', 'UPI QR generator'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0b0f19',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
