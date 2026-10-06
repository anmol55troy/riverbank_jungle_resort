'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/admin/_components/ui/Button'
import { ConfirmDialog } from '@/app/admin/_components/ui/ConfirmDialog'
import { Pagination } from '@/app/admin/_components/tables/Pagination'
import { useToast } from '@/app/admin/_components/ui/Toast'
import { deleteNewsletterSignup } from '@/lib/services/submissions'
import type { NewsletterSignup } from '@/lib/types'

export interface NewsletterSignupsClientProps {
  initialDocs: NewsletterSignup[]
  total: number
  totalPages: number
  currentPage: number
  searchQuery: string
}

export function NewsletterSignupsClient({
  initialDocs,
  total,
  totalPages,
  currentPage,
  searchQuery,
}: NewsletterSignupsClientProps) {
  const router = useRouter()
  const { addToast } = useToast()

  const [search, setSearch] = useState(searchQuery)
  const [deleteTarget, setDeleteTarget] = useState<NewsletterSignup | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/admin/newsletter-signups?q=${encodeURIComponent(search.trim())}`)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const res = await deleteNewsletterSignup(deleteTarget.id)
      if (res.success) {
        addToast('Subscriber removed.', 'success')
        setDeleteTarget(null)
        router.refresh()
      } else {
        addToast(res.error || 'Failed to remove subscriber.', 'error')
      }
    } catch (err: any) {
      addToast(err.message || 'Error occurred.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const exportCSV = () => {
    if (initialDocs.length === 0) {
      addToast('No subscribers to export.', 'info')
      return
    }

    const headers = 'Email,Subscribed At\n'
    const rows = initialDocs
      .map((doc) => `"${doc.email}","${new Date(doc.createdAt).toISOString()}"`)
      .join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    addToast('Subscribers exported to CSV.', 'success')
  }

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by subscriber email..."
            className="w-full px-3.5 py-2 pl-9 rounded-xl border border-espresso/15 bg-white text-xs text-espresso placeholder:text-espresso/40 focus:outline-hidden focus:border-espresso/40"
          />
          <svg
            className="w-4 h-4 text-espresso/40 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </form>

        <Button variant="secondary" onClick={exportCSV}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV ({total})
        </Button>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-3xl border border-espresso/10 p-5 shadow-xs">
        {initialDocs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-espresso/50 uppercase tracking-wider text-[10px] border-b border-espresso/10">
                  <th className="pb-3 font-semibold">Subscriber Email</th>
                  <th className="pb-3 font-semibold">Date Subscribed</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/5">
                {initialDocs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-3 font-medium text-espresso font-mono">
                      <a href={`mailto:${sub.email}`} className="hover:text-gold-dark hover:underline">
                        {sub.email}
                      </a>
                    </td>
                    <td className="py-3 text-espresso/60">
                      {new Date(sub.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setDeleteTarget(sub)}
                        className="text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-espresso/60">
            {searchQuery ? 'No subscribers match your search.' : 'No newsletter subscribers yet.'}
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={total} />
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Remove Subscriber"
        message={`Are you sure you want to remove "${deleteTarget?.email}" from the newsletter mailing list?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
