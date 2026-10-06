'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/app/admin/_components/forms/FormField'
import { TextInput, Textarea, NumberInput } from '@/app/admin/_components/forms/Inputs'
import { RichTextEditor } from '@/app/admin/_components/forms/RichTextEditor'
import { MediaPicker } from '@/app/admin/_components/forms/MediaPicker'
import { FormActions } from '@/app/admin/_components/forms/FormActions'
import { useToast } from '@/app/admin/_components/ui/Toast'
import { saveExperience, deleteExperience } from '@/lib/services/experiences'
import type { Experience } from '@/lib/types'

export interface ExperienceFormProps {
  experience?: Experience | null
}

export function ExperienceForm({ experience }: ExperienceFormProps) {
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
      const res = await saveExperience(experience?.id || null, formData)
      if (res.success) {
        addToast(experience ? 'Experience updated.' : 'Experience created.', 'success')
        router.push('/admin/experiences')
        router.refresh()
      } else {
        setError(res.error || 'Failed to save experience.')
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : "An unknown error occurred") || 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!experience?.id) return
    const res = await deleteExperience(experience.id)
    if (res.success) {
      addToast('Experience deleted.', 'success')
      router.push('/admin/experiences')
      router.refresh()
    } else {
      addToast(res.error || 'Failed to delete experience.', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
      {error && <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Experience Title" required>
          <TextInput name="title" defaultValue={experience?.title || ''} required placeholder="e.g. Jeep Safari in Chitwan" />
        </FormField>

        <FormField label="URL Slug" description="Leave empty to auto-generate">
          <TextInput name="slug" defaultValue={experience?.slug || ''} placeholder="e.g. jeep-safari" />
        </FormField>
      </div>

      <FormField label="Short Description" required>
        <Textarea name="shortDescription" defaultValue={experience?.shortDescription || ''} required rows={2} />
      </FormField>

      <FormField label="Full Description (optional)">
        <RichTextEditor name="description" defaultValue={experience?.description} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <FormField label="Duration" description="e.g. 3–4 hours, Half day, Full day">
          <TextInput name="duration" defaultValue={experience?.duration || ''} placeholder="e.g. 3–4 hours" />
        </FormField>

        <FormField label="Display Order">
          <NumberInput name="order" defaultValue={experience?.order ?? 0} />
        </FormField>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Featured Image</h3>
        <MediaPicker name="image" defaultValue={experience?.image as any} label="Select Featured Image" />
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        cancelHref="/admin/experiences"
        saveLabel={experience ? 'Update Experience' : 'Create Experience'}
        onDelete={experience ? handleDelete : undefined}
        deleteMessage={`Are you sure you want to delete "${experience?.title}"?`}
      />
    </form>
  )
}
