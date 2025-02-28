'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ImageUpload from '@/components/admin/ImageUpload';
import { Loader2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ImageMetadata {
  key: string;
  url: string;
  uploadedAt: Date;
  size: number;
  hasError: boolean;
}

export default function AdminGallery() {
  const { data: session } = useSession();
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<number>(0);
  const [deletingKeys, setDeletingKeys] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const loadImages = async () => {
    // Prevent refreshing more than once every 5 seconds
    const now = Date.now();
    if (now - lastRefresh < 5000) return;
    setLastRefresh(now);

    try {
      if (!isRefreshing) {
        setIsLoading(true);
      }
      const response = await fetch('/api/images');
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Parse dates and sort
      const parsedImages = data.map((img: any) => ({
        ...img,
        uploadedAt: new Date(img.uploadedAt),
        hasError: false
      })).sort((a: ImageMetadata, b: ImageMetadata) => 
        b.uploadedAt.getTime() - a.uploadedAt.getTime()
      );
      
      setImages(parsedImages);
      setError(null);
    } catch (err) {
      setError('Failed to load images');
      console.error('Error loading images:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Load images on mount and when session changes
  useEffect(() => {
    if (session) {
      loadImages();
    }
  }, [session]);

  const handleUploadComplete = async (imageUrl: string) => {
    setShowUpload(false);
    setIsRefreshing(true);
    await loadImages();
  };

  const handleUploadError = (error: string) => {
    setError(error);
    setTimeout(() => setError(null), 5000);
  };

  const handleDelete = async (key: string) => {
    try {
      setDeletingKeys(prev => new Set([...prev, key]));
      const response = await fetch(`/api/images?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete image');
      }

      // Remove the image from the state
      setImages(current => current.filter(img => img.key !== key));
    } catch (err) {
      setError('Failed to delete image');
      console.error('Error deleting image:', err);
      setTimeout(() => setError(null), 5000);
    } finally {
      setDeletingKeys(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const handleFilterChange = () => {
    loadImages(); // Reload images with the new filters applied
  };

  const handleAddCategory = () => {
    // Logic to add new category to the database or state
    console.log('New category added:', newCategory);
    setNewCategory(''); // Clear input after adding
    setShowCategoryModal(false); // Close modal
  };

  return (
    <div className="min-h-screen bg-secondary pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Filter UI */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center">
            <label htmlFor="categoryFilter" className="mr-2 text-gray-200">Category:</label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded bg-gray-800 text-white"
            >
              <option value="">All Categories</option>
              <option value="Nature">Nature</option>
              <option value="Events">Events</option>
              <option value="Portraits">Portraits</option>
              <option value="Other">Other</option>
            </select>
            <button onClick={() => setShowCategoryModal(true)} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Add Category</button>
          </div>
          <div className="flex items-center">
            <label htmlFor="startDate" className="mr-2 text-gray-200">Start Date:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="p-2 border border-gray-300 rounded bg-gray-800 text-white"
              placeholderText="Select start date"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="endDate" className="mr-2 text-gray-200">End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="p-2 border border-gray-300 rounded bg-gray-800 text-white"
              placeholderText="Select end date"
            />
          </div>
          <button onClick={handleFilterChange} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition">Apply Filters</button>
        </div>

        {/* Category Modal */}
        <AnimatePresence>
          {showCategoryModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative w-full max-w-md bg-secondary rounded-2xl p-6 border border-white/10"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Add New Category</h2>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category"
                  className="p-2 border border-gray-300 rounded bg-gray-800 text-white w-full"
                />
                <button onClick={handleAddCategory} className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Add Category</button>
                <button onClick={() => setShowCategoryModal(false)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Cancel</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
              Gallery Management
            </h1>
            <p className="mt-2 text-white/60">
              Upload and manage gallery images
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUpload(true)}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            Upload New Image
          </motion.button>
        </div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative w-full max-w-2xl bg-secondary rounded-2xl p-6 border border-white/10"
              >
                <button
                  onClick={() => setShowUpload(false)}
                  className="absolute top-4 right-4 p-2 text-white/60 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-2xl font-bold text-white mb-6">Upload New Image</h2>
                <ImageUpload
                  onUploadComplete={handleUploadComplete}
                  onError={handleUploadError}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeletons
            [...Array(8)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="aspect-square rounded-lg bg-white/5 animate-pulse"
              />
            ))
          ) : images.length === 0 ? (
            // Empty state
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 rounded-lg border-2 border-dashed border-white/10">
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
              <h3 className="text-xl font-semibold text-white/80 mb-2">No Images Yet</h3>
              <p className="text-white/60 text-center max-w-md mb-6">
                Get started by uploading your first image to the gallery. Click the "Upload New Image" button above.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUpload(true)}
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                Upload First Image
              </motion.button>
            </div>
          ) : (
            <AnimatePresence mode="sync">
              {images.map((image) => (
                <motion.div
                  key={image.key}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group relative w-full aspect-square rounded-lg overflow-hidden bg-white/5"
                  style={{ minHeight: '250px' }}
                >
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={true}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => {
                      setImages(current =>
                        current.map(img =>
                          img.key === image.key
                            ? { ...img, hasError: true }
                            : img
                        )
                      );
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-sm text-white/60">
                        {image.uploadedAt.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-white/60">
                        {(image.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(image.key);
                        }}
                        disabled={deletingKeys.has(image.key)}
                        className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                      >
                        {deletingKeys.has(image.key) ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
} 