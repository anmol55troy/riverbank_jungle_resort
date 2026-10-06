import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAdminEventVenues } from '@/lib/services/eventVenues'
import { SearchBar } from '@/app/admin/_components/tables/SearchBar'
import { Pagination } from '@/app/admin/_components/tables/Pagination'
import type { Media } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminEventVenuesPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const searchParams = await props.searchParams
  const q = searchParams.q || ''
  const page = Number(searchParams.page || 1)

  const { docs: eventVenues, total, totalPages } = await getAdminEventVenues({ search: q, page })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-light text-gray-900">Event Venues</h1>
          <p className="text-xs text-gray-500">Manage conference halls, meeting rooms, and event spaces.</p>
        </div>
        <Link
          href="/admin/event-venues/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          + Add New Event Venue
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar placeholder="Search event venues..." />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        {eventVenues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-200">
                  <th className="pb-3 font-semibold">Image</th>
                  <th className="pb-3 font-semibold">Title</th>
                  <th className="pb-3 font-semibold">Hall Size</th>
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/5">
                {eventVenues.map((exp) => {
                  const img = exp.image as Media | undefined
                  const thumb = img?.thumbnailURL || img?.url

                  return (
                    <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                          {thumb && (
                            <Image src={thumb} alt={exp.title} fill sizes="48px" className="object-cover" unoptimized />
                          )}
                        </div>
                      </td>
                      <td className="py-3 font-medium text-gray-900">{exp.title}</td>
                      <td className="py-3 text-gray-500">{exp.hallSize || '—'}</td>
                      <td className="py-3 text-gray-500">{exp.order ?? 0}</td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/event-venues/${exp.id}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          Edit Event Venue
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-gray-500">
            No event venues found.
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} />
      </div>
    </div>
  )
}
