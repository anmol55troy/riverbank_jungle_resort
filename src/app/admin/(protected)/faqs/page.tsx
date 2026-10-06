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
          <h1 className="font-serif text-2xl font-light text-gray-900">Frequently Asked Questions</h1>
          <p className="text-xs text-gray-500">Manage visitor FAQs and resort policies.</p>
        </div>
        <Link
          href="/admin/faqs/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          + Add FAQ
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar placeholder="Search FAQs by question..." />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        {faqs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-200">
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Question</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/5">
                {faqs.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-mono text-gray-500 w-16">
                      <Badge variant="default" size="sm">
                        #{f.order ?? 0}
                      </Badge>
                    </td>
                    <td className="py-3 font-medium text-gray-900">{f.question}</td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/faqs/${f.id}`}
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
            No FAQs found.
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} />
      </div>
    </div>
  )
}
