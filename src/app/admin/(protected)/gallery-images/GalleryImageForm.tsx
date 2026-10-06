'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/app/admin/_components/forms/FormField'
import { TextInput, Select, NumberInput } from '@/app/admin/_components/forms/Inputs'
import { MediaPicker } from '@/app/admin/_components/forms/MediaPicker'
import { FormActions } from '@/app/admin/_components/forms/FormActions'
import { useToast } from '@/app/admin/_components/ui/Toast'
import { saveGalleryImage, deleteGalleryImage } from '@/lib/services/gallery'
import type { GalleryImage } from '@/lib/types'

export interface GalleryImageFormProps {
  item?: GalleryImage | null
}

export function GalleryImageForm({ item }: GalleryImageFormProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    try {
      const res = await saveGalleryImage(item?.id || null, formData)
      if (res.success) {
        addToast(item ? 'Gallery image updated.' : 'Gallery image added.', 'success')
        router.push('/admin/gallery-images')
        router.refresh()
      } else {
        setError(res.error || 'Failed to save gallery image.')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!item?.id) return
    const res = await deleteGalleryImage(item.id)
    if (res.success) {
      addToast('Gallery image deleted.', 'success')
      router.push('/admin/gallery-images')
      router.refresh()
    } else {
      addToast(res.error || 'Failed to delete.', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-espresso/10 p-6 sm:p-8 space-y-6 shadow-xs max-w-2xl">
      {error && <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">{error}</div>}

      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-espresso/80 mb-2">Image File</h3>
          <MediaPicker name="image" defaultValue={item?.image as any} label="Select Image" />
        </div>

        <FormField label="Caption / Alt Description">
          <TextInput name="caption" defaultValue={item?.caption || ''} placeholder="e.g. Traditional Tharu cultural dance by the campfire" />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Gallery Category">
            <Select
              name="category"
              defaultValue={item?.category || 'resort'}
              options={[
                { label: 'Resort Grounds', value: 'resort' },
                { label: 'Rooms & Villas', value: 'rooms' },
                { label: 'Dining & Bars', value: 'dining' },
                { label: 'Wildlife & Safaris', value: 'wildlife' },
                { label: 'Experiences & Nature', value: 'experiences' },
                { label: 'Culture & Tharu Dance', value: 'culture' },
              ]}
            />
          </FormField>

          <FormField label="Display Order">
            <NumberInput name="order" defaultValue={item?.order ?? 0} />
          </FormField>
        </div>
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        cancelHref="/admin/gallery-images"
        saveLabel={item ? 'Update Image' : 'Add to Gallery'}
        onDelete={item ? handleDelete : undefined}
        deleteMessage="Are you sure you want to remove this image from the gallery?"
      />
    </form>
  )
}
