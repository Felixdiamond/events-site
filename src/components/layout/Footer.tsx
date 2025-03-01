'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaLinkedinIn, FaPhone } from 'react-icons/fa';
import { MdEmail, MdLocationOn } from 'react-icons/md';
import NewsletterSignup from '@/components/common/NewsletterSignup';

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
    className="relative text-white/70 hover:text-white transition-colors group"
  >
    <span className="relative">
      {children}
      <span className="absolute left-0 bottom-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform" />
    </span>
  </Link>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-secondary overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
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

      <div className="relative container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 py-20">
          {/* Company Info */}
          <div className="lg:col-span-3 space-y-6">
            <motion.h3 
              className="text-3xl font-serif font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Sparkling World
            </motion.h3>
            <p className="text-white/70 leading-relaxed">
              Creating extraordinary moments and unforgettable celebrations since 2016. Your premier destination for exceptional event planning and execution.
            </p>
            <div className="flex gap-4">
              <SocialLink href="https://wa.me/2349119217578" icon={FaWhatsapp} label="WhatsApp" />
              <SocialLink href="https://instagram.com/sparklingworldng" icon={FaInstagram} label="Instagram" />
              <SocialLink href="https://facebook.com/SparklingWorld" icon={FaFacebookF} label="Facebook" />
              <SocialLink href="https://linkedin.com/company/sparkling-world" icon={FaLinkedinIn} label="LinkedIn" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="/services">Our Services</FooterLink></li>
              <li><FooterLink href="/gallery">Gallery</FooterLink></li>
              <li><FooterLink href="/contact">Contact Us</FooterLink></li>
              <li><FooterLink href="/newsletter">Newsletter</FooterLink></li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-lg font-semibold text-white">Our Services</h4>
            <ul className="space-y-3">
              <li className="text-white/70 hover:text-white transition-colors">Event Planning</li>
              <li className="text-white/70 hover:text-white transition-colors">Decorations</li>
              <li className="text-white/70 hover:text-white transition-colors">Rentals</li>
              <li className="text-white/70 hover:text-white transition-colors">Coordination</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaPhone className="text-primary mt-1" />
                <div className="space-y-1">
                  <p className="text-white/70 hover:text-white transition-colors">+234 802 599 7713</p>
                  <p className="text-white/70 hover:text-white transition-colors">+234 817 777 6580</p>
                  <p className="text-white/70 hover:text-white transition-colors">+234 905 557 2903 (Calls Only)</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MdEmail className="text-primary text-xl" />
                <a
                  href="mailto:sparklingworldevents@gmail.com"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  sparklingworldevents@gmail.com
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MdLocationOn className="text-primary text-xl mt-1" />
                <p className="text-white/70">
                  Lagos, Nigeria
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-3 space-y-6">
            <NewsletterSignup variant="footer" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
            <p>© {currentYear} Sparkling World Events. All rights reserved.</p>
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