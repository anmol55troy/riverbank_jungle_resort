import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAdminGalleryImages } from '@/lib/services/gallery'
import { SearchBar } from '@/components/admin/tables/SearchBar'
import { Pagination } from '@/components/admin/tables/Pagination'
import { Badge } from '@/components/admin/ui/Badge'
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
          <h1 className="font-serif text-2xl font-light text-espresso">Resort Photo Gallery</h1>
          <p className="text-xs text-espresso/60">Manage resort image showcase categorized by rooms, wildlife, culture, and dining.</p>
        </div>
        <Link
          href="/admin/gallery-images/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-espresso text-ivory hover:bg-espresso-light shadow-xs"
        >
          + Add Gallery Image
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar placeholder="Search captions..." />
      </div>

      <div className="bg-white rounded-3xl border border-espresso/10 p-5 shadow-xs">
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((item) => {
              const img = item.image as Media | undefined
              const thumb = img?.thumbnailURL || img?.url

              return (
                <Link
                  key={item.id}
                  href={`/admin/gallery-images/${item.id}`}
                  className="group relative rounded-2xl overflow-hidden border border-espresso/15 hover:border-espresso hover:shadow-card bg-cream/40 transition-all flex flex-col"
                >
                  <div className="relative aspect-4/3 w-full bg-cream">
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
                    <p className="text-xs font-medium text-espresso line-clamp-1">
                      {item.caption || 'No caption'}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <Badge variant="default" size="sm">
                        {item.category}
                      </Badge>
                      <span className="text-[10px] text-espresso/50">Order {item.order ?? 0}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-espresso/60">
            No gallery images found.
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} />
      </div>
    </div>
  )
}
