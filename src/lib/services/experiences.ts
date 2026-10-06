'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '../db/connect'
import { ExperienceModel } from '../db/models'
import { serializeDoc, serializeDocs } from '../db/serialize'
import { requireAdmin } from '../auth/guard'
import { generateSlug } from '../validation/slug'
import type { Experience } from '../types'
import { parseLexicalJson, parseStringField, parseNumberField } from '../utils/form'

export async function getAdminExperiences(options?: {
  search?: string
  page?: number
  limit?: number
}): Promise<{ docs: Experience[]; total: number; totalPages: number }> {
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
    ExperienceModel.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).populate('image').lean(),
    ExperienceModel.countDocuments(query),
  ])

  return {
    docs: serializeDocs<Experience>(docs),
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getAdminExperienceById(id: string): Promise<Experience | null> {
  await requireAdmin()
  await connectDB()
  const doc = await ExperienceModel.findById(id).populate('image').lean()
  return serializeDoc<Experience>(doc) ?? null
}

export async function saveExperience(
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

  if (!title) return { success: false, error: 'Title is required.' }
  if (!shortDescription) return { success: false, error: 'Short description is required.' }

  const slug = generateSlug(rawSlug, title)
  const existing = await ExperienceModel.findOne({ slug, ...(id ? { _id: { $ne: id } } : {}) })
  if (existing) {
    return { success: false, error: `An experience with the slug "${slug}" already exists.` }
  }

  const descriptionObj = rawDescription ? parseLexicalJson(rawDescription) : undefined

  const data: Record<string, unknown> = {
    title,
    slug,
    shortDescription,
    description: descriptionObj,
    duration: duration || undefined,
    image: image || undefined,
    order,
  }

  try {
    let savedId = id
    if (id) {
      await ExperienceModel.findByIdAndUpdate(id, data)
    } else {
      const created = await ExperienceModel.create(data)
      savedId = created._id.toString()
    }

    revalidatePath('/[locale]/experiences', 'page')
    revalidatePath('/[locale]', 'page')
    revalidatePath('/sitemap.xml')

    return { success: true, id: savedId! }
  } catch (err: unknown) {
    return { success: false, error: (err instanceof Error ? err.message : "An unknown error occurred") || 'Failed to save experience.' }
  }
}

export async function deleteExperience(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await connectDB()
  try {
    await ExperienceModel.findByIdAndDelete(id)
    revalidatePath('/[locale]/experiences', 'page')
    revalidatePath('/[locale]', 'page')
    revalidatePath('/sitemap.xml')
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: (err instanceof Error ? err.message : "An unknown error occurred") || 'Failed to delete experience.' }
  }
}
