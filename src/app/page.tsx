'use client';

import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import ServicesShowcase from '@/components/home/ServicesShowcase';
import StatsSection from '@/components/home/StatsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CoreValuesSection from '@/components/home/CoreValuesSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CoreValuesSection />
      <ServicesShowcase />
      <StatsSection />
      <TestimonialsSection />
    </div>
  );
}
