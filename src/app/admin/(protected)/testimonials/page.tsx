import React from 'react'
import Link from 'next/link'
import { getAdminTestimonials } from '@/lib/services/testimonials'
import { SearchBar } from '@/app/admin/_components/tables/SearchBar'
import { Pagination } from '@/app/admin/_components/tables/Pagination'
import { Badge } from '@/app/admin/_components/ui/Badge'

export const dynamic = 'force-dynamic'

export default async function AdminTestimonialsPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const searchParams = await props.searchParams
  const q = searchParams.q || ''
  const page = Number(searchParams.page || 1)

  const { docs: testimonials, total, totalPages } = await getAdminTestimonials({ search: q, page })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-light text-gray-900">Guest Reviews</h1>
          <p className="text-xs text-gray-500">Manage visitor testimonials displayed on the homepage and review carousels.</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          + Add Review
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar placeholder="Search by guest or quote..." />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        {testimonials.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-200">
                  <th className="pb-3 font-semibold">Guest</th>
                  <th className="pb-3 font-semibold">Country</th>
                  <th className="pb-3 font-semibold">Quote Snippet</th>
                  <th className="pb-3 font-semibold">Source</th>
                  <th className="pb-3 font-semibold">Rating</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/5">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-medium text-gray-900">{t.guestName}</td>
                    <td className="py-3 text-gray-500">{t.country || '—'}</td>
                    <td className="py-3 text-gray-600 max-w-sm truncate">{t.quote}</td>
                    <td className="py-3">
                      {t.sourceUrl ? (
                        <a href={t.sourceUrl} target="_blank" rel="noopener noreferrer" title="View source review">
                          <Badge variant="default" size="sm" className="hover:bg-gray-200 transition-colors">
                            {t.source}
                          </Badge>
                        </a>
                      ) : (
                        <Badge variant="default" size="sm">
                          {t.source}
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 text-amber-600 font-semibold">{'★'.repeat(t.rating)}</td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/testimonials/${t.id}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-gray-500">
            No testimonials found.
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} />
      </div>
    </div>
  )
}
