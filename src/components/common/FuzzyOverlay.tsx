'use client';

import { motion } from 'framer-motion';

export const FuzzyOverlay = () => {
 return (
  <motion.div
   initial={{ transform: 'translateX(-10%) translateY(-10%)' }}
   animate={{
    transform: 'translateX(10%) translateY(10%)',
   }}
   transition={{
    repeat: Infinity,
    duration: 0.1,
    ease: 'linear',
    repeatType: 'mirror',
   }}
   style={{
    backgroundImage: 'url("/noise.webp")',
   }}
   className="pointer-events-none absolute -inset-[100%] opacity-[15%]"
  />
 );
}; 