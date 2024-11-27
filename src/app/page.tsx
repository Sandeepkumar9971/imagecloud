import { UploadForm } from '@/components/UploadForm';
import { list } from '@vercel/blob';
import Image from 'next/image'
import { promises as fs } from 'fs';
import path from 'path';

export const revalidate = 0

export default async function Home() {
  let images: { url: string }[] = [];

  try {
    if (process.env.VERCEL) {
      const { blobs } = await list();
      images = blobs.map(blob => ({ url: blob.url }));
    } else {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const files = await fs.readdir(uploadsDir);
      images = files.map(file => ({ url: `/uploads/${file}` }));
    }
  } catch (error) {
    console.error('Error listing images:', error);
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Upload</h1>
      <UploadForm />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Uploaded Images</h2>
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={image.url}
                alt={`Uploaded image ${index + 1}`}
                fill
                className="object-cover rounded"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

