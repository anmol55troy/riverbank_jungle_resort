'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '../db/connect'
import { EventVenueModel } from '../db/models'
import { serializeDoc, serializeDocs } from '../db/serialize'
import { requireAdmin } from '../auth/guard'
import { generateSlug } from '../validation/slug'
import type { EventVenue } from '../types'
import { parseLexicalJson, parseStringField, parseNumberField } from '../utils/form'

export async function getAdminEventVenues(options?: {
  search?: string
  page?: number
  limit?: number
}): Promise<{ docs: EventVenue[]; total: number; totalPages: number }> {
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
    EventVenueModel.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).populate('image').lean(),
    EventVenueModel.countDocuments(query),
  ])

  return {
    docs: serializeDocs<EventVenue>(docs),
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getAdminEventVenueById(id: string): Promise<EventVenue | null> {
  await requireAdmin()
  await connectDB()
  const doc = await EventVenueModel.findById(id).populate('image').lean()
  return serializeDoc<EventVenue>(doc) ?? null
}

export async function saveEventVenue(
  id: string | null,
  formData: FormData
): Promise<{ success: boolean; id?: string; error?: string }> {
  await requireAdmin()
  await connectDB()

  const title = parseStringField(formData, 'title')
  const rawSlug = parseStringField(formData, 'slug')
  const shortDescription = parseStringField(formData, 'shortDescription')
  const rawDescription = parseStringField(formData, 'description')
  const duration = parseStringField(formData, 'duration')
  const image = parseStringField(formData, 'image')
  const order = parseNumberField(formData, 'order', 0)
  
  // New fields
  const hallSize = parseStringField(formData, 'hallSize')
  const uSetup = parseStringField(formData, 'uSetup')
  const classroomSetup = parseStringField(formData, 'classroomSetup')
  const theaterSetup = parseStringField(formData, 'theaterSetup')
  const roundTableSetup = parseStringField(formData, 'roundTableSetup')
  
  // Amenities come in as multiple values or comma separated depending on the form, we can just split by comma or take all.
  // Assuming a textarea for amenities (comma-separated for simplicity in the form).
  const amenitiesStr = parseStringField(formData, 'amenities')
  const amenities = amenitiesStr ? amenitiesStr.split(',').map(s => s.trim()).filter(Boolean) : []

  // Gallery
  const rawGallery = parseStringField(formData, 'gallery')
  const galleryIds = rawGallery ? rawGallery.split(',').filter(Boolean) : []
  const gallery = galleryIds.map(imgId => ({ image: imgId }))

  if (!title) return { success: false, error: 'Title is required.' }
  if (!shortDescription) return { success: false, error: 'Short description is required.' }

  const slug = generateSlug(rawSlug, title)
  const existing = await EventVenueModel.findOne({ slug, ...(id ? { _id: { $ne: id } } : {}) })
  if (existing) {
    return { success: false, error: `An eventVenue with the slug "${slug}" already exists.` }
  }

  const descriptionObj = rawDescription ? parseLexicalJson(rawDescription) : undefined

  const data: Record<string, unknown> = {
    title,
    slug,
    shortDescription,
    description: descriptionObj,
    duration: duration || undefined,
    image: image || undefined,
    hallSize: hallSize || undefined,
    uSetup: uSetup || undefined,
    classroomSetup: classroomSetup || undefined,
    theaterSetup: theaterSetup || undefined,
    roundTableSetup: roundTableSetup || undefined,
    amenities: amenities.length > 0 ? amenities : undefined,
    gallery: gallery.length > 0 ? gallery : undefined,
    order,
  }

  try {
    let savedId = id
    if (id) {
      await EventVenueModel.findByIdAndUpdate(id, data)
    } else {
      const created = await EventVenueModel.create(data)
      savedId = created._id.toString()
    }

    revalidatePath('/[locale]/eventVenues', 'page')
    revalidatePath('/[locale]', 'page')
    revalidatePath('/sitemap.xml')

    return { success: true, id: savedId! }
  } catch (err: unknown) {
    return { success: false, error: (err instanceof Error ? err.message : "An unknown error occurred") || 'Failed to save eventVenue.' }
  }
}

export async function deleteEventVenue(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await connectDB()
  try {
    await EventVenueModel.findByIdAndDelete(id)
    revalidatePath('/[locale]/eventVenues', 'page')
    revalidatePath('/[locale]', 'page')
    revalidatePath('/sitemap.xml')
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: (err instanceof Error ? err.message : "An unknown error occurred") || 'Failed to delete eventVenue.' }
  }
}
