import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAdminGalleryImages } from '@/lib/services/gallery'
import { SearchBar } from '@/app/admin/_components/tables/SearchBar'
import { Pagination } from '@/app/admin/_components/tables/Pagination'
import { Badge } from '@/app/admin/_components/ui/Badge'
import type { Media } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminGalleryPage(props: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>
}) {
  const searchParams = await props.searchParams
  const q = searchParams.q || ''
  const category = searchParams.category || 'all'
  const page = Number(searchParams.page || 1)

  const { docs: images, total, totalPages } = await getAdminGalleryImages({
    search: q,
    category,
    page,
    limit: 20,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-light text-gray-900">Resort Photo Gallery</h1>
          <p className="text-xs text-gray-500">Manage resort image showcase categorized by rooms, wildlife, culture, and dining.</p>
        </div>
        <Link
          href="/admin/gallery-images/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          + Add Gallery Image
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar placeholder="Search captions..." />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((item) => {
              const img = item.image as Media | undefined
              const thumb = img?.thumbnailURL || img?.url

              return (
                <Link
                  key={item.id}
                  href={`/admin/gallery-images/${item.id}`}
                  className="group relative rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-sm bg-gray-50 transition-all flex flex-col"
                >
                  <div className="relative aspect-4/3 w-full bg-gray-100">
                    {thumb && (
                      <Image
                        src={thumb}
                        alt={item.caption || 'Gallery photo'}
                        fill
                        sizes="250px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-1">
                    <p className="text-xs font-medium text-gray-900 line-clamp-1">
                      {item.caption || 'No caption'}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <Badge variant="default" size="sm">
                        {item.category}
                      </Badge>
                      <span className="text-[10px] text-gray-400">Order {item.order ?? 0}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-gray-500">
            No gallery images found.
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} />
      </div>
    </div>
  )
}
