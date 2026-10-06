'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/admin/_components/ui/Button'
import { Modal } from '@/app/admin/_components/ui/Modal'
import { ConfirmDialog } from '@/app/admin/_components/ui/ConfirmDialog'
import { useToast } from '@/app/admin/_components/ui/Toast'
import { saveAmenity, deleteAmenity } from '@/lib/services/amenities'
import type { Amenity } from '@/lib/types'

export interface AmenitiesClientProps {
  initialAmenities: Amenity[]
  total: number
}

export function AmenitiesClient({ initialAmenities }: AmenitiesClientProps) {
  const router = useRouter()
  const { addToast } = useToast()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null)
  const [nameInput, setNameInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Amenity | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = initialAmenities.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase().trim())
  )

  const openCreateModal = () => {
    setEditingAmenity(null)
    setNameInput('')
    setModalOpen(true)
  }

  const openEditModal = (amenity: Amenity) => {
    setEditingAmenity(amenity)
    setNameInput(amenity.name)
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameInput.trim()) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('name', nameInput.trim())

    try {
      const res = await saveAmenity(editingAmenity?.id || null, formData)
      if (res.success) {
        addToast(editingAmenity ? 'Amenity updated.' : 'Amenity created.', 'success')
        setModalOpen(false)
        router.refresh()
      } else {
        addToast(res.error || 'Failed to save amenity.', 'error')
      }
    } catch (err: unknown) {
      addToast((err instanceof Error ? err.message : "An unknown error occurred") || 'Error occurred.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const res = await deleteAmenity(deleteTarget.id)
      if (res.success) {
        addToast('Amenity deleted.', 'success')
        setDeleteTarget(null)
        router.refresh()
      } else {
        addToast(res.error || 'Failed to delete amenity.', 'error')
      }
    } catch (err: unknown) {
      addToast((err instanceof Error ? err.message : "An unknown error occurred") || 'Error occurred.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter amenities..."
            className="w-full px-3.5 py-2 pl-9 rounded-xl border border-gray-200 bg-white text-xs text-gray-900 placeholder:text-gray-900/40 focus:outline-hidden focus:border-gray-300/40"
          />
          <svg
            className="w-4 h-4 text-gray-900/40 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <Button onClick={openCreateModal}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Amenity
        </Button>
      </div>

      {/* Amenities Grid/Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-900/40 text-xs">
            {search ? 'No amenities match your filter.' : 'No amenities yet. Click "Add Amenity" to create one.'}
          </div>
        ) : (
          <div className="divide-y divide-espresso/5">
            <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 text-[11px] font-medium uppercase tracking-wider text-gray-400">
              <div className="col-span-8">Amenity Name</div>
              <div className="col-span-4 text-right">Actions</div>
            </div>
            {filtered.map((amenity) => (
              <div
                key={amenity.id}
                className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-gray-100/10 transition-colors"
              >
                <div className="col-span-8 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-forest/60" />
                  <span className="text-sm font-medium text-gray-900">{amenity.name}</span>
                </div>
                <div className="col-span-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(amenity)}
                    className="px-2.5 py-1 text-xs text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(amenity)}
                    className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAmenity ? 'Edit Amenity' : 'Add New Amenity'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-900 mb-1.5">Amenity Name</label>
            <input
              type="text"
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. Riverfront Balcony, Air Conditioning, Free Wi-Fi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-900 placeholder:text-gray-900/40 focus:outline-hidden focus:border-gray-300/40"
              autoFocus
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingAmenity ? 'Save Changes' : 'Create Amenity'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Amenity"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Rooms referencing this amenity will no longer show it.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
