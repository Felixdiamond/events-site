'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  RiWhatsappLine,
  RiInstagramLine,
  RiFacebookBoxLine,
  RiLinkedinBoxLine,
  RiPhoneLine,
  RiMailLine,
  RiMapPin2Line,
  RiStarLine,
  RiArrowRightUpLine,
  RiCalendarCheckLine,
} from 'react-icons/ri';

const socialLinks = [
  {
    icon: RiWhatsappLine,
    href: 'https://wa.me/2348103657145',
    label: 'WhatsApp',
    color: 'hover:bg-green-500',
  },
  {
    icon: RiInstagramLine,
    href: 'https://www.instagram.com/sparklingworldng',
    label: 'Instagram',
    color: 'hover:bg-pink-600',
  },
  {
    icon: RiFacebookBoxLine,
    href: 'https://facebook.com/sparklingworld',
    label: 'Facebook',
    color: 'hover:bg-blue-600',
  },
  {
    icon: RiLinkedinBoxLine,
    href: 'https://linkedin.com/company/sparklingworld',
    label: 'LinkedIn',
    color: 'hover:bg-blue-700',
  },
];

const contactInfo = [
  {
    icon: RiPhoneLine,
    title: 'Phone',
    details: [
      { text: '+234 802 599 7713', type: 'phone' },
      { text: '+234 810 365 7145', type: 'phone' },
      { text: '+234 905 557 2903', type: 'phone', note: '(Calls Only)' },
      { text: '+234 911 921 7578', type: 'phone', note: '(WhatsApp Only)' },
    ],
  },
  {
    icon: RiMailLine,
    title: 'Email',
    details: [
      { text: 'sparklingworldevents@gmail.com', type: 'email' },
    ],
  },
  {
    icon: RiMapPin2Line,
    title: 'Location',
    details: [
      { text: 'Lagos, Nigeria', type: 'address' },
      { text: 'Available Nationwide', type: 'address' },
    ],
  },
];

const FloatingParticle = ({ delay = 0, className = '' }) => (
  <motion.div
    className={`absolute w-1 h-1 bg-primary/30 rounded-full ${className}`}
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

export default function Contact() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-secondary" ref={containerRef}>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 via-secondary/80 to-secondary" />
          <div className="absolute inset-0 bg-[url('/images/texture.png')] bg-repeat bg-[length:32px_32px] opacity-[0.02]" />
          
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
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
            <div className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.03] backdrop-blur-2xl border border-white/10">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <RiStarLine className="text-lg text-primary" />
              </motion.span>
              <span className="text-sm font-medium tracking-wider uppercase text-primary-200">
                Let's Create Something Special
              </span>
              <motion.span
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <RiStarLine className="text-lg text-primary" />
              </motion.span>
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Ready to bring your vision to life? We're here to help make your dreams a reality.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a 
              href="/book" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary-600 text-white rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105"
            >
              <RiCalendarCheckLine className="text-xl" />
              <span>Book Our Services</span>
              <RiArrowRightUpLine className="text-xl" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="relative py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-7 space-y-12">
              <div>
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Contact Information
                </motion.h2>
                <motion.p 
                  className="text-white/70 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Have questions or ready to start planning your event? 
                  Reach out through any of our contact channels below.
                </motion.p>
              </div>

              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-start gap-4 md:gap-6">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.03] backdrop-blur-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <info.icon className="text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">{info.title}</h3>
                        <div className="space-y-2">
                          {info.details.map((detail, i) => (
                            <p key={i} className="text-white/70 flex items-center flex-wrap gap-2">
                              {detail.type === 'phone' ? (
                                <a href={`tel:${detail.text}`} className="hover:text-primary transition-colors">
                                  {detail.text}
                                </a>
                              ) : detail.type === 'email' ? (
                                <a href={`mailto:${detail.text}`} className="hover:text-primary transition-colors break-all">
                                  {detail.text}
                                </a>
                              ) : (
                                <span>{detail.text}</span>
                              )}
                              {detail.note && (
                                <span className="text-sm text-primary/70">
                                  {detail.note}
                                </span>
                              )}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Connect With Us</h3>
                <div className="flex gap-4">
                  {socialLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <motion.a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm flex items-center justify-center text-white ${link.color} hover:scale-110 transition-all`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <Icon className="text-2xl" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 h-full"
            >
              <div className="sticky top-32 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl h-full">
                <div className="relative w-full aspect-square md:aspect-auto md:h-64 bg-secondary/80 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-white/[0.03] backdrop-blur-sm flex items-center justify-center text-primary border border-white/10">
                      <RiMapPin2Line className="text-5xl" />
                    </div>
                    
                    {/* Animated rings */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full border border-primary/20"
                        initial={{ width: 100, height: 100, opacity: 0 }}
                        animate={{ 
                          width: [100, 300], 
                          height: [100, 300], 
                          opacity: [0, 0.5, 0]
                        }}
                        transition={{
                          duration: 4,
                          delay: i * 1.2,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-semibold text-white mb-4">Our Location</h3>
                  <p className="text-white/70 mb-6">
                    We are based in Lagos, Nigeria, and available for events nationwide. Our team can travel to your location for consultations and event planning.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href="https://goo.gl/maps/YOUR_LOCATION_LINK" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-5 rounded-xl bg-white/[0.03] border border-white/10 text-white hover:bg-white/10 transition-colors text-center"
                    >
                      View on Map
                    </a>
                    <a 
                      href="/book" 
                      className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-primary to-primary-600 text-white text-center hover:shadow-lg hover:shadow-primary/20 transition-all"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary to-secondary/90" />
        
        {/* Background elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0, 2, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
              Ready to Create an Unforgettable Event?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Let's bring your vision to life. Our team of experienced event planners is ready to help you create memories that last a lifetime.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <a 
                href="/book" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary-600 text-white rounded-xl font-medium shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all"
              >
                <RiCalendarCheckLine className="text-xl" />
                <span>Book Your Consultation</span>
                <RiArrowRightUpLine className="text-xl" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}