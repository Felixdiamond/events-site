'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import CountUp from '@/components/common/CountUp';

const stats = [
  {
    value: 500,
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
    value: 25,
    suffix: 'K',
    label: 'Happy Guests',
    description: 'Memories created and shared',
  },
  {
    value: 12,
    label: 'Industry Awards',
    description: 'Recognition for excellence',
  },
];

const StatsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Luxury Background */}
      <div className="absolute inset-0">
        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary to-secondary/95" />
        
        {/* Animated luxury pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/texture.png')] bg-repeat bg-[length:24px_24px]" />
          
          {/* Animated light beams */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
                className="absolute w-[50%] h-[200%] blur-[100px]"
            style={{
                  background: 'linear-gradient(to right, transparent, rgba(212, 175, 55, 0.08), transparent)',
                  left: `${i * 30}%`,
                  top: '-50%',
                  transform: 'rotate(35deg)',
                }}
                animate={{
                  y: ['0%', '100%'],
                }}
            transition={{ 
                  duration: 20 + i * 5,
              repeat: Infinity,
                  ease: 'linear',
                  delay: -i * 7,
            }}
          />
        ))}
          </div>
        </div>
      </div>

      <div className="container relative">
        <div className="max-w-7xl mx-auto">
        {/* Section Header */}
          <motion.div
            className="text-center mb-32"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-block perspective-1000"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                className="relative"
                animate={{ rotateX: [0, 5, 0], rotateY: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="inline-block px-8 py-3 rounded-full bg-[linear-gradient(110deg,rgba(212,175,55,0.1),rgba(212,175,55,0.05)_30%,rgba(212,175,55,0.15))] backdrop-blur-sm text-sm text-primary font-medium tracking-wider uppercase mb-8 border border-primary/10 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                  Our Legacy
              </span>
            </motion.div>
          </motion.div>
            
            <h2 className="text-5xl md:text-7xl font-bold mb-8 relative">
              <span className="absolute -inset-x-full inset-y-0 hidden md:block">
                <div className="w-full h-full">
                  <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-xl" />
                  <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-transparent via-primary/5 to-transparent blur-xl" />
                </div>
              </span>
              <span className="relative bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
                Milestones of Excellence
              </span>
            </h2>
            <p className="text-white/75 text-xl md:text-2xl max-w-3xl mx-auto font-light">
              A decade of creating extraordinary experiences, one celebration at a time.
            </p>
        </motion.div>

          {/* Stats Display */}
          <div className="relative">
        {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {stats.map((stat, index) => (
            <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative perspective-1000"
                >
                  <motion.div
                    className="relative z-10 p-8"
                    animate={{ rotateX: [0, 2, 0], rotateY: [0, 4, 0] }}
                    transition={{ duration: 5, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {/* Number */}
                    <div className="relative">
                      <div className="absolute -inset-x-6 -inset-y-2 bg-gradient-to-r from-primary/[0.08] via-primary/[0.05] to-primary/[0.08] rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative flex items-baseline justify-center space-x-1 mb-6">
                        <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
                          <CountUp
                            to={stat.value}
                            duration={2}
                            delay={0.5 + index * 0.1}
                          />
                        </span>
                        {stat.suffix && (
                          <span className="text-4xl md:text-5xl font-bold text-primary">
                            {stat.suffix}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Label & Description */}
                    <div className="relative">
                      <h3 className="text-2xl font-bold text-white mb-3 text-center">
                        {stat.label}
                      </h3>
                      <p className="text-white/60 text-center text-lg">
                        {stat.description}
                      </p>
                    </div>

                    {/* Hover Effects */}
                    <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] to-transparent rounded-3xl" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.08] to-transparent rounded-3xl" />
                    </div>
                </motion.div>

                  {/* 3D Border Effect */}
                  <div className="absolute -inset-px bg-gradient-to-b from-primary/20 to-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20" />
            </motion.div>
          ))}
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl opacity-50" />
            <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-gradient-to-tl from-primary/20 to-transparent rounded-full blur-2xl opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 