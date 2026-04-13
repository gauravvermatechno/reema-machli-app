import { NextResponse } from 'next/server';
import { put, head, list } from '@vercel/blob';

const BLOB_PATH = 'reema-tasks.json';

async function getBlobUrl(): Promise<string | null> {
  const { blobs } = await list({ prefix: BLOB_PATH });
  if (blobs.length > 0) {
    return blobs[0].url;
  }
  return null;
}

export async function GET() {
  try {
    const url = await getBlobUrl();
    if (!url) {
      return NextResponse.json({ tasks: null });
    }
    const metadata = await head(url);
    const response = await fetch(metadata.url);
    const tasks = await response.json();
    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json({ tasks: null });
  }
}

export async function PUT(request: Request) {
  try {
    const { tasks } = await request.json();

    // Delete old blob if exists
    const { blobs } = await list({ prefix: BLOB_PATH });
    // We just overwrite by using the same pathname with addRandomSuffix: false
    await put(BLOB_PATH, JSON.stringify(tasks), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    // Clean up old blobs with random suffixes if any
    for (const blob of blobs) {
      if (blob.pathname !== BLOB_PATH) {
        try {
          const { del } = await import('@vercel/blob');
          await del(blob.url);
        } catch { /* ignore cleanup errors */ }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save tasks:', error);
    return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 });
  }
}
