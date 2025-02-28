'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onUploadComplete: (imageUrl: string) => void;
  onError?: (error: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const LoadingSpinner = () => (
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
    <Loader2 className="animate-spin" size={48} strokeWidth={2} color="#ffffff" />
  </div>
);

export default function ImageUpload({ onUploadComplete, onError }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [eventDate, setEventDate] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log('[ImageUpload] onDrop triggered');
    const file = acceptedFiles[0];
    if (!file) {
      console.log('[ImageUpload] No file selected');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      console.log('[ImageUpload] File exceeds MAX_FILE_SIZE');
      onError?.('File size exceeds 5MB limit');
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    console.log('[ImageUpload] Created object URL:', objectUrl);
    setPreviewUrl(objectUrl);
    setUploading(true);
    setUploadedImageUrl(null); // Clear any previous uploaded image
    console.log('[ImageUpload] Uploading state set to true');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('originalName', file.name);
      formData.append('category', category);
      formData.append('eventDate', eventDate);
      console.log('[ImageUpload] FormData prepared, starting upload');

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });
      console.log('[ImageUpload] Upload response received:', response.status);

      const data = await response.json();
      console.log('[ImageUpload] Upload response data:', data);

      if (!response.ok) {
        console.log('[ImageUpload] Upload failed, throwing error');
        throw new Error(data.error || 'Upload failed');
      }

      console.log('[ImageUpload] Upload successful, calling onUploadComplete with URL', data.url);
      setUploadedImageUrl(data.url);
      onUploadComplete(data.url);
    } catch (error) {
      console.log('[ImageUpload] Error during upload:', error);
      onError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      console.log('[ImageUpload] Finalizing upload, cleaning up state');
      setUploading(false);
      console.log('[ImageUpload] Uploading state set to false');
      URL.revokeObjectURL(objectUrl);
      setPreviewUrl(null);
      console.log('[ImageUpload] Cleared preview URL');
    }
  }, [onUploadComplete, onError, category, eventDate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-white/10 hover:border-primary/50 hover:bg-white/[0.02]'
        }`}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="sync">
          {(previewUrl || uploadedImageUrl) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full max-w-lg mx-auto bg-black/20 rounded-lg overflow-hidden h-[300px]"
            >
              <div className="relative w-full h-full">
                <Image
                  src={uploadedImageUrl || previewUrl || ''}
                  alt={uploading ? "Upload preview" : "Uploaded image"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {uploading && <LoadingSpinner />}
              </div>
            </motion.div>
          )}
          
          {!previewUrl && !uploadedImageUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-center">
                <motion.div
                  className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/40"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </motion.div>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-800">
                  {isDragActive ? (
                    "Drop the image here"
                  ) : (
                    "Drag & drop an image here"
                  )}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  or click to select a file
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Supports: JPG, PNG, GIF, WebP (up to 5MB)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label htmlFor="category" className="text-lg font-semibold text-gray-800">Category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary focus:border-primary transition duration-200 ease-in-out bg-gray-50 text-gray-800"
        >
          <option value="">Select a category</option>
          <option value="Nature">Nature</option>
          <option value="Events">Events</option>
          <option value="Portraits">Portraits</option>
          <option value="Other">Other</option>
        </select>
        <span className="text-red-500 text-sm">{!category && 'Category is required'}</span>

        <label htmlFor="eventDate" className="text-lg font-semibold text-gray-800 mt-4">Event Date:</label>
        <input
          type="date"
          id="eventDate"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary focus:border-primary transition duration-200 ease-in-out bg-gray-50 text-gray-800"
        />
        <span className="text-red-500 text-sm">{!eventDate && 'Event date is required'}</span>
      </div>
    </div>
  );
} 