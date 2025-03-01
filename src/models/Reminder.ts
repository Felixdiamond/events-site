import mongoose, { Schema, Document } from 'mongoose';

export interface IReminder extends Document {
  userId: string;
  eventId?: string;
  eventName: string;
  eventDate: Date;
  reminderDate: Date;
  reminderSent: boolean;
  reminderType: string; // "1day", "1week", etc.
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReminderSchema = new Schema<IReminder>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
    },
    eventId: {
      type: String,
      required: false,
    },
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    reminderDate: {
      type: Date,
      required: [true, 'Reminder date is required'],
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    reminderType: {
      type: String,
      required: [true, 'Reminder type is required'],
      enum: ['1hour', '1day', '3days', '1week', '2weeks', 'custom'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the model
export const Reminder = mongoose.models.Reminder || mongoose.model<IReminder>('Reminder', ReminderSchema);

export default Reminder; 