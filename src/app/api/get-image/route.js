import { NextResponse } from 'next/server';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import app from '../../lib/firebase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'No image ID provided' }, { status: 400 });
    }

    const storage = getStorage(app);
    const storageRef = ref(storage, id); // Adjust to `images/${id}` if needed
    const url = await getDownloadURL(storageRef);

    const response = await fetch(url, { method: 'GET', cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();
    const extension = id.split('.').pop() || 'jpg';
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Content-Disposition': `attachment; filename="photobooth-photo-${id.split('.').slice(0, -1).join('.')}.${extension}"`,
      },
    });
  } catch (error) {
    console.error('Error getting image:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}