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

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative overflow-hidden">
        {/* Card Content */}
        <motion.div 
          className="relative p-8 rounded-2xl border border-white/10 backdrop-blur-sm h-full"
          style={{
            background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))',
          }}
        >
          {/* Icon */}
          <div className="relative mb-6">
            <motion.div 
              className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl text-primary">
                {value.icon}
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="relative space-y-4">
            <motion.h3 
              className="text-2xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent"
              animate={isInView ? { opacity: [0, 1], y: [20, 0] } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            >
              {value.title}
            </motion.h3>

            <motion.p 
              className="text-white/80"
              animate={isInView ? { opacity: [0, 1] } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            >
              {value.description}
            </motion.p>

            {/* Achievement Section */}
            <motion.div
              className="pt-6 mt-6 border-t border-white/5"
              animate={isInView ? { opacity: [0, 1], y: [20, 0] } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
            >
              <div className="space-y-2">
                <p className="text-primary/90 font-medium">{value.highlight}</p>
                <p className="text-white/60 text-sm">{value.achievement}</p>
              </div>
            </motion.div>
          </div>

          {/* Hover Effects */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.08] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/[0.02] to-transparent" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const CoreValuesSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-32">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary to-secondary/95">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(600px circle at 0% 0%, rgba(212, 175, 55, 0.07), transparent 70%)",
              "radial-gradient(800px circle at 100% 100%, rgba(212, 175, 55, 0.07), transparent 70%)",
              "radial-gradient(600px circle at 0% 0%, rgba(212, 175, 55, 0.07), transparent 70%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container relative">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-20"
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="inline-block"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-sm text-primary font-medium tracking-wider uppercase mb-6">
                The Sparkling World Experience
              </span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent mb-6">
              Celebrating Life's Moments
            </h2>
            <p className="text-white/75 text-lg md:text-xl max-w-3xl mx-auto">
              Every event is a canvas for creating memories. We bring your vision to life with expertise, creativity, and meticulous attention to detail.
            </p>
          </motion.div>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          {celebrationValues.map((value, index) => (
            <CelebrationCard key={value.title} value={value} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;