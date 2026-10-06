'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '../db/connect'
import { GalleryImageModel } from '../db/models'
import { serializeDoc, serializeDocs } from '../db/serialize'
import { requireAdmin } from '../auth/guard'
import type { GalleryImage } from '../types'

export async function getAdminGalleryImages(options?: {
  category?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{ docs: GalleryImage[]; total: number; totalPages: number }> {
  await requireAdmin()
  await connectDB()

  const page = Math.max(1, options?.page || 1)
  const limit = Math.max(1, Math.min(100, options?.limit || 24))
  const skip = (page - 1) * limit

  const query: Record<string, unknown> = {}
  if (options?.category && options.category !== 'all') {
    query.category = options.category
  }
  if (options?.search && options.search.trim()) {
    query.caption = { $regex: options.search.trim(), $options: 'i' }
  }

  const [docs, total] = await Promise.all([
    GalleryImageModel.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).populate('image').lean(),
    GalleryImageModel.countDocuments(query),
  ])

  return {
    docs: serializeDocs<GalleryImage>(docs),
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getAdminGalleryImageById(id: string): Promise<GalleryImage | null> {
  await requireAdmin()
  await connectDB()
  const doc = await GalleryImageModel.findById(id).populate('image').lean()
  return serializeDoc<GalleryImage>(doc) ?? null
}

export async function saveGalleryImage(
  id: string | null,
  formData: FormData
): Promise<{ success: boolean; id?: string; error?: string }> {
  await requireAdmin()
  await connectDB()

  const image = String(formData.get('image') || '').trim()
  const caption = String(formData.get('caption') || '').trim()
  const category = (formData.get('category') as any) || 'resort'
  const order = Number(formData.get('order') || 0)

  if (!image) return { success: false, error: 'Image selection is required.' }

  const data = {
    image,
    caption: caption || undefined,
    category,
    order,
  }

  try {
    let savedId = id
    if (id) {
      await GalleryImageModel.findByIdAndUpdate(id, data)
    } else {
      const created = await GalleryImageModel.create(data)
      savedId = created._id.toString()
    }

    revalidatePath('/[locale]/gallery', 'page')
    return { success: true, id: savedId! }
  } catch (err: unknown) {
    return { success: false, error: (err instanceof Error ? err.message : "An unknown error occurred") || 'Failed to save gallery image.' }
  }
}

export async function deleteGalleryImage(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await connectDB()
  try {
    await GalleryImageModel.findByIdAndDelete(id)
    revalidatePath('/[locale]/gallery', 'page')
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: (err instanceof Error ? err.message : "An unknown error occurred") || 'Failed to delete gallery image.' }
  }
}
