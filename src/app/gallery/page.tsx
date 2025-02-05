'use client';

import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { RiCloseLine, RiZoomInLine, RiArrowRightUpLine } from 'react-icons/ri';

// Gallery categories and images
const categories = [
  { id: 'all', label: 'All Events' },
  { id: 'weddings', label: 'Weddings' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'social', label: 'Social Events' },
  { id: 'burial', label: 'Burial Services' },
  { id: 'decoration', label: 'Decorations' },
];

type GallerySize = 'small' | 'wide' | 'tall' | 'large';
type GalleryPosition = 'center' | 'top' | 'bottom';

interface GalleryItem {
  id: number;
  category: string;
  image: string;
  title: string;
  description: string;
  size: GallerySize;
  position?: GalleryPosition;
  accent?: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    category: 'weddings',
    image: '/images/gallery/wedding-1.jpg',
    title: 'Beachfront Wedding',
    description: 'An elegant beachfront wedding celebration with stunning sunset views.',
    size: 'large',
    position: 'center',
    accent: 'from-rose-500/20 to-primary/20',
  },
  {
    id: 2,
    category: 'corporate',
    image: '/images/gallery/corporate-1.jpg',
    title: 'Tech Summit 2023',
    description: 'Annual technology conference with industry leaders.',
    size: 'small',
    position: 'center',
    accent: 'from-blue-500/20 to-primary/20',
  },
  {
    id: 3,
    category: 'decoration',
    image: '/images/gallery/decoration-1.jpg',
    title: 'Floral Paradise',
    description: 'Exquisite floral arrangements transforming spaces.',
    size: 'wide',
    position: 'center',
    accent: 'from-emerald-500/20 to-primary/20',
  },
  {
    id: 4,
    category: 'burial',
    image: '/images/gallery/burial-1.jpg',
    title: 'Memorial Service',
    description: 'A dignified celebration of life.',
    size: 'tall',
    position: 'center',
    accent: 'from-purple-500/20 to-primary/20',
  },
  {
    id: 5,
    category: 'weddings',
    image: '/images/gallery/wedding-2.jpg',
    title: 'Garden Wedding',
    description: 'A romantic garden wedding with enchanting floral arrangements.',
    size: 'small',
    position: 'center',
    accent: 'from-pink-500/20 to-primary/20',
  },
  {
    id: 6,
    category: 'decoration',
    image: '/images/gallery/decoration-2.jpg',
    title: 'Royal Theme',
    description: 'Luxurious venue transformation with royal aesthetics.',
    size: 'large',
    position: 'center',
    accent: 'from-amber-500/20 to-primary/20',
  },
  {
    id: 7,
    category: 'burial',
    image: '/images/gallery/burial-2.jpg',
    title: 'Traditional Ceremony',
    description: 'Cultural celebration honoring heritage.',
    size: 'wide',
    position: 'center',
    accent: 'from-indigo-500/20 to-primary/20',
  },
  {
    id: 8,
    category: 'social',
    image: '/images/gallery/social-2.jpg',
    title: 'Birthday Gala',
    description: 'Extravagant birthday celebration with custom entertainment.',
    size: 'tall',
    accent: 'from-teal-500/20 to-primary/20',
  },
  {
    id: 9,
    category: 'weddings',
    image: '/images/gallery/wedding-3.jpg',
    title: 'Traditional Wedding',
    description: 'A beautiful blend of modern and traditional ceremonies.',
    size: 'small',
    position: 'center',
    accent: 'from-rose-500/20 to-primary/20',
  },
  {
    id: 10,
    category: 'corporate',
    image: '/images/gallery/corporate-3.jpg',
    title: 'Annual Gala',
    description: 'Corporate excellence awards and celebration.',
    size: 'wide',
    position: 'center',
    accent: 'from-blue-500/20 to-primary/20',
  },
];

const GalleryModal = ({ item, onClose }: { item: GalleryItem; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative max-w-7xl w-full bg-secondary/80 backdrop-blur-2xl rounded-2xl overflow-hidden border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent opacity-60" />
        </div>
        <div className="p-8 space-y-4">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
            {item.title}
          </h3>
          <p className="text-white/70 text-lg">{item.description}</p>
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

const GalleryItem = ({ item, onSelect }: { item: GalleryItem; onSelect: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses: Record<GallerySize, string> = {
    small: 'col-span-12 sm:col-span-6 lg:col-span-3',
    wide: 'col-span-12 sm:col-span-12 lg:col-span-6',
    tall: 'col-span-12 sm:col-span-6 lg:col-span-3 row-span-2',
    large: 'col-span-12 sm:col-span-12 lg:col-span-6 row-span-2',
  };

  const aspectRatios: Record<GallerySize, string> = {
    small: 'aspect-[4/3]',
    wide: 'aspect-[16/9]',
    tall: 'aspect-[3/4]',
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
      onClick={onSelect}
    >
      <motion.div 
        className={`relative ${aspectRatios[item.size]} rounded-2xl overflow-hidden bg-white/[0.01] border border-white/10 backdrop-blur-sm cursor-pointer h-full`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className={`object-cover ${item.position ? `object-${item.position}` : ''}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${item.accent || 'from-primary/20 to-transparent'} mix-blend-soft-light opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <motion.div
          initial={false}
          animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="absolute inset-x-0 bottom-0 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-bold text-white ${item.size === 'large' ? 'text-2xl' : 'text-xl'}`}>
              {item.title}
            </h3>
            <RiArrowRightUpLine className="text-primary text-xl" />
          </div>
          <p className={`text-white/80 ${item.size === 'large' ? 'text-base' : 'text-sm'}`}>
            {item.description}
          </p>
        </motion.div>

        <motion.div
          initial={false}
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className={`rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center ${
            item.size === 'large' ? 'w-16 h-16' : 'w-12 h-12'
          }`}>
            <RiZoomInLine className={`text-white ${item.size === 'large' ? 'text-2xl' : 'text-xl'}`} />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
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

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6"
          >
            <div className="px-6 py-2 rounded-full bg-white/[0.03] backdrop-blur-sm border border-white/10">
              <span className="text-sm text-primary-200 font-medium tracking-wider uppercase">
                Our Portfolio
              </span>
            </div>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Event Gallery
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Explore our collection of extraordinary events and celebrations
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
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-white/[0.02] border border-white/10 backdrop-blur-sm text-white/70 hover:bg-white/[0.05]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.label}
              </motion.button>
            ))}
          </div>

          {/* Gallery Grid */}
          <LayoutGroup>
            <motion.div 
              layout
              className="grid grid-cols-12 gap-6 md:gap-8"
            >
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <GalleryItem
                    key={item.id}
                    item={item}
                    onSelect={() => setSelectedItem(item)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
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