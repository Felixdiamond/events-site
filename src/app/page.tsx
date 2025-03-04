'use client';

import ServicesShowcase from '@/components/home/ServicesShowcase';
import StatsSection from '@/components/home/StatsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CoreValuesSection from '@/components/home/CoreValuesSection';
import HeroWrapper from '@/components/layout/HeroWrapper';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroWrapper />
      <CoreValuesSection />
      <ServicesShowcase />
      <StatsSection />
      <TestimonialsSection />
    </div>
  );
}
