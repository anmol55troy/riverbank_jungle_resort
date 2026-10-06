'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/app/admin/_components/ui/Badge'
import { Modal } from '@/app/admin/_components/ui/Modal'
import { ConfirmDialog } from '@/app/admin/_components/ui/ConfirmDialog'
import { Pagination } from '@/app/admin/_components/tables/Pagination'
import { useToast } from '@/app/admin/_components/ui/Toast'
import { deleteSubmission } from '@/lib/services/submissions'
import type { FormSubmission } from '@/lib/types'

export interface FormSubmissionsClientProps {
  initialDocs: FormSubmission[]
  total: number
  totalPages: number
  currentPage: number
  currentType: string
  searchQuery: string
}

export function FormSubmissionsClient({
  initialDocs,
  total,
  totalPages,
  currentPage,
  currentType,
  searchQuery,
}: FormSubmissionsClientProps) {
  const router = useRouter()
  const { addToast } = useToast()

  const [search, setSearch] = useState(searchQuery)
  const [activeSubmission, setActiveSubmission] = useState<FormSubmission | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<FormSubmission | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/admin/form-submissions?type=${currentType}&q=${encodeURIComponent(search.trim())}`)
  }

  const handleTypeChange = (newType: string) => {
    router.push(`/admin/form-submissions?type=${newType}&q=${encodeURIComponent(search.trim())}`)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const res = await deleteSubmission(deleteTarget.id)
      if (res.success) {
        addToast('Submission deleted.', 'success')
        setDeleteTarget(null)
        if (activeSubmission?.id === deleteTarget.id) {
          setActiveSubmission(null)
        }
        router.refresh()
      } else {
        addToast(res.error || 'Failed to delete submission.', 'error')
      }
    } catch (err: unknown) {
      addToast((err instanceof Error ? err.message : "An unknown error occurred") || 'Error occurred.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Type tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-cream/40 rounded-xl border border-espresso/10">
          {[
            { label: 'All', value: 'all' },
            { label: 'General Contact', value: 'contact' },
            { label: 'Events & Weddings', value: 'events' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTypeChange(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                currentType === tab.value
                  ? 'bg-espresso text-ivory shadow-xs'
                  : 'text-espresso/60 hover:text-espresso'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, subject..."
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
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-3xl border border-espresso/10 p-5 shadow-xs">
        {initialDocs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-espresso/50 uppercase tracking-wider text-[10px] border-b border-espresso/10">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Sender</th>
                  <th className="pb-3 font-semibold">Subject / Details</th>
                  <th className="pb-3 font-semibold">Message Preview</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/5">
                {initialDocs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-3 text-espresso/60 whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3">
                      <Badge variant={sub.formType === 'events' ? 'gold' : 'forest'} size="sm">
                        {sub.formType === 'events' ? 'Event Inquiry' : 'Contact'}
                      </Badge>
                    </td>
                    <td className="py-3 font-medium text-espresso">
                      <div>{sub.name}</div>
                      <div className="text-[11px] text-espresso/60 font-mono">{sub.email}</div>
                    </td>
                    <td className="py-3 text-espresso/80">
                      {sub.subject && <div className="font-medium truncate max-w-xs">{sub.subject}</div>}
                      {sub.eventDate && (
                        <div className="text-[11px] text-espresso/60">
                          Date: {sub.eventDate} {sub.guests ? `(${sub.guests} guests)` : ''}
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-espresso/70 max-w-sm truncate">{sub.message}</td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setActiveSubmission(sub)}
                        className="font-semibold text-gold-dark hover:underline mr-3 cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setDeleteTarget(sub)}
                        className="text-rose-600 hover:text-rose-800 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-espresso/60">
            {searchQuery ? 'No submissions match your search.' : 'No form submissions received yet.'}
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={total} />
      </div>

      {/* Submission Detail Modal */}
      <Modal
        isOpen={!!activeSubmission}
        onClose={() => setActiveSubmission(null)}
        title={activeSubmission?.formType === 'events' ? 'Event & Wedding Inquiry' : 'Contact Message'}
        maxWidth="lg"
      >
        {activeSubmission && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-cream/40 border border-espresso/10 text-xs">
              <div>
                <span className="block text-[10px] text-espresso/50 uppercase font-semibold">Sender Name</span>
                <span className="text-sm font-medium text-espresso">{activeSubmission.name}</span>
              </div>

              <div>
                <span className="block text-[10px] text-espresso/50 uppercase font-semibold">Email</span>
                <a
                  href={`mailto:${activeSubmission.email}`}
                  className="text-sm text-gold-dark hover:underline font-mono"
                >
                  {activeSubmission.email}
                </a>
              </div>

              {activeSubmission.phone && (
                <div>
                  <span className="block text-[10px] text-espresso/50 uppercase font-semibold">Phone</span>
                  <a
                    href={`tel:${activeSubmission.phone}`}
                    className="text-sm text-espresso/80 hover:text-espresso font-mono"
                  >
                    {activeSubmission.phone}
                  </a>
                </div>
              )}

              <div>
                <span className="block text-[10px] text-espresso/50 uppercase font-semibold">Received On</span>
                <span className="text-espresso/70">
                  {new Date(activeSubmission.createdAt).toLocaleString()}
                </span>
              </div>

              {activeSubmission.subject && (
                <div className="col-span-full">
                  <span className="block text-[10px] text-espresso/50 uppercase font-semibold">Subject</span>
                  <span className="text-espresso font-medium">{activeSubmission.subject}</span>
                </div>
              )}

              {activeSubmission.eventDate && (
                <div>
                  <span className="block text-[10px] text-espresso/50 uppercase font-semibold">Requested Event Date</span>
                  <span className="text-espresso font-medium">{activeSubmission.eventDate}</span>
                </div>
              )}

              {activeSubmission.guests && (
                <div>
                  <span className="block text-[10px] text-espresso/50 uppercase font-semibold">Estimated Guests</span>
                  <span className="text-espresso font-medium">{activeSubmission.guests} persons</span>
                </div>
              )}
            </div>

            <div>
              <span className="block text-xs font-semibold text-espresso uppercase tracking-wider mb-2">Message</span>
              <div className="p-4 rounded-2xl bg-white border border-espresso/10 text-xs leading-relaxed text-espresso whitespace-pre-wrap">
                {activeSubmission.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-espresso/10">
              <button
                type="button"
                onClick={() => setDeleteTarget(activeSubmission)}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
              >
                Delete Submission
              </button>

              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${activeSubmission.email}?subject=Re: ${encodeURIComponent(activeSubmission.subject || 'River Bank Jungle Resort Inquiry')}`}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-espresso text-ivory hover:bg-espresso-light shadow-xs"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Form Submission"
        message={`Are you sure you want to permanently delete the inquiry from "${deleteTarget?.name}"?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
