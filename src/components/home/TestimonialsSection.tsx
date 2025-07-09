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
import React from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Mr. Ofele Okposo',
    role: 'Private Event Host',
    company: '',
    image: '/images/testimonials/blackman1.jpg',
    quote: 'The event was simply awesome, exquisite, gorgeous, and more. You delivered beyond my expectations. The food was perfect, drinks chilled, ambience perfect, and customer service unbelievably courteous. Thank you from the bottom of our hearts for a job well done—you blew our minds.',
    rating: 5,
    location: 'Lagos, Nigeria',
    date: 'April 2024',
    eventSize: '100+ Guests',
    verified: true,
    highlights: [
      'Exceptional Service',
      'Perfect Ambience',
      'Courteous Staff',
    ],
  },
  {
    id: 2,
    name: 'Ms. Adebukola Akingbade',
    role: '50th Birthday Celebrant',
    company: '',
    image: '/images/testimonials/adebukola.jpg',
    quote: `My dear Mrs. Peters, my sis!\n\nWith heartfelt love and deepest appreciation, I want to thank you from the bottom of my heart for being part of my 50th birthday celebration.\n\nYour support throughout the planning, managing my last-minute requests, the beautiful decorations, and your presence meant more to me than you may ever know.\n\nIt was more than a party—it was a moment of love and honour that I will carry with me for years to come.\n\nThank you for showing up. Thank you for stepping up throughout the preparations. Thank you for celebrating me. Thank you for the honour of your time and your beautiful spirit. I am deeply touched and truly blessed. God bless you, sis.\n\nI pray that your days are filled with divine favour, peace that passes all understanding, and blessings that will leave you in awe. May God continue to honour you.\n\nAmen! 🙏`,
    rating: 5,
    location: 'Lagos, Nigeria',
    date: 'March 2024',
    eventSize: '50+ Guests',
    verified: true,
    highlights: [
      'Personalized Planning',
      'Beautiful Decorations',
      'Heartfelt Support',
    ],
  },
  {
    id: 3,
    name: 'Mrs. Bukola Adeogun',
    role: 'Family Event Host',
    company: '',
    image: '/images/testimonials/blackwoman2.jpg',
    quote: 'Good evening, the event went very well—thanks to your professional staff. The leftovers were handed over to us. 👍😃 Your staff behaved well and were well-cultured. Our appreciation goes to them.',
    rating: 5,
    location: 'Lagos, Nigeria',
    date: 'February 2024',
    eventSize: '80+ Guests',
    verified: true,
    highlights: [
      'Professional Staff',
      'Well-Organized',
      'Great Hospitality',
    ],
  },
  {
    id: 4,
    name: 'Mr. Yemi Ejidiran',
    role: '60th Birthday Host',
    company: '',
    image: '/images/testimonials/yemi.jpg',
    quote: `On behalf of my wife, Mrs. Yemisi Ejidiran, and myself, I would like to express our deepest gratitude to each and every one of you for your outstanding contributions to the success of the 60th birthday celebration on the 9th of December 2023.Your professionalism, dedication, and commitment played a pivotal role in making the entire event truly memorable and exceptionally successful.Your collective efforts, attention to detail, and unwavering support ensured that every aspect of the celebration exceeded our highest expectations. From the meticulous planning and flawless execution to the exceptional services rendered, each of you played a key role in creating an event that will be cherished forever.We are sincerely grateful for your hard work, creativity, and the personalized touch you brought to your respective roles. Your unwavering commitment to excellence did not go unnoticed, and we are truly thankful for your invaluable contributions.Looking ahead, we are excited about the prospect of working with each of you again in the future. Your expertise and professionalism are truly second to none, and we look forward to the possibility of collaborating on future endeavors.Furthermore, I would like to encourage the event planner to facilitate the administration of an evaluation template for all service providers involved in the event. This necessary feedback is incredibly valuable, and it will undoubtedly help all of you collectively identify areas for improvement and ensure even greater success in future collaborations.Once again, thank you for your exceptional service, dedication, and commitment. Your contributions have left an indelible mark on this special occasion, and we are deeply appreciative of all that you have done.`,
    rating: 5,
    location: 'Lagos, Nigeria',
    date: 'December 2023',
    eventSize: '100+ Guests',
    verified: true,
    highlights: [
      'Meticulous Planning',
      'Flawless Execution',
      'Personalized Touch',
      'Professional Team',
      'Memorable Experience',
    ],
  },
];

// Add ExpandableText component
interface ExpandableTextProps {
  text: string;
  lines?: number;
  className?: string;
}

const ExpandableText = ({ text, lines = 4, className = '' }: ExpandableTextProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setShowButton(textRef.current.scrollHeight > textRef.current.clientHeight + 1);
    }
  }, [text, lines]);

  return (
    <div>
      <div
        ref={textRef}
        className={`${className} ${expanded ? '' : 'line-clamp'} transition-all duration-300`}
        style={
          expanded
            ? { maxHeight: 'none', overflow: 'visible' }
            : {
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: lines,
                overflow: 'hidden',
                maxHeight: `${lines * 1.6}em`,
              }
        }
      >
        {text}
      </div>
      {showButton && (
        <button
          className="mt-2 text-accent-light underline text-xs font-medium focus:outline-none hover:text-accent transition-colors duration-200 cursor-pointer"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-10%" });
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [isTruncatable, setIsTruncatable] = useState(false);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  useEffect(() => {
    // Check if the quote overflows 4 lines
    if (quoteRef.current) {
      const lineHeight = parseFloat(getComputedStyle(quoteRef.current).lineHeight);
      const maxHeight = lineHeight * 4;
      setIsTruncatable(quoteRef.current.scrollHeight > maxHeight + 2); // +2 for rounding
    }
  }, [testimonial.quote]);

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
                  onLoad={() => setImageLoading(false)}
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
                      className="ml-2 text-accent-light"
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
                <p className="text-accent-light/80 text-sm truncate">{testimonial.role}</p>
                <p className="text-white/60 text-xs truncate">{testimonial.company}</p>
              </div>
            </div>

            {/* Quote */}
            <blockquote className={`relative mb-6 transition-opacity duration-300 ${imageLoading ? 'opacity-50' : 'opacity-100'}`}>
              <ExpandableText
                text={`"${testimonial.quote}"`}
                lines={4}
                className="text-white/90 text-sm md:text-base leading-relaxed whitespace-pre-line"
              />
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
                      className="w-4 h-4 text-accent-light"
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
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-800 text-accent-light"
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
              background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.03), transparent 40%)',
            }}
          />
        </motion.div>

        {/* Background Glow */}
        <motion.div
          className="absolute -inset-2 bg-accent-light/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
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
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-800 via-secondary to-secondary/95" />
        
        {/* Enhanced Animated Patterns */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.02] bg-[url('/images/texture.png')] bg-repeat bg-[length:32px_32px]" />
          
          {/* Primary Color Flowing Effect */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%]"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(198, 90, 45, 0), rgba(198, 90, 45, 0.03) 25%, rgba(198, 90, 45, 0) 50%)',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.7, 0.3],
                rotate: [0, 45, 0]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%]"
              style={{
                background: 'radial-gradient(circle at center, rgba(198, 90, 45, 0), rgba(198, 90, 45, 0.025) 30%, rgba(198, 90, 45, 0) 60%)',
              }}
              animate={{
                scale: [1.5, 1, 1.5],
                opacity: [0.5, 0.2, 0.5],
                rotate: [45, 0, 45]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
          </div>
            
          {/* Enhanced Light Beams */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-[40%] h-[200%] blur-[100px]"
                style={{
                  background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.03), transparent)',
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

          {/* Primary Color Particle Effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 4 + 1 + 'px',
                  height: Math.random() * 4 + 1 + 'px',
                  background: `rgba(198, 90, 45, ${Math.random() * 0.3 + 0.1})`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [
                    Math.random() * 100 - 50,
                    Math.random() * 100 - 50,
                    Math.random() * 100 - 50,
                  ],
                  y: [
                    Math.random() * 100 - 50,
                    Math.random() * 100 - 50,
                    Math.random() * 100 - 50,
                  ],
                  opacity: [0.1, 0.4, 0.1],
                }}
                transition={{
                  duration: Math.random() * 20 + 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-light/10 to-transparent"
            style={{ y: decorativeY }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-light/10 to-transparent"
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
                className="absolute -inset-2 rounded-full bg-accent-light/10 blur-xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.3, 0.5]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <span className="relative inline-block px-8 py-3 rounded-full bg-[linear-gradient(110deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02)_30%,rgba(255,255,255,0.07))] backdrop-blur-sm text-sm text-accent-light font-medium tracking-wider uppercase mb-8 border border-accent-light/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                Client Stories
              </span>
            </motion.div>
            
            <h2 className="relative text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-600 bg-clip-text text-transparent mb-6">
              Voices of Joy & Success
            </h2>

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