import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/lib/cart-context';

export const metadata: Metadata = {
  title: 'FIGBRICKS | Collectible Minifigs of Fictional Characters',
  description: 'Buy customized anime, comic, movie and superhero minifigures online at Figbricks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased font-sans">
        <CartProvider>
          <Header />
          <main className="flex-1 w-full bg-white">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
