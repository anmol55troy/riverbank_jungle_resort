'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/app/admin/_components/forms/FormField'
import { TextInput, Textarea, Select, NumberInput } from '@/app/admin/_components/forms/Inputs'
import { FormActions } from '@/app/admin/_components/forms/FormActions'
import { useToast } from '@/app/admin/_components/ui/Toast'
import { saveTestimonial, deleteTestimonial } from '@/lib/services/testimonials'
import type { Testimonial } from '@/lib/types'

export interface TestimonialFormProps {
  testimonial?: Testimonial | null
}

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
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
      const res = await saveTestimonial(testimonial?.id || null, formData)
      if (res.success) {
        addToast(testimonial ? 'Review updated.' : 'Review created.', 'success')
        router.push('/admin/testimonials')
        router.refresh()
      } else {
        setError(res.error || 'Failed to save review.')
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : "An unknown error occurred") || 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!testimonial?.id) return
    const res = await deleteTestimonial(testimonial.id)
    if (res.success) {
      addToast('Review deleted.', 'success')
      router.push('/admin/testimonials')
      router.refresh()
    } else {
      addToast(res.error || 'Failed to delete review.', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-espresso/10 p-6 sm:p-8 space-y-6 shadow-xs max-w-2xl">
      {error && <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">{error}</div>}

      <FormField label="Guest Name" required>
        <TextInput name="guestName" defaultValue={testimonial?.guestName || ''} required placeholder="e.g. Sarah Jenkins" />
      </FormField>

      <FormField label="Review Quote" required>
        <Textarea name="quote" defaultValue={testimonial?.quote || ''} required rows={4} placeholder="Guest feedback and experience review..." />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Origin / Country">
          <TextInput name="country" defaultValue={testimonial?.country || ''} placeholder="e.g. United Kingdom" />
        </FormField>

        <FormField label="Review Source" required>
          <Select
            name="source"
            defaultValue={testimonial?.source || 'tripadvisor'}
            options={[
              { label: 'TripAdvisor', value: 'tripadvisor' },
              { label: 'Booking.com', value: 'booking' },
              { label: 'Expedia', value: 'expedia' },
              { label: 'Trip.com', value: 'tripcom' },
            ]}
          />
        </FormField>

        <FormField label="Rating (1 to 5 Stars)" required>
          <NumberInput name="rating" min={1} max={5} defaultValue={testimonial?.rating ?? 5} required />
        </FormField>
      </div>

      <FormField label="Original Review Link (optional)">
        <TextInput name="sourceUrl" defaultValue={testimonial?.sourceUrl || ''} placeholder="https://www.tripadvisor.com/..." />
      </FormField>

      <FormActions
        isSubmitting={isSubmitting}
        cancelHref="/admin/testimonials"
        saveLabel={testimonial ? 'Update Review' : 'Create Review'}
        onDelete={testimonial ? handleDelete : undefined}
        deleteMessage={`Are you sure you want to delete the review by "${testimonial?.guestName}"?`}
      />
    </form>
  )
}
