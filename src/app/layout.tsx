import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'FinLife – Textile Export Platform',
  description: 'Digital Product Passport & Invoice Financing for Turkish textile exporters',
  icons: {
    icon: '/logo_finlife.png',
    apple: '/logo_finlife.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <Sidebar />
        <main className="ml-64 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
