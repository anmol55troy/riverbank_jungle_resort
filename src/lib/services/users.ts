'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '../db/connect'
import { UserModel } from '../db/models'
import { serializeDoc, serializeDocs } from '../db/serialize'
import { requireAdmin, getCurrentUser } from '../auth/guard'
import { hashPassword } from '../auth/password'
import { revokeAllUserSessions } from '../auth/session'
import type { User } from '../types'

export async function getAdminUsers(options?: {
  search?: string
  page?: number
  limit?: number
}): Promise<{ docs: User[]; total: number; totalPages: number }> {
  await requireAdmin()
  await connectDB()

  const page = Math.max(1, options?.page || 1)
  const limit = Math.max(1, Math.min(100, options?.limit || 20))
  const skip = (page - 1) * limit

  const query: Record<string, unknown> = {}
  if (options?.search && options.search.trim()) {
    const s = options.search.trim()
    query.$or = [
      { name: { $regex: s, $options: 'i' } },
      { email: { $regex: s, $options: 'i' } },
    ]
  }

  const [docs, total] = await Promise.all([
    UserModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    UserModel.countDocuments(query),
  ])

  return {
    docs: serializeDocs<User>(docs),
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getAdminUserById(id: string): Promise<User | null> {
  await requireAdmin()
  await connectDB()
  const doc = await UserModel.findById(id).lean()
  return serializeDoc<User>(doc) ?? null
}

export async function saveAdminUser(
  id: string | null,
  formData: FormData
): Promise<{ success: boolean; id?: string; error?: string }> {
  await requireAdmin()
  await connectDB()

  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '').trim()

  if (!email) return { success: false, error: 'Email is required.' }

  const existing = await UserModel.findOne({ email, ...(id ? { _id: { $ne: id } } : {}) })
  if (existing) {
    return { success: false, error: `A user with email "${email}" already exists.` }
  }

  if (!id && !password) {
    return { success: false, error: 'Password is required for new users.' }
  }

  if (password && password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters long.' }
  }

  const data: Record<string, unknown> = {
    name: name || undefined,
    email,
    role: 'admin',
  }

  if (password) {
    data.passwordHash = await hashPassword(password)
    data.$unset = { hash: 1, salt: 1 }
  }

  try {
    let savedId = id
    if (id) {
      await UserModel.findByIdAndUpdate(id, data)
      if (password) {
        // Revoke active sessions so they log in with new password
        await revokeAllUserSessions(id)
      }
    } else {
      const created = await UserModel.create(data)
      savedId = created._id.toString()
    }

    revalidatePath('/admin/users')
    return { success: true, id: savedId! }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save user.' }
  }
}

export async function deleteAdminUser(id: string): Promise<{ success: boolean; error?: string }> {
  const current = await getCurrentUser()
  if (!current) return { success: false, error: 'Not authenticated.' }

  if (current.id === id) {
    return { success: false, error: 'You cannot delete your own account.' }
  }

  await connectDB()
  const totalUsers = await UserModel.countDocuments()
  if (totalUsers <= 1) {
    return { success: false, error: 'Cannot delete the only remaining admin user.' }
  }

  try {
    await UserModel.findByIdAndDelete(id)
    await revokeAllUserSessions(id)
    revalidatePath('/admin/users')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete user.' }
  }
}
