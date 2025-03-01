'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Loader2, Upload } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatePickerDemo } from '@/components/ui/DatePicker';

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
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories:', err);
        onError?.('Failed to load categories');
      }
    };

    loadCategories();
  }, [onError]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      onError?.('File size exceeds 5MB limit');
      return;
    }

    if (!category || !eventDate) {
      onError?.('Please select a category and event date');
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploading(true);
    setUploadedImageUrl(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('originalName', file.name);
      formData.append('category', category);
      formData.append('eventDate', eventDate.toISOString());

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Upload response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadedImageUrl(data.image.url);
      onUploadComplete(data.image.url);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
      setPreviewUrl(null);
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
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-white/60">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full border-white/10 bg-white/5 text-white hover:bg-black/20">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-secondary border-white/10">
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/60">Event Date</label>
          <DatePickerDemo 
            date={eventDate}
            onSelect={(date) => setEventDate(date || null)}
          />
        </div>
      </div>

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
                  <Upload className="w-8 h-8" />
                </motion.div>
              </div>
              <div>
                <p className="text-lg font-medium text-white/80">
                  {isDragActive ? (
                    "Drop the image here"
                  ) : (
                    "Drag & drop an image here"
                  )}
                </p>
                <p className="text-sm text-white/60 mt-1">
                  or click to select a file
                </p>
              </div>
              <p className="text-xs text-white/40">
                Supports: JPG, PNG, GIF, WebP (up to 5MB)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 