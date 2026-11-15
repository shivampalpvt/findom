import type { Metadata } from 'next';
import './globals.css';
import { MarketplaceProvider } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Findom: India’s Premier B2B Fish Marketplace',
  description:
    'Direct B2B wholesale platform connecting Indian ornamental fish breeders and suppliers with verified aquarium retail stores. Features pre-dispatch photo verification and DOA protection.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <MarketplaceProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </MarketplaceProvider>
      </body>
    </html>
  );
}
