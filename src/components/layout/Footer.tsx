'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaLinkedinIn, FaPhone } from 'react-icons/fa';
import { MdEmail, MdLocationOn } from 'react-icons/md';

const SocialLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="relative group"
    whileHover={{ y: -3 }}
    whileTap={{ scale: 0.95 }}
    aria-label={label}
  >
    <div className="relative p-3 bg-white/5 rounded-full overflow-hidden transition-colors hover:bg-white/10">
      <Icon size={20} className="relative z-10 text-primary transition-colors group-hover:text-white" />
      <motion.div
        className="absolute inset-0 bg-primary"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </div>
  </motion.a>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link 
    href={href} 
    className="relative text-white/70 hover:text-white transition-colors group inline-block"
  >
    <span className="relative">
      {children}
      <span className="absolute left-0 bottom-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform" />
    </span>
  </Link>
);

const ServiceItem = ({ children }: { children: React.ReactNode }) => (
  <li className="relative group">
    <span className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
      {children}
    </span>
  </li>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-secondary overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      <div className="relative container mx-auto px-4 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12 gap-x-8 gap-y-12 py-20">
          {/* Company Info */}
          <div className="xl:col-span-4 md:col-span-2 lg:col-span-4 space-y-6">
            <motion.h3 
              className="text-3xl font-serif font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Sparkling World
            </motion.h3>
            <p className="text-white/70 leading-relaxed max-w-md">
              Creating extraordinary moments and unforgettable celebrations since 2016. Your premier destination for exceptional event planning and execution.
            </p>
            <div className="flex gap-4">
              <SocialLink href="https://wa.me/2348103657145" icon={FaWhatsapp} label="WhatsApp" />
              <SocialLink href="https://www.instagram.com/sparklingworldng" icon={FaInstagram} label="Instagram" />
              <SocialLink href="https://facebook.com/sparklingworld" icon={FaFacebookF} label="Facebook" />
              <SocialLink href="https://linkedin.com/company/sparklingworld" icon={FaLinkedinIn} label="LinkedIn" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="xl:col-span-2 lg:col-span-1 space-y-6">
            <h4 className="text-lg font-semibold text-white after:content-[''] after:block after:w-12 after:h-0.5 after:bg-primary/50 after:mt-2">Quick Links</h4>
            <ul className="space-y-3">
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="/services">Our Services</FooterLink></li>
              <li><FooterLink href="/gallery">Gallery</FooterLink></li>
              <li><FooterLink href="/contact">Contact Us</FooterLink></li>
              <li><FooterLink href="/newsletter">Newsletter</FooterLink></li>
            </ul>
          </div>

          {/* Services */}
          <div className="xl:col-span-2 lg:col-span-1 space-y-6">
            <h4 className="text-lg font-semibold text-white after:content-[''] after:block after:w-12 after:h-0.5 after:bg-primary/50 after:mt-2">Our Services</h4>
            <ul className="space-y-3">
              <ServiceItem>Event Planning</ServiceItem>
              <ServiceItem>Decorations</ServiceItem>
              <ServiceItem>Rentals</ServiceItem>
              <ServiceItem>Coordination</ServiceItem>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="xl:col-span-4 lg:col-span-2 space-y-6">
            <h4 className="text-lg font-semibold text-white after:content-[''] after:block after:w-12 after:h-0.5 after:bg-primary/50 after:mt-2">Get in Touch</h4>
            <div className="space-y-5">
              <div className="flex items-start space-x-3">
                <div className="bg-white/5 p-2 rounded-lg">
                  <FaPhone className="text-primary" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-white/70 hover:text-white transition-colors">+234 802 599 7713</p>
                  <p className="text-white/70 hover:text-white transition-colors">+234 810 365 7145</p>
                  <p className="text-white/70 hover:text-white transition-colors">+234 905 557 2903 (Calls Only)</p>
                  <p className="text-white/70 hover:text-white transition-colors">+234 911 921 7578 (WhatsApp Only)</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white/5 p-2 rounded-lg">
                  <MdEmail className="text-primary text-xl" />
                </div>
                <a
                  href="mailto:sparklingworldevents@gmail.com"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  sparklingworldevents@gmail.com
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-white/5 p-2 rounded-lg">
                  <MdLocationOn className="text-primary text-xl" />
                </div>
                <p className="text-white/70">
                  Lagos, Nigeria
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup (New Addition) */}
        <div className="relative -mt-4 mb-16 bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
          <div className="grid lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-1">
              <h4 className="text-xl font-semibold text-white">Stay Updated</h4>
              <p className="text-white/70 mt-1">Subscribe to our newsletter for exclusive offers and event inspiration.</p>
            </div>
            <div className="lg:col-span-2">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary flex-grow"
                  required
                />
                <motion.button
                  className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="/newsletter">Subscribe</Link>
                </motion.button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
            <p>&copy; {currentYear} Sparkling World Business & Events. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;