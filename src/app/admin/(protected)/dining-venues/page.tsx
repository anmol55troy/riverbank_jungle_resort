import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAdminDiningVenues } from '@/lib/services/dining'
import { SearchBar } from '@/components/admin/tables/SearchBar'
import { Pagination } from '@/components/admin/tables/Pagination'
import type { Media } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminDiningPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const searchParams = await props.searchParams
  const q = searchParams.q || ''
  const page = Number(searchParams.page || 1)

  const { docs: venues, total, totalPages } = await getAdminDiningVenues({ search: q, page })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-light text-espresso">Dining & Venues</h1>
          <p className="text-xs text-espresso/60">Manage resort dining outlets, menus, bars, and culinary offerings.</p>
        </div>
        <Link
          href="/admin/dining-venues/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-espresso text-ivory hover:bg-espresso-light shadow-xs"
        >
          + Add New Venue
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar placeholder="Search dining venues..." />
      </div>

      <div className="bg-white rounded-3xl border border-espresso/10 p-5 shadow-xs">
        {venues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-espresso/50 uppercase tracking-wider text-[10px] border-b border-espresso/10">
                  <th className="pb-3 font-semibold">Image</th>
                  <th className="pb-3 font-semibold">Title</th>
                  <th className="pb-3 font-semibold">Cuisine</th>
                  <th className="pb-3 font-semibold">Hours</th>
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/5">
                {venues.map((venue) => {
                  const img = venue.image as Media | undefined
                  const thumb = img?.thumbnailURL || img?.url

                  return (
                    <tr key={venue.id} className="hover:bg-cream/20 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-cream border border-espresso/10">
                          {thumb && (
                            <Image src={thumb} alt={venue.title} fill sizes="48px" className="object-cover" unoptimized />
                          )}
                        </div>
                      </td>
                      <td className="py-3 font-medium text-espresso">{venue.title}</td>
                      <td className="py-3 text-espresso/70">{venue.cuisine || '—'}</td>
                      <td className="py-3 text-espresso/60">{venue.hours || '—'}</td>
                      <td className="py-3 text-espresso/70">{venue.order ?? 0}</td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/dining-venues/${venue.id}`}
                          className="font-semibold text-gold-dark hover:underline"
                        >
                          Edit Venue
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-espresso/60">
            No dining venues found.
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} />
      </div>
    </div>
  )
}
