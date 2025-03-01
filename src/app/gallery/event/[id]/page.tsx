'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { RiArrowLeftLine, RiShareLine, RiDownloadLine, RiHeartLine, RiHeartFill } from 'react-icons/ri';
import { Loader2 } from 'lucide-react';

// Interface for API response
interface ImageData {
  _id: string;
  key: string;
  url: string;
  category: string;
  eventDate: string;
  uploadedAt: string;
  size: number;
}

// Interface for event details
interface EventDetails {
  category: string;
  eventDate: Date;
  images: ImageData[];
}

const EventDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  console.log('Event Detail Page - ID param:', id);
  
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax scrolling effect with layoutEffect: false to fix hydration warning
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
    layoutEffect: false // Add this to fix hydration warning
  });
  
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  
  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Decode the category from the URL
        const decodedCategory = decodeURIComponent(id as string);
        console.log('Fetching images for category:', decodedCategory);
        
        // Fetch all images for this event category
        // Use a more robust approach for the API call
        const queryParams = new URLSearchParams();
        queryParams.append('category', decodedCategory);
        
        const response = await fetch(`/api/images?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event images');
        }
        
        const images: ImageData[] = await response.json();
        console.log('Fetched images:', images.length, images);
        
        if (!images || images.length === 0) {
          throw new Error('No images found for this event');
        }
        
        // Group by event date and category
        setEvent({
          category: decodedCategory,
          eventDate: new Date(images[0].eventDate),
          images: images
        });
      } catch (err) {
        console.error('Error loading event details:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEventDetails();
  }, [id]);
  
  // Navigate back to gallery
  const handleBack = () => {
    router.push('/gallery');
  };
  
  // Navigate to next image
  const handleNextImage = () => {
    if (event && event.images && currentImageIndex < event.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };
  
  // Navigate to previous image
  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };
  
  // Toggle like status
  const handleLike = () => {
    setLiked(prev => !prev);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !event || !event.images || event.images.length === 0) {
    return (
      <div className="min-h-screen bg-secondary flex flex-col items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-red-400 max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || 'Failed to load event details'}</p>
          <Button 
            className="mt-4 bg-primary hover:bg-primary-dark text-white"
            onClick={handleBack}
          >
            Return to Gallery
          </Button>
        </div>
      </div>
    );
  }
  
  // Make sure currentImageIndex is valid
  const safeCurrentIndex = Math.min(currentImageIndex, event.images.length - 1);
  const currentImage = event.images[safeCurrentIndex];
  const totalImages = event.images.length;
  
  // Fallback image URL in case the current image fails to load
  const fallbackImageUrl = "/images/gallery/wedding-1.jpg"; // Using an existing image as fallback
  
  return (
    <div className="min-h-screen bg-secondary" ref={containerRef}>
      {/* Hero Section with Parallax */}
      <motion.section 
        className="relative h-[70vh] flex items-center justify-center overflow-hidden"
        style={{ opacity: headerOpacity, y: headerY }}
      >
        <div className="absolute inset-0">
          <div className="relative w-full h-full" style={{ minHeight: '100%' }}>
            <Image
              src={currentImage.url}
              alt={event.category}
              fill
              sizes="100vw"
              className="object-cover blur-sm scale-105"
              priority
              onError={(e) => {
                // If image fails to load, use fallback
                console.error('Failed to load hero image:', currentImage.url);
                const target = e.target as HTMLImageElement;
                target.src = fallbackImageUrl;
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 via-secondary/70 to-secondary" />
          <div className="absolute inset-0 bg-[url('/images/texture.png')] bg-repeat bg-[length:32px_32px] opacity-[0.02]" />
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
                {event.category}
              </span>
            </div>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {event.category} Event
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {format(event.eventDate, 'MMMM yyyy')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8"
          >
            <Button 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/10"
              onClick={handleBack}
            >
              <RiArrowLeftLine className="mr-2" />
              Back to Gallery
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Image Showcase */}
          <div className="mb-12">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ minHeight: '300px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={safeCurrentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full" 
                  style={{ minHeight: '100%' }}
                >
                  <div className="relative w-full h-full" style={{ minHeight: '100%' }}> 
                    <Image
                      src={currentImage.url}
                      alt={`${event.category} image ${safeCurrentIndex + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 80vw"
                      className="object-cover"
                      priority
                      onError={(e) => {
                        // If image fails to load, use fallback
                        console.error('Failed to load main image:', currentImage.url);
                        const target = e.target as HTMLImageElement;
                        target.src = fallbackImageUrl;
                      }}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation Arrows */}
              {safeCurrentIndex > 0 && (
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <RiArrowLeftLine size={24} />
                </button>
              )}
              
              {safeCurrentIndex < totalImages - 1 && (
                <button 
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors rotate-180"
                >
                  <RiArrowLeftLine size={24} />
                </button>
              )}
              
              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
                {safeCurrentIndex + 1} / {totalImages}
              </div>
            </div>
            
            {/* Image Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-white/70">
                <span className="font-medium text-white">{event.category}</span> • {format(event.eventDate, 'MMMM d, yyyy')}
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleLike}>
                  {liked ? (
                    <RiHeartFill className="text-red-500" size={20} />
                  ) : (
                    <RiHeartLine className="text-white/70" size={20} />
                  )}
                </Button>
                
                <Button variant="ghost" size="icon">
                  <RiShareLine className="text-white/70" size={20} />
                </Button>
                
                <Button variant="ghost" size="icon">
                  <RiDownloadLine className="text-white/70" size={20} />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {event.images.map((image, index) => (
              <motion.div
                key={image._id}
                whileHover={{ scale: 1.05 }}
                className={`relative aspect-square rounded-lg overflow-hidden border ${
                  index === safeCurrentIndex 
                    ? 'border-primary' 
                    : 'border-white/10'
                } cursor-pointer`}
                style={{ minHeight: '100px' }}
                onClick={() => setCurrentImageIndex(index)}
              >
                <div className="relative w-full h-full" style={{ minHeight: '100%' }}> 
                  <Image
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                    className="object-cover"
                    onError={(e) => {
                      // If thumbnail fails to load, use fallback
                      console.error('Failed to load thumbnail:', image.url);
                      const target = e.target as HTMLImageElement;
                      target.src = fallbackImageUrl;
                    }}
                  />
                </div>
                {index === safeCurrentIndex && (
                  <div className="absolute inset-0 bg-primary/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Cinematic Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
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
              left: `${Math.random() * 100}%`,
              top: `${80 + Math.random() * 20}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EventDetailPage; 