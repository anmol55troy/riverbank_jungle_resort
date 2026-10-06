'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/app/admin/_components/forms/FormField'
import { TextInput, NumberInput } from '@/app/admin/_components/forms/Inputs'
import { RichTextEditor } from '@/app/admin/_components/forms/RichTextEditor'
import { FormActions } from '@/app/admin/_components/forms/FormActions'
import { useToast } from '@/app/admin/_components/ui/Toast'
import { saveFaq, deleteFaq } from '@/lib/services/faqs'
import type { Faq } from '@/lib/types'

export interface FaqFormProps {
  faq?: Faq | null
}

export function FaqForm({ faq }: FaqFormProps) {
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
      const res = await saveFaq(faq?.id || null, formData)
      if (res.success) {
        addToast(faq ? 'FAQ updated.' : 'FAQ created.', 'success')
        router.push('/admin/faqs')
        router.refresh()
      } else {
        setError(res.error || 'Failed to save FAQ.')
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : "An unknown error occurred") || 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!faq?.id) return
    const res = await deleteFaq(faq.id)
    if (res.success) {
      addToast('FAQ deleted.', 'success')
      router.push('/admin/faqs')
      router.refresh()
    } else {
      addToast(res.error || 'Failed to delete FAQ.', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm max-w-3xl">
      {error && <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">{error}</div>}

      <FormField label="Question" required>
        <TextInput name="question" defaultValue={faq?.question || ''} required placeholder="e.g. What is check-in time and how do transfers work?" />
      </FormField>

      <FormField label="Display Sort Order">
        <NumberInput name="order" defaultValue={faq?.order ?? 0} />
      </FormField>

      <FormField label="Answer (Rich Text)" required>
        <RichTextEditor
          name="answer"
          defaultValue={faq?.answer}
        />
      </FormField>

      <FormActions
        isSubmitting={isSubmitting}
        cancelHref="/admin/faqs"
        saveLabel={faq ? 'Update FAQ' : 'Create FAQ'}
        onDelete={faq ? handleDelete : undefined}
        deleteMessage={`Are you sure you want to delete this FAQ: "${faq?.question}"?`}
      />
    </form>
  )
}
