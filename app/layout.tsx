import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Oshiya - קנייה חכמה ללא FOMO',
  description: 'עוזרת לקנות חכם - בלי FOMO ובלי לרדוף אחרי מבצעים',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
