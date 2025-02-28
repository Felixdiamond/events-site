'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { RiStarLine, RiHeartLine, RiTeamLine, RiMagicLine, RiTimeLine, RiShieldLine } from 'react-icons/ri';

const celebrationValues = [
  {
    icon: <RiMagicLine />,
    title: 'Magical Moments',
    description: 'Creating unforgettable experiences that leave your guests spellbound.',
    highlight: 'From intimate gatherings to grand galas',
    achievement: 'Over 500 dreams realized',
  },
  {
    icon: <RiTimeLine />,
    title: 'Timeless Execution',
    description: 'Precision planning that ensures your event flows seamlessly from start to finish.',
    highlight: 'Every minute masterfully orchestrated',
    achievement: '100% on-time performance',
  },
  {
    icon: <RiHeartLine />,
    title: 'Personal Touch',
    description: 'Your story and vision at the heart of every celebration we create.',
    highlight: 'Uniquely yours, perfectly executed',
    achievement: 'No two events alike',
  },
  {
    icon: <RiTeamLine />,
    title: 'Dream Team',
    description: 'Expert coordinators and vendors working in perfect harmony.',
    highlight: 'Industry-leading professionals',
    achievement: '50+ trusted partners',
  },
  {
    icon: <RiStarLine />,
    title: 'Excellence',
    description: 'Setting the gold standard in luxury event experiences.',
    highlight: 'Award-winning service',
    achievement: '5-star rated events',
  },
  {
    icon: <RiShieldLine />,
    title: 'Peace of Mind',
    description: 'Relax and enjoy while we handle every detail with care.',
    highlight: 'Stress-free celebrations',
    achievement: '100% satisfaction rate',
  },
];

const CelebrationCard = ({ value, index }: { value: typeof celebrationValues[0]; index: number }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.5, 
        delay: isMobile ? index * 0.05 : index * 0.1,
        ease: [0.21, 0.45, 0.27, 0.9]
      }}
      className="group relative"
    >
      <div className="relative overflow-hidden">
        {/* Card Content */}
        <motion.div 
          className="relative p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-sm h-full"
          style={{
            background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))',
          }}
          whileHover={!isMobile ? { y: -5, transition: { duration: 0.2 } } : undefined}
        >
          {/* Icon */}
          <div className="relative mb-6">
            <motion.div 
              className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10"
              whileHover={!isMobile ? { scale: 1.05 } : undefined}
              transition={{ duration: 0.2, type: "tween" }}
            >
              <div className="text-2xl md:text-3xl text-primary">
                {value.icon}
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <motion.h3 
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent mb-3"
            animate={isInView ? { opacity: [0, 1], y: [20, 0] } : {}}
            transition={{ duration: 0.5, delay: isMobile ? index * 0.05 + 0.1 : index * 0.1 + 0.2 }}
          >
            {value.title}
          </motion.h3>

          <motion.p 
            className="text-base md:text-lg text-white/80 mb-6"
            animate={isInView ? { opacity: [0, 1] } : {}}
            transition={{ duration: 0.5, delay: isMobile ? index * 0.05 + 0.15 : index * 0.1 + 0.3 }}
          >
            {value.description}
          </motion.p>

          {/* Achievement Section */}
          <motion.div
            className="pt-4 md:pt-6 mt-4 md:mt-6 border-t border-white/5"
            animate={isInView ? { opacity: [0, 1], y: [20, 0] } : {}}
            transition={{ duration: 0.5, delay: isMobile ? index * 0.05 + 0.2 : index * 0.1 + 0.4 }}
          >
            <div className="space-y-2">
              <p className="text-primary/90 font-medium text-sm md:text-base">{value.highlight}</p>
              <p className="text-white/60 text-xs md:text-sm">{value.achievement}</p>
            </div>
          </motion.div>

          {/* Hover Effects - Disabled on Mobile */}
          {!isMobile && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.08] via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/[0.02] to-transparent" />
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

const CoreValuesSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:py-32">
      {/* Ambient Background - Optimized */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary to-secondary/95">
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            background: [
              "radial-gradient(600px circle at 0% 0%, rgba(212, 175, 55, 0.05), transparent 70%)",
              "radial-gradient(800px circle at 100% 100%, rgba(212, 175, 55, 0.05), transparent 70%)",
              "radial-gradient(600px circle at 0% 0%, rgba(212, 175, 55, 0.05), transparent 70%)",
            ],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear",
            times: [0, 0.5, 1]
          }}
        />
      </div>

      <div className="container relative">
        {/* Section Header - Enhanced */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={false}
            animate={{ y: [0, -5, 0] }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut",
              times: [0, 0.5, 1]
            }}
            className="inline-block perspective-1000"
          >
            <motion.span 
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-sm text-primary font-medium tracking-wider uppercase mb-6"
              initial={false}
              animate={{ rotateX: [0, 5, 0], rotateY: [0, 10, 0] }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }}
            >
              The Sparkling World Experience
            </motion.span>
          </motion.div>
            
          <motion.h2 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent mb-6"
            animate={isInView ? { 
              opacity: [0, 1],
              y: [20, 0],
              scale: [0.95, 1]
            } : {}}
            transition={{ 
              duration: 0.8,
              ease: [0.21, 0.45, 0.27, 0.9]
            }}
          >
            Celebrating Life's Moments
          </motion.h2>
          <motion.p 
            className="text-white/75 text-lg md:text-xl max-w-3xl mx-auto"
            animate={isInView ? { 
              opacity: [0, 1],
              y: [20, 0]
            } : {}}
            transition={{ 
              duration: 0.8,
              delay: 0.1,
              ease: [0.21, 0.45, 0.27, 0.9]
            }}
          >
            Every event is a canvas for creating memories. We bring your vision to life with expertise, creativity, and meticulous attention to detail.
          </motion.p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 xl:gap-10">
          {celebrationValues.map((value, index) => (
            <CelebrationCard key={value.title} value={value} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;