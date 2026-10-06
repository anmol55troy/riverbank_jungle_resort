import React from 'react'
import Link from 'next/link'
import { getAdminFaqs } from '@/lib/services/faqs'
import { SearchBar } from '@/app/admin/_components/tables/SearchBar'
import { Pagination } from '@/app/admin/_components/tables/Pagination'
import { Badge } from '@/app/admin/_components/ui/Badge'

export const dynamic = 'force-dynamic'

export default async function AdminFaqsPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const searchParams = await props.searchParams
  const q = searchParams.q || ''
  const page = Number(searchParams.page || 1)

  const { docs: faqs, total, totalPages } = await getAdminFaqs({ search: q, page })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-light text-espresso">Frequently Asked Questions</h1>
          <p className="text-xs text-espresso/60">Manage visitor FAQs and resort policies.</p>
        </div>
        <Link
          href="/admin/faqs/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-espresso text-ivory hover:bg-espresso-light shadow-xs"
        >
          + Add FAQ
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar placeholder="Search FAQs by question..." />
      </div>

      <div className="bg-white rounded-3xl border border-espresso/10 p-5 shadow-xs">
        {faqs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-espresso/50 uppercase tracking-wider text-[10px] border-b border-espresso/10">
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Question</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/5">
                {faqs.map((f) => (
                  <tr key={f.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-3 font-mono text-espresso/60 w-16">
                      <Badge variant="default" size="sm">
                        #{f.order ?? 0}
                      </Badge>
                    </td>
                    <td className="py-3 font-medium text-espresso">{f.question}</td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/faqs/${f.id}`}
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
            No FAQs found.
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} />
      </div>
    </div>
  )
}
