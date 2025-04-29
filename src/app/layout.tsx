import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientRootLayout from '@/components/layout/ClientLayout';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Metadata } from "next";
import { ToastProvider } from "@heroui/toast"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    template: '%s | Sparkling World Events',
    default: 'Sparkling World Events | Premier Event Planning in Nigeria'
  },
  description: "Transform your special moments into extraordinary experiences with Nigeria's leading event planning service. From intimate gatherings to grand celebrations, we bring your vision to life with meticulous attention to detail and unparalleled creativity.",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [
      { url: '/favicon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/favicon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/favicon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/favicon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/favicon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/favicon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/favicon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/favicon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/favicon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  other: {
    'msapplication-TileColor': '#ffffff',
    'msapplication-TileImage': '/favicon-144x144.png',
    'msapplication-config': '/browserconfig.xml',
  },
};

export const viewport = {
  themeColor: '#1a1a1a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-secondary text-accent-light">
        <AuthProvider>
          <ClientRootLayout>
            <ToastProvider />
            {children}
          </ClientRootLayout>
        </AuthProvider>
      </body>
    </html>
  );
}