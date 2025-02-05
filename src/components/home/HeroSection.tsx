'use client';

import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { MdStar } from 'react-icons/md';
import SplitText from '../common/SplitText';

const FloatingParticle = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-primary/30 rounded-full"
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      y: [-20, -60],
    }}
      transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeOut"
    }}
  />
);

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.5], [0.75, 0]);

  // Subtle parallax effect for decorative elements
  const glowX = useTransform(mouseX, [-1, 1], ['-3%', '3%']);
  const glowY = useTransform(mouseY, [-1, 1], ['-3%', '3%']);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 0.75;
    video.style.filter = 'brightness(0.65) contrast(1.1) saturate(1.1)';

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      video.play().catch(console.error);
    };

    const handlePlaying = () => {
      setIsVideoPlaying(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
    };
  }, []);

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Video Background with Loading State */}
      <div className="absolute inset-0 w-full h-full bg-secondary">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVideoLoaded && isVideoPlaying ? 1 : 0 }}
          transition={{ duration: 2, ease: [0.45, 0, 0.55, 1] }}
          className="relative w-full h-full"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </motion.div>
        
        {/* Enhanced Gradient Overlays */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-secondary/90 via-secondary/85 to-secondary"
          style={{ opacity: videoOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-transparent to-secondary/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/5 to-transparent mix-blend-overlay" />
      </div>

      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-full h-full"
          style={{ x: glowX, y: glowY }}
          transition={{ type: "spring", damping: 15 }}
        >
          {/* Enhanced glow effects with parallax */}
      <motion.div 
            className="absolute top-1/4 left-1/4 w-[45rem] h-[45rem] bg-primary/10 rounded-full filter blur-[130px] mix-blend-soft-light"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-white/5 rounded-full filter blur-[120px] mix-blend-overlay"
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-secondary/20 rounded-full filter blur-[150px] mix-blend-multiply"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", delay: 2 }}
          />
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${25 + Math.random() * 50}%`,
                top: `${40 + Math.random() * 20}%`,
              }}
            >
              <FloatingParticle delay={i * 0.5} />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 py-20"
        style={{ scale, opacity }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-12">
            {/* Pre-title badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block"
            >
                <motion.div
                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.02] backdrop-blur-2xl border border-white/10 text-primary-200 text-sm font-medium tracking-wider uppercase shadow-2xl shadow-black/5"
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)'
                }}
                transition={{ duration: 0.2 }}
              >
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <MdStar className="text-lg" />
                </motion.span>
                <span>Elevating Nigerian Events</span>
                <motion.span
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <MdStar className="text-lg" />
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Main Title */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 70 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 1,
                  ease: [0.2, 0.65, 0.3, 0.9]
                }}
                className="text-6xl md:text-7xl lg:text-8xl font-display font-bold bg-gradient-to-r from-white via-primary-200 to-white bg-clip-text text-transparent drop-shadow-sm"
              >
                Crafting Extraordinary
              </motion.div>
              <SplitText
                text="Moments Together"
                className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-primary drop-shadow-lg"
                delay={35}
                animationFrom={{ opacity: 0, transform: 'translate3d(0,70px,0)' }}
                animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                easing={(t) => t * (2 - t)}
              />
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-xl md:text-2xl text-accent-light/90 max-w-3xl mx-auto font-light leading-relaxed tracking-wide"
            >
              Where dreams transform into unforgettable celebrations. Experience event planning redefined through creativity, precision, and passion.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
            >
              <Link href="/contact" className="group">
                  <motion.div
                  className="relative px-8 py-4 bg-gradient-to-r from-primary to-primary-600 text-white rounded-full shadow-[0_8px_25px_-4px_rgba(212,175,55,0.3)] overflow-hidden"
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 20px 40px rgba(212, 175, 55, 0.25)",
                  }}
                  whileTap={{ scale: 0.98 }}
              >
                <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600"
                      initial={{ x: '100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative flex items-center space-x-3 font-medium">
                    <span>Begin Your Journey</span>
                      <motion.span
                  animate={{
                          x: [0, 5, 0],
                          opacity: [1, 0.8, 1],
                  }}
                  transition={{
                          duration: 1.5, 
                    repeat: Infinity,
                          repeatType: "reverse",
                  }}
                      >
                        <FaArrowRight />
                      </motion.span>
                    </span>
                  </motion.div>
              </Link>

              <Link href="/gallery">
                  <motion.div
                  className="group relative px-8 py-4 bg-white/[0.02] backdrop-blur-2xl text-white border border-white/10 rounded-full overflow-hidden hover:border-primary/30 shadow-lg shadow-black/5"
                  whileHover={{ 
                    scale: 1.02,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }}
                  whileTap={{ scale: 0.98 }}
              >
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                />
                  <span className="relative font-medium">Explore Our Work</span>
                  </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="w-6 h-12 border-2 border-white/10 rounded-full p-1 backdrop-blur-2xl bg-white/[0.02]"
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <motion.div
            className="w-1.5 h-1.5 bg-primary rounded-full mx-auto"
            animate={{
              y: [0, 20, 0],
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

export default HeroSection; 