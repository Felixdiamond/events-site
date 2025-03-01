import mongoose from 'mongoose';

export interface ICategory {
  name: string;
  createdAt: Date;
}

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model is already defined to prevent OverwriteModelError
export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema); 