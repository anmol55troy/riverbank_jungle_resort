import React from 'react'
import Link from 'next/link'
import { GalleryImageForm } from '../GalleryImageForm'

export const dynamic = 'force-dynamic'

export default function NewGalleryImagePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin/gallery-images" className="hover:text-gray-900">
          Gallery Images
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Add Image</span>
      </div>

      <h1 className="font-serif text-2xl font-light text-gray-900">Add Image to Gallery</h1>
      <GalleryImageForm />
    </div>
  )
}
