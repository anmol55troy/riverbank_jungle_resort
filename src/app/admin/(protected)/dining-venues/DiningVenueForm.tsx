'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/app/admin/_components/forms/FormField'
import { TextInput, Textarea, NumberInput } from '@/app/admin/_components/forms/Inputs'
import { RichTextEditor } from '@/app/admin/_components/forms/RichTextEditor'
import { MediaPicker } from '@/app/admin/_components/forms/MediaPicker'
import { GalleryPicker } from '@/app/admin/_components/forms/GalleryPicker'
import { FormActions } from '@/app/admin/_components/forms/FormActions'
import { useToast } from '@/app/admin/_components/ui/Toast'
import { saveDiningVenue, deleteDiningVenue } from '@/lib/services/dining'
import type { DiningVenue } from '@/lib/types'

export interface DiningVenueFormProps {
  venue?: DiningVenue | null
}

export function DiningVenueForm({ venue }: DiningVenueFormProps) {
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
      const res = await saveDiningVenue(venue?.id || null, formData)
      if (res.success) {
        addToast(venue ? 'Dining venue updated.' : 'Dining venue created.', 'success')
        router.push('/admin/dining-venues')
        router.refresh()
      } else {
        setError(res.error || 'Failed to save venue.')
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : "An unknown error occurred") || 'An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!venue?.id) return
    const res = await deleteDiningVenue(venue.id)
    if (res.success) {
      addToast('Dining venue deleted.', 'success')
      router.push('/admin/dining-venues')
      router.refresh()
    } else {
      addToast(res.error || 'Failed to delete venue.', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Venue Title" required>
          <TextInput name="title" defaultValue={venue?.title || ''} required placeholder="e.g. Rapti River Restaurant & Bar" />
        </FormField>

        <FormField label="URL Slug" description="Leave empty to auto-generate">
          <TextInput name="slug" defaultValue={venue?.slug || ''} placeholder="e.g. rapti-river-restaurant" />
        </FormField>
      </div>

      <FormField label="Short Description" required>
        <Textarea name="shortDescription" defaultValue={venue?.shortDescription || ''} required rows={2} />
      </FormField>

      <FormField label="Full Description" required>
        <RichTextEditor name="description" defaultValue={venue?.description} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <FormField label="Cuisine Type" description="e.g. Nepali, Indian, Continental">
          <TextInput name="cuisine" defaultValue={venue?.cuisine || ''} placeholder="e.g. Organic Nepali & Continental" />
        </FormField>

        <FormField label="Service Hours" description="e.g. 6:30 AM – 10:30 PM">
          <TextInput name="hours" defaultValue={venue?.hours || ''} placeholder="e.g. 6:30 AM – 10:30 PM" />
        </FormField>

        <FormField label="Display Order">
          <NumberInput name="order" defaultValue={venue?.order ?? 0} />
        </FormField>
      </div>

      <div className="pt-4 border-t border-gray-200 space-y-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Featured Cover Image</h3>
          <MediaPicker name="image" defaultValue={venue?.image as any} label="Select Featured Image" />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Venue Photo Gallery</h3>
          <GalleryPicker name="gallery" defaultValue={venue?.gallery as any} />
        </div>
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        cancelHref="/admin/dining-venues"
        saveLabel={venue ? 'Update Venue' : 'Create Venue'}
        onDelete={venue ? handleDelete : undefined}
        deleteMessage={`Are you sure you want to delete "${venue?.title}"?`}
      />
    </form>
  )
}
