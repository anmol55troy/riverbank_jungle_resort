'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/app/admin/_components/forms/FormField'
import { TextInput, Textarea, Select, DateInput } from '@/app/admin/_components/forms/Inputs'
import { RichTextEditor } from '@/app/admin/_components/forms/RichTextEditor'
import { MediaPicker } from '@/app/admin/_components/forms/MediaPicker'
import { FormActions } from '@/app/admin/_components/forms/FormActions'
import { useToast } from '@/app/admin/_components/ui/Toast'
import { saveBlogPost, deleteBlogPost } from '@/lib/services/blogs'
import type { BlogPost, Room, Experience } from '@/lib/types'

export interface BlogPostFormProps {
  post?: BlogPost | null
  roomsList: Room[]
  experiencesList: Experience[]
}

export function BlogPostForm({ post, roomsList, experiencesList }: BlogPostFormProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Pre-selected related rooms and experiences
  const initialRooms = new Set((post?.relatedRooms || []).map((r) => (typeof r === 'object' ? r.id : r)))
  const [selectedRooms, setSelectedRooms] = useState<Set<string>>(initialRooms)

  const initialExps = new Set((post?.relatedExperiences || []).map((e) => (typeof e === 'object' ? e.id : e)))
  const [selectedExps, setSelectedExps] = useState<Set<string>>(initialExps)

  const toggleRoom = (id: string) => {
    setSelectedRooms((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleExp = (id: string) => {
    setSelectedExps((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const formatDateForInput = (d?: string | null) => {
    if (!d) return new Date().toISOString().split('T')[0]
    try {
      return new Date(d).toISOString().split('T')[0]
    } catch {
      return new Date().toISOString().split('T')[0]
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.delete('relatedRooms')
    selectedRooms.forEach((id) => formData.append('relatedRooms', id))

    formData.delete('relatedExperiences')
    selectedExps.forEach((id) => formData.append('relatedExperiences', id))

    try {
      const res = await saveBlogPost(post?.id || null, formData)
      if (res.success) {
        addToast(post ? 'Article updated.' : 'Article created.', 'success')
        router.push('/admin/blog-posts')
        router.refresh()
      } else {
        setError(res.error || 'Failed to save blog post.')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!post?.id) return
    const res = await deleteBlogPost(post.id)
    if (res.success) {
      addToast('Article deleted.', 'success')
      router.push('/admin/blog-posts')
      router.refresh()
    } else {
      addToast(res.error || 'Failed to delete post.', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-espresso/10 p-6 sm:p-8 space-y-6 shadow-xs">
      {error && <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Article Title" required>
          <TextInput name="title" defaultValue={post?.title || ''} required placeholder="e.g. Best Time to Visit Chitwan" />
        </FormField>

        <FormField label="URL Slug" description="Leave empty to auto-generate from title">
          <TextInput name="slug" defaultValue={post?.slug || ''} placeholder="e.g. best-time-to-visit-chitwan" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <FormField label="Category">
          <Select
            name="category"
            defaultValue={post?.category || 'travel-guide'}
            options={[
              { label: 'Travel Guide', value: 'travel-guide' },
              { label: 'Wildlife & Nature', value: 'wildlife' },
              { label: 'Culture & Community', value: 'culture' },
              { label: 'Resort News', value: 'resort-news' },
            ]}
          />
        </FormField>

        <FormField label="Published Date" required>
          <DateInput name="publishedDate" defaultValue={formatDateForInput(post?.publishedDate)} required />
        </FormField>

        <FormField label="Author">
          <TextInput name="author" defaultValue={post?.author || 'River Bank Jungle Resort'} />
        </FormField>
      </div>

      <FormField label="Excerpt / Meta Description" required description="Shown on blog cards and used as SEO meta description">
        <Textarea name="excerpt" defaultValue={post?.excerpt || ''} required rows={2} />
      </FormField>

      <FormField label="Article Body" required>
        <RichTextEditor name="body" defaultValue={post?.body} />
      </FormField>

      <div className="pt-4 border-t border-espresso/10">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-espresso/80 mb-2">Featured Cover Image</h3>
        <MediaPicker name="coverImage" defaultValue={post?.coverImage as any} label="Select Cover Image" />
      </div>

      {/* Cross-linking: Related Rooms & Experiences */}
      <div className="pt-4 border-t border-espresso/10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-espresso/80">Cross-Link Rooms (SEO)</h3>
          <p className="text-[11px] text-espresso/60 mb-2">Select rooms featured in or relevant to this article.</p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto p-2 border border-espresso/15 rounded-xl bg-ivory/30">
            {roomsList.map((r) => {
              const checked = selectedRooms.has(r.id)
              return (
                <label
                  key={r.id}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer border transition-colors ${
                    checked ? 'bg-espresso text-ivory border-espresso font-medium' : 'bg-white text-espresso border-espresso/10 hover:bg-cream/40'
                  }`}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggleRoom(r.id)} className="sr-only" />
                  <span className="truncate">{r.title}</span>
                </label>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-espresso/80">Cross-Link Experiences (SEO)</h3>
          <p className="text-[11px] text-espresso/60 mb-2">Select experiences featured in or relevant to this article.</p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto p-2 border border-espresso/15 rounded-xl bg-ivory/30">
            {experiencesList.map((e) => {
              const checked = selectedExps.has(e.id)
              return (
                <label
                  key={e.id}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer border transition-colors ${
                    checked ? 'bg-espresso text-ivory border-espresso font-medium' : 'bg-white text-espresso border-espresso/10 hover:bg-cream/40'
                  }`}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggleExp(e.id)} className="sr-only" />
                  <span className="truncate">{e.title}</span>
                </label>
              )
            })}
          </div>
        </div>
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        cancelHref="/admin/blog-posts"
        saveLabel={post ? 'Update Article' : 'Publish Article'}
        onDelete={post ? handleDelete : undefined}
        deleteMessage={`Are you sure you want to delete "${post?.title}"?`}
      />
    </form>
  )
}
