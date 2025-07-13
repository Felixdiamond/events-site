#!/usr/bin/env node

const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET || 'sparklingworldevents';

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

// Image Schema (same as in your models)
const imageSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  category: { type: String, required: true },
  eventDate: { type: Date, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
});

const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);

async function deleteImagesByCategory(categoryName) {
  try {
    console.log(`🗑️  Starting deletion of all images from category: "${categoryName}"`);
    
    // First, get all images from the category
    const images = await Image.find({ category: { $regex: new RegExp(`^${categoryName}$`, 'i') } });
    
    if (!images || images.length === 0) {
      console.log(`ℹ️  No images found for category: "${categoryName}"`);
      return;
    }
    
    console.log(`📊 Found ${images.length} images to delete`);
    
    // Delete images from Cloudflare R2 storage
    const storagePromises = images.map(async (image) => {
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: image.key,
          })
        );
        
        console.log(`✅ Deleted from storage: ${image.key}`);
        return true;
      } catch (error) {
        console.error(`❌ Error deleting from storage: ${image.key}`, error);
        return false;
      }
    });
    
    const storageResults = await Promise.all(storagePromises);
    const storageSuccessCount = storageResults.filter(Boolean).length;
    
    // Delete records from MongoDB
    const deleteResult = await Image.deleteMany({ 
      category: { $regex: new RegExp(`^${categoryName}$`, 'i') } 
    });
    
    console.log(`✅ Deleted ${deleteResult.deletedCount} records from database`);
    
    console.log(`\n🎉 Summary:`);
    console.log(`   📁 Category: "${categoryName}"`);
    console.log(`   🗂️  Database records deleted: ${deleteResult.deletedCount}`);
    console.log(`   💾 Storage files deleted: ${storageSuccessCount}/${images.length}`);
    
    if (storageSuccessCount < images.length) {
      console.log(`   ⚠️  Some files may not have been deleted from storage`);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Get category name from command line arguments
const categoryName = process.argv[2];

if (!categoryName) {
  console.log('❌ Please provide a category name');
  console.log('Usage: node scripts/delete-category-images.js "Category Name"');
  console.log('Example: node scripts/delete-category-images.js "Weddings"');
  process.exit(1);
}

// Confirmation prompt
console.log(`\n⚠️  WARNING: This will permanently delete ALL images from category: "${categoryName}"`);
console.log('This action cannot be undone!');
console.log('\nType the category name exactly to confirm:');

process.stdin.once('data', async (data) => {
  const confirmation = data.toString().trim();
  
  if (confirmation === categoryName) {
    console.log('\n🔄 Connecting to database...');
    await connectDB();
    console.log('🔄 Proceeding with deletion...\n');
    
    try {
      await deleteImagesByCategory(categoryName);
      console.log('\n✅ Deletion completed');
      await mongoose.connection.close();
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Deletion failed:', error);
      await mongoose.connection.close();
      process.exit(1);
    }
  } else {
    console.log('❌ Confirmation failed. Deletion cancelled.');
    process.exit(0);
  }
}); 