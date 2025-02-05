'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {
  RiWhatsappLine,
  RiInstagramLine,
  RiFacebookBoxLine,
  RiLinkedinBoxLine,
  RiPhoneLine,
  RiMailLine,
  RiMapPin2Line,
  RiCalendarLine,
  RiUserLine,
  RiMailSendLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiArrowRightLine,
  RiStarLine,
} from 'react-icons/ri';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  eventType: z.string().min(1, 'Please select an event type'),
  eventDate: z.string().min(1, 'Please select an event date'),
  guestCount: z.string().min(1, 'Please provide an estimated guest count'),
  budget: z.string().min(1, 'Please select a budget range'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const eventTypes = [
  'Wedding',
  'Corporate Event',
  'Birthday Celebration',
  'Burial Ceremony',
  'Social Gathering',
  'Venue Decoration',
  'Party Supplies & Rentals',
  'Other',
];

const budgetRanges = [
  'Below ₦500,000',
  '₦500,000 - ₦1,000,000',
  '₦1,000,000 - ₦2,000,000',
  '₦2,000,000 - ₦5,000,000',
  'Above ₦5,000,000',
];

const guestRanges = [
  '1-50 guests',
  '51-100 guests',
  '101-200 guests',
  '201-500 guests',
  'More than 500 guests',
];

const socialLinks = [
  {
    icon: RiWhatsappLine,
    href: 'https://wa.me/2349119217578',
    label: 'WhatsApp',
    color: 'hover:bg-green-500',
  },
  {
    icon: RiInstagramLine,
    href: 'https://instagram.com/sparklingworldng',
    label: 'Instagram',
    color: 'hover:bg-pink-600',
  },
  {
    icon: RiFacebookBoxLine,
    href: 'https://facebook.com/SparklingWorld',
    label: 'Facebook',
    color: 'hover:bg-blue-600',
  },
  {
    icon: RiLinkedinBoxLine,
    href: 'https://linkedin.com/company/sparkling-world',
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
      { text: '+234 817 777 6580', type: 'phone' },
      { text: '+234 905 557 2903', type: 'phone', note: '(Calls Only)' },
      { text: '+234 911 921 7578', type: 'phone', note: '(WhatsApp Only)' },
    ],
  },
  {
    icon: RiMailLine,
    title: 'Email',
    details: [
      { text: 'sparklingworldevents@gmail.com', type: 'email' },
      { text: 'info@sparklingworld.ng', type: 'email' },
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

const FloatingParticle = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-primary/30 rounded-full"
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

const FormInput = ({ 
  label, 
  type = 'text', 
  error, 
  icon: Icon,
  ...props 
}: { 
  label: string; 
  type?: string; 
  error?: string;
  icon: any;
  [key: string]: any;
}) => (
  <div className="relative">
    <label className="block text-sm font-medium mb-2 text-white">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60">
        <Icon className="text-lg" />
      </div>
      {type === 'select' ? (
        <select
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          {...props}
        >
          <option value="" className="bg-secondary text-white">{`Select ${label}`}</option>
          {props.options?.map((option: string) => (
            <option key={option} value={option} className="bg-secondary text-white">
              {option}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all min-h-[120px] placeholder:text-white/30"
          {...props}
        />
      ) : (
        <input
          type={type}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-white/30"
          {...props}
        />
      )}
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-400 text-sm mt-1 flex items-center gap-1"
      >
        <RiErrorWarningLine />
        {error}
      </motion.p>
    )}
  </div>
);

const SuccessMessage = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
  >
    <motion.div
      initial={{ y: 50 }}
      animate={{ y: 0 }}
      className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <RiCheckLine className="text-3xl text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Message Sent Successfully!</h3>
        <p className="text-secondary/70 mb-6">
          Thank you for reaching out. We'll get back to you within 24 hours.
        </p>
        <button
          onClick={onClose}
          className="btn btn-primary w-full"
        >
          Continue
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulated API call
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary" ref={containerRef}>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 via-secondary/80 to-secondary" />
          <div className="absolute inset-0 bg-[url('/images/texture.png')] bg-repeat bg-[length:32px_32px] opacity-[0.02]" />
          
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
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
            <div className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.02] backdrop-blur-2xl border border-white/10">
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
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Ready to bring your vision to life? We're here to help make your dreams a reality.
          </motion.p>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="relative py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-12">
              <div>
                <motion.h2 
                  className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent"
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
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 backdrop-blur-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <info.icon className="text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">{info.title}</h3>
                        <div className="space-y-2">
                          {info.details.map((detail, i) => (
                            <p key={i} className="text-white/70 flex items-center gap-2">
                              {detail.type === 'phone' ? (
                                <a href={`tel:${detail.text}`} className="hover:text-primary transition-colors">
                                  {detail.text}
                                </a>
                              ) : detail.type === 'email' ? (
                                <a href={`mailto:${detail.text}`} className="hover:text-primary transition-colors">
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
                        className={`w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 backdrop-blur-sm flex items-center justify-center text-white ${link.color} hover:scale-110 transition-all`}
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

              {/* Replace Google Maps with a static location card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden shadow-elegant border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8"
              >
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 backdrop-blur-sm flex items-center justify-center text-primary">
                    <RiMapPin2Line className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Our Location</h3>
                    <p className="text-white/70">
                      We are based in Lagos, Nigeria, and available for events nationwide. Our team can travel to your location for consultations and event planning.
                    </p>
                    <a 
                      href="https://goo.gl/maps/YOUR_LOCATION_LINK" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-light mt-4 transition-colors"
                    >
                      <span>View on Google Maps</span>
                      <RiArrowRightLine />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="sticky top-32">
                <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8 space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Send Us a Message</h2>
                    <p className="text-white/70">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <FormInput
                      label="Full Name"
                      icon={RiUserLine}
                      {...register('name')}
                      error={errors.name?.message}
                      placeholder="Your full name"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Email Address"
                        type="email"
                        icon={RiMailLine}
                        {...register('email')}
                        error={errors.email?.message}
                        placeholder="your@email.com"
                      />

                      <FormInput
                        label="Phone Number"
                        type="tel"
                        icon={RiPhoneLine}
                        {...register('phone')}
                        error={errors.phone?.message}
                        placeholder="+234"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Event Type"
                        type="select"
                        icon={RiCalendarLine}
                        options={eventTypes}
                        {...register('eventType')}
                        error={errors.eventType?.message}
                      />

                      <FormInput
                        label="Event Date"
                        type="date"
                        icon={RiCalendarLine}
                        {...register('eventDate')}
                        error={errors.eventDate?.message}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Guest Count"
                        type="select"
                        icon={RiUserLine}
                        options={guestRanges}
                        {...register('guestCount')}
                        error={errors.guestCount?.message}
                      />

                      <FormInput
                        label="Budget Range"
                        type="select"
                        icon={RiMailLine}
                        options={budgetRanges}
                        {...register('budget')}
                        error={errors.budget?.message}
                      />
                    </div>

                    <FormInput
                      label="Message"
                      type="textarea"
                      icon={RiMailLine}
                      {...register('message')}
                      error={errors.message?.message}
                      placeholder="Tell us about your event..."
                    />

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-8 py-4 bg-gradient-to-r from-primary to-primary-600 text-white rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 flex items-center justify-center gap-2 ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <RiMailSendLine className="text-xl" />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      <AnimatePresence>
        {submitSuccess && (
          <SuccessMessage onClose={() => setSubmitSuccess(false)} />
        )}
      </AnimatePresence>
    </div>
  );
} 