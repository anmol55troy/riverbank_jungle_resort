'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '../db/connect'
import { OfferModel } from '../db/models'
import { serializeDoc, serializeDocs } from '../db/serialize'
import { requireAdmin } from '../auth/guard'
import { generateSlug } from '../validation/slug'
import type { Offer } from '../types'
import { parseLexicalJson, parseStringField } from '../utils/form'

export async function getAdminOffers(options?: {
  search?: string
  page?: number
  limit?: number
}): Promise<{ docs: Offer[]; total: number; totalPages: number }> {
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
    OfferModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('image').lean(),
    OfferModel.countDocuments(query),
  ])

  return {
    docs: serializeDocs<Offer>(docs),
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getAdminOfferById(id: string): Promise<Offer | null> {
  await requireAdmin()
  await connectDB()
  const doc = await OfferModel.findById(id).populate('image').lean()
  return serializeDoc<Offer>(doc) ?? null
}

export async function saveOffer(
  id: string | null,
  formData: FormData
): Promise<{ success: boolean; id?: string; error?: string }> {
  await requireAdmin()
  await connectDB()

  const title = parseStringField(formData, 'title')
  const rawSlug = parseStringField(formData, 'slug')
  const active = formData.get('active') === 'on' || formData.get('active') === 'true'
  const validFrom = formData.get('validFrom') ? new Date(String(formData.get('validFrom'))) : undefined
  const validUntil = formData.get('validUntil') ? new Date(String(formData.get('validUntil'))) : undefined
  const rawDescription = parseStringField(formData, 'description')
  const image = parseStringField(formData, 'image')

  if (!title) return { success: false, error: 'Title is required.' }

  const slug = generateSlug(rawSlug, title)
  const existing = await OfferModel.findOne({ slug, ...(id ? { _id: { $ne: id } } : {}) })
  if (existing) {
    return { success: false, error: `An offer with the slug "${slug}" already exists.` }
  }

  const descriptionObj = parseLexicalJson(rawDescription)

  const data: Record<string, unknown> = {
    title,
    slug,
    active,
    validFrom,
    validUntil,
    description: descriptionObj,
    image: image || undefined,
  }

  try {
    let savedId = id
    if (id) {
      await OfferModel.findByIdAndUpdate(id, data)
    } else {
      const created = await OfferModel.create(data)
      savedId = created._id.toString()
    }

    revalidatePath('/[locale]/offers', 'page')
    revalidatePath('/[locale]', 'page')
    revalidatePath('/sitemap.xml')

    return { success: true, id: savedId! }
  } catch (err: unknown) {
    return { success: false, error: (err instanceof Error ? err.message : "An unknown error occurred") || 'Failed to save offer.' }
  }
}

export async function deleteOffer(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await connectDB()
  try {
    await OfferModel.findByIdAndDelete(id)
    revalidatePath('/[locale]/offers', 'page')
    revalidatePath('/[locale]', 'page')
    revalidatePath('/sitemap.xml')
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: (err instanceof Error ? err.message : "An unknown error occurred") || 'Failed to delete offer.' }
  }
}
