'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  eventType: z.string().min(1, 'Please select an event type'),
  eventDate: z.string().min(1, 'Please select an event date'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const eventTypes = [
  'Wedding',
  'Birthday',
  'Corporate Event',
  'Social Gathering',
  'Special Occasion',
  'Other',
];

const socialLinks = [
  {
    icon: <FaWhatsapp />,
    href: 'https://wa.me/2349119217578',
    label: 'WhatsApp',
  },
  {
    icon: <FaInstagram />,
    href: 'https://instagram.com/sparklingworldng',
    label: 'Instagram',
  },
  {
    icon: <FaFacebookF />,
    href: 'https://facebook.com/SparklingWorld',
    label: 'Facebook',
  },
  {
    icon: <FaLinkedinIn />,
    href: 'https://linkedin.com/company/sparkling-world',
    label: 'LinkedIn',
  },
];

const phoneNumbers = [
  '+234 802 599 7713',
  '+234 817 777 6580',
  '+234 905 557 2903 (Calls Only)',
  '+234 911 921 7578 (WhatsApp Only)',
];

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: 6.5244,
    lng: 3.3792,
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-secondary/80" />
        <div className="absolute inset-0">
          <img
            src="/images/contact-hero.jpg"
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 container text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-accent-light/80 max-w-3xl mx-auto"
          >
            Let's create something extraordinary together
          </motion.p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="text-secondary/80">
                  We're here to help bring your vision to life. Reach out to us
                  through any of our contact channels.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <FaPhone className="text-primary text-xl mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Phone Numbers</h3>
                    <div className="space-y-1">
                      {phoneNumbers.map((number) => (
                        <p key={number} className="text-secondary/80">
                          {number}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FaEnvelope className="text-primary text-xl mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <a
                      href="mailto:sparklingworldevents@gmail.com"
                      className="text-secondary/80 hover:text-primary transition-colors"
                    >
                      sparklingworldevents@gmail.com
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-accent-cream flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-colors"
                        aria-label={link.label}
                      >
                        {link.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-lg overflow-hidden shadow-elegant">
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={15}
                  >
                    <Marker position={center} />
                  </GoogleMap>
                </LoadScript>
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-premium p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className="w-full px-4 py-2 rounded-lg border border-secondary/20 focus:outline-none focus:border-primary"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      className="w-full px-4 py-2 rounded-lg border border-secondary/20 focus:outline-none focus:border-primary"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone')}
                      className="w-full px-4 py-2 rounded-lg border border-secondary/20 focus:outline-none focus:border-primary"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="eventType"
                      className="block text-sm font-medium mb-2"
                    >
                      Event Type
                    </label>
                    <select
                      id="eventType"
                      {...register('eventType')}
                      className="w-full px-4 py-2 rounded-lg border border-secondary/20 focus:outline-none focus:border-primary"
                    >
                      <option value="">Select Event Type</option>
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.eventType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.eventType.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="eventDate"
                      className="block text-sm font-medium mb-2"
                    >
                      Event Date
                    </label>
                    <input
                      type="date"
                      id="eventDate"
                      {...register('eventDate')}
                      className="w-full px-4 py-2 rounded-lg border border-secondary/20 focus:outline-none focus:border-primary"
                    />
                    {errors.eventDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.eventDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    {...register('message')}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-secondary/20 focus:outline-none focus:border-primary"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full btn btn-primary ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {submitSuccess && (
                  <p className="text-green-600 text-center mt-4">
                    Thank you for your message! We'll get back to you soon.
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
} 