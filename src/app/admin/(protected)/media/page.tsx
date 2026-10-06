import React from 'react'
import { MediaManagerClient } from './MediaManagerClient'
import { getMediaList } from '@/lib/services/media'

export const dynamic = 'force-dynamic'

export default async function AdminMediaPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const searchParams = await props.searchParams
  const q = searchParams.q || ''
  const page = Number(searchParams.page || 1)

  const { docs, total, totalPages } = await getMediaList({ search: q, page, limit: 24 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light text-gray-900">Media Library</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage resort photography, room imagery, and banner assets hosted on the server
          </p>
        </div>
      </div>

      <MediaManagerClient
        initialDocs={docs}
        total={total}
        totalPages={totalPages}
        currentPage={page}
        searchQuery={q}
      />
    </div>
  )
}
