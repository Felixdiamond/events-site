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
    const file = formData.get('file');
    const originalName = formData.get('originalName') as string;
    const category = formData.get('category') as string;
    const eventDate = formData.get('eventDate') as string;
    
    console.log('Received upload request:', {
      hasFile: !!file,
      originalName,
      category,
      eventDate,
      fileType: file instanceof Blob ? file.type : typeof file
    });

    if (!file || !category || !eventDate || !originalName) {
      console.log('Missing fields:', { file: !!file, category, eventDate, originalName });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!(file instanceof Blob)) {
      console.log('Invalid file type:', typeof file);
      return NextResponse.json({ error: 'Invalid file format' }, { status: 400 });
    }

    // Generate a safe filename
    const timestamp = Date.now();
    const safeFilename = originalName
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '-')
      .replace(/-+/g, '-');
    
    if (!safeFilename) {
      console.log('Invalid filename generated from:', originalName);
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const key = `gallery/${timestamp}-${safeFilename}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = file.type || 'application/octet-stream';

    console.log('Processing upload:', {
      key,
      contentType,
      size: buffer.length,
      category,
      eventDate
    });

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
    await dbConnect();
    const image = await Image.create({
      key,
      url,
      category,
      eventDate: new Date(eventDate),
      size: buffer.length,
      uploadedAt: new Date(),
    });

    console.log('Upload successful:', {
      key,
      url,
      size: buffer.length
    });

    return NextResponse.json({
      success: true,
      image: image.toObject(),
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    );
  }
} 