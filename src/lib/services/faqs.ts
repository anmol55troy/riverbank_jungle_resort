'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '../db/connect'
import { FaqModel } from '../db/models'
import { serializeDoc, serializeDocs } from '../db/serialize'
import { requireAdmin } from '../auth/guard'
import type { Faq } from '../types'
import { parseLexicalJson, parseStringField, parseNumberField } from '../utils/form'

export async function getAdminFaqs(options?: {
  search?: string
  page?: number
  limit?: number
}): Promise<{ docs: Faq[]; total: number; totalPages: number }> {
  await requireAdmin()
  await connectDB()

  const page = Math.max(1, options?.page || 1)
  const limit = Math.max(1, Math.min(100, options?.limit || 20))
  const skip = (page - 1) * limit

  const query: Record<string, unknown> = {}
  if (options?.search && options.search.trim()) {
    query.question = { $regex: options.search.trim(), $options: 'i' }
  }

  const [docs, total] = await Promise.all([
    FaqModel.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    FaqModel.countDocuments(query),
  ])

  return {
    docs: serializeDocs<Faq>(docs),
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getAdminFaqById(id: string): Promise<Faq | null> {
  await requireAdmin()
  await connectDB()
  const doc = await FaqModel.findById(id).lean()
  return serializeDoc<Faq>(doc) ?? null
}

export async function saveFaq(
  id: string | null,
  formData: FormData
): Promise<{ success: boolean; id?: string; error?: string }> {
  await requireAdmin()
  await connectDB()

  const question = parseStringField(formData, 'question')
  const rawAnswer = parseStringField(formData, 'answer')
  const order = parseNumberField(formData, 'order', 0)

  if (!question) return { success: false, error: 'Question is required.' }

  const answerObj = parseLexicalJson(rawAnswer)

  const data = {
    question,
    answer: answerObj,
    order,
  }

  try {
    let savedId = id
    if (id) {
      await FaqModel.findByIdAndUpdate(id, data)
    } else {
      const created = await FaqModel.create(data)
      savedId = created._id.toString()
    }

    revalidatePath('/[locale]/contact', 'page')
    revalidatePath('/[locale]', 'page')
    return { success: true, id: savedId! }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save FAQ.' }
  }
}

export async function deleteFaq(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await connectDB()
  try {
    await FaqModel.findByIdAndDelete(id)
    revalidatePath('/[locale]/contact', 'page')
    revalidatePath('/[locale]', 'page')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete FAQ.' }
  }
}
