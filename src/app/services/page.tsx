'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RiArrowRightLine, RiHeartLine, RiHomeHeartLine, RiPaletteLine, RiStore3Line } from 'react-icons/ri';

const services = [
  {
    id: 'weddings',
    title: 'Weddings & Engagements',
    description: 'Turn your dream wedding into reality with our bespoke planning and flawless execution.',
    image: '/images/services/wedding.jpg',
    icon: RiHeartLine,
    features: [
      'Full Wedding Planning',
      'Partial Planning & Coordination',
      'Day-of Coordination',
      'Venue Selection',
      'Vendor Management',
      'Design & Styling',
      'Timeline Planning',
      'Budget Management',
    ],
    price: 'Starting from ₦500,000',
  },
  {
    id: 'corporate',
    title: 'Corporate Events',
    description: 'Elevate your corporate gatherings with sophisticated planning and professional execution.',
    image: '/images/services/corporate.jpg',
    icon: RiStore3Line,
    features: [
      'Conferences & Seminars',
      'Product Launches',
      'Award Ceremonies',
      'Team Building Events',
      'Corporate Parties',
      'Executive Retreats',
      'Brand Activations',
      'Virtual Events',
    ],
    price: 'Starting from ₦350,000',
  },
  {
    id: 'burial',
    title: 'Burial Ceremonies',
    description: 'Thoughtful and well-organized services that honor and celebrate the life of your loved ones.',
    image: '/images/services/burial.jpg',
    icon: RiHomeHeartLine,
    features: [
      'Complete Ceremony Planning',
      'Venue Arrangement',
      'Catering Services',
      'Memorial Services',
      'Family Support',
      'Cultural Integration',
      'Guest Coordination',
      'Documentation',
    ],
    price: 'Starting from ₦400,000',
  },
  {
    id: 'decoration',
    title: 'Event Venue Decorations',
    description: 'Transform any space with our elegant and customized themes that create the perfect ambiance.',
    image: '/images/services/decoration.jpg',
    icon: RiPaletteLine,
    features: [
      'Custom Theme Design',
      'Floral Arrangements',
      'Lighting Design',
      'Stage Setup',
      'Table Settings',
      'Backdrop Creation',
      'Props & Accessories',
      'On-site Styling',
    ],
    price: 'Starting from ₦200,000',
  },
  {
    id: 'rentals',
    title: 'Rentals & Party Supplies',
    description: 'Providing all essentials for a perfect event, from furniture to decor items.',
    image: '/images/services/rentals.jpg',
    icon: RiStore3Line,
    features: [
      'Furniture Rental',
      'Tableware & Linens',
      'Lighting Equipment',
      'Sound Systems',
      'Tents & Canopies',
      'Dance Floors',
      'Decor Items',
      'Setup & Breakdown',
    ],
    price: 'Starting from ₦150,000',
  },
  {
    id: 'social',
    title: 'Social Celebrations',
    description: 'Create unforgettable moments with expertly crafted social events that leave lasting impressions.',
    image: '/images/services/social.jpg',
    icon: RiHeartLine,
    features: [
      'Birthday Parties',
      'Anniversary Celebrations',
      'Graduation Parties',
      'Baby Showers',
      'Engagement Parties',
      'Holiday Events',
      'Family Reunions',
      'Private Dinners',
    ],
    price: 'Starting from ₦250,000',
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = service.icon;

  return (
    <motion.div
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
        <div className="relative h-[300px] overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
          
          {/* Title Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                <Icon className="text-2xl text-primary" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
                {service.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          <p className="text-white/70 text-lg">{service.description}</p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            {service.features.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -10 }}
                animate={isHovered ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center space-x-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                <span className="text-white/70">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Price and CTA */}
          <div className="pt-6 border-t border-white/10">
            <div className="flex justify-between items-center">
              <p className="text-primary font-medium">{service.price}</p>
              <Link href={`/contact?service=${service.id}`}>
                <motion.button
                  className="flex items-center space-x-2 px-6 py-2 bg-primary/10 rounded-full group/btn overflow-hidden relative"
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
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
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
            className="inline-block mb-6"
          >
            <div className="px-6 py-2 rounded-full bg-white/[0.03] backdrop-blur-sm border border-white/10">
              <span className="text-sm text-primary-200 font-medium tracking-wider uppercase">
                Comprehensive Event Solutions
              </span>
            </div>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our Services
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto"
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
      <section className="relative py-32 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
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

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
              Let's Create Something Special
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Ready to bring your vision to life? Contact us to discuss your event needs 
              and discover how we can make your dreams a reality.
            </p>
            <Link href="/contact">
              <motion.button
                className="px-8 py-4 bg-primary text-white rounded-full font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
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
