'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/app/admin/_components/forms/FormField'
import { TextInput, Textarea, NumberInput } from '@/app/admin/_components/forms/Inputs'
import { RichTextEditor } from '@/app/admin/_components/forms/RichTextEditor'
import { MediaPicker } from '@/app/admin/_components/forms/MediaPicker'
import { FormActions } from '@/app/admin/_components/forms/FormActions'
import { useToast } from '@/app/admin/_components/ui/Toast'
import { saveEventVenue, deleteEventVenue } from '@/lib/services/eventVenues'
import type { EventVenue } from '@/lib/types'

export interface EventVenueFormProps {
  eventVenue?: EventVenue | null
}

export function EventVenueForm({ eventVenue }: EventVenueFormProps) {
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
      const res = await saveEventVenue(eventVenue?.id || null, formData)
      if (res.success) {
        addToast(eventVenue ? 'Event Venue updated.' : 'Event Venue created.', 'success')
        router.push('/admin/event-venues')
        router.refresh()
      } else {
        setError(res.error || 'Failed to save eventVenue.')
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : "An unknown error occurred") || 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!eventVenue?.id) return
    const res = await deleteEventVenue(eventVenue.id)
    if (res.success) {
      addToast('Event Venue deleted.', 'success')
      router.push('/admin/event-venues')
      router.refresh()
    } else {
      addToast(res.error || 'Failed to delete eventVenue.', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
      {error && <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Venue Title" required>
          <TextInput name="title" defaultValue={eventVenue?.title || ''} required placeholder="e.g. Regal Ball Room" />
        </FormField>

        <FormField label="URL Slug" description="Leave empty to auto-generate">
          <TextInput name="slug" defaultValue={eventVenue?.slug || ''} placeholder="e.g. jeep-safari" />
        </FormField>
      </div>

      <FormField label="Short Description" required>
        <Textarea name="shortDescription" defaultValue={eventVenue?.shortDescription || ''} required rows={2} />
      </FormField>

      <FormField label="Full Description (optional)">
        <RichTextEditor name="description" defaultValue={eventVenue?.description} />
      </FormField>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Hall Configuration & Capacities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <FormField label="Hall Size (sq.ft)">
            <TextInput name="hallSize" defaultValue={eventVenue?.hallSize || ''} placeholder="e.g. 1575 sq.ft" />
          </FormField>
          <FormField label="U-Shape Setup">
            <TextInput name="uSetup" defaultValue={eventVenue?.uSetup || ''} placeholder="e.g. 40-50 cover" />
          </FormField>
          <FormField label="Classroom Setup">
            <TextInput name="classroomSetup" defaultValue={eventVenue?.classroomSetup || ''} placeholder="e.g. 30-40 cover" />
          </FormField>
          <FormField label="Theater Setup">
            <TextInput name="theaterSetup" defaultValue={eventVenue?.theaterSetup || ''} placeholder="e.g. 160-170 cover" />
          </FormField>
          <FormField label="Round Table Setup">
            <TextInput name="roundTableSetup" defaultValue={eventVenue?.roundTableSetup || ''} placeholder="e.g. 70-80 cover" />
          </FormField>
          <FormField label="Display Order">
            <NumberInput name="order" defaultValue={eventVenue?.order ?? 0} />
          </FormField>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Amenities</h3>
        <FormField label="Comma-separated list" description="e.g. Projector, LED TV, Computer / Laptop, White Board">
          <Textarea name="amenities" defaultValue={eventVenue?.amenities?.join(', ') || ''} rows={3} />
        </FormField>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Featured Image</h3>
        <MediaPicker name="image" defaultValue={eventVenue?.image as any} label="Select Featured Image" />
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        cancelHref="/admin/event-venues"
        saveLabel={eventVenue ? 'Update Venue' : 'Create Venue'}
        onDelete={eventVenue ? handleDelete : undefined}
        deleteMessage={`Are you sure you want to delete "${eventVenue?.title}"?`}
      />
    </form>
  )
}
