import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAdminExperiences } from '@/lib/services/experiences'
import { SearchBar } from '@/app/admin/_components/tables/SearchBar'
import { Pagination } from '@/app/admin/_components/tables/Pagination'
import type { Media } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminExperiencesPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const searchParams = await props.searchParams
  const q = searchParams.q || ''
  const page = Number(searchParams.page || 1)

  const { docs: experiences, total, totalPages } = await getAdminExperiences({ search: q, page })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-light text-gray-900">Wildlife & Experiences</h1>
          <p className="text-xs text-gray-500">Manage guided safaris, canoe excursions, bird watching, and cultural tours.</p>
        </div>
        <Link
          href="/admin/experiences/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          + Add New Experience
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar placeholder="Search experiences..." />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        {experiences.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-200">
                  <th className="pb-3 font-semibold">Image</th>
                  <th className="pb-3 font-semibold">Title</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/5">
                {experiences.map((exp) => {
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
                      <td className="py-3 text-gray-500">{exp.duration || '—'}</td>
                      <td className="py-3 text-gray-500">{exp.order ?? 0}</td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/experiences/${exp.id}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          Edit Experience
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
            No experiences found.
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} />
      </div>
    </div>
  )
}
