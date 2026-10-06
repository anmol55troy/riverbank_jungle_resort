'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/app/admin/_components/forms/FormField'
import { TextInput, Textarea, NumberInput } from '@/app/admin/_components/forms/Inputs'
import { RichTextEditor } from '@/app/admin/_components/forms/RichTextEditor'
import { FeaturesArray } from '@/app/admin/_components/forms/FeaturesArray'
import { GalleryPicker } from '@/app/admin/_components/forms/GalleryPicker'
import { FormActions } from '@/app/admin/_components/forms/FormActions'
import { useToast } from '@/app/admin/_components/ui/Toast'
import { saveRoom, deleteRoom } from '@/lib/services/rooms'
import type { Amenity, Room } from '@/lib/types'

export interface RoomFormProps {
  room?: Room | null
  amenitiesList: Amenity[]
}

export function RoomForm({ room, amenitiesList }: RoomFormProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Calculate pre-selected amenities
  const initialSelectedAmenities = new Set(
    (room?.amenities || []).map((a) => (typeof a === 'object' ? a.id : a))
  )
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(initialSelectedAmenities)

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    // Clear and re-append all selected amenities
    formData.delete('amenities')
    selectedAmenities.forEach((id) => formData.append('amenities', id))

    try {
      const res = await saveRoom(room?.id || null, formData)
      if (res.success) {
        addToast(room ? 'Room updated successfully.' : 'Room created successfully.', 'success')
        router.push('/admin/rooms')
        router.refresh()
      } else {
        setError(res.error || 'Failed to save room.')
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : "An unknown error occurred") || 'An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!room?.id) return
    const res = await deleteRoom(room.id)
    if (res.success) {
      addToast('Room deleted successfully.', 'success')
      router.push('/admin/rooms')
      router.refresh()
    } else {
      addToast(res.error || 'Failed to delete room.', 'error')
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
        <FormField label="Room Title" required>
          <TextInput name="title" defaultValue={room?.title || ''} required placeholder="e.g. Deluxe Riverside Room" />
        </FormField>

        <FormField label="URL Slug" description="Leave empty to automatically generate from title">
          <TextInput name="slug" defaultValue={room?.slug || ''} placeholder="e.g. deluxe-riverside-room" />
        </FormField>
      </div>

      <FormField label="Short Description" required description="Summary shown on room cards and search engines">
        <Textarea name="shortDescription" defaultValue={room?.shortDescription || ''} required rows={2} />
      </FormField>

      <FormField label="Full Room Description" required>
        <RichTextEditor name="description" defaultValue={room?.description} />
      </FormField>

      {/* Display Order */}
      <div className="pt-4 border-t border-gray-200">
        <div className="max-w-xs">
          <FormField label="Display Order" description="Lower number appears first">
            <NumberInput name="order" defaultValue={room?.order ?? 0} />
          </FormField>
        </div>
      </div>

      {/* Features Array */}
      <div className="pt-4 border-t border-gray-200 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600">
          Key Features & Specifications
        </h3>
        <p className="text-xs text-gray-500 mb-3">Add key facts such as room size, occupancy limits, bed configurations.</p>
        <FeaturesArray name="features" defaultValue={room?.features} />
      </div>

      {/* Amenities Multi-Select */}
      <div className="pt-4 border-t border-gray-200 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600">Room Amenities</h3>
        <p className="text-xs text-gray-500 mb-3">Select the amenities available in this room.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-2 border border-gray-200 rounded-xl bg-gray-50">
          {amenitiesList.map((a) => {
            const checked = selectedAmenities.has(a.id)
            return (
              <label
                key={a.id}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer border transition-colors ${
                  checked ? 'bg-gray-900 text-white border-gray-300 font-medium' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAmenity(a.id)}
                  className="sr-only"
                />
                <span className="truncate">{a.name}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Gallery Images */}
      <div className="pt-4 border-t border-gray-200 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600">Room Photo Gallery</h3>
        <p className="text-xs text-gray-500 mb-3">Upload or select images. The first image will be used as the primary card cover.</p>
        <GalleryPicker name="gallery" defaultValue={room?.gallery as any} />
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        cancelHref="/admin/rooms"
        saveLabel={room ? 'Update Room' : 'Create Room'}
        onDelete={room ? handleDelete : undefined}
        deleteMessage={`Are you sure you want to delete "${room?.title}"?`}
      />
    </form>
  )
}
