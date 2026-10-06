import React from 'react'
import { requireAdmin } from '@/lib/auth/guard'
import { AdminShell } from '@/app/admin/_components/layout/AdminShell'

export const dynamic = 'force-dynamic'

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAdmin()

  return <AdminShell user={user}>{children}</AdminShell>
}
