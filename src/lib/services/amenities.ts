'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '../db/connect'
import { AmenityModel } from '../db/models'
import { serializeDocs } from '../db/serialize'
import { requireAdmin } from '../auth/guard'
import type { Amenity } from '../types'


export async function getAllAmenities(): Promise<Amenity[]> {
  await connectDB()
  const docs = await AmenityModel.find({}).sort({ name: 1 }).lean()
  return serializeDocs<Amenity>(docs)
}

export async function saveAmenity(
  id: string | null,
  formData: FormData
): Promise<{ success: boolean; id?: string; error?: string }> {
  await requireAdmin()
  await connectDB()

  const name = String(formData.get('name') || '').trim()
  if (!name) return { success: false, error: 'Amenity name is required.' }

  const existing = await AmenityModel.findOne({ name, ...(id ? { _id: { $ne: id } } : {}) })
  if (existing) {
    return { success: false, error: `An amenity named "${name}" already exists.` }
  }

  try {
    let savedId = id
    if (id) {
      await AmenityModel.findByIdAndUpdate(id, { name })
    } else {
      const created = await AmenityModel.create({ name })
      savedId = created._id.toString()
    }

    revalidatePath('/[locale]/rooms', 'page')
    return { success: true, id: savedId! }
  } catch (err: unknown) {
    return { success: false, error: (err instanceof Error ? err.message : "An unknown error occurred") || 'Failed to save amenity.' }
  }
}

export async function deleteAmenity(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await connectDB()
  try {
    await AmenityModel.findByIdAndDelete(id)
    revalidatePath('/[locale]/rooms', 'page')
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: (err instanceof Error ? err.message : "An unknown error occurred") || 'Failed to delete amenity.' }
  }
}
