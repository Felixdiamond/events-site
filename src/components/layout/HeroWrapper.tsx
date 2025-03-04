'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '../home/HeroSection';

// Import the original (desktop) HeroSection


// Dynamically import the mobile version to reduce initial load time
const MobileHeroSection = dynamic(() => import('../home/MobileHeroSection'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[100svh] flex items-center justify-center bg-secondary">
      <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  )
});

const ResponsiveHeroWrapper = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Function to check if the device is mobile
    const checkMobile = () => {
      // Initial check based on screen width
      setIsMobile(window.innerWidth < 768);
      
      // Also check for device performance capabilities
      // This helps identify low-power devices even with larger screens
      const performanceCheck = () => {
        // Check for low memory indicator
        const deviceMemory = 'deviceMemory' in navigator ? (navigator as any).deviceMemory : 8;
        const lowMemory = deviceMemory < 4;
        
        // Check for slow CPU
        const hardwareConcurrency = 'hardwareConcurrency' in navigator ? navigator.hardwareConcurrency : 8;
        const slowCPU = hardwareConcurrency < 4;
        
        // Check if mobile browser
        const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Use a combination of factors to determine if we should use the mobile version
        return (lowMemory || slowCPU || mobileUserAgent) && window.innerWidth < 1024;
      };
      
      // Set isMobile to true for both small screens and low-performance devices
      setIsMobile(window.innerWidth < 768 || performanceCheck());
    };
    
    // Run the check immediately
    checkMobile();
    
    // Setup listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Use server-side rendering for the desktop version initially
  // Only switch to client-side decision after hydration
  if (!isClient) {
    return <HeroSection />;
  }
  
  return isMobile ? <MobileHeroSection /> : <HeroSection />;
};

export default ResponsiveHeroWrapper;