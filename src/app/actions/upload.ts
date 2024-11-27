'use server'

import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No file uploaded' };
  }

  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    return { error: 'File size exceeds 10MB limit' };
  }

  try {

    const blob = await put(file.name, file, { access: 'public' });
    revalidatePath('/');
    return { success: true, url: blob.url };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { error: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

