'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RiArrowRightLine, RiHeartLine, RiHomeHeartLine, RiPaletteLine, RiStore3Line, RiInstagramLine } from 'react-icons/ri';

const services = [
  {
    id: 'planning',
    title: 'Corporate/Social Event Planning & Coordination',
    description: 'Comprehensive planning and seamless coordination for corporate and social events of any scale.',
    image: '/images/services/diningarea.jpg',
    icon: RiStore3Line,
    features: [
      'Event concept development',
      'Timeline creation',
      'Guest management',
      'Program flow',
      'Event execution',
    ],
    price: '',
  },
  {
    id: 'vendor',
    title: 'Vendor Sourcing & Management',
    description: 'We connect you with trusted vendors and manage all communications to ensure quality and reliability.',
    image: '/images/services/vendor.jpg',
    icon: RiHomeHeartLine,
    features: [
      'Vendor research',
      'Contract negotiation',
      'Communication',
      'Quality assurance',
      'Payment coordination',
    ],
    price: '',
  },
  {
    id: 'venue',
    title: 'Venue Selection',
    description: 'Find the perfect venue that matches your event\'s vision, size, and budget.',
    image: '/images/services/diningarea.jpg',
    icon: RiStore3Line,
    features: [
      'Venue research',
      'Site visits',
      'Booking',
      'Layout planning',
      'Logistics coordination',
    ],
    price: '',
  },
  {
    id: 'decoration',
    title: 'Decoration/Styling',
    description: 'Transform your event space with creative and elegant decoration tailored to your theme.',
    image: '/images/services/wedding.jpg',
    icon: RiPaletteLine,
    features: [
      'Theme design',
      'Floral arrangements',
      'Lighting',
      'Table settings',
      'On-site styling',
    ],
    price: '',
  },
  {
    id: 'budget',
    title: 'Budget Planning',
    description: 'Detailed budgeting to maximize value and keep your event on track financially.',
    image: '/images/services/budget.jpg',
    icon: RiHeartLine,
    features: [
      'Budget creation',
      'Cost tracking',
      'Vendor payments',
      'Financial reporting',
      'Contingency planning',
    ],
    price: '',
  },
  {
    id: 'logistics',
    title: 'Logistics/Accommodation Management',
    description: 'We handle all logistics and accommodation needs for a smooth and stress-free event.',
    image: '/images/services/logistics.jpg',
    icon: RiStore3Line,
    features: [
      'Transportation',
      'Accommodation booking',
      'Guest logistics',
      'On-site coordination',
      'Special requests',
    ],
    price: '',
  },
  {
    id: 'supervision',
    title: 'On-site Supervision',
    description: 'Professional on-site supervision to ensure every detail is executed flawlessly.',
    image: '/images/services/supervise.jpg',
    icon: RiHeartLine,
    features: [
      'Event setup',
      'Vendor coordination',
      'Timeline management',
      'Troubleshooting',
      'Guest assistance',
    ],
    price: '',
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef(null);
  const Icon = service.icon;

  // Check if the screen size is mobile on component mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute -inset-2 rounded-3xl bg-primary/5 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"
        whileHover={{ scale: 1.1 }}
      />
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.01] border border-white/10 backdrop-blur-sm">
        {/* Image Section */}
        <div className="relative h-[220px] sm:h-[250px] md:h-[300px] overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
          
          {/* Title Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                <Icon className="text-xl sm:text-2xl text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
                {service.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <p className="text-base sm:text-lg text-white/70">{service.description}</p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {service.features.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -10 }}
                animate={(isHovered || isMobile) ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center space-x-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                <span className="text-sm sm:text-base text-white/70">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Price and CTA */}
          <div className="pt-4 sm:pt-6 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <p className="text-primary font-medium text-sm sm:text-base">{service.price}</p>
                {service.instagram && (
                  <a 
                    href={`https://instagram.com/${service.instagram.replace('@', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-white/70 hover:text-primary text-sm mt-2 transition-colors"
                  >
                    <RiInstagramLine className="text-lg" />
                    <span>{service.instagram}</span>
                  </a>
                )}
              </div>
              <Link href={`/contact?service=${service.id}`} className="w-full sm:w-auto">
                <motion.button
                  className="flex items-center justify-center sm:justify-start space-x-2 px-4 sm:px-6 py-2 bg-primary/10 rounded-full group/btn overflow-hidden relative w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-primary opacity-0 group-hover/btn:opacity-100 transition-opacity"
                  />
                  <span className="relative text-primary group-hover/btn:text-white transition-colors">
                    Inquire Now
                  </span>
                  <RiArrowRightLine className="relative text-primary group-hover/btn:text-white transition-colors" />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>

        {/* Hover Effects */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.08] via-transparent to-transparent" />
        </div>
      </div>
    </motion.div>
  );
};

const ServicesPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden pt-16 md:pt-0">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 via-secondary/80 to-secondary" />
          <div className="absolute inset-0 bg-[url('/images/texture.png')] bg-repeat bg-[length:32px_32px] opacity-[0.02]" />
          
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
          style={{ y, opacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-4 sm:mb-6"
          >
            <div className="px-4 sm:px-6 py-1 sm:py-2 rounded-full bg-white/[0.03] backdrop-blur-sm border border-white/10">
              <span className="text-xs sm:text-sm text-primary-200 font-medium tracking-wider uppercase">
                Comprehensive Event Solutions
              </span>
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our Services
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover our comprehensive range of event planning services, 
            each crafted to deliver extraordinary experiences.
          </motion.p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="relative py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-20 md:py-32 bg-secondary overflow-hidden">
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

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
              Let's Create Something Special
            </h2>
            <p className="text-base sm:text-lg text-white/70 mb-6 sm:mb-8">
              Ready to bring your vision to life? Contact us to discuss your event needs 
              and discover how we can make your dreams a reality.
            </p>
            <Link href="/contact">
              <motion.button
                className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-full font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get in Touch
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;