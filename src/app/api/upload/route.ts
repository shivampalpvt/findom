import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

async function ensureUploadsDir() {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create uploads directory:', err);
  }
}

function sanitizeExtension(ext: string): string {
  const clean = ext.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(clean)) {
    return clean === 'jpeg' ? 'jpg' : clean;
  }
  return 'jpg';
}

function getExtensionFromMime(mime: string): string {
  switch (mime) {
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/gif':
      return 'gif';
    case 'image/svg+xml':
      return 'svg';
    case 'image/jpeg':
    default:
      return 'jpg';
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureUploadsDir();

    const contentType = req.headers.get('content-type') || '';

    // 1. Multipart Form Data (file / files)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const files: File[] = [];

      // Support field names: 'file', 'files', 'image', 'images'
      const singleFile = formData.get('file') as File | null;
      if (singleFile && singleFile.size > 0) files.push(singleFile);

      const allFiles = formData.getAll('files') as File[];
      if (allFiles && allFiles.length > 0) {
        allFiles.forEach((f) => {
          if (f && f.size > 0 && !files.includes(f)) files.push(f);
        });
      }

      const allImages = formData.getAll('image') as File[];
      if (allImages && allImages.length > 0) {
        allImages.forEach((f) => {
          if (f && f.size > 0 && !files.includes(f)) files.push(f);
        });
      }

      if (files.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No image file uploaded in request' },
          { status: 400 }
        );
      }

      const uploadedResults = [];

      for (const file of files) {
        const originalName = file.name || 'specimen.jpg';
        const rawExt = path.extname(originalName).replace('.', '');
        const ext = rawExt ? sanitizeExtension(rawExt) : getExtensionFromMime(file.type);
        const uniqueId = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
        const cleanName = `proof-${uniqueId}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, cleanName);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(filePath, buffer);

        const fileUrl = `/api/uploads/${cleanName}`;
        uploadedResults.push({
          url: fileUrl,
          filename: cleanName,
          originalName,
          size: file.size,
          type: file.type || `image/${ext}`,
        });
      }

      return NextResponse.json({
        success: true,
        count: uploadedResults.length,
        url: uploadedResults[0].url,
        file: uploadedResults[0],
        files: uploadedResults,
      });
    }

    // 2. Base64 JSON Payload fallback (data:image/...;base64,...)
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { dataUrl, filename: suggestedName, type: suggestedType } = body;

      if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.includes('base64,')) {
        return NextResponse.json(
          { success: false, error: 'Invalid base64 image data payload' },
          { status: 400 }
        );
      }

      const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return NextResponse.json(
          { success: false, error: 'Malformed base64 data string' },
          { status: 400 }
        );
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      const ext = getExtensionFromMime(mimeType);
      const uniqueId = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
      const cleanName = `proof-${uniqueId}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, cleanName);

      await fs.writeFile(filePath, buffer);

      const fileUrl = `/api/uploads/${cleanName}`;
      return NextResponse.json({
        success: true,
        count: 1,
        url: fileUrl,
        file: {
          url: fileUrl,
          filename: cleanName,
          originalName: suggestedName || cleanName,
          size: buffer.length,
          type: mimeType,
        },
        files: [
          {
            url: fileUrl,
            filename: cleanName,
            originalName: suggestedName || cleanName,
            size: buffer.length,
            type: mimeType,
          },
        ],
      });
    }

    return NextResponse.json(
      { success: false, error: 'Unsupported Content-Type. Please use multipart/form-data or application/json' },
      { status: 415 }
    );
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error while uploading file' },
      { status: 500 }
    );
  }
}
