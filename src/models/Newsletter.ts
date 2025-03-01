import mongoose from 'mongoose';

export interface INewsletter {
  email: string;
  name?: string;
  subscribed: boolean;
  subscribedAt: Date;
  preferences: {
    events: boolean;
    promotions: boolean;
    news: boolean;
  };
}

const newsletterSchema = new mongoose.Schema<INewsletter>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    trim: true,
  },
  subscribed: {
    type: Boolean,
    default: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  preferences: {
    events: {
      type: Boolean,
      default: true,
    },
    promotions: {
      type: Boolean,
      default: true,
    },
    news: {
      type: Boolean,
      default: true,
    },
  },
});

// Add index for email lookups
newsletterSchema.index({ email: 1 });

export const Newsletter = mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', newsletterSchema); 