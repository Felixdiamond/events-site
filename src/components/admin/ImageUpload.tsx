'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Loader2, Upload, X, Check, AlertCircle } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { Progress } from '@/components/ui/progress';

interface ImageUploadProps {
  onUploadComplete: (imageUrl: string) => void;
  onError?: (error: string) => void;
}

interface FileWithPreview extends File {
  preview?: string;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const LoadingSpinner = () => (
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
    <Loader2 className="animate-spin" size={48} strokeWidth={2} color="#ffffff" />
  </div>
);

export default function ImageUpload({ onUploadComplete, onError }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
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

  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const uploadFile = async (file: FileWithPreview) => {
    if (!category || !eventDate) {
      return;
    }

    try {
      // Update file status to uploading
      setFiles(prevFiles =>
        prevFiles.map(f =>
          f.id === file.id
            ? { ...f, status: 'uploading', progress: 0 }
            : f
        )
      );

      const formData = new FormData();
      formData.append('file', file);
      formData.append('originalName', file.name);
      formData.append('category', category);
      formData.append('eventDate', eventDate.toISOString());

      console.log('Uploading file:', {
        filename: file.name,
        size: file.size,
        type: file.type,
        category,
        eventDate: eventDate.toISOString()
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setFiles(prevFiles =>
          prevFiles.map(f =>
            f.id === file.id && f.status === 'uploading'
              ? { ...f, progress: Math.min(f.progress + 10, 90) }
              : f
          )
        );
      }, 300);

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      const data = await response.json();
      console.log('Upload response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Update file status to success
      setFiles(prevFiles =>
        prevFiles.map(f =>
          f.id === file.id
            ? { ...f, status: 'success', progress: 100 }
            : f
        )
      );

      setUploadedCount(prev => prev + 1);
      onUploadComplete(data.image.url);

      return true;
    } catch (error) {
      console.error('Error uploading file:', error);

      // Update file status to error
      setFiles(prevFiles =>
        prevFiles.map(f =>
          f.id === file.id
            ? {
              ...f,
              status: 'error',
              progress: 100,
              error: error instanceof Error ? error.message : 'Upload failed'
            }
            : f
        )
      );

      return false;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Validate that both category and date are properly selected
    if (!category) {
      onError?.('Please select a category before uploading');
      return;
    }

    if (!eventDate) {
      onError?.('Please select an event date and click "Apply" in the date picker before uploading');
      return;
    }

    // Filter out files that are too large
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        onError?.(`File "${file.name}" exceeds 10MB limit and will be skipped`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create preview for each file
    const filesWithPreviews = validFiles.map(file => {
      return {
        ...file,
        preview: URL.createObjectURL(file),
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending' as const,
        progress: 0
      };
    });

    setFiles(prev => [...prev, ...filesWithPreviews]);
    setTotalCount(prev => prev + filesWithPreviews.length);
    setUploading(true);

    // Upload files sequentially to avoid overwhelming the server
    for (const file of filesWithPreviews) {
      await uploadFile(file);
    }

    setUploading(false);
  }, [category, eventDate, onError, onUploadComplete]);

  const removeFile = (id: string) => {
    setFiles(prevFiles => {
      const fileToRemove = prevFiles.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      const newFiles = prevFiles.filter(f => f.id !== id);

      // If we're removing a successful upload, decrement the counter
      if (fileToRemove?.status === 'success') {
        setUploadedCount(prev => prev - 1);
      }

      // If we're removing a file that hasn't been processed yet, decrement the total
      if (fileToRemove?.status === 'pending') {
        setTotalCount(prev => prev - 1);
      }

      return newFiles;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.heic', '.heif']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: true
  });

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-white/60">Category <span className="text-red-400">*</span></label>
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
          <label className="text-sm text-white/60">Event Date <span className="text-red-400">*</span></label>
          <div className="relative">
            <DateTimePicker
              date={eventDate}
              onSelect={(date) => {
                setEventDate(date || null);
                console.log("Date selected:", date);
              }}
            />
            {eventDate && (
              <div className="text-xs text-green-400 mt-1">
                Date selected: {eventDate.toLocaleString()}
              </div>
            )}
            {!eventDate && (
              <div className="text-xs text-yellow-400 mt-1">
                Please select a date and click "Apply" in the date picker
              </div>
            )}
          </div>
        </div>

        {/* Validation message */}
        {(!category || !eventDate) && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-md p-3 text-sm text-orange-300">
            <p>⚠️ Please select both a category and event date before uploading an image.</p>
            <p className="mt-1 text-xs">Make sure to click the "Apply" button after selecting a date in the calendar.</p>
          </div>
        )}
      </div>

      {totalCount > 0 && (
        <div className="bg-white/5 rounded-md p-3 border border-white/10">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-white/70">Upload progress</span>
            <span className="text-sm font-medium">{uploadedCount} of {totalCount} complete</span>
          </div>
          <Progress value={(uploadedCount / totalCount) * 100} className="h-2" />
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-2 bg-white/5 rounded-md border border-white/10"
            >
              <div className="relative h-16 w-16 flex-shrink-0 bg-black/20 rounded overflow-hidden">
                {file.preview ? (
                  <Image
                    src={file.preview}
                    alt={file.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                    <Upload className="h-6 w-6 text-white/40" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-white/60">{(file.size / 1024).toFixed(1)} KB</p>

                {file.status === 'uploading' && (
                  <Progress value={file.progress} className="h-1 mt-1" />
                )}

                {file.status === 'error' && (
                  <p className="text-xs text-red-400 mt-1">{file.error}</p>
                )}
              </div>

              <div className="flex-shrink-0">
                {file.status === 'pending' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}

                {file.status === 'uploading' && (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                )}

                {file.status === 'success' && (
                  <Check className="h-5 w-5 text-green-500" />
                )}

                {file.status === 'error' && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-white/10 hover:border-primary/50 hover:bg-white/[0.02]'
          } ${(!category || !eventDate) ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} disabled={!category || !eventDate} />

        <div className="space-y-4">
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
                "Drop the images here"
              ) : (
                "Drag & drop images here"
              )}
            </p>
            <p className="text-sm text-white/60 mt-1">
              or click to select files
            </p>
          </div>
          <p className="text-xs text-white/40">
            Supports: JPG, PNG, GIF, WebP, HEIC (up to 10MB)
          </p>
        </div>
        {/* Clear all button */}
{files.length > 0 && (
  <div className="flex justify-end mt-4">
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => {
        files.forEach(file => {
          if (file.preview) URL.revokeObjectURL(file.preview);
        });
        setFiles([]);
        setUploadedCount(0);
        setTotalCount(0);
      }}
      className="text-white/60 hover:text-white"
    >
      Clear All
    </Button>
  </div>
)}
      </div>
    </div>
  );
} 