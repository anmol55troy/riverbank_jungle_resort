'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/admin/ui/Button'
import { Modal } from '@/components/admin/ui/Modal'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { useToast } from '@/components/admin/ui/Toast'
import { Pagination } from '@/components/admin/tables/Pagination'
import { uploadMedia, updateMedia, deleteMedia } from '@/lib/services/media'
import type { Media } from '@/lib/types'

export interface MediaManagerClientProps {
  initialDocs: Media[]
  total: number
  totalPages: number
  currentPage: number
  searchQuery: string
}

export function MediaManagerClient({
  initialDocs,
  total,
  totalPages,
  currentPage,
  searchQuery,
}: MediaManagerClientProps) {
  const router = useRouter()
  const { addToast } = useToast()

  const [search, setSearch] = useState(searchQuery)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadAlt, setUploadAlt] = useState('')
  const [uploadCaption, setUploadCaption] = useState('')

  // Edit modal
  const [editAlt, setEditAlt] = useState('')
  const [editCaption, setEditCaption] = useState('')
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<Media | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/admin/media?q=${encodeURIComponent(search.trim())}`)
  }

  const handleOpenEdit = (m: Media) => {
    setSelectedMedia(m)
    setEditAlt(m.alt || '')
    setEditCaption(m.caption || '')
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMedia) return

    setIsSavingEdit(true)
    const formData = new FormData()
    formData.set('alt', editAlt)
    formData.set('caption', editCaption)

    try {
      const res = await updateMedia(selectedMedia.id, formData)
      if (res.success && res.media) {
        addToast('Media details updated.', 'success')
        setSelectedMedia(res.media)
        router.refresh()
      } else {
        addToast(res.error || 'Failed to update media.', 'error')
      }
    } catch (err: any) {
      addToast(err.message || 'Error occurred.', 'error')
    } finally {
      setIsSavingEdit(false)
    }
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', uploadFile)
    formData.append('alt', uploadAlt.trim())
    formData.append('caption', uploadCaption.trim())

    try {
      const res = await uploadMedia(formData)
      if (res.success) {
        addToast('Media uploaded successfully.', 'success')
        setUploadModalOpen(false)
        setUploadFile(null)
        setUploadAlt('')
        setUploadCaption('')
        router.refresh()
      } else {
        addToast(res.error || 'Upload failed.', 'error')
      }
    } catch (err: any) {
      addToast(err.message || 'Upload error.', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      const res = await deleteMedia(deleteTarget.id)
      if (res.success) {
        addToast('Media deleted.', 'success')
        setDeleteTarget(null)
        if (selectedMedia?.id === deleteTarget.id) {
          setSelectedMedia(null)
        }
        router.refresh()
      } else {
        addToast(res.error || 'Failed to delete media.', 'error')
      }
    } catch (err: any) {
      addToast(err.message || 'Deletion error.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url)
    addToast('Direct URL copied to clipboard.', 'info')
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by alt or filename..."
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

        <Button onClick={() => setUploadModalOpen(true)}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload New Image
        </Button>
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-3xl border border-espresso/10 p-6 shadow-xs">
        {initialDocs.length === 0 ? (
          <div className="py-20 text-center text-espresso/40 text-xs">
            {searchQuery ? 'No images match your search.' : 'No media uploaded yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {initialDocs.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenEdit(item)}
                className="group relative flex flex-col rounded-2xl border border-espresso/10 overflow-hidden bg-cream/20 hover:border-gold transition-all cursor-pointer hover:shadow-md"
              >
                <div className="aspect-square relative w-full bg-cream/40 overflow-hidden">
                  <Image
                    src={(item.thumbnailURL || item.url) || ''}
                    alt={item.alt || ''}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                  />
                </div>
                <div className="p-2.5 space-y-1">
                  <p className="text-[11px] font-medium text-espresso truncate" title={item.alt}>
                    {item.alt || item.filename}
                  </p>
                  <p className="text-[9px] text-espresso/50 font-mono truncate">
                    {item.width && item.height ? `${item.width}×${item.height}px` : ''}{' '}
                    {item.filesize ? `• ${Math.round(item.filesize / 1024)}KB` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={total} />
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Image"
        description="Choose a high-resolution image to upload to the local media repository. Derivatives will automatically be generated."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-espresso mb-1.5">Image File</label>
            <input
              type="file"
              required
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] || null
                setUploadFile(f)
                if (f && !uploadAlt) {
                  setUploadAlt(f.name.replace(/\.[^/.]+$/, ''))
                }
              }}
              className="w-full text-xs text-espresso/70 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-espresso file:text-ivory hover:file:bg-espresso-light cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-espresso mb-1.5">Alt Text / Description (SEO)</label>
            <input
              type="text"
              required
              value={uploadAlt}
              onChange={(e) => setUploadAlt(e.target.value)}
              placeholder="Descriptive text for accessibility and SEO..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-espresso/15 bg-white text-xs text-espresso placeholder:text-espresso/40 focus:outline-hidden focus:border-espresso/40"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-espresso mb-1.5">Caption (optional)</label>
            <input
              type="text"
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              placeholder="e.g. Deluxe Balcony Suite view over Rapti river"
              className="w-full px-3.5 py-2.5 rounded-xl border border-espresso/15 bg-white text-xs text-espresso placeholder:text-espresso/40 focus:outline-hidden focus:border-espresso/40"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="ghost" type="button" onClick={() => setUploadModalOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isUploading} disabled={!uploadFile}>
              Upload Image
            </Button>
          </div>
        </form>
      </Modal>

      {/* Media Detail & Edit Modal */}
      <Modal
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        title="Media Details"
        maxWidth="lg"
      >
        {selectedMedia && (
          <div className="space-y-6">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-espresso/5 border border-espresso/10">
              <Image
                src={selectedMedia.url || ''}
                alt={selectedMedia.alt || ''}
                fill
                className="object-contain"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-cream/40 border border-espresso/5 text-xs">
              <div>
                <span className="block text-[10px] text-espresso/50 uppercase">Dimensions</span>
                <span className="font-mono text-espresso font-medium">{selectedMedia.width} × {selectedMedia.height}px</span>
              </div>
              <div>
                <span className="block text-[10px] text-espresso/50 uppercase">File Size</span>
                <span className="font-mono text-espresso font-medium">
                  {selectedMedia.filesize ? `${Math.round(selectedMedia.filesize / 1024)} KB` : '—'}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-espresso/50 uppercase">Format</span>
                <span className="font-mono text-espresso font-medium uppercase">{selectedMedia.mimeType?.split('/')[1] || 'WEBP'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-espresso/50 uppercase">Action</span>
                <button
                  type="button"
                  onClick={() => copyUrl(selectedMedia.url || '')}
                  className="text-gold-dark hover:underline font-medium text-[11px]"
                >
                  Copy URL
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-espresso mb-1.5">Alt Text</label>
                <input
                  type="text"
                  required
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-espresso/15 bg-white text-xs text-espresso focus:outline-hidden focus:border-espresso/40"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-espresso mb-1.5">Caption</label>
                <input
                  type="text"
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-espresso/15 bg-white text-xs text-espresso focus:outline-hidden focus:border-espresso/40"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-espresso/10">
                <Button
                  variant="danger"
                  type="button"
                  onClick={() => setDeleteTarget(selectedMedia)}
                >
                  Delete Image
                </Button>

                <div className="flex items-center gap-3">
                  <Button variant="ghost" type="button" onClick={() => setSelectedMedia(null)}>
                    Close
                  </Button>
                  <Button type="submit" isLoading={isSavingEdit}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Media File"
        message={`Are you sure you want to permanently delete "${deleteTarget?.filename}" and all its resized variants from the server? Any content using this image will display a missing image placeholder.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
