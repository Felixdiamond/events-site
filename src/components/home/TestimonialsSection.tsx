'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { MdFormatQuote } from 'react-icons/md';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const testimonials = [
  {
    id: 1,
    name: 'Sarah & James Thompson',
    role: 'Luxury Wedding',
    company: 'Tech Executive Couple',
    image: '/images/testimonials/testimonial-1.jpg',
    quote: 'Sparkling World Events turned our dream wedding into a breathtaking reality. Their attention to detail, from the custom-designed decor to the seamless coordination, created an atmosphere of pure magic. Our guests still talk about it months later!',
    rating: 5,
    location: 'Lagos, Nigeria',
    date: 'March 2024',
    eventSize: '350 Guests',
    verified: true,
    highlights: [
      'Custom Design & Decor',
      'International Coordination',
      'VIP Guest Management',
    ],
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Chief Marketing Officer',
    company: 'TechCorp Africa',
    image: '/images/testimonials/testimonial-2.jpg',
    quote: 'The team delivered an exceptional product launch event that perfectly aligned with our brand vision. Their innovative approach and flawless execution helped us create a lasting impression on our stakeholders and media partners.',
    rating: 5,
    location: 'Abuja, Nigeria',
    date: 'February 2024',
    eventSize: '500+ Attendees',
    verified: true,
    highlights: [
      'Brand Integration',
      'Media Management',
      'Tech Integration',
    ],
  },
  {
    id: 3,
    name: 'Amara Okonkwo',
    role: 'Celebrity Host',
    company: 'Entertainment Industry',
    image: '/images/testimonials/testimonial-3.jpg',
    quote: 'As someone who\'s attended countless events, I can say that Sparkling World Events operates on another level. My 40th birthday celebration was a masterpiece of creativity and sophistication. They exceeded every expectation!',
    rating: 5,
    location: 'Port Harcourt, Nigeria',
    date: 'January 2024',
    eventSize: '200 VIP Guests',
    verified: true,
    highlights: [
      'Celebrity Entertainment',
      'Security Management',
      'Luxury Experience',
    ],
  },
  {
    id: 4,
    name: 'Dr. & Mrs. Adebayo',
    role: 'Anniversary Celebration',
    company: 'Healthcare Professionals',
    image: '/images/testimonials/testimonial-4.jpg',
    quote: 'Our 25th anniversary celebration was nothing short of magical. The attention to personal details and family traditions, combined with modern luxury touches, created an unforgettable evening of love and joy.',
    rating: 5,
    location: 'Lagos, Nigeria',
    date: 'December 2023',
    eventSize: '150 Guests',
    verified: true,
    highlights: [
      'Family-Focused Planning',
      'Traditional Elements',
      'Modern Luxury',
    ],
  },
  {
    id: 5,
    name: 'Emma & David Wilson',
    role: 'Destination Wedding',
    company: 'International Couple',
    image: '/images/testimonials/testimonial-5.jpg',
    quote: 'Planning a destination wedding in Nigeria from London seemed daunting, but the team made it seamless. They beautifully merged our British and Nigerian cultures, creating a truly unique celebration.',
    rating: 5,
    location: 'Lagos, Nigeria',
    date: 'November 2023',
    eventSize: '250 Guests',
    verified: true,
    highlights: [
      'Cultural Integration',
      'International Planning',
      'Guest Experience',
    ],
  },
  {
    id: 6,
    name: 'Chief Samuel Nnamdi',
    role: 'Chairman',
    company: 'Nnamdi Holdings',
    image: '/images/testimonials/testimonial-6.jpg',
    quote: 'The corporate gala they organized for our company\'s 20th anniversary was impeccable. The perfect balance of sophistication and entertainment kept our international guests thoroughly impressed.',
    rating: 5,
    location: 'Abuja, Nigeria',
    date: 'October 2023',
    eventSize: '400+ Guests',
    verified: true,
    highlights: [
      'Corporate Branding',
      'International Standards',
      'VIP Protocol',
    ],
  },
];

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-10%" });
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: isMobile ? index * 0.05 : index * 0.1,
        ease: "easeOut"
      }}
      onHoverStart={() => !isMobile && setIsHovered(true)}
      onHoverEnd={() => !isMobile && setIsHovered(false)}
      className="group relative testimonial-card"
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
          <div className="p-6 md:p-8">
            {/* Image and Details */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shrink-0">
                {imageLoading && (
                  <div className="absolute inset-0 loading bg-white/5">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  </div>
                )}
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className={`object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                  sizes="(max-width: 768px) 56px, 64px"
                  onLoadingComplete={() => setImageLoading(false)}
                  priority={index < 3}
                />
                <div className="absolute inset-0 ring-1 ring-white/10 rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base md:text-lg font-bold text-white truncate">
                    {testimonial.name}
                  </h3>
                  {testimonial.verified && (
                    <motion.div
                      className="ml-2 text-primary"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </div>
                <p className="text-primary/80 text-sm truncate">{testimonial.role}</p>
                <p className="text-white/60 text-xs truncate">{testimonial.company}</p>
              </div>
            </div>

            {/* Quote */}
            <blockquote className={`relative mb-6 transition-opacity duration-300 ${imageLoading ? 'opacity-50' : 'opacity-100'}`}>
              <p className="text-white/90 text-sm md:text-base leading-relaxed line-clamp-4 md:line-clamp-none">
                "{testimonial.quote}"
              </p>
            </blockquote>

            {/* Event Details */}
            <div className={`grid grid-cols-2 gap-4 mb-6 text-xs md:text-sm transition-opacity duration-300 ${imageLoading ? 'opacity-50' : 'opacity-100'}`}>
              <div>
                <p className="text-white/60">Date</p>
                <p className="text-white/90">{testimonial.date}</p>
              </div>
              <div>
                <p className="text-white/60">Location</p>
                <p className="text-white/90">{testimonial.location}</p>
              </div>
              <div>
                <p className="text-white/60">Event Size</p>
                <p className="text-white/90">{testimonial.eventSize}</p>
              </div>
              <div>
                <p className="text-white/60">Rating</p>
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-4 h-4 text-primary"
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

            {/* Highlights */}
            <div className={`border-t border-white/5 pt-6 transition-opacity duration-300 ${imageLoading ? 'opacity-50' : 'opacity-100'}`}>
              <div className="flex flex-wrap gap-2">
                {testimonial.highlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary/90"
                  >
                    {highlight}
                  </span>
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
  const headerRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-20%" });
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start end", "end start"],
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const titleY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const decorativeY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  // Handle mouse move effect for cards
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
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
        
        {/* Enhanced Animated Patterns */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.02] bg-[url('/images/texture.png')] bg-repeat bg-[length:32px_32px]" />
          
          {/* Enhanced Light Beams */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-[40%] h-[200%] blur-[100px]"
                style={{
                  background: 'linear-gradient(to right, transparent, rgba(212, 175, 55, 0.05), transparent)',
                  left: `${i * 25 - 10}%`,
                  top: '-50%',
                  transform: 'rotate(35deg)',
                }}
                animate={{
                  y: ['0%', '100%'],
                }}
                transition={{ 
                  duration: 15 + i * 5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: -i * 5,
                }}
              />
            ))}
          </div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            style={{ y: decorativeY }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            style={{ y: decorativeY }}
          />
        </div>
      </div>

      <div className="container relative">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Section Header */}
          <motion.div 
            ref={headerRef}
            className="text-center mb-20"
            style={{ y: titleY, opacity: titleOpacity }}
          >
            <motion.div
              className="inline-block relative"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.span 
                className="absolute -inset-2 rounded-full bg-primary/20 blur-xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.3, 0.5]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <span className="relative inline-block px-8 py-3 rounded-full bg-[linear-gradient(110deg,rgba(212,175,55,0.1),rgba(212,175,55,0.05)_30%,rgba(212,175,55,0.15))] backdrop-blur-sm text-sm text-primary font-medium tracking-wider uppercase mb-8 border border-primary/10 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                Client Stories
              </span>
            </motion.div>
            
            <div className="relative">
              <motion.div
                className="absolute -inset-x-4 -inset-y-2 md:-inset-x-6 md:-inset-y-4"
                animate={{ 
                  background: [
                    'radial-gradient(circle at 0% 0%, rgba(212,175,55,0.03) 0%, transparent 50%)',
                    'radial-gradient(circle at 100% 100%, rgba(212,175,55,0.03) 0%, transparent 50%)',
                    'radial-gradient(circle at 0% 0%, rgba(212,175,55,0.03) 0%, transparent 50%)',
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <h2 className="relative text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent mb-6">
                Voices of Joy & Success
              </h2>
            </div>

            <motion.p 
              className="text-white/75 text-lg md:text-xl max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Real stories from our cherished clients who trusted us with their most precious moments.
            </motion.p>
          </motion.div>

          {/* Testimonials Grid/Carousel */}
          {isMobile ? (
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              navigation
              className="testimonials-swiper"
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={testimonial.id}>
                  <TestimonialCard testimonial={testimonial} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10"
              onMouseMove={handleMouseMove}
            >
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 