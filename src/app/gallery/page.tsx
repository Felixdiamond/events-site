'use client';

import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { RiCloseLine, RiZoomInLine, RiArrowRightUpLine } from 'react-icons/ri';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

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

// Fetch gallery data function - this would be replaced with a server call
const fetchGalleryItems = async (): Promise<GalleryItem[]> => {
  // Simulating server response
  return [
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
      position: 'center',
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
};

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

// Utility function to get size classes based on item size
const getSizeClasses = (size: GallerySize): string => {
  switch (size) {
    case 'small':
      return 'col-span-1 row-span-1';
    case 'wide':
      return 'col-span-2 row-span-1';
    case 'tall':
      return 'col-span-1 row-span-2';
    case 'large':
      return 'col-span-2 row-span-2';
    default:
      return 'col-span-1 row-span-1';
  }
};

// Utility function to get aspect ratios based on item size
const getAspectRatio = (size: GallerySize): string => {
  switch (size) {
    case 'small':
      return 'aspect-[4/3]';
    case 'wide':
      return 'aspect-[16/9]';
    case 'tall':
      return 'aspect-[3/4]';
    case 'large':
      return 'aspect-square';
    default:
      return 'aspect-square';
  }
};

const GalleryItem = ({ item, onSelect }: { item: GalleryItem; onSelect: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const sizeClass = getSizeClasses(item.size);
  const aspectRatio = getAspectRatio(item.size);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`relative ${sizeClass} h-full`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
    >
      <motion.div 
        className={`relative ${aspectRatio} rounded-2xl overflow-hidden bg-white/[0.01] border border-white/10 backdrop-blur-sm cursor-pointer h-full`}
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
          className="absolute inset-x-0 bottom-0 p-4 md:p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-bold text-white ${item.size === 'large' || item.size === 'wide' ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'}`}>
              {item.title}
            </h3>
            <RiArrowRightUpLine className="text-primary text-xl" />
          </div>
          <p className={`text-white/80 ${item.size === 'large' || item.size === 'wide' ? 'text-sm md:text-base' : 'text-xs md:text-sm'}`}>
            {item.description}
          </p>
        </motion.div>

        <motion.div
          initial={false}
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className={`rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center ${
            item.size === 'large' ? 'w-12 h-12 md:w-16 md:h-16' : 'w-10 h-10 md:w-12 md:h-12'
          }`}>
            <RiZoomInLine className={`text-white ${item.size === 'large' ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'}`} />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const containerRef = useRef(null);
  const [startDate, setStartDate] = useState<Date | null>(null);

  useEffect(() => {
    // Fetch gallery items - this would be replaced with a real API call
    const loadItems = async () => {
      const items = await fetchGalleryItems();
      setGalleryItems(items);
    };
    
    loadItems();
  }, []);

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
          <div className="flex items-center mb-4">
            <label htmlFor="category" className="text-lg font-semibold text-gray-800">Filter by Category:</label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="ml-4">Add Category</Button>
          </div>

          {/* Date Filter */}
          <div className="flex items-center mb-4">
            <label htmlFor="startDate" className="text-lg font-semibold text-gray-800">Start Date:</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="ml-4 w-[240px] justify-start text-left font-normal">
                  {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Gallery Grid - Proper Bento Grid Layout */}
          <LayoutGroup>
            <motion.div 
              layout
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-auto"
              ref={containerRef}
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