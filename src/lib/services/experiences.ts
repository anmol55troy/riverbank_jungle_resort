'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '../db/connect'
import { ExperienceModel } from '../db/models'
import { serializeDoc, serializeDocs } from '../db/serialize'
import { requireAdmin } from '../auth/guard'
import { generateSlug } from '../validation/slug'
import type { Experience } from '../types'

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
    ExperienceModel.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
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

  const title = String(formData.get('title') || '').trim()
  const rawSlug = String(formData.get('slug') || '').trim()
  const shortDescription = String(formData.get('shortDescription') || '').trim()
  const rawDescription = String(formData.get('description') || '').trim()
  const duration = String(formData.get('duration') || '').trim()
  const image = String(formData.get('image') || '').trim()
  const order = Number(formData.get('order') || 0)

  if (!title) return { success: false, error: 'Title is required.' }
  if (!shortDescription) return { success: false, error: 'Short description is required.' }

  const slug = generateSlug(rawSlug, title)
  const existing = await ExperienceModel.findOne({ slug, ...(id ? { _id: { $ne: id } } : {}) })
  if (existing) {
    return { success: false, error: `An experience with the slug "${slug}" already exists.` }
  }

  let descriptionObj: any = undefined
  if (rawDescription) {
    try {
      descriptionObj = JSON.parse(rawDescription)
    } catch {
      descriptionObj = {
        root: {
          type: 'root',
          children: [{ type: 'paragraph', children: [{ type: 'text', text: rawDescription, version: 1 }], version: 1 }],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      }
    }
  }

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
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save experience.' }
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
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete experience.' }
  }
}
