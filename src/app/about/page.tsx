'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { RiTeamLine, RiEyeLine, RiAwardLine, RiCustomerService2Line } from 'react-icons/ri';

const stats = [
  { value: '7+', label: 'Years of Excellence', icon: RiAwardLine },
  { value: '500+', label: 'Events Executed', icon: RiCustomerService2Line },
  { value: '50+', label: 'Team Members', icon: RiTeamLine },
  { value: '98%', label: 'Client Satisfaction', icon: RiEyeLine },
];

const values = [
  {
    title: 'Excellence',
    description: 'We strive for perfection in every detail, ensuring each event exceeds expectations.',
  },
  {
    title: 'Innovation',
    description: 'Constantly pushing boundaries to create unique and memorable experiences.',
  },
  {
    title: 'Integrity',
    description: 'Building trust through transparency, honesty, and ethical practices.',
  },
  {
    title: 'Passion',
    description: 'Driven by our love for creating extraordinary moments that last a lifetime.',
  },
];

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'Creative Director',
    image: '/images/team/member1.jpg',
  },
  {
    name: 'Michael Chen',
    role: 'Event Coordinator',
    image: '/images/team/member2.jpg',
  },
  {
    name: 'Amara Okafor',
    role: 'Design Lead',
    image: '/images/team/member3.jpg',
  },
];

const AboutPage = () => {
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
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/about-hero.jpg"
            alt="About Sparkling World Events"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/90 to-secondary" />
        </div>

        {/* Content */}
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
            Crafting Dreams Into Reality
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Since 2016, we've been transforming ordinary moments into extraordinary memories, 
            one celebration at a time.
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="w-6 h-12 border-2 border-primary/30 rounded-full p-1">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mx-auto animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative mb-4 mx-auto">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <stat.icon className="text-3xl text-primary" />
                  </div>
                  <div className="absolute -inset-2 bg-primary/5 rounded-xl blur-lg opacity-50" />
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-white/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative py-32 bg-secondary overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.02] bg-[url('/images/texture.png')] bg-repeat bg-[length:32px_32px]" />
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
                Our Story
              </h2>
              <div className="space-y-6 text-white/70">
                <p>
                  Founded in 2016, Sparkling World Events emerged from a passion for creating 
                  unforgettable celebrations. What began as a dream has blossomed into one of 
                  Nigeria's premier event planning and management companies.
                </p>
                <p>
                  Our journey has been marked by countless smiles, joyful tears, and the 
                  privilege of being part of life's most precious moments. From intimate 
                  gatherings to grand celebrations, we've built our reputation on turning 
                  dreams into reality.
                </p>
                <p>
                  Today, we continue to push the boundaries of creativity and excellence, 
                  setting new standards in the event industry while maintaining the personal 
                  touch that has been our hallmark since day one.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/about-story.jpg"
                  alt="Our journey in creating extraordinary events"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay" />
              </div>
              <div className="absolute -inset-4 bg-primary/5 rounded-2xl blur-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-32 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
              Our Core Values
            </h2>
            <p className="text-white/70 max-w-3xl mx-auto">
              These principles guide every decision we make and every event we create.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-white/70">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-32 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-white/70 max-w-3xl mx-auto">
              The passionate individuals behind every successful event.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-end p-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-primary">{member.role}</p>
                    </div>
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