'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ShinyText from '@/components/common/ShinyText';
import { FiInfo, FiGrid, FiPhone } from 'react-icons/fi';
import { MdOutlineEventAvailable } from 'react-icons/md';
import { RiServiceLine } from 'react-icons/ri';
import { HiOutlineMail } from 'react-icons/hi';
import { BiBell } from 'react-icons/bi';
import { FaCalendarAlt } from 'react-icons/fa';
import { Menu, X } from 'lucide-react'; // Imported Lucide React icons

const navLinks = [
  { href: '/about', label: 'About', icon: FiInfo },
  { href: '/services', label: 'Services', icon: RiServiceLine },
  { href: '/gallery', label: 'Gallery', icon: FiGrid },
  { href: '/reminders', label: 'Reminders', icon: BiBell },
  { href: '/newsletter', label: 'Newsletter', icon: HiOutlineMail },
  { href: '/contact', label: 'Contact', icon: FiPhone },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for focus handling
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Next.js router & scroll transforms
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Scroll‐based transforms
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(26, 26, 26, 0)', 'rgba(26, 26, 26, 0.95)']
  );
  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(12px)']
  );
  const borderOpacity = useTransform(
    scrollY,
    [0, 100],
    ['0', '0.1']
  );

  // Close menu on "Escape"
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Scroll lock when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Framer Motion variants
  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }),
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0],
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.98,
      transition: { duration: 0.2, ease: 'easeInOut' }
    }
  };
  
  // Hamburger menu animation variants
  const Path = (props: any) => (
    <motion.path
      fill="transparent"
      strokeWidth="2"
      stroke="currentColor"
      strokeLinecap="round"
      {...props}
    />
  );

  return (
    <>
      {/* 
        1) Mobile overlay & menu, outside the header so we avoid z‐index fights
        2) Overlay = z-40, menu panel = z-50, header = z-20
      */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark overlay */}
            <motion.div
              ref={mobileMenuRef}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            {/* Slide-down menu content */}
            <motion.div
              className="fixed top-0 left-0 right-0 md:hidden z-50"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <div className="flex justify-between items-center p-4 pt-5">
                {/* Logo in the mobile menu */}
                <Link
                  href="/"
                  aria-label="Sparkling World - Home"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2"
                  >
                    <Image 
                      src="/logo.png" 
                      alt="Sparkling World Logo" 
                      width={32} 
                      height={32} 
                      className="h-8 w-auto" 
                    />
                    <ShinyText
                      text="Sparkling World"
                      className="text-xl font-poppins"
                    />
                  </motion.div>
                </Link>
                
                {/* Close button */}
                <motion.button
                  className="p-2 text-accent-light hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" aria-hidden="true" />
                </motion.button>
              </div>
              
              <div
                className="flex flex-col items-start justify-center h-[calc(100vh-80px)] gap-3 px-6 w-full"
                role="menu"
              >
                {navLinks.map(({ href, label, icon: Icon }, i) => {
                  const isActive = pathname === href;
                  return (
                    <motion.div
                      key={href}
                      custom={i}
                      variants={navItemVariants}
                      className="w-full"
                      role="none"
                    >
                      <Link
                        href={href}
                        className={`relative flex items-center w-full gap-4 px-5 py-4 text-base font-medium tracking-wide transition-all rounded-lg overflow-hidden ${
                          isActive
                            ? 'text-primary'
                            : 'text-white hover:text-primary'
                        }`}
                        role="menuitem"
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"
                          whileHover={{ opacity: 1 }}
                          whileTap={{ opacity: 0.8 }}
                        />
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-primary/10"
                            layoutId="mobile-navbar-active"
                            transition={{
                              type: 'spring',
                              bounce: 0.25,
                              duration: 0.5
                            }}
                          />
                        )}
                        <Icon
                          className="w-5 h-5 relative z-10"
                          aria-hidden="true"
                        />
                        <span className="relative z-10">{label}</span>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Book Event button */}
                <motion.div
                  custom={navLinks.length}
                  variants={navItemVariants}
                  className="w-full mt-4"
                  role="none"
                >
                  <Link href="/book" className="block w-full">
                    <motion.button
                      className="w-full px-6 py-4 bg-primary text-white rounded-lg flex items-center justify-center gap-3 transition-colors relative overflow-hidden"
                      whileHover="hover"
                      whileTap="tap"
                      role="menuitem"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.div
                        className="absolute inset-0 bg-black/20 opacity-0"
                        variants={{
                          hover: { opacity: 1 },
                          tap: { opacity: 0.8 }
                        }}
                      />
                      <MdOutlineEventAvailable
                        className="w-5 h-5 relative z-10"
                        aria-hidden="true"
                      />
                      <span className="font-medium relative z-10">
                        Book Event
                      </span>
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header (at z-20 so the overlay can appear above it) */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-20"
        style={{
          backgroundColor,
          backdropFilter: backdropBlur,
          borderBottom: '1px solid',
          borderColor: `rgba(255, 255, 255, ${borderOpacity.get()})`
        }}
        role="banner"
      >
        {/* Skip to main content link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>

        <nav
          className="container mx-auto px-4 py-4"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              aria-label="Sparkling World - Home"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2"
              >
                <Image 
                  src="/logo.png" 
                  alt="Sparkling World Logo" 
                  width={32} 
                  height={32} 
                  className="h-8 w-auto" 
                />
                <ShinyText
                  text="Sparkling World"
                  className="text-xl font-poppins"
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div
              className="hidden md:flex items-center space-x-1"
              role="menubar"
            >
              {navLinks.map(({ href, label }, i) => {
                const isActive = pathname === href;
                return (
                  <motion.div
                    key={href}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={navItemVariants}
                    role="none"
                  >
                    <Link
                      href={href}
                      className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors rounded-full hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary ${
                        isActive
                          ? 'text-primary'
                          : 'text-accent-light hover:text-primary'
                      }`}
                      role="menuitem"
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className="relative z-10">{label}</span>
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-primary/10 rounded-full"
                          layoutId="navbar-active"
                          transition={{
                            type: 'spring',
                            bounce: 0.25,
                            duration: 0.5
                          }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Book Event (desktop button) */}
              <motion.div
                custom={navLinks.length}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
                role="none"
              >
                <Link href="/book">
                  <motion.button
                    className="ml-4 px-6 py-2 bg-primary text-white rounded-full flex items-center gap-2 hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    role="menuitem"
                  >
                    <MdOutlineEventAvailable
                      className="text-lg"
                      aria-hidden="true"
                    />
                    <span>Book Event</span>
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button with Hamburger Animation */}
            <motion.button
              ref={menuButtonRef}
              className="p-2 md:hidden text-accent-light hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <motion.div className="w-6 h-6 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <Path
                    variants={{
                      closed: { d: "M3 6h18" },
                      open: { d: "M3 6l18 12" }
                    }}
                    animate={isMobileMenuOpen ? "open" : "closed"}
                    transition={{ duration: 0.3 }}
                  />
                  <Path
                    variants={{
                      closed: { d: "M3 12h18", opacity: 1 },
                      open: { d: "M3 12h18", opacity: 0 }
                    }}
                    animate={isMobileMenuOpen ? "open" : "closed"}
                    transition={{ duration: 0.2 }}
                  />
                  <Path
                    variants={{
                      closed: { d: "M3 18h18" },
                      open: { d: "M3 18L21 6" }
                    }}
                    animate={isMobileMenuOpen ? "open" : "closed"}
                    transition={{ duration: 0.3 }}
                  />
                </svg>
              </motion.div>
            </motion.button>
          </div>
        </nav>
      </motion.header>
    </>
  );
};

export default Navbar;