import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GalleryImageForm } from '../GalleryImageForm'
import { getAdminGalleryImageById } from '@/lib/services/gallery'

export const dynamic = 'force-dynamic'

export default async function EditGalleryImagePage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const item = await getAdminGalleryImageById(id)

  if (!item) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin/gallery-images" className="hover:text-gray-900">
          Gallery Images
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{item.caption || 'Image Details'}</span>
      </div>

      <div>
        <h1 className="font-serif text-2xl font-light text-gray-900">Edit Gallery Image</h1>
        <p className="text-xs text-gray-500 mt-0.5 font-mono">ID: {item.id}</p>
      </div>

      <GalleryImageForm item={item} />
    </div>
  )
}
