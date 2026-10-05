'use server'

import { redirect } from 'next/navigation'
import { connectDB } from '../db/connect'
import { UserModel } from '../db/models'
import { verifyPassword, hashPassword } from '../auth/password'
import { createSession, destroySession } from '../auth/session'

export type AuthState = {
  success?: boolean
  error?: string
}

export async function loginAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '')

  if (!email || !password) {
    return { error: 'Please enter both email and password.' }
  }

  await connectDB()
  const user = await UserModel.findOne({ email })

  if (!user) {
    return { error: 'Invalid email or password.' }
  }

  // Check lockout
  if (user.lockUntil && user.lockUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / (60 * 1000))
    return { error: `Account locked due to too many failed attempts. Try again in ${minutesLeft} minutes.` }
  }

  const { valid, needsUpgrade } = await verifyPassword(password, {
    passwordHash: user.passwordHash,
    hash: user.hash,
    salt: user.salt,
  })

  if (!valid) {
    const attempts = (user.loginAttempts || 0) + 1
    const updates: Record<string, unknown> = { loginAttempts: attempts }

    if (attempts >= 5) {
      updates.lockUntil = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes lock
    }

    await UserModel.findByIdAndUpdate(user._id, updates)
    return { error: 'Invalid email or password.' }
  }

  // Reset login attempts on success
  const successUpdates: Record<string, unknown> = {
    loginAttempts: 0,
    lockUntil: null,
  }

  // Upgrade legacy PBKDF2 hash to scrypt transparently
  if (needsUpgrade) {
    const newScrypt = await hashPassword(password)
    successUpdates.passwordHash = newScrypt
    successUpdates.$unset = { hash: 1, salt: 1 }
  }

  await UserModel.findByIdAndUpdate(user._id, successUpdates)

  // Create session and set cookie
  await createSession(user._id.toString())

  redirect('/admin')
}

export async function logoutAction(): Promise<void> {
  await destroySession()
  redirect('/admin/login')
}

