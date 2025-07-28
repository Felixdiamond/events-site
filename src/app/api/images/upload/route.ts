import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/config';
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

export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    // Accept multiple files
    const files = formData.getAll('file');
    const originalNames = formData.getAll('originalName');
    const category = formData.get('category') as string;
    const eventDate = formData.get('eventDate') as string;
    
    if (!files.length || !category || !eventDate || !originalNames.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();
    const uploaded = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const originalName = originalNames[i] as string;
      if (!(file instanceof Blob)) continue;

    // Generate a safe filename
    const timestamp = Date.now();
    const safeFilename = originalName
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '-')
      .replace(/-+/g, '-');
      if (!safeFilename) continue;

    const key = `gallery/${timestamp}-${safeFilename}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = file.type || 'application/octet-stream';

    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });
    await s3Client.send(uploadCommand);

    // Generate signed URL for the uploaded file
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    const url = await getSignedUrl(s3Client, getCommand, {
      expiresIn: SIGNED_URL_EXPIRY,
    });

    // Store metadata in MongoDB
    const image = await Image.create({
      key,
      url,
      category,
      eventDate: new Date(eventDate),
      size: buffer.length,
      uploadedAt: new Date(),
        type: contentType,
      });
      uploaded.push(image.toObject());
    }

    return NextResponse.json({
      success: true,
      images: uploaded,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    );
  }
} 