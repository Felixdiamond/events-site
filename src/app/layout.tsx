import { metadata } from './metadata';
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientRootLayout from '@/components/layout/ClientLayout';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-secondary text-accent-light">
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}