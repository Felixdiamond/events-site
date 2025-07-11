'use client';

import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RiCloseLine, RiZoomInLine, RiArrowRightUpLine } from 'react-icons/ri';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format, isBefore, isAfter, parseISO } from 'date-fns';
import { 
  Search, 
  Filter, 
  X, 
  Camera, 
  ArrowLeft, 
  ArrowRight,
  Download, 
  Share, 
  Info, 
  ZoomIn, 
  XCircle
} from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/DatePicker';
import { Loader2 } from 'lucide-react';

type GallerySize = 'small' | 'wide' | 'tall' | 'large';
type GalleryPosition = 'center' | 'top' | 'bottom';

// Interface for API response
interface ImageData {
  _id: string;
  key: string;
  url: string;
  category: string;
  eventDate: string;
  uploadedAt: string;
  size: number;
  type?: string; // Add type for video/image distinction
}

// Interface for our gallery items
interface GalleryItem {
  id: string;
  category: string;
  image: string;
  title: string;
  description: string;
  size: GallerySize;
  position?: GalleryPosition;
  accent?: string;
  eventDate: Date;
  type?: string; // Add type for video/image distinction
}

// Map API data to gallery item format
const mapImageToGalleryItem = (image: ImageData, index: number): GalleryItem => {
  // Determine size based on index for visual variety
  const sizes: GallerySize[] = ['small', 'wide', 'tall', 'large'];
  const size = sizes[index % sizes.length];
  
  // Generate accent colors based on category
  const accentColors = {
    'Weddings': 'from-rose-500/20 to-primary/20',
    'Corporate': 'from-blue-500/20 to-primary/20',
    'Social Events': 'from-amber-500/20 to-primary/20',
    'Burial Services': 'from-purple-500/20 to-primary/20',
    'Decorations': 'from-emerald-500/20 to-primary/20',
  };
  
  const eventDate = new Date(image.eventDate);
  
  return {
    id: image._id || image.key,
    category: image.category,
    image: image.url,
    title: `${image.category} Event`,
    description: `Event from ${format(eventDate, 'MMMM yyyy')}`,
    size,
      position: 'center',
    accent: accentColors[image.category as keyof typeof accentColors] || 'from-primary/20 to-transparent',
    eventDate,
    type: image.type, // Pass type
  };
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

const GalleryItem = ({ item, onSelect }: { item: GalleryItem; onSelect: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const sizeClass = getSizeClasses(item.size);
  const isVideo = item.type?.startsWith('video');

  const handleClick = () => {
    // Navigate to event detail page with proper encoding
    router.push(`/gallery/event/${encodeURIComponent(item.category)}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`relative ${sizeClass}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <motion.div 
        className="relative h-full w-full rounded-2xl overflow-hidden bg-white/[0.01] border border-white/10 backdrop-blur-sm cursor-pointer group"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {isVideo ? (
          <div className="relative h-full w-full">
            <video
              src={item.image}
              className={`object-cover w-full h-full aspect-video rounded-2xl`}
              controls
              preload="metadata"
              style={{ background: '#000' }}
            />
            {/* Play icon overlay for videos */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/50 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><polygon points="9.5,7.5 16.5,12 9.5,16.5" fill="white" /></svg>
              </div>
            </div>
          </div>
        ) : (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className={`object-cover ${item.position ? `object-${item.position}` : ''}`}
          />
        )}
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

// Loading skeleton for gallery items
const GallerySkeleton = () => {
  // Create an array of different sizes to mimic the bento grid
  const skeletonSizes = [
    'col-span-1 row-span-1', // small
    'col-span-2 row-span-1', // wide
    'col-span-1 row-span-2', // tall
    'col-span-2 row-span-2', // large
    'col-span-1 row-span-1',
    'col-span-2 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
  ];

  return (
    <>
      {skeletonSizes.map((size, index) => (
        <div 
          key={index} 
          className={`${size} relative animate-pulse`}
        >
          <div className="h-full w-full rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden" />
        </div>
      ))}
    </>
  );
};

// Group images by category and select a representative image
const groupImagesByCategory = (images: ImageData[]): GalleryItem[] => {
  const categoryMap = new Map<string, ImageData[]>();
  
  // Group images by category
  images.forEach(image => {
    if (!categoryMap.has(image.category)) {
      categoryMap.set(image.category, []);
    }
    categoryMap.get(image.category)!.push(image);
  });
  
  // Create gallery items from grouped images
  const galleryItems: GalleryItem[] = [];
  let index = 0;
  
  categoryMap.forEach((categoryImages, category) => {
    // Sort by date (newest first)
    categoryImages.sort((a, b) => 
      new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
    );
    
    // Select a representative image (newest one)
    const representativeImage = categoryImages[0];
    
    // Create gallery item
    galleryItems.push(mapImageToGalleryItem(representativeImage, index));
    index++;
  });
  
  return galleryItems;
};

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const containerRef = useRef(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>(
    [
      { id: 'all', name: 'All Events' },
    ]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date || null);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date || null);
  };

  // Load images from API
  const loadImages = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (startDate) {
        params.append('startDate', startDate.toISOString());
      }
      if (endDate) {
        params.append('endDate', endDate.toISOString());
      }

      const response = await fetch(`/api/images?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      
      const data = await response.json();
      
      // Group images by category if viewing all categories
      if (selectedCategory === 'all') {
        const groupedItems = groupImagesByCategory(data);
        setGalleryItems(groupedItems);
      } else {
        // Map API data to gallery items
        const mappedItems = data.map((image: ImageData, index: number) => 
          mapImageToGalleryItem(image, index)
        );
        setGalleryItems(mappedItems);
      }
    } catch (err) {
      console.error('Error loading images:', err);
      setError('Failed to load gallery images. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load categories from API
  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      // Add "All Events" option
      setCategories([
        { id: 'all', name: 'All Events' },
        ...data.map((cat: any) => ({ id: cat.name, name: cat.name }))
      ]);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories. Please try again later.');
    }
  };

  // Initial load
  useEffect(() => {
    loadCategories();
    loadImages();
  }, []);

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
          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[linear-gradient(110deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)_30%,rgba(255,255,255,0.05))] backdrop-blur-sm p-6 rounded-2xl border border-white/10 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="categoryFilter" className="text-sm text-white/60">Category</label>
                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
                  <SelectTrigger className="w-[200px] border-white/10 bg-white/5 text-white hover:bg-black/20">
                    <SelectValue placeholder="All Events" />
              </SelectTrigger>
                  <SelectContent className="bg-secondary border-white/10">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                        {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-white/60">Event Date</label>
                <DatePicker 
                  date={startDate}
                  onSelect={handleStartDateSelect}
                />
              </div>
          </div>

            <Button 
              className="bg-primary hover:bg-primary-dark text-white"
              onClick={loadImages}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Apply Filters'
              )}
                </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 mb-8">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && galleryItems.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-16 px-4 rounded-lg border-2 border-dashed border-white/10 mb-8">
              <svg
                className="w-16 h-16 text-white/20 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-white/80 mb-2">No Images Found</h3>
              <p className="text-white/60 text-center max-w-md">
                No images match your current filter criteria. Try changing your filters or check back later for new content.
              </p>
            </div>
          )}

          {/* Gallery Grid - Proper Bento Grid Layout */}
          <LayoutGroup>
            <motion.div 
              layout
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] grid-flow-dense"
              ref={containerRef}
            >
              <AnimatePresence>
                {isLoading ? (
                  <GallerySkeleton />
                ) : (
                  galleryItems.map((item) => (
                    <GalleryItem
                      key={item.id}
                      item={item}
                      onSelect={() => {}} // Empty function since we're not using the modal anymore
                    />
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;