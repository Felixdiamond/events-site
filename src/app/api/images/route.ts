import { NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/config';
import dbConnect from '@/lib/db';
import { Image } from '@/models/Image';

const BUCKET_NAME = process.env.R2_BUCKET || 'sparklingworldevents';
const REGION = 'auto';
const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const SIGNED_URL_EXPIRY = 24 * 3600; // 24 hours in seconds

const s3Client = new S3Client({
  region: REGION,
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    console.log('API Request - Category:', category);
    console.log('API Request - StartDate:', startDate);
    console.log('API Request - EndDate:', endDate);

    await dbConnect();

    // Build query
    const query: any = {};

    if (category && category !== 'all') {
      // Use exact match for category, but make it case-insensitive
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      console.log('Using category filter:', category);
    }

    if (startDate || endDate) {
      query.eventDate = {};
      if (startDate) {
        query.eventDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.eventDate.$lte = new Date(endDate);
      }
    }

    console.log('MongoDB Query:', JSON.stringify(query));

    const images = await Image.find(query)
      .sort({ uploadedAt: -1 })
      .lean();

    console.log(`Found ${images.length} images matching query`);

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json(
      { error: 'Key parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Delete from S3
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );

    // Delete from MongoDB
    await dbConnect();
    await Image.deleteOne({ key });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
} 