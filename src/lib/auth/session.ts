import crypto from 'crypto'
import { cookies } from 'next/headers'
import { connectDB } from '../db/connect'
import { AdminSessionModel } from '../db/models'
import { serializeDoc } from '../db/serialize'
import type { User } from '../types'

const COOKIE_NAME = 'admin_session_token'
const SESSION_DURATION_HOURS = Number(process.env.ADMIN_SESSION_HOURS || 8)

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export async function createSession(userId: string, reqInfo?: { ip?: string; userAgent?: string }): Promise<string> {
  await connectDB()
  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = hashToken(rawToken)

  const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000)

  await AdminSessionModel.create({
    tokenHash,
    userId,
    expiresAt,
    ip: reqInfo?.ip,
    userAgent: reqInfo?.userAgent,
  })

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })

  return rawToken
}

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  await connectDB()
  const tokenHash = hashToken(token)

  const session = await AdminSessionModel.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
  }).populate('userId')

  if (!session || !session.userId) {
    return null
  }

  return serializeDoc<User>(session.userId)
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (token) {
    await connectDB()
    const tokenHash = hashToken(token)
    await AdminSessionModel.deleteOne({ tokenHash })
  }

  cookieStore.delete(COOKIE_NAME)
}

export async function revokeAllUserSessions(userId: string): Promise<void> {
  await connectDB()
  await AdminSessionModel.deleteMany({ userId })
}
