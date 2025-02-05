'use client';

import { motion, useScroll, useTransform, MotionValue, useSpring, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { RiTeamLine, RiEyeLine, RiAwardLine, RiCustomerService2Line, RiStarLine, RiShieldLine, RiHeartLine, RiHandHeartLine, RiUserStarLine, RiGroupLine } from 'react-icons/ri';

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
  },
  {
    name: 'Michael Chen',
    role: 'Event Coordinator',
    image: '/images/team/member2.jpg',
    bio: 'Specialized in seamless event execution and logistics.',
  },
  {
    name: 'Amara Okafor',
    role: 'Design Lead',
    image: '/images/team/member3.jpg',
    bio: 'Award-winning designer with a passion for innovation.',
  },
];

const NumberCounter = ({ value, duration = 2 }: { value: string; duration?: number }) => {
  const numberValue = parseInt(value.replace(/[^0-9]/g, ''));
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useSpring(0, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (inView) {
      motionValue.set(numberValue);
    }
  }, [inView, motionValue, numberValue]);

  return (
    <motion.span ref={ref} className="tabular-nums">
      {useTransform(motionValue, (latest) => 
        Math.floor(latest) + (value.includes('+') ? '+' : '')
      )}
    </motion.span>
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

      {/* Stats Section with Enhanced Parallax */}
      <section className="relative py-32 bg-secondary overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'url("/images/texture.png")',
            backgroundSize: '32px 32px',
          }}
          animate={{
            y: [0, -32],
          }}
          transition={{
            repeat: Infinity,
            duration: 60,
            ease: "linear",
          }}
        />

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <motion.div
                  className="absolute -inset-4 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-500"
                  whileHover={{ scale: 1.1 }}
                />
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-12 transition-transform duration-500">
                    <stat.icon className="text-5xl text-primary transform group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-6xl font-bold text-white mb-3">
                    <NumberCounter value={stat.value} />
                  </h3>
                  <p className="text-lg text-white/70 font-light">{stat.label}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Background Gradient Animation */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </section>

      {/* Story Section with Enhanced Parallax */}
      <section className="relative py-32 bg-secondary overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="h-1 bg-gradient-to-r from-primary to-transparent mb-8"
              />
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                <GradientText>Creating Memories</GradientText>
                <br />
                <span className="text-white">Since 2016</span>
              </h2>
              <div className="space-y-6 text-white/70">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-xl leading-relaxed"
                >
                  Founded with a vision to revolutionize event planning in Nigeria, Sparkling World Events 
                  has grown from a passionate startup to a leading force in the industry. Our journey 
                  began with a simple belief: every celebration deserves to be extraordinary.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl leading-relaxed"
                >
                  Over the years, we've had the privilege of crafting countless memorable moments, 
                  from intimate gatherings to grand celebrations. Each event has added to our 
                  expertise and strengthened our commitment to excellence.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-xl leading-relaxed"
                >
                  Today, we continue to push boundaries, embrace innovation, and maintain the 
                  personal touch that has been our hallmark since day one.
                </motion.p>
              </div>
            </motion.div>
            
            <div className="relative">
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
                  className="object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay"
                  animate={{
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </motion.div>
              <motion.div
                className="absolute -inset-4 bg-primary/5 rounded-2xl blur-2xl -z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
              />
              </div>
          </div>
        </div>
      </section>

      {/* Values Section with Enhanced UI */}
      <section className="relative py-32 bg-secondary overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[url('/images/texture.png')] bg-repeat opacity-[0.02]"
          animate={{
            backgroundPosition: ["0px 0px", "32px 32px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <GradientText>Our Core Values</GradientText>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto font-light">
              These fundamental principles guide our approach and define our commitment to excellence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
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
                <div className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="mb-6"
                  >
                    <value.icon className="text-5xl text-primary" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-lg text-white/70">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
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