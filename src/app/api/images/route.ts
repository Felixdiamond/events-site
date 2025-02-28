import { NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/config';
import { MongoClient } from 'mongodb';

const BUCKET_NAME = process.env.R2_BUCKET || 'sparklingworldevents';
const REGION = 'auto';
const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const SIGNED_URL_EXPIRY = 24 * 3600; // 24 hours in seconds
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

const s3Client = new S3Client({
  region: REGION,
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const client = new MongoClient(MONGODB_URI);
const dbName = 'yourDatabaseName'; // Replace with your actual database name

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // List images
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'gallery/', // Only list images in the gallery folder
    });

    const response = await s3Client.send(command);
    const images = await Promise.all(
      (response.Contents || [])
        .filter(item => item.Key?.match(/\.(jpg|jpeg|png|gif|webp)$/i))
        .map(async item => {
          const key = item.Key!;
          const getCommand = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
          });

          try {
            // Get signed URL for viewing
            const url = await getSignedUrl(s3Client, getCommand, {
              expiresIn: SIGNED_URL_EXPIRY,
            });

            return {
              key,
              url,
              uploadedAt: item.LastModified || new Date(),
              size: item.Size || 0,
            };
          } catch (error) {
            console.error(`Error generating signed URL for ${key}:`, error);
            return null;
          }
        })
    );

    // Filter out any failed URLs
    const validImages = images.filter(img => img !== null);

    return NextResponse.json(validImages);
  } catch (error) {
    console.error('Error listing images:', error);
    return NextResponse.json(
      { error: 'Failed to list images' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Image key is required' }, { status: 400 });
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(deleteCommand);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const originalName = formData.get('originalName') as string;
  const category = formData.get('category') as string;
  const eventDate = formData.get('eventDate') as string;

  // Validate inputs
  if (!file || !originalName || !category || !eventDate) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  // Upload logic here...
  const imageMetadata = {
    key: file.name,
    url: `https://your-bucket-url/${file.name}`,
    uploadedAt: new Date().toISOString(),
    category,
    eventDate,
  };

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('images'); // Replace with your actual collection name
    await collection.insertOne(imageMetadata);
  } catch (error) {
    console.error('Error saving image metadata to MongoDB:', error);
    return NextResponse.json({ error: 'Failed to save image metadata' }, { status: 500 });
  } finally {
    await client.close();
  }

  return NextResponse.json({ success: true, image: imageMetadata });
} 