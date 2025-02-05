'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RiArrowRightLine } from 'react-icons/ri';

const services = [
  {
    id: 'weddings',
    title: 'Weddings & Engagements',
    description: 'Turn your dream wedding into reality with our bespoke planning and flawless execution.',
    image: '/images/services/wedding.jpg',
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
    id: 'social',
    title: 'Social Celebrations',
    description: 'Create unforgettable moments with expertly crafted social events that leave lasting impressions.',
    image: '/images/services/social.jpg',
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
  {
    id: 'luxury',
    title: 'Luxury Experiences',
    description: 'Indulge in extraordinary experiences with our premium event planning and concierge services.',
    image: '/images/services/luxury.jpg',
    features: [
      'VIP Events',
      'Destination Events',
      'Luxury Weddings',
      'Celebrity Events',
      'Yacht Parties',
      'Private Concerts',
      'Exclusive Galas',
      'Bespoke Experiences',
    ],
    price: 'Custom Quotation',
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

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
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.01] border border-white/10">
        {/* Image Section */}
        <div className="relative h-[300px] overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />
          
          {/* Title Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
              {service.title}
            </h3>
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
        </div>

        <motion.div 
          className="relative container mx-auto px-4 text-center"
          style={{ y, opacity }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Services
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
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
                className="px-8 py-4 bg-primary text-white rounded-full flex items-center space-x-2 mx-auto hover:bg-primary-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Your Journey</span>
                <RiArrowRightLine />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage; 
