'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FuzzyOverlay } from '@/components/common/FuzzyOverlay';

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.7,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen">
      <Navbar />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer />
      <FuzzyOverlay />
    </div>
  );
} 
