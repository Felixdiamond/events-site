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
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoFallback, setIsVideoFallback] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', isTouchDevice ? '30%' : '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, isTouchDevice ? 0.97 : 0.95]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.5], [0.75, 0]);

  // Subtle parallax effect for decorative elements
  const glowX = useTransform(mouseX, [-1, 1], ['-3%', '3%']);
  const glowY = useTransform(mouseY, [-1, 1], ['-3%', '3%']);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Adjust mouse/touch parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isTouchDevice && 'clientX' in e) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 2;
        const y = (clientY / innerHeight - 0.5) * 2;
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const { innerWidth, innerHeight } = window;
        const x = (touch.clientX / innerWidth - 0.5) * 2;
        const y = (touch.clientY / innerHeight - 0.5) * 2;
        mouseX.set(x * 0.5); // Reduce effect on touch devices
        mouseY.set(y * 0.5);
      }
    };

    if (isTouchDevice) {
      window.addEventListener('touchmove', handleTouchMove);
      return () => window.removeEventListener('touchmove', handleTouchMove);
    } else {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY, isTouchDevice]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 0.75;
    video.style.filter = 'brightness(0.65) contrast(1.1) saturate(1.1)';

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      video.play().catch((error) => {
        console.error('Video playback error:', error);
        setVideoError('Video playback failed. Please refresh the page.');
        setIsVideoFallback(true);
      });
    };

    const handlePlaying = () => {
      setIsVideoPlaying(true);
    };

    const handleError = (e: Event) => {
      console.error('Video loading error:', e);
      setVideoError('Failed to load video. Using fallback background.');
      setIsVideoFallback(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
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
          {!isVideoFallback ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
              aria-hidden="true"
            >
              <source src="/videos/hero.mp4" type="video/mp4" />
              <source src="/videos/hero.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div 
              className="absolute inset-0 w-full h-full bg-gradient-to-br from-secondary via-primary/10 to-secondary"
              aria-hidden="true"
            />
          )}
        </motion.div>
        
        {/* Loading Spinner */}
        {!isVideoLoaded && !isVideoFallback && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              role="progressbar"
              aria-label="Loading video"
            />
          </div>
        )}

        {/* Error Message */}
        {videoError && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-red-500/80 text-white rounded-lg text-sm">
            {videoError}
          </div>
        )}

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
        className="relative z-10 container mx-auto px-4 py-12 md:py-20"
        style={{ scale, opacity }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8 md:space-y-12">
            {/* Pre-title badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block"
            >
                <motion.div
                className="group flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full bg-white/[0.02] backdrop-blur-2xl border border-white/10 text-primary-200 text-xs md:text-sm font-medium tracking-wider uppercase shadow-2xl shadow-black/5"
                whileHover={{ 
                  scale: isTouchDevice ? 1 : 1.02,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                role="presentation"
              >
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  aria-hidden="true"
                >
                  <MdStar className="text-lg" />
                </motion.span>
                <span>Sparkling World Events</span>
                <motion.span
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  aria-hidden="true"
                >
                  <MdStar className="text-lg" />
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Main Title */}
            <div className="space-y-4 md:space-y-6" role="heading" aria-level={1}>
              <motion.div
                initial={{ opacity: 0, y: 70 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 1,
                  ease: [0.2, 0.65, 0.3, 0.9]
                }}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold bg-gradient-to-r from-white via-primary-200 to-white bg-clip-text text-transparent drop-shadow-sm"
              >
                Creating Magical
              </motion.div>
              <SplitText
                text="Events & Memories"
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold text-primary drop-shadow-lg"
                delay={isTouchDevice ? 25 : 35}
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
              className="text-lg sm:text-xl md:text-2xl text-accent-light/90 max-w-3xl mx-auto font-light leading-relaxed tracking-wide px-4"
            >
              Transform your special moments into extraordinary experiences. From intimate gatherings to grand celebrations, we bring your vision to life with meticulous attention to detail and unparalleled creativity.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-6 sm:pt-8"
            >
              <Link 
                href="/contact" 
                className="group w-full sm:w-auto"
                aria-label="Start planning your event - Contact us for a personalized consultation"
              >
                  <motion.div
                  className="relative w-full sm:w-auto px-6 sm:px-8 py-4 bg-gradient-to-r from-primary to-primary-600 text-white rounded-full shadow-[0_8px_25px_-4px_rgba(212,175,55,0.3)] overflow-hidden"
                  whileHover={{ 
                    scale: isTouchDevice ? 1 : 1.02, 
                    boxShadow: "0 20px 40px rgba(212, 175, 55, 0.25)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.currentTarget.click();
                    }
                  }}
              >
                <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600"
                      initial={{ x: '100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                      aria-hidden="true"
                    />
                    <span className="relative flex items-center space-x-3 font-medium">
                    <span>Start Planning Your Event</span>
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
                  aria-hidden="true"
                      >
                        <FaArrowRight />
                      </motion.span>
                    </span>
                  </motion.div>
              </Link>

              <Link 
                href="/gallery"
                className="w-full sm:w-auto"
                aria-label="View our event gallery - Get inspired by our past events and celebrations"
              >
                  <motion.div
                  className="group relative w-full sm:w-auto px-6 sm:px-8 py-4 bg-white/[0.02] backdrop-blur-2xl text-white border border-white/10 rounded-full overflow-hidden hover:border-primary/30 shadow-lg shadow-black/5"
                  whileHover={{ 
                    scale: isTouchDevice ? 1 : 1.02,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.currentTarget.click();
                    }
                  }}
              >
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      aria-hidden="true"
                />
                  <span className="relative font-medium">View Our Gallery</span>
                  </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection; 