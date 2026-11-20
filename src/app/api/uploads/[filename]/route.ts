import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;

    // Security check: prevent directory traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join(UPLOADS_DIR, safeFilename);

    try {
      const fileBuffer = await fs.readFile(filePath);
      const mimeType = getMimeType(safeFilename);

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error reading image' }, { status: 500 });
  }
}
