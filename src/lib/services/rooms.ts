'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '../db/connect'
import { RoomModel } from '../db/models'
import { serializeDoc, serializeDocs } from '../db/serialize'
import { requireAdmin } from '../auth/guard'
import { generateSlug } from '../validation/slug'
import type { Room } from '../types'
import { parseLexicalJson, parseJsonField, parseNumberField, parseStringField } from '../utils/form'

export async function getAdminRooms(options?: {
  search?: string
  page?: number
  limit?: number
}): Promise<{ docs: Room[]; total: number; totalPages: number }> {
  await requireAdmin()
  await connectDB()

  const page = Math.max(1, options?.page || 1)
  const limit = Math.max(1, Math.min(100, options?.limit || 20))
  const skip = (page - 1) * limit

  const query: Record<string, unknown> = {}
  if (options?.search && options.search.trim()) {
    query.title = { $regex: options.search.trim(), $options: 'i' }
  }

  const [docs, total] = await Promise.all([
    RoomModel.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    RoomModel.countDocuments(query),
  ])

  return {
    docs: serializeDocs<Room>(docs),
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getAdminRoomById(id: string): Promise<Room | null> {
  await requireAdmin()
  await connectDB()
  const doc = await RoomModel.findById(id).populate('amenities').populate('gallery.image').lean()
  return serializeDoc<Room>(doc) ?? null
}

export async function saveRoom(
  id: string | null,
  formData: FormData
): Promise<{ success: boolean; id?: string; error?: string }> {
  await requireAdmin()
  await connectDB()

  const title = parseStringField(formData, 'title')
  const rawSlug = parseStringField(formData, 'slug')
  const shortDescription = parseStringField(formData, 'shortDescription')
  const rawDescription = parseStringField(formData, 'description')
  const order = parseNumberField(formData, 'order', 0)
  const priceAmount = parseNumberField(formData, 'priceAmount')
  const priceCurrency = parseStringField(formData, 'priceCurrency', 'USD') as 'USD' | 'NPR'

  const amenities = formData.getAll('amenities') as string[]

  if (!title) return { success: false, error: 'Title is required.' }
  if (!shortDescription) return { success: false, error: 'Short description is required.' }

  const slug = generateSlug(rawSlug, title)
  const existing = await RoomModel.findOne({ slug, ...(id ? { _id: { $ne: id } } : {}) })
  if (existing) {
    return { success: false, error: `A room with the slug "${slug}" already exists.` }
  }

  const descriptionObj = parseLexicalJson(rawDescription)
  const features = parseJsonField(parseStringField(formData, 'features', '[]'))
  const gallery = parseJsonField(parseStringField(formData, 'gallery', '[]'))

  const data: Record<string, unknown> = {
    title,
    slug,
    shortDescription,
    description: descriptionObj,
    order,
    features,
    amenities: amenities.filter(Boolean),
    gallery: Array.isArray(gallery) ? gallery.filter((g: any) => g.image) : [],
    priceFrom: priceAmount !== undefined ? { amount: priceAmount, currency: priceCurrency } : undefined,
  }

  try {
    let savedId = id
    if (id) {
      await RoomModel.findByIdAndUpdate(id, data)
    } else {
      const created = await RoomModel.create(data)
      savedId = created._id.toString()
    }

    revalidatePath('/[locale]/rooms', 'page')
    revalidatePath(`/[locale]/rooms/${slug}`, 'page')
    revalidatePath('/[locale]', 'page')
    revalidatePath('/sitemap.xml')

    return { success: true, id: savedId! }
  } catch (err: unknown) {
    return { success: false, error: (err instanceof Error ? err.message : "An unknown error occurred") || 'Failed to save room.' }
  }
}

export async function deleteRoom(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await connectDB()

  try {
    const doc = await RoomModel.findByIdAndDelete(id)
    if (doc?.slug) {
      revalidatePath('/[locale]/rooms', 'page')
      revalidatePath(`/[locale]/rooms/${doc.slug}`, 'page')
      revalidatePath('/[locale]', 'page')
      revalidatePath('/sitemap.xml')
    }
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: (err instanceof Error ? err.message : "An unknown error occurred") || 'Failed to delete room.' }
  }
}
