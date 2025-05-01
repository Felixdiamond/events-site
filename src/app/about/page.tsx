'use client';

import { motion, useScroll, useTransform, MotionValue, useSpring, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { RiTeamLine, RiEyeLine, RiAwardLine, RiCustomerService2Line, RiStarLine, RiShieldLine, RiHeartLine, RiHandHeartLine, RiUserStarLine, RiGroupLine } from 'react-icons/ri';

// FloatingParticles - Add subtle floating particles to any section
const FloatingParticles = ({ count = 15, color = "primary", opacity = 0.15 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full bg-${color}/${opacity * 100}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [opacity * 0.5, opacity, opacity * 0.5],
            scale: [0, 1, 0],
            y: [-20, -100 - Math.random() * 50],
            x: Math.random() * 20 - 10,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeOut"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${80 + Math.random() * 20}%`,
          }}
        />
      ))}
    </div>
  );
};

// GradientBackground - Add a moving gradient background to any section
const GradientBackground = ({ colors = ["primary"], intensity = 0.05 }) => {
  const colorValues = colors.map(color => `rgba(212,175,55,${intensity})`);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{
        background: [
          `radial-gradient(circle at 20% 20%, ${colorValues[0]} 0%, transparent 50%)`,
          `radial-gradient(circle at 80% 80%, ${colorValues[0]} 0%, transparent 50%)`,
          `radial-gradient(circle at 20% 20%, ${colorValues[0]} 0%, transparent 50%)`,
        ]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

// AnimatedLine - Add an animated line that draws itself
const AnimatedLine = ({ direction = "horizontal", width = "100%", height = "1px", className = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ width: direction === "horizontal" ? 0 : width, height: direction === "vertical" ? 0 : height }}
      whileInView={{ width: width, height: height }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay }}
      className={`bg-gradient-to-r from-primary to-transparent ${className}`}
    />
  );
};

// GlassCard - A reusable glass card component with hover effects
const GlassCard = ({ 
  children, 
  className = "", 
  hoverEffect = true 
}: { 
  children: React.ReactNode; 
  className?: string; 
  hoverEffect?: boolean;
}) => {
  return (
    <motion.div
      className={`group relative ${className}`}
      whileHover={hoverEffect ? { y: -10, transition: { duration: 0.3 } } : {}}
    >
      <motion.div
        className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0) 70%)',
          filter: 'blur(20px)',
        }}
      />

      <div className="relative p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {children}
      </div>
    </motion.div>
  );
};

const stats = [
  { value: '7+', label: 'Years of Excellence', icon: RiAwardLine },
  { value: '500+', label: 'Events Executed', icon: RiCustomerService2Line },
  { value: '50+', label: 'Team Members', icon: RiTeamLine },
  { value: '98%', label: 'Client Satisfaction', icon: RiEyeLine },
];

const values = [
  {
    title: 'Excellence',
    description: 'We exceed expectations in every detail, setting new standards in event management.',
    icon: RiStarLine,
  },
  {
    title: 'Integrity',
    description: 'Building trust through transparency and ethical practices in all our dealings.',
    icon: RiShieldLine,
  },
  {
    title: 'Quality',
    description: 'Delivering premium experiences with meticulous attention to every aspect.',
    icon: RiAwardLine,
  },
  {
    title: 'Passion',
    description: 'Driven by our love for creating extraordinary moments that last a lifetime.',
    icon: RiHeartLine,
  },
  {
    title: 'Service',
    description: 'Dedicated to providing exceptional service that goes above and beyond.',
    icon: RiHandHeartLine,
  },
  {
    title: 'Partnership',
    description: 'Fostering strong relationships with clients and vendors for mutual success.',
    icon: RiGroupLine,
  },
];

const differentiators = [
  {
    title: 'Exceeding Expectations',
    description: 'We go beyond the ordinary, ensuring every detail contributes to an extraordinary experience.',
    icon: RiStarLine,
  },
  {
    title: 'No Compromises',
    description: 'Quality is never negotiable – we consistently deliver excellence in every aspect.',
    icon: RiShieldLine,
  },
  {
    title: 'Expert Team',
    description: 'Our seasoned professionals bring creativity and precision to every event.',
    icon: RiUserStarLine,
  },
  {
    title: 'Premium Network',
    description: 'Partnerships with top-tier vendors ensure access to the best services and products.',
    icon: RiGroupLine,
  },
];

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'Creative Director',
    image: '/images/team/member1.jpg',
    bio: 'With over 15 years of experience in luxury events.',
  }
];

const NumberCounter = ({ value, duration = 2.5 }: { value: string; duration?: number }) => {
  const valueWithoutSymbols = value.replace(/[^0-9.]/g, '');
  const numberValue = parseFloat(valueWithoutSymbols);
  const hasPlusSign = value.includes('+');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  // Use spring animation for smoother counting
  const motionValue = useSpring(0, {
    duration: duration * 1000,
    bounce: 0.2,
    stiffness: 50,
    damping: 15
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(numberValue);
    }
  }, [inView, motionValue, numberValue]);

  return (
    <div ref={ref} className="relative inline-flex items-center">
      <motion.span
        className="tabular-nums text-4xl md:text-5xl font-bold relative z-10"
        style={{
          backgroundImage: 'linear-gradient(to right, #FFFFFF, #D4AF37)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {useTransform(motionValue, (latest) => {
          const formattedNumber = Number.isInteger(latest)
            ? Math.floor(latest).toLocaleString()
            : latest.toFixed(1).toLocaleString();
          return formattedNumber + (hasPlusSign ? '+' : '');
        })}
      </motion.span>

      {/* Subtle glow effect behind the number */}
      <motion.div
        className="absolute inset-0 rounded-full blur-md -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 0.3 : 0 }}
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0) 70%)',
        }}
      />
    </div>
  );
};

const GradientText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
);

const AboutPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/about-hero.jpg"
            alt="About Sparkling World Events"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/90 to-secondary" />

          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                initial={{ opacity: 0.2, scale: 0 }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0, 1.5, 0],
                  y: [-20, -100],
                  x: Math.random() * 20 - 10,
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeOut"
                }}
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${80 + Math.random() * 10}%`,
                }}
              />
            ))}
          </div>
        </div>

        <motion.div
          className="relative container mx-auto px-4 text-center"
          style={{ y, opacity, scale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: [0.25, 0.1, 0, 1]
            }}
            className="relative inline-block mb-8"
          >
            <div className="relative px-8 py-3 rounded-full bg-white/[0.03] backdrop-blur-2xl border border-white/10">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-transparent"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <span className="relative text-sm font-medium tracking-wider uppercase text-primary-200">
                Welcome to Our World
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="text-7xl md:text-9xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <GradientText>Our Story</GradientText>
          </motion.h1>

          <motion.p
            className="text-2xl md:text-3xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Crafting extraordinary moments since 2016, we transform dreams into unforgettable celebrations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-primary text-white font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow duration-300"
            >
              Discover More
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.div
            className="w-6 h-12 border-2 border-primary/30 rounded-full p-1 backdrop-blur-sm"
            animate={{
              y: [0, 10, 0],
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
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>
        </motion.div>
      </section>
      {/* Story Section with Enhanced Parallax and Animation */}
      <section className="relative py-32 bg-secondary overflow-hidden">
        {/* Background elements */}
        <FloatingParticles count={20} opacity={0.1} />
        <GradientBackground intensity={0.08} />

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <AnimatedLine className="mb-8" />

              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                <GradientText>Creating Memories</GradientText>
                <br />
                <span className="text-white">Since 2016</span>
              </h2>

              <div className="space-y-6 text-white/70">
                {/* Timeline style story with animated appearance */}
                <div className="relative pl-8 border-l border-primary/30">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-12"
                  >
                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary mb-2">The Beginning</h3>
                    <p className="text-xl leading-relaxed">
                      Founded with a vision to revolutionize event planning in Nigeria, Sparkling World Events
                      began as a passionate startup with a simple belief: every celebration deserves to be extraordinary.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative mb-12"
                  >
                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary mb-2">The Journey</h3>
                    <p className="text-xl leading-relaxed">
                      Over the years, we&apos;ve had the privilege of crafting countless memorable moments,
                      from intimate gatherings to grand celebrations. Each event has added to our
                      expertise and strengthened our commitment to excellence.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="relative"
                  >
                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary mb-2">Today & Beyond</h3>
                    <p className="text-xl leading-relaxed">
                      Today, we continue to push boundaries, embrace innovation, and maintain the
                      personal touch that has been our hallmark since day one, constantly evolving
                      to exceed the expectations of our discerning clientele.
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <div className="relative">
              {/* Main image with enhanced animation and effects */}
              <motion.div
                className="relative aspect-[4/3] rounded-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <Image
                  src="/images/about-story.jpg"
                  alt="Our journey in creating extraordinary events"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient overlay with animation */}
                <motion.div
                  className="absolute inset-0 mix-blend-overlay"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.3) 0%, rgba(0,0,0,0) 50%)',
                  }}
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />

                {/* Floating event elements */}
                <motion.div
                  className="absolute top-6 right-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-xl"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    opacity: { duration: 0.5, delay: 0.8 },
                    y: { duration: 4, repeat: Infinity, repeatType: "reverse" }
                  }}
                  animate={{
                    y: [0, -10, 0],
                  }}
                >
                  <p className="text-sm font-medium text-white">500+ Events</p>
                </motion.div>

                <motion.div
                  className="absolute bottom-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    opacity: { duration: 0.5, delay: 1 },
                    y: { duration: 5, repeat: Infinity, repeatType: "reverse" }
                  }}
                  animate={{
                    y: [0, 10, 0],
                  }}
                >
                  <p className="text-sm font-medium text-white">Since 2016</p>
                </motion.div>
              </motion.div>

              {/* Background glow effect */}
              <motion.div
                className="absolute -inset-4 bg-primary/5 rounded-2xl blur-2xl -z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
              />

              {/* Decorative element */}
              <motion.div
                className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full border border-primary/30"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  opacity: { duration: 0.5, delay: 1.2 },
                  scale: { duration: 5, repeat: Infinity, repeatType: "reverse" }
                }}
                animate={{
                  scale: [1, 1.1, 1],
                }}
              >
                <motion.div
                  className="absolute inset-4 rounded-full border border-primary/50"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section with Enhanced UI */}
      <section className="relative py-24 md:py-32 bg-secondary overflow-hidden">
        {/* Premium background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-[url('/images/texture.png')] bg-repeat opacity-[0.03]"
            animate={{
              backgroundPosition: ["0px 0px", "32px 32px"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute -top-[30%] -right-[30%] w-[80%] h-[80%] bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent rounded-full blur-3xl"
            animate={{
              y: [0, 30, 0],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16 md:mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "120px" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6 md:mb-8"
            />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              <GradientText>Our Essence</GradientText>
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto font-light">
              The foundations that define our identity and guide our approach to creating extraordinary experiences.
            </p>
          </motion.div>

          {/* Core Values & Principles Cards - Integrated with Mission, Vision */}
          <div className="grid lg:grid-cols-3 gap-6 md:gap-10 mb-16 md:mb-24">
            {/* Mission, History and Vision Card - Improved for mobile */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-1 relative group rounded-2xl order-2 lg:order-1"
            >
              <div className="h-full flex flex-col relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Mission - More sleek design */}
                <div className="relative mb-8 md:mb-10">
                  <div className="flex items-center gap-3 md:gap-4 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-inner">
                      <RiStarLine className="text-xl md:text-2xl text-accent-light" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">Mission</h3>
                  </div>
                  <div className="pl-4 md:pl-16 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-light/50 via-accent-light/20 to-transparent"></div>
                    <p className="text-base md:text-lg text-white/80 font-light pl-4">
                      "To consistently create exceptional, unforgettable events that provide outstanding value for every investment made by our valued clients."
                    </p>
                  </div>
                </div>
                
                {/* Vision - More sleek design */}
                <div className="relative mb-8 md:mb-10">
                  <div className="flex items-center gap-3 md:gap-4 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-inner">
                      <RiEyeLine className="text-xl md:text-2xl text-accent-light" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">Vision</h3>
                  </div>
                  <div className="pl-4 md:pl-16 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-light/50 via-accent-light/20 to-transparent"></div>
                    <p className="text-base md:text-lg text-white/80 font-light pl-4">
                      "To drive the evolution of the event management industry by establishing new benchmarks of integrity and uncompromising quality."
                    </p>
                  </div>
                </div>
                
                {/* History - More sleek timeline design */}
                <div className="relative mt-auto">
                  <div className="flex items-center gap-3 md:gap-4 mb-5">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-inner">
                      <RiAwardLine className="text-xl md:text-2xl text-accent-light" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">History</h3>
                  </div>
                  <div className="pl-4 md:pl-16 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-light/50 via-accent-light/20 to-transparent"></div>
                    <div className="space-y-4 md:space-y-5 pl-4">
                      <div className="relative">
                        <div className="absolute -left-[17px] top-1 w-3 h-3 rounded-full bg-accent-light"></div>
                        <div className="flex items-start">
                          <span className="text-accent-light font-medium w-12 text-sm md:text-base">2013</span>
                          <span className="text-white/70 text-sm md:text-base flex-1">Established with a vision of excellence</span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[17px] top-1 w-3 h-3 rounded-full bg-accent-light"></div>
                        <div className="flex items-start">
                          <span className="text-accent-light font-medium w-12 text-sm md:text-base">2016</span>
                          <span className="text-white/70 text-sm md:text-base flex-1">Officially commenced operations</span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[17px] top-1 w-3 h-3 rounded-full bg-accent-light"></div>
                        <div className="flex items-start">
                          <span className="text-accent-light font-medium w-12 text-sm md:text-base">Today</span>
                          <span className="text-white/70 text-sm md:text-base flex-1">Industry leader with uncompromising quality</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Values Cards - Using your existing values but with enhanced styling */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 order-1 lg:order-2 mb-6 lg:mb-0">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="relative group"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <motion.div
                    className="absolute -inset-1.5 md:-inset-2 rounded-xl md:rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500"
                    whileHover={{ scale: 1.03 }}
                  />
                  <div className="relative p-6 md:p-8 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden h-full flex flex-col">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="mb-4 md:mb-6"
                    >
                      <value.icon className="text-4xl md:text-5xl text-primary" />
                    </motion.div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4">{value.title}</h3>
                    <p className="text-base md:text-lg text-white/70">{value.description}</p>
                    
                    {/* Add subtle animated line */}
                    <motion.div
                      className="w-8 md:w-12 h-px bg-primary/50 mt-4 md:mt-6"
                      initial={{ width: 0 }}
                      whileInView={{ width: "2rem" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Premium quote section - Improved for mobile */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative rounded-xl md:rounded-2xl overflow-hidden group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-light/5 via-accent-light/10 to-accent-light/5 rounded-xl md:rounded-2xl blur-2xl md:blur-3xl opacity-30" />
            
            <div className="relative bg-white/[0.02] border border-white/5 p-6 md:p-10 backdrop-blur-sm rounded-xl md:rounded-2xl">
              <motion.div 
                className="absolute right-0 top-0 w-full h-full opacity-30"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
                }}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-10 relative z-10">
                <div className="md:w-1/2">
                  <div className="flex items-center mb-6">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "30px" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="h-px bg-gradient-to-r from-accent-light to-transparent mr-3"
                    />
                    <h3 className="text-xl md:text-2xl text-white/70 uppercase tracking-wide font-light">Our Promise</h3>
                  </div>
                  
                  <p className="text-xl md:text-2xl leading-relaxed text-white/90 mb-4 md:mb-6 font-serif">
                    <span className="text-3xl md:text-4xl text-accent-light font-serif">"</span>
                    Through unwavering consistency, unshakeable integrity, and uncompromising quality, we redefine the industry standard.
                    <span className="text-3xl md:text-4xl text-accent-light font-serif">"</span>
                  </p>
                  
                  <p className="text-base md:text-lg leading-relaxed text-white/70">
                    Our comprehensive services cover the complete planning and coordination of events, allowing our clients to remain stress-free throughout their special occasions.
                  </p>
                </div>
                
                <div className="md:w-1/2 relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg shadow-black/20"
                  >
                    {/* Mobile-optimized image container */}
                    <div className="relative w-full h-full">
                      <Image
                        src="/images/about-detail.jpg"
                        alt="Our commitment to excellence"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                      
                      <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                        <p className="text-base md:text-lg text-white font-medium drop-shadow-md">
                          We approach every event as a personal commitment, dedicating our full effort to make it truly memorable.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Decorative elements - hidden on small screens */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-16 md:w-20 h-16 md:h-20 border border-accent-light/20 rounded-full hidden md:block"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Sets Us Apart Section */}
      <section className="relative py-32 bg-secondary overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.02] bg-[url('/images/texture.png')] bg-repeat bg-[length:32px_32px]" />
          <motion.div
            className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent rounded-full blur-3xl"
            animate={{
              y: [0, 50, 0],
              x: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <GradientText>What Sets Us Apart</GradientText>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto font-light">
              Our commitment to excellence and attention to detail make every event truly special.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {differentiators.map((item, index) => (
              <motion.div
                key={item.title}
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <motion.div
                  className="absolute -inset-2 rounded-3xl bg-primary/5 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"
                  whileHover={{ scale: 1.1 }}
                />
                <div className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex items-start gap-6">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 12 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"
                    >
                      <item.icon className="text-3xl text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-lg text-white/70">{item.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section with Enhanced Cards */}
      <section className="relative py-32 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <GradientText>Meet Our Team</GradientText>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto font-light">
              The passionate individuals behind every successful event.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <motion.div
                  className="absolute -inset-2 rounded-3xl bg-primary/5 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"
                  whileHover={{ scale: 1.1 }}
                />
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "40%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-1 bg-gradient-to-r from-primary to-transparent mb-6"
                    />
                    <h3 className="text-3xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-primary text-lg mb-4">{member.role}</p>
                    <p className="text-lg text-white/70 transform opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;