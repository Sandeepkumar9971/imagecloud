'use client'

import { useState } from 'react'
import { uploadImage } from '@/app/actions/upload'

interface UploadResult {
  error?: string;
}

export function UploadForm() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setUploading(true)
    setError(null)
    setSuccess(false)

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const result: UploadResult = await uploadImage(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        form.reset()
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.',)
      console.log(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Choose an image (max 10MB)
        </label>
        <input
          type="file"
          id="file"
          name="file"
          accept="image/*"
          required
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      <button
        type="submit"
        disabled={uploading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">File uploaded successfully!</p>}
    </form>
  )
}
