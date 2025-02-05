'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { MdFormatQuote } from 'react-icons/md';

const testimonials = [
  {
    id: 1,
    name: 'Sarah & James',
    role: 'Wedding Celebration',
    image: '/images/testimonials/testimonial-1.jpg',
    quote: 'They transformed our dream wedding into a reality that exceeded our wildest expectations. Every detail was pure perfection.',
    rating: 5,
    location: 'Lagos, Nigeria',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Corporate Event',
    image: '/images/testimonials/testimonial-2.jpg',
    quote: 'The level of professionalism and creativity they brought to our product launch was extraordinary. Our guests are still talking about it.',
    rating: 5,
    location: 'Abuja, Nigeria',
  },
  {
    id: 3,
    name: 'Amara & Family',
    role: 'Birthday Celebration',
    image: '/images/testimonials/testimonial-3.jpg',
    quote: 'They created a magical celebration that perfectly captured our style. The attention to detail was simply outstanding.',
    rating: 5,
    location: 'Port Harcourt, Nigeria',
  },
];

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) => {
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
      <div className="relative">
        {/* Card Container */}
        <motion.div 
          className="relative overflow-hidden rounded-2xl bg-[linear-gradient(110deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)_30%,rgba(255,255,255,0.05))] backdrop-blur-sm border border-white/10"
          animate={isHovered ? { y: -5 } : { y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Quote Icon */}
          <div className="absolute top-6 right-6 text-4xl text-primary/20">
            <MdFormatQuote />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Image and Details */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
                <div className="absolute inset-0 ring-1 ring-white/10 rounded-full" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{testimonial.name}</h3>
                <p className="text-primary/80 text-sm">{testimonial.role}</p>
              </div>
            </div>

            {/* Quote */}
            <blockquote className="relative mb-6">
              <p className="text-white/90 text-lg leading-relaxed">
                "{testimonial.quote}"
              </p>
            </blockquote>

            {/* Location and Rating */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <span className="text-white/60 text-sm">{testimonial.location}</span>
              <div className="flex items-center space-x-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-5 h-5 text-primary"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.2, delay: index * 0.1 + i * 0.1 }}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Hover Effects */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, 0.06), transparent 40%)',
            }}
          />
        </motion.div>

        {/* Background Glow */}
        <motion.div
          className="absolute -inset-2 bg-primary/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
        />
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Handle mouse move effect for cards
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = document.getElementsByClassName('testimonial-card');
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
      (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
    }
  };

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Luxury Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary to-secondary/95" />
        
        {/* Animated Patterns */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.02] bg-[url('/images/texture.png')] bg-repeat bg-[length:32px_32px]" />
          
          {/* Light Beams */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
                className="absolute w-[50%] h-[200%] blur-[100px]"
            style={{
                  background: 'linear-gradient(to right, transparent, rgba(212, 175, 55, 0.05), transparent)',
                  left: `${i * 30}%`,
                  top: '-50%',
                  transform: 'rotate(35deg)',
                }}
                animate={{
                  y: ['0%', '100%'],
                }}
            transition={{ 
                  duration: 20 + i * 5,
              repeat: Infinity,
                  ease: 'linear',
                  delay: -i * 7,
            }}
          />
        ))}
          </div>
        </div>
      </div>

      <div className="container relative">
        <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="inline-block px-8 py-3 rounded-full bg-[linear-gradient(110deg,rgba(212,175,55,0.1),rgba(212,175,55,0.05)_30%,rgba(212,175,55,0.15))] backdrop-blur-sm text-sm text-primary font-medium tracking-wider uppercase mb-8 border border-primary/10 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                Client Stories
              </span>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent mb-6">
              Voices of Joy & Success
            </h2>
            <p className="text-white/75 text-lg md:text-xl max-w-3xl mx-auto">
              Real stories from our cherished clients who trusted us with their most precious moments.
            </p>
        </motion.div>

          {/* Testimonials Grid */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10"
            onMouseMove={handleMouseMove}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
              ))}
            </div>
          </div>
        </div>
    </section>
  );
};

export default TestimonialsSection; 