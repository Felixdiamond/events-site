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
    // Stop the default smooth scroll behavior
    if (typeof window !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'auto';
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    let rafId: number;
    
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    // Start the animation frame
    rafId = requestAnimationFrame(raf);

    return () => {
      // Clean up animation frame
      cancelAnimationFrame(rafId);
      lenis.destroy();

      // Reset scroll behavior
      if (typeof window !== 'undefined') {
        document.documentElement.style.scrollBehavior = '';
      }
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
