'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { RiArrowRightLine } from 'react-icons/ri';

const services = [
  {
    id: 'planning',
    title: 'Corporate/Social Event Planning & Coordination',
    description: 'Comprehensive planning and seamless coordination for corporate and social events of any scale.',
    image: '/images/services/peopleplanning.jpg',
    features: [
      'Event concept development',
      'Timeline creation',
      'Guest management',
      'Program flow',
      'Event execution',
    ],
    pricing: '',
    stats: '',
  },
  {
    id: 'vendor',
    title: 'Vendor Sourcing & Management',
    description: 'We work with tested and trusted vendors to deliver quality and excellent service.',
    image: '/images/services/vendor.jpg',
    features: [
      'Vendor research',
      'Contract negotiation',
      'Communication',
      'Quality assurance',
      'Payment coordination',
    ],
    pricing: '',
    stats: '',
  },
  {
    id: 'venue',
    title: 'Venue Selection',
    description: 'Find the perfect venue that matches your event\'s vision, size, and budget.',
    image: '/images/services/venue.jpg',
    features: [
      'Venue research',
      'Site visits',
      'Booking',
      'Layout planning',
      'Logistics coordination',
    ],
    pricing: '',
    stats: '',
  },
  {
    id: 'decoration',
    title: 'Decoration/Styling',
    description: 'Transform your event space with creative and elegant decoration tailored to your theme.',
    image: '/images/services/decstyle.jpg',
    features: [
      'Theme design',
      'Floral arrangements',
      'Lighting',
      'Table settings',
      'On-site styling',
    ],
    pricing: '',
    stats: '',
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-10%" });
  const [isHovered, setIsHovered] = useState(false);
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
      onHoverStart={() => !isMobile && setIsHovered(true)}
      onHoverEnd={() => !isMobile && setIsHovered(false)}
      className="group relative"
    >
      <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-2xl">
        {/* Image Container with Optimized Loading */}
        <div className="absolute inset-0">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 2}
            loading={index < 2 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />
        </div>

        {/* Content Container */}
        <div className="relative h-full p-6 md:p-8 flex flex-col justify-end">
          <motion.div
            animate={isHovered ? { y: -20 } : { y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Title and Stats */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
                {service.title}
              </h3>
              <span className="text-sm text-primary/90 font-medium hidden md:block">
                {service.stats}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-white/90 mb-4 md:mb-6 line-clamp-3 md:line-clamp-none">
              {service.description}
            </p>

            {/* Features */}
            <motion.div
              className="space-y-2 mb-4 md:mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={isHovered || isMobile ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-2">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                    <span className="text-white/80 text-xs md:text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pricing and CTA */}
            <div className="flex items-center justify-between">
              <span className="text-sm md:text-base text-primary/90 font-medium">
                {service.pricing}
              </span>
              <motion.button
                className="flex items-center space-x-2 text-primary hover:text-primary-light transition-colors"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-sm md:text-base font-medium">Learn More</span>
                <RiArrowRightLine className="text-lg" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Hover Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl transition-colors duration-300" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ServicesShowcase = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Effects - Optimized */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/95 via-secondary to-secondary/95">
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            background: [
              "radial-gradient(800px circle at 100% 0%, rgba(192, 132, 252, 0.08), transparent 70%)",
              "radial-gradient(600px circle at 0% 100%, rgba(192, 132, 252, 0.08), transparent 70%)",
              "radial-gradient(800px circle at 100% 0%, rgba(192, 132, 252, 0.08), transparent 70%)",
            ],
          }}
          transition={{ 
            duration: 10, 
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
          transition={{ duration: 0.8, ease: [0.21, 0.45, 0.27, 0.9] }}
        >
          <motion.div
            className="inline-block perspective-1000"
            initial={false}
            animate={{ y: [0, -5, 0] }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1]
            }}
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
              Our Expertise
            </motion.span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent mb-6"
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
            Crafting Extraordinary Events
          </motion.h2>
          <motion.p 
            className="text-base md:text-lg lg:text-xl text-white/75 max-w-3xl mx-auto"
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
            From intimate gatherings to grand celebrations, we bring your vision to life with unparalleled attention to detail and creative excellence.
          </motion.p>
        </motion.div>

        {/* Services Grid - Optimized for Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 xl:gap-10">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesShowcase; 