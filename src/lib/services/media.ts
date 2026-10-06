'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '../db/connect'
import { MediaModel } from '../db/models'
import { serializeDoc, serializeDocs } from '../db/serialize'
import { requireAdmin } from '../auth/guard'
import { uploadToCloudinary, deleteFromCloudinary } from '../cloudinary'
import type { Media } from '../types'

export async function getMediaList(options?: {
  search?: string
  page?: number
  limit?: number
}): Promise<{ docs: Media[]; total: number; totalPages: number }> {
  await connectDB()
  const page = Math.max(1, options?.page || 1)
  const limit = Math.max(1, Math.min(100, options?.limit || 24))
  const skip = (page - 1) * limit

  const query: Record<string, unknown> = {}
  if (options?.search && options.search.trim()) {
    const s = options.search.trim()
    query.$or = [
      { alt: { $regex: s, $options: 'i' } },
      { filename: { $regex: s, $options: 'i' } },
      { caption: { $regex: s, $options: 'i' } },
    ]
  }

  const [docs, total] = await Promise.all([
    MediaModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    MediaModel.countDocuments(query),
  ])

  return {
    docs: serializeDocs<Media>(docs),
    total,
    totalPages: Math.ceil(total / limit),
  }
}


export async function uploadMedia(formData: FormData): Promise<{ success: boolean; media?: Media; error?: string }> {
  await requireAdmin()
  const file = formData.get('file') as File | null
  const alt = String(formData.get('alt') || '').trim()
  const caption = String(formData.get('caption') || '').trim()

  if (!file || file.size === 0) {
    return { success: false, error: 'No file provided.' }
  }

  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'Only image files are allowed.' }
  }

  const effectiveAlt = alt || file.name.replace(/\.[^/.]+$/, '')

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await uploadToCloudinary(buffer)
    
    await connectDB()
    const doc = await MediaModel.create({
      alt: effectiveAlt,
      caption: caption || undefined,
      url: result.secure_url,
      thumbnailURL: result.secure_url, // Cloudinary provides auto-optimization
      filename: result.public_id, // keep as fallback or reference
      mimeType: file.type,
      filesize: result.bytes,
      width: result.width,
      height: result.height,
      provider: 'cloudinary',
      public_id: result.public_id,
    })

    const media = serializeDoc<Media>(doc)
    revalidatePath('/admin/media')
    return { success: true, media }
  } catch (err: any) {
    console.error('Failed to process upload:', err)
    return { success: false, error: err.message || 'Image processing failed.' }
  }
}

export async function updateMedia(
  id: string,
  formData: FormData
): Promise<{ success: boolean; media?: Media; error?: string }> {
  await requireAdmin()
  const alt = String(formData.get('alt') || '').trim()
  const caption = String(formData.get('caption') || '').trim()

  if (!alt) {
    return { success: false, error: 'Alt text is required.' }
  }

  try {
    await connectDB()
    const doc = await MediaModel.findByIdAndUpdate(
      id,
      { alt, caption: caption || undefined },
      { new: true }
    ).lean()

    if (!doc) {
      return { success: false, error: 'Media not found.' }
    }

    revalidatePath('/admin/media')
    return { success: true, media: serializeDoc<Media>(doc) }
  } catch (err: any) {
    return { success: false, error: err.message || 'Update failed.' }
  }
}

export async function deleteMedia(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  try {
    await connectDB()
    const doc = await MediaModel.findById(id)
    if (!doc) {
      return { success: false, error: 'Media not found.' }
    }

    if (doc.provider === 'cloudinary' && doc.public_id) {
      await deleteFromCloudinary(doc.public_id)
    }

    // Delete DB record
    await MediaModel.findByIdAndDelete(id)

    revalidatePath('/admin/media')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Deletion failed.' }
  }
}
