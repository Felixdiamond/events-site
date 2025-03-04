'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import { MdStar } from 'react-icons/md';
import { 
  InteractiveBadge, 
  SubtleParallax, 
  StaggeredTextReveal,
  MagneticButton,
  OptimizedBackgroundPattern,
  CinematicReveal,
  FloatingIcons
} from '../ui/MobileHeroEnhancements';

const MobileHeroSection = () => {
  const containerRef = useRef(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Static background image instead of video for performance
  const backgroundImage = '/images/hero-mobile.jpg'; // You'll need to create this optimized image
  
  // Simple scroll handling with minimal performance impact
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      if (position < window.innerHeight) {
        setScrollPosition(position / window.innerHeight);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Static Background with Parallax Effect */}
      <div className="absolute inset-0 w-full h-full bg-secondary">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isImageLoaded ? 1 : 0 }}
          transition={{ duration: 1.5 }}
          className="relative w-full h-full"
          style={{ 
            transform: `translateY(${scrollPosition * 15}px)`, 
            scale: 1 + (scrollPosition * 0.05) 
          }}
        >
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            priority
            className="object-cover"
            style={{ filter: 'brightness(0.6) contrast(1.1) saturate(1.1)' }}
            onLoadingComplete={() => setIsImageLoaded(true)}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 via-secondary/70 to-secondary" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-transparent to-secondary/60" />
        </motion.div>
        
        {/* Loading State */}
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              role="progressbar"
              aria-label="Loading"
            />
          </div>
        )}
      </div>

      {/* Enhanced Background Elements - Optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Optimized pattern background */}
        <OptimizedBackgroundPattern className="opacity-10" />
        
        {/* Single primary glow */}
        <SubtleParallax amount={10}>
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-primary/10 rounded-full filter blur-[80px] mix-blend-soft-light"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
          />
        </SubtleParallax>
        
        {/* Floating icons - ultra lightweight */}
        <FloatingIcons />
      </div>

      {/* Main Content - Enhanced with cinematic reveals */}
      <div 
        className="relative z-10 container mx-auto px-4 py-10"
        style={{ 
          transform: `translateY(${-scrollPosition * 30}px)`, 
          opacity: 1 - (scrollPosition * 1.5) 
        }}
      >
        <div className="max-w-md mx-auto">
          <div className="text-center space-y-6">
            {/* Pre-title badge - Interactive */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <InteractiveBadge>
                <div className="flex items-center gap-2 text-primary-200 text-xs font-medium tracking-wider uppercase">
                  <MdStar className="text-sm" />
                  <span>Premier Event Planning in Nigeria</span>
                  <MdStar className="text-sm" />
                </div>
              </InteractiveBadge>
            </motion.div>

            {/* Main Title - Cinematic Reveal */}
            <div className="space-y-3" role="heading" aria-level={1}>
              <CinematicReveal>
                <div className="text-3xl sm:text-4xl font-display font-bold bg-gradient-to-r from-white via-primary-200 to-white bg-clip-text text-transparent drop-shadow-sm">
                  Creating Magical
                </div>
              </CinematicReveal>
              
              <CinematicReveal delay={0.15}>
                <StaggeredTextReveal 
                  text="Events & Memories"
                  className="text-3xl sm:text-4xl font-display font-bold text-primary drop-shadow-lg"
                  delay={0.25}
                />
              </CinematicReveal>
            </div>

            {/* Description - With subtle parallax */}
            <SubtleParallax amount={5} className="block">
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-base sm:text-lg text-accent-light/90 mx-auto font-light leading-relaxed tracking-wide"
              >
                Transform your special moments into extraordinary experiences with our meticulous attention to detail.
              </motion.p>
            </SubtleParallax>

            {/* CTA Buttons - Enhanced with magnetic effect */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col items-center justify-center gap-3 pt-4"
            >
              <Link 
                href="/contact" 
                className="w-full"
                aria-label="Start planning your event"
              >
                <MagneticButton className="w-full" onClick={() => {}}>
                  <div className="w-full px-6 py-3.5 bg-gradient-to-r from-primary to-primary-600 text-white rounded-full shadow-[0_5px_15px_-3px_rgba(212,175,55,0.3)] overflow-hidden">
                    <motion.span 
                      className="flex items-center justify-center space-x-2 font-medium"
                      animate={{
                        x: [0, 3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <span>Start Planning</span>
                      <FaArrowRight />
                    </motion.span>
                  </div>
                </MagneticButton>
              </Link>

              <Link 
                href="/gallery"
                className="w-full"
                aria-label="View our gallery"
              >
                <MagneticButton className="w-full" onClick={() => {}}>
                  <div className="w-full px-6 py-3.5 bg-white/[0.02] backdrop-blur-sm text-white border border-white/10 rounded-full overflow-hidden shadow-md shadow-black/5">
                    <span className="font-medium">View Our Gallery</span>
                    
                    {/* Subtle shimmer effect */}
                    <motion.div 
                      className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -z-10"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      aria-hidden="true"
                    />
                  </div>
                </MagneticButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subtle scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{ opacity: 1 - (scrollPosition * 3) }}
      >
        <motion.div
          className="w-5 h-8 border border-white/10 rounded-full p-1 backdrop-blur-sm bg-white/[0.01]"
          animate={{
            y: [0, 3, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <motion.div
            className="w-1 h-1 bg-primary rounded-full mx-auto"
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default MobileHeroSection;