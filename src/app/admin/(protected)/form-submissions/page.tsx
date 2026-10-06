import React from 'react'
import { FormSubmissionsClient } from './FormSubmissionsClient'
import { getAdminSubmissions } from '@/lib/services/submissions'

export const dynamic = 'force-dynamic'

export default async function AdminFormSubmissionsPage(props: {
  searchParams: Promise<{ type?: string; q?: string; page?: string }>
}) {
  const searchParams = await props.searchParams
  const currentType = searchParams.type || 'all'
  const q = searchParams.q || ''
  const page = Number(searchParams.page || 1)

  const { docs, total, totalPages } = await getAdminSubmissions({
    formType: currentType,
    search: q,
    page,
    limit: 20,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light text-gray-900">Form Inquiries</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Incoming contact messages, wedding & event booking inquiries from website visitors
          </p>
        </div>
      </div>

      <FormSubmissionsClient
        initialDocs={docs}
        total={total}
        totalPages={totalPages}
        currentPage={page}
        currentType={currentType}
        searchQuery={q}
      />
    </div>
  )
}
