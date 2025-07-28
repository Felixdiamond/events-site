'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import CountUp from '@/components/common/CountUp';
import Image from 'next/image';
import React from 'react';

// Placeholder icons (replace with your SVGs or icon components)
const statIcons = [
  () => (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-primary"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  () => (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-primary"><rect x="4" y="4" width="16" height="16" rx="8" stroke="currentColor" strokeWidth="2" /><path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
  ),
  () => (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-primary"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
  ),
  () => (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-primary"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
  ),
];

const stats = [
  {
    value: 250,
    suffix: '+',
    label: 'Events Orchestrated',
    description: 'Unforgettable celebrations crafted',
  },
  {
    value: 98,
    suffix: '%',
    label: 'Client Satisfaction',
    description: 'Exceeding expectations consistently',
  },
  {
    value: 10,
    suffix: 'K',
    label: 'Happy Guests',
    description: 'Memories created and shared',
  },
  {
    value: 10,
    label: 'Industry Awards',
    description: 'Recognition for excellence',
  },
];

const GradientText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
);

const StatsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section ref={sectionRef} className="relative py-32 md:py-40 overflow-hidden">
      {/* Subtle texture background with dark gradient base */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary to-secondary/95" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/texture.png')] bg-repeat bg-[length:24px_24px]" />
      </div>
      <div className="container relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-sm text-primary font-medium tracking-wider uppercase mb-6">
              Our Achievements
            </span>
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <GradientText>Milestones of Excellence</GradientText>
            </h2>
            <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto font-light">
              A decade of creating extraordinary experiences, one celebration at a time.
            </p>
          </div>
          {/* Stats Grid in GlassCard style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
            {stats.map((stat, index) => {
              const Icon = statIcons[index];
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  className="group relative"
                >
                  {/* GlassCard style */}
                  <motion.div
                    className="group relative p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm h-full overflow-hidden shadow-xl"
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  >
                    <div className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'radial-gradient(circle, rgba(198,90,45,0.15) 0%, rgba(198,90,45,0) 70%)',
                        filter: 'blur(20px)',
                      }}
                    />
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <Icon />
                    </div>
                    {/* Number with radial glow */}
                    <div className="relative flex items-baseline justify-center space-x-1 mb-5">
                      <span className="text-5xl md:text-6xl font-bold relative z-10 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
                        <CountUp
                          to={stat.value}
                          duration={2}
                          delay={0.5 + index * 0.1}
                        />
                      </span>
                      {stat.suffix && (
                        <span className="text-2xl md:text-3xl font-bold text-primary">
                          {stat.suffix}
                        </span>
                      )}
                      {/* Radial glow behind number */}
                      <motion.div
                        className="absolute inset-0 rounded-full blur-md -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        style={{
                          background: 'radial-gradient(circle, rgba(198,90,45,0.4) 0%, rgba(198,90,45,0) 70%)',
                        }}
                      />
                    </div>
                    {/* Label & Description */}
                    <h3 className="text-xl font-semibold text-white mb-1 text-center">
                      {stat.label}
                    </h3>
                    <p className="text-white/60 text-center text-base">
                      {stat.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 