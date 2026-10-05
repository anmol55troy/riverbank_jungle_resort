'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '../db/connect'
import { BlogPostModel } from '../db/models'
import { serializeDoc, serializeDocs } from '../db/serialize'
import { requireAdmin } from '../auth/guard'
import { generateSlug } from '../validation/slug'
import type { BlogPost } from '../types'

export async function getAdminBlogPosts(options?: {
  search?: string
  page?: number
  limit?: number
}): Promise<{ docs: BlogPost[]; total: number; totalPages: number }> {
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
    BlogPostModel.find(query).sort({ publishedDate: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    BlogPostModel.countDocuments(query),
  ])

  return {
    docs: serializeDocs<BlogPost>(docs),
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getAdminBlogPostById(id: string): Promise<BlogPost | null> {
  await requireAdmin()
  await connectDB()
  const doc = await BlogPostModel.findById(id)
    .populate('coverImage')
    .populate('relatedRooms')
    .populate('relatedExperiences')
    .lean()
  return serializeDoc<BlogPost>(doc) ?? null
}

export async function saveBlogPost(
  id: string | null,
  formData: FormData
): Promise<{ success: boolean; id?: string; error?: string }> {
  await requireAdmin()
  await connectDB()

  const title = String(formData.get('title') || '').trim()
  const rawSlug = String(formData.get('slug') || '').trim()
  const excerpt = String(formData.get('excerpt') || '').trim()
  const rawBody = String(formData.get('body') || '').trim()
  const coverImage = String(formData.get('coverImage') || '').trim()
  const author = String(formData.get('author') || 'River Bank Jungle Resort').trim()
  const publishedDate = formData.get('publishedDate')
    ? new Date(String(formData.get('publishedDate')))
    : new Date()
  const category = (formData.get('category') as any) || 'travel-guide'

  const relatedRooms = formData.getAll('relatedRooms') as string[]
  const relatedExperiences = formData.getAll('relatedExperiences') as string[]

  if (!title) return { success: false, error: 'Title is required.' }
  if (!excerpt) return { success: false, error: 'Excerpt is required.' }

  const slug = generateSlug(rawSlug, title)
  const existing = await BlogPostModel.findOne({ slug, ...(id ? { _id: { $ne: id } } : {}) })
  if (existing) {
    return { success: false, error: `A blog post with the slug "${slug}" already exists.` }
  }

  let bodyObj: any = { root: { type: 'root', children: [], direction: 'ltr', format: '', indent: 0, version: 1 } }
  try {
    if (rawBody) bodyObj = JSON.parse(rawBody)
  } catch {
    bodyObj = {
      root: {
        type: 'root',
        children: [{ type: 'paragraph', children: [{ type: 'text', text: rawBody, version: 1 }], version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    }
  }

  const data: Record<string, unknown> = {
    title,
    slug,
    excerpt,
    body: bodyObj,
    coverImage: coverImage || undefined,
    author,
    publishedDate,
    category,
    relatedRooms: relatedRooms.filter(Boolean),
    relatedExperiences: relatedExperiences.filter(Boolean),
  }

  try {
    let savedId = id
    if (id) {
      await BlogPostModel.findByIdAndUpdate(id, data)
    } else {
      const created = await BlogPostModel.create(data)
      savedId = created._id.toString()
    }

    revalidatePath('/[locale]/blog', 'page')
    revalidatePath(`/[locale]/blog/${slug}`, 'page')
    revalidatePath('/[locale]', 'page')
    revalidatePath('/sitemap.xml')

    return { success: true, id: savedId! }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save blog post.' }
  }
}

export async function deleteBlogPost(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await connectDB()
  try {
    const doc = await BlogPostModel.findByIdAndDelete(id)
    if (doc?.slug) {
      revalidatePath('/[locale]/blog', 'page')
      revalidatePath(`/[locale]/blog/${doc.slug}`, 'page')
      revalidatePath('/[locale]', 'page')
      revalidatePath('/sitemap.xml')
    }
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete post.' }
  }
}
