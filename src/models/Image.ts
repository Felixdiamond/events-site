import mongoose from 'mongoose';

export interface IImage {
  key: string;
  url: string;
  uploadedAt: Date;
  category: string;
  eventDate: Date;
  size: number;
  type: string; // Add this line
}

const imageSchema = new mongoose.Schema<IImage>({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

// Add indexes for filtering
imageSchema.index({ category: 1 });
imageSchema.index({ eventDate: 1 });
imageSchema.index({ uploadedAt: -1 });

export const Image = mongoose.models.Image || mongoose.model<IImage>('Image', imageSchema); 