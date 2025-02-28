import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientRootLayout from '@/components/layout/ClientLayout';
import { AuthProvider } from '@/components/providers/AuthProvider';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-secondary text-accent-light">
        <AuthProvider>
          <ClientRootLayout>{children}</ClientRootLayout>
        </AuthProvider>
      </body>
    </html>
  );
}