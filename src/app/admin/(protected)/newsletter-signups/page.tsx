import React from 'react'
import { NewsletterSignupsClient } from './NewsletterSignupsClient'
import { getAdminNewsletterSignups } from '@/lib/services/submissions'

export const dynamic = 'force-dynamic'

export default async function AdminNewsletterSignupsPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const searchParams = await props.searchParams
  const q = searchParams.q || ''
  const page = Number(searchParams.page || 1)

  const { docs, total, totalPages } = await getAdminNewsletterSignups({
    search: q,
    page,
    limit: 50,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light text-gray-900">Newsletter Subscribers</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Mailing list subscribers collected from footer & newsletter signup forms
          </p>
        </div>
      </div>

      <NewsletterSignupsClient
        initialDocs={docs}
        total={total}
        totalPages={totalPages}
        currentPage={page}
        searchQuery={q}
      />
    </div>
  )
}
