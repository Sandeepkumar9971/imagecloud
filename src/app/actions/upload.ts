'use server'

import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import path from 'path';
import fs from 'fs/promises';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No file uploaded' };
  }

  try {
    if (process.env.VERCEL) {
      // If on Vercel, use Vercel Blob
      const blob = await put(file.name, file, { access: 'public' });
      revalidatePath('/');
      return { success: true, url: blob.url };
    } else {
      // If local, save to public directory
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const publicDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(publicDir, { recursive: true });
      const filePath = path.join(publicDir, file.name);
      await fs.writeFile(filePath, buffer);
      revalidatePath('/');
      return { success: true, url: `/uploads/${file.name}` };
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return { error: 'Failed to upload file' };
  }
}

