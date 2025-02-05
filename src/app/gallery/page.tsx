'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { RiCloseLine, RiZoomInLine } from 'react-icons/ri';

// Gallery categories and images
const categories = [
  { id: 'all', label: 'All Events' },
  { id: 'weddings', label: 'Weddings' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'social', label: 'Social Events' },
  { id: 'luxury', label: 'Luxury' },
];

type GallerySize = 'small' | 'wide' | 'tall' | 'large';

const galleryItems = [
  {
    id: 1,
    category: 'weddings',
    image: '/images/gallery/wedding-1.jpg',
    title: 'Beachfront Wedding',
    description: 'An elegant beachfront wedding celebration with stunning sunset views.',
    size: 'large' as GallerySize,
  },
  {
    id: 2,
    category: 'corporate',
    image: '/images/gallery/corporate-1.jpg',
    title: 'Tech Summit 2023',
    description: 'Annual technology conference with industry leaders.',
    size: 'tall' as GallerySize,
  },
  {
    id: 3,
    category: 'social',
    image: '/images/gallery/social-1.jpg',
    title: 'Garden Party',
    description: 'A sophisticated garden party with exquisite details.',
    size: 'wide' as GallerySize,
  },
  {
    id: 4,
    category: 'luxury',
    image: '/images/gallery/luxury-1.jpg',
    title: 'VIP Gala Night',
    description: 'Exclusive gala dinner with premium entertainment.',
    size: 'small' as GallerySize,
  },
  {
    id: 5,
    category: 'weddings',
    image: '/images/gallery/wedding-2.jpg',
    title: 'Garden Wedding',
    description: 'A romantic garden wedding with enchanting floral arrangements.',
    size: 'wide' as GallerySize,
  },
  {
    id: 6,
    category: 'corporate',
    image: '/images/gallery/corporate-2.jpg',
    title: 'Annual Conference',
    description: 'Global business leaders gathering for innovative discussions.',
    size: 'small' as GallerySize,
  },
  {
    id: 7,
    category: 'luxury',
    image: '/images/gallery/luxury-2.jpg',
    title: 'Yacht Party',
    description: 'Exclusive celebration aboard a luxury yacht.',
    size: 'tall' as GallerySize,
  },
  {
    id: 8,
    category: 'social',
    image: '/images/gallery/social-2.jpg',
    title: 'Birthday Gala',
    description: 'Extravagant birthday celebration with custom entertainment.',
    size: 'large' as GallerySize,
  },
];

const GalleryModal = ({ item, onClose }: { item: typeof galleryItems[0]; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative max-w-7xl w-full bg-secondary rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6 space-y-4">
          <h3 className="text-2xl font-bold text-white">{item.title}</h3>
          <p className="text-white/70">{item.description}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <RiCloseLine size={24} />
        </button>
      </motion.div>
    </motion.div>
  );
};

const GalleryItem = ({ item }: { item: typeof galleryItems[0] }) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses: Record<GallerySize, string> = {
    small: 'col-span-1 row-span-1',
    wide: 'col-span-2 row-span-1',
    tall: 'col-span-1 row-span-2',
    large: 'col-span-2 row-span-2',
  };

  const aspectRatios: Record<GallerySize, string> = {
    small: 'aspect-square',
    wide: 'aspect-[2/1]',
    tall: 'aspect-[1/2]',
    large: 'aspect-square',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`relative group ${sizeClasses[item.size]}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className={`relative ${aspectRatios[item.size]} rounded-xl overflow-hidden`}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <motion.div
          initial={false}
          animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="absolute inset-x-0 bottom-0 p-6"
        >
          <h3 className={`font-bold text-white mb-2 ${item.size === 'large' ? 'text-2xl' : 'text-xl'}`}>
            {item.title}
          </h3>
          <p className={`text-white/80 ${item.size === 'large' ? 'text-base' : 'text-sm'}`}>
            {item.description}
          </p>
        </motion.div>

        <motion.div
          initial={false}
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className={`rounded-full bg-primary/90 flex items-center justify-center ${
            item.size === 'large' ? 'w-16 h-16' : 'w-12 h-12'
          }`}>
            <RiZoomInLine className={`text-white ${item.size === 'large' ? 'text-2xl' : 'text-xl'}`} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);
  const containerRef = useRef(null);

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 via-secondary/80 to-secondary" />
          <div className="absolute inset-0 bg-[url('/images/texture.png')] bg-repeat bg-[length:32px_32px] opacity-[0.02]" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Gallery
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore our portfolio of extraordinary events and celebrations
          </motion.p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.label}
              </motion.button>
            ))}
          </div>

          {/* Gallery Grid */}
          <motion.div
            ref={containerRef}
            layout
            className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <div key={item.id} onClick={() => setSelectedItem(item)}>
                  <GalleryItem item={item} />
                </div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <GalleryModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage; 