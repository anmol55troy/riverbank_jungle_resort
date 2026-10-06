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
          <h1 className="font-serif text-2xl font-light text-espresso">Guest Reviews</h1>
          <p className="text-xs text-espresso/60">Manage visitor testimonials displayed on the homepage and review carousels.</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-espresso text-ivory hover:bg-espresso-light shadow-xs"
        >
          + Add Review
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar placeholder="Search by guest or quote..." />
      </div>

      <div className="bg-white rounded-3xl border border-espresso/10 p-5 shadow-xs">
        {testimonials.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-espresso/50 uppercase tracking-wider text-[10px] border-b border-espresso/10">
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
                  <tr key={t.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-3 font-medium text-espresso">{t.guestName}</td>
                    <td className="py-3 text-espresso/70">{t.country || '—'}</td>
                    <td className="py-3 text-espresso/80 max-w-sm truncate">{t.quote}</td>
                    <td className="py-3">
                      <Badge variant="default" size="sm">
                        {t.source}
                      </Badge>
                    </td>
                    <td className="py-3 text-amber-600 font-semibold">{'★'.repeat(t.rating)}</td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/testimonials/${t.id}`}
                        className="font-semibold text-gold-dark hover:underline"
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
          <div className="py-12 text-center text-xs text-espresso/60">
            No testimonials found.
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} />
      </div>
    </div>
  )
}
