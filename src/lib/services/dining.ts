'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '../db/connect'
import { DiningVenueModel } from '../db/models'
import { serializeDoc, serializeDocs } from '../db/serialize'
import { requireAdmin } from '../auth/guard'
import { generateSlug } from '../validation/slug'
import type { DiningVenue } from '../types'
import { parseLexicalJson, parseJsonField, parseNumberField, parseStringField } from '../utils/form'

export async function getAdminDiningVenues(options?: {
  search?: string
  page?: number
  limit?: number
}): Promise<{ docs: DiningVenue[]; total: number; totalPages: number }> {
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
    DiningVenueModel.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).populate('image').lean(),
    DiningVenueModel.countDocuments(query),
  ])

  return {
    docs: serializeDocs<DiningVenue>(docs),
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getAdminDiningVenueById(id: string): Promise<DiningVenue | null> {
  await requireAdmin()
  await connectDB()
  const doc = await DiningVenueModel.findById(id).populate('image').populate('gallery.image').lean()
  return serializeDoc<DiningVenue>(doc) ?? null
}

export async function saveDiningVenue(
  id: string | null,
  formData: FormData
): Promise<{ success: boolean; id?: string; error?: string }> {
  await requireAdmin()
  await connectDB()

  const title = parseStringField(formData, 'title')
  const rawSlug = parseStringField(formData, 'slug')
  const shortDescription = parseStringField(formData, 'shortDescription')
  const rawDescription = parseStringField(formData, 'description')
  const cuisine = parseStringField(formData, 'cuisine')
  const hours = parseStringField(formData, 'hours')
  const image = parseStringField(formData, 'image')
  const order = parseNumberField(formData, 'order', 0)
  
  if (!title) return { success: false, error: 'Title is required.' }
  if (!shortDescription) return { success: false, error: 'Short description is required.' }

  const slug = generateSlug(rawSlug, title)
  const existing = await DiningVenueModel.findOne({ slug, ...(id ? { _id: { $ne: id } } : {}) })
  if (existing) {
    return { success: false, error: `A dining venue with the slug "${slug}" already exists.` }
  }

  const descriptionObj = parseLexicalJson(rawDescription)
  const gallery = parseJsonField(parseStringField(formData, 'gallery', '[]'))

  const data: Record<string, unknown> = {
    title,
    slug,
    shortDescription,
    description: descriptionObj,
    cuisine: cuisine || undefined,
    hours: hours || undefined,
    image: image || undefined,
    gallery: Array.isArray(gallery) ? gallery.filter((g: any) => g.image) : [],
    order,
  }

  try {
    let savedId = id
    if (id) {
      await DiningVenueModel.findByIdAndUpdate(id, data)
    } else {
      const created = await DiningVenueModel.create(data)
      savedId = created._id.toString()
    }

    revalidatePath('/[locale]/dining', 'page')
    revalidatePath(`/[locale]/dining/${slug}`, 'page')
    revalidatePath('/[locale]', 'page')
    revalidatePath('/sitemap.xml')

    return { success: true, id: savedId! }
  } catch (err: unknown) {
    return { success: false, error: (err instanceof Error ? err.message : "An unknown error occurred") || 'Failed to save venue.' }
  }
}

export async function deleteDiningVenue(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await connectDB()
  try {
    const doc = await DiningVenueModel.findByIdAndDelete(id)
    if (doc?.slug) {
      revalidatePath('/[locale]/dining', 'page')
      revalidatePath(`/[locale]/dining/${doc.slug}`, 'page')
      revalidatePath('/[locale]', 'page')
      revalidatePath('/sitemap.xml')
    }
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: (err instanceof Error ? err.message : "An unknown error occurred") || 'Failed to delete venue.' }
  }
}
