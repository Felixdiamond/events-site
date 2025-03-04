'use client';

import { motion } from 'framer-motion';
import { ReactNode, ReactElement } from 'react';

// Interactive Badge - A premium-feeling interactive element for mobile
export const InteractiveBadge = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-full bg-white/[0.03] backdrop-blur-sm border border-white/10 px-4 py-2"
      whileTap={{ scale: 0.97 }}
    >
      {/* Subtle shimmer effect */}
      <motion.div 
        className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
        aria-hidden="true"
      />
      
      {children}
    </motion.div>
  );
};

// SubtleParallax - Creates a gentle parallax effect that works well even on low-power devices
export const SubtleParallax = ({ 
  children, 
  amount = 15, 
  className = "" 
}: { 
  children: ReactNode; 
  amount?: number; 
  className?: string;
}) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      animate={{ y: [amount, -amount, amount] }}
      transition={{ 
        repeat: Infinity, 
        repeatType: "reverse", 
        duration: 10, 
        ease: "easeInOut" 
      }}
    >
      {children}
    </motion.div>
  );
};

// Staggered Text Reveal - For mobile, we'll use a simpler but still engaging text reveal
export const StaggeredTextReveal = ({ 
  text, 
  delay = 0.1, 
  className = "" 
}: {
  text: string;
  delay?: number;
  className?: string;
}) => {
  const words = text.split(" ");
  
  return (
    <motion.div className={`flex flex-wrap justify-center ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="mr-2 mb-1 inline-block"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: delay + (i * 0.1),
            ease: [0.2, 0.65, 0.3, 0.9] 
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// MagneticButton - A subtle but premium feeling button for mobile
export const MagneticButton = ({ 
  children, 
  className = "", 
  onClick 
}: { 
  children: ReactNode; 
  className?: string; 
  onClick: () => void;
}) => {
  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 bg-primary/20 blur-md rounded-full -z-10"
        initial={{ scale: 0.85, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 0.8 }}
        transition={{ duration: 0.3 }}
        aria-hidden="true"
      />
      
      {children}
    </motion.button>
  );
};

// Optimized Background Patterns that won't cause performance issues
export const OptimizedBackgroundPattern = ({ 
  className = "" 
}: { 
  className?: string;
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none opacity-20 ${className}`} aria-hidden="true">
      {/* Use SVG for better performance than CSS gradients on mobile */}
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};

// Cinematic Reveal Animation - A simple but effective animation for content reveal
export const CinematicReveal = ({ 
  children, 
  delay = 0 
}: { 
  children: ReactNode; 
  delay?: number;
}) => {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ 
          duration: 0.9, 
          delay,
          ease: [0.25, 1, 0.5, 1]
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// FloatingIcons - Ultra-lightweight animated icons for decoration
export const FloatingIcons = (): React.ReactElement => {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary/30"
          initial={{ 
            left: `${Math.random() * 80 + 10}%`, 
            top: `${Math.random() * 80 + 10}%`,
            scale: 0 
          }}
          animate={{ 
            y: [-20, -40, -20],
            scale: [0, 1, 0]
          }}
          transition={{ 
            duration: 3,
            delay: i * 1.5,
            repeat: Infinity
          }}
        />
      ))}
    </div>
  );
};

// You can import these components in your MobileHeroSection for enhanced visuals
// without the heavy performance cost of the desktop version