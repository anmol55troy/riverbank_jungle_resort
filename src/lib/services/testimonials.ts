'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '../db/connect'
import { TestimonialModel } from '../db/models'
import { serializeDoc, serializeDocs } from '../db/serialize'
import { requireAdmin } from '../auth/guard'
import type { Testimonial } from '../types'

export async function getAdminTestimonials(options?: {
  search?: string
  page?: number
  limit?: number
}): Promise<{ docs: Testimonial[]; total: number; totalPages: number }> {
  await requireAdmin()
  await connectDB()

  const page = Math.max(1, options?.page || 1)
  const limit = Math.max(1, Math.min(100, options?.limit || 20))
  const skip = (page - 1) * limit

  const query: Record<string, unknown> = {}
  if (options?.search && options.search.trim()) {
    query.$or = [
      { guestName: { $regex: options.search.trim(), $options: 'i' } },
      { quote: { $regex: options.search.trim(), $options: 'i' } },
    ]
  }

  const [docs, total] = await Promise.all([
    TestimonialModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    TestimonialModel.countDocuments(query),
  ])

  return {
    docs: serializeDocs<Testimonial>(docs),
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getAdminTestimonialById(id: string): Promise<Testimonial | null> {
  await requireAdmin()
  await connectDB()
  const doc = await TestimonialModel.findById(id).lean()
  return serializeDoc<Testimonial>(doc) ?? null
}

export async function saveTestimonial(
  id: string | null,
  formData: FormData
): Promise<{ success: boolean; id?: string; error?: string }> {
  await requireAdmin()
  await connectDB()

  const guestName = String(formData.get('guestName') || '').trim()
  const quote = String(formData.get('quote') || '').trim()
  const country = String(formData.get('country') || '').trim()
  const source = String(formData.get('source') || 'tripadvisor').trim()
  const rating = Number(formData.get('rating') || 5)
  const sourceUrl = String(formData.get('sourceUrl') || '').trim()

  if (!guestName) return { success: false, error: 'Guest name is required.' }
  if (!quote) return { success: false, error: 'Quote is required.' }

  const data = {
    guestName,
    quote,
    country: country || undefined,
    source,
    rating,
    sourceUrl: sourceUrl || undefined,
  }

  try {
    let savedId = id
    if (id) {
      await TestimonialModel.findByIdAndUpdate(id, data)
    } else {
      const created = await TestimonialModel.create(data)
      savedId = created._id.toString()
    }

    revalidatePath('/[locale]', 'page')
    return { success: true, id: savedId! }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save review.' }
  }
}

export async function deleteTestimonial(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await connectDB()
  try {
    await TestimonialModel.findByIdAndDelete(id)
    revalidatePath('/[locale]', 'page')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete review.' }
  }
}
