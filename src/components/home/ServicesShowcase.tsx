'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { RiArrowRightLine } from 'react-icons/ri';

const services = [
  {
    id: 'weddings',
    title: 'Weddings & Engagements',
    description: 'Turn your dream wedding into reality with our bespoke planning and flawless execution.',
    image: '/images/services/wedding.jpg',
    features: [
      'Personalized Planning',
      'Venue Selection',
      'Full Coordination',
      'Custom Design',
    ],
  },
  {
    id: 'corporate',
    title: 'Corporate Events',
    description: 'Elevate your corporate gatherings with sophisticated planning and professional execution.',
    image: '/images/services/corporate.jpg',
    features: [
      'Conference Planning',
      'Team Building',
      'Product Launches',
      'Award Ceremonies',
    ],
  },
  {
    id: 'social',
    title: 'Social Celebrations',
    description: 'Create unforgettable moments with expertly crafted social events that leave lasting impressions.',
    image: '/images/services/social.jpg',
    features: [
      'Birthday Parties',
      'Anniversary Events',
      'Holiday Celebrations',
      'Private Gatherings',
    ],
  },
  {
    id: 'luxury',
    title: 'Luxury Experiences',
    description: 'Indulge in extraordinary experiences with our premium event planning and concierge services.',
    image: '/images/services/luxury.jpg',
    features: [
      'VIP Events',
      'Exclusive Venues',
      'Luxury Transportation',
      'Premium Entertainment',
    ],
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-10%" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="relative h-[500px] overflow-hidden rounded-2xl">
        {/* Image Container */}
        <div className="absolute inset-0">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative h-full p-8 flex flex-col justify-end">
          <motion.div
            animate={isHovered ? { y: -20 } : { y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent mb-4">
              {service.title}
            </h3>
            <p className="text-white/90 mb-6">
              {service.description}
            </p>

            {/* Features */}
            <motion.div
              className="space-y-2 mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={isHovered ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                  <span className="text-white/80 text-sm">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.button
              className="flex items-center space-x-2 text-primary hover:text-primary-light transition-colors"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-medium">Explore Service</span>
              <RiArrowRightLine className="text-lg" />
            </motion.button>
          </motion.div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl transition-colors duration-300" />
      </div>
    </motion.div>
  );
};

const ServicesShowcase = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/95 via-secondary to-secondary/95">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(800px circle at 100% 0%, rgba(212, 175, 55, 0.05), transparent 70%)",
              "radial-gradient(600px circle at 0% 100%, rgba(212, 175, 55, 0.05), transparent 70%)",
              "radial-gradient(800px circle at 100% 0%, rgba(212, 175, 55, 0.05), transparent 70%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
      </div>

      <div className="container relative">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-sm text-primary font-medium tracking-wider uppercase mb-6">
                Our Expertise
              </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent mb-6">
            Crafting Extraordinary Events
          </h2>
          <p className="text-white/75 text-lg md:text-xl max-w-3xl mx-auto">
            From intimate gatherings to grand celebrations, we bring your vision to life with unparalleled attention to detail and creative excellence.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-10">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesShowcase; 