'use client';

import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FuzzyOverlay } from '@/components/common/FuzzyOverlay';
import { ChatWidget } from '@/components/chat/ChatWidget';

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Chat state callback to be passed to ChatWidget
  const handleChatStateChange = (isOpen: boolean) => {
    setIsChatOpen(isOpen);
  };

  useEffect(() => {
    // Stop the default smooth scroll behavior
    if (typeof window !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'auto';
    }
    
    // Configure Lenis for smooth scrolling
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
    
    // Disable scrolling when chat is open on mobile
    if (isChatOpen && window.innerWidth < 768) {
      lenis.stop();
    } else {
      lenis.start();
    }
    
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
  }, [isChatOpen]);
  
  return (
    <div className={`relative min-h-screen ${isChatOpen ? 'overflow-hidden md:overflow-auto' : 'overflow-hidden'}`}>
      <Navbar />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer />
      <ChatWidget onChatStateChange={handleChatStateChange} />
      {/* <FuzzyOverlay /> */}
    </div>
  );
}