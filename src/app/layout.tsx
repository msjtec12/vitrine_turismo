import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { FavoritesProvider } from '@/lib/favorites-context';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import PWAInstallPrompt from '@/components/ui/PWAInstallPrompt';

const jakartaSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#1B4332',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'Descubra Artes | Vitrine de Artesanato, Cultura e Turismo',
    template: '%s | Descubra Artes',
  },
  description:
    'Descubra quem faz. Conheça o lugar. Leve uma história. Conecte-se com mestres artesãos, ateliês e produtos regionais em São Roque e destinos de todo o Brasil.',
  keywords: [
    'artesanato são roque',
    'produtos regionais',
    'cerâmica artesanal',
    'roteiro do vinho são roque',
    'marcenaria rustica',
    'artesanato brasileiro',
    'turismo são paulo',
    'descubra cidades',
    'guia de artesãos',
  ],
  authors: [{ name: 'Descubra Artes' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://descubraartes.com.br',
    siteName: 'Descubra Artes',
    title: 'Descubra Artes | Conectando Turistas aos Artesãos Locais',
    description:
      'Encontre artesãos, artistas, produtos regionais e lembranças especiais direto de quem produz.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Descubra Artes - Turismo e Artesanato',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${jakartaSans.variable} ${playfairDisplay.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#2C2623] selection:bg-[#C85A32] selection:text-white">
        <AuthProvider>
          <FavoritesProvider>
            <Header />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <MobileBottomNav />
            <PWAInstallPrompt />
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
