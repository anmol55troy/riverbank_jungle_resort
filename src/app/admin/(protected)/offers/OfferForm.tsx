'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/app/admin/_components/forms/FormField'
import { TextInput, Checkbox, DateInput } from '@/app/admin/_components/forms/Inputs'
import { RichTextEditor } from '@/app/admin/_components/forms/RichTextEditor'
import { MediaPicker } from '@/app/admin/_components/forms/MediaPicker'
import { FormActions } from '@/app/admin/_components/forms/FormActions'
import { useToast } from '@/app/admin/_components/ui/Toast'
import { saveOffer, deleteOffer } from '@/lib/services/offers'
import type { Offer } from '@/lib/types'

export interface OfferFormProps {
  offer?: Offer | null
}

export function OfferForm({ offer }: OfferFormProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const formatDateForInput = (d?: string | null) => {
    if (!d) return ''
    try {
      return new Date(d).toISOString().split('T')[0]
    } catch {
      return ''
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    try {
      const res = await saveOffer(offer?.id || null, formData)
      if (res.success) {
        addToast(offer ? 'Offer updated.' : 'Offer created.', 'success')
        router.push('/admin/offers')
        router.refresh()
      } else {
        setError(res.error || 'Failed to save offer.')
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : "An unknown error occurred") || 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!offer?.id) return
    const res = await deleteOffer(offer.id)
    if (res.success) {
      addToast('Offer deleted.', 'success')
      router.push('/admin/offers')
      router.refresh()
    } else {
      addToast(res.error || 'Failed to delete offer.', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-espresso/10 p-6 sm:p-8 space-y-6 shadow-xs">
      {error && <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Offer Title" required>
          <TextInput name="title" defaultValue={offer?.title || ''} required placeholder="e.g. Wildlife Honeymoon Package" />
        </FormField>

        <FormField label="URL Slug" description="Leave empty to auto-generate">
          <TextInput name="slug" defaultValue={offer?.slug || ''} placeholder="e.g. wildlife-honeymoon-package" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-ivory/50 border border-espresso/10 items-center">
        <div>
          <Checkbox name="active" defaultChecked={offer?.active ?? true} label="Offer is Active on Website" />
        </div>

        <FormField label="Valid From">
          <DateInput name="validFrom" defaultValue={formatDateForInput(offer?.validFrom)} />
        </FormField>

        <FormField label="Valid Until">
          <DateInput name="validUntil" defaultValue={formatDateForInput(offer?.validUntil)} />
        </FormField>
      </div>

      <FormField label="Offer Details & Inclusions" required>
        <RichTextEditor name="description" defaultValue={offer?.description} />
      </FormField>

      <div className="pt-4 border-t border-espresso/10">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-espresso/80 mb-2">Offer Promotional Image</h3>
        <MediaPicker name="image" defaultValue={offer?.image as any} label="Select Offer Image" />
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        cancelHref="/admin/offers"
        saveLabel={offer ? 'Update Offer' : 'Create Offer'}
        onDelete={offer ? handleDelete : undefined}
        deleteMessage={`Are you sure you want to delete "${offer?.title}"?`}
      />
    </form>
  )
}
