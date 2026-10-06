'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { getMediaList, uploadMedia } from '@/lib/services/media'
import type { Media } from '@/lib/types'

export interface MediaBrowserModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (media: Media) => void
  title?: string
  requireAltAndCaption?: boolean
}

export function MediaBrowserModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media',
  requireAltAndCaption = true,
}: MediaBrowserModalProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'upload'>('browse')
  const [mediaList, setMediaList] = useState<Media[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const loadMedia = async (q = '') => {
    setLoading(true)
    try {
      const res = await getMediaList({ search: q, limit: 40 })
      setMediaList(res.docs)
    } catch (e) {
      console.error('Error fetching media:', e)
    } finally {
      setLoading(false)
    }
  }

  // Load initial media when opened
  useEffect(() => {
    if (isOpen) {
      loadMedia(search)
    }
  }, [isOpen])

  const uploadFormRef = useRef<HTMLFormElement>(null)

  const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploadError('')
    
    const form = e.currentTarget
    const formData = new FormData(form)
    const file = formData.get('file') as File

    if (!file || file.size === 0) {
      setUploadError('Please choose a file to upload.')
      return
    }

    setUploading(true)
    try {
      const res = await uploadMedia(formData)
      if (res.success && res.media) {
        onSelect(res.media)
        form.reset()
      } else {
        setUploadError(res.error || 'Upload failed.')
      }
    } catch (err: unknown) {
      setUploadError((err instanceof Error ? err.message : "An unknown error occurred") || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="4xl">
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-espresso/15 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('browse')}
            className={`pb-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'browse'
                ? 'border-espresso text-espresso'
                : 'border-transparent text-espresso/60 hover:text-espresso'
            }`}
          >
            Browse Library
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'border-espresso text-espresso'
                : 'border-transparent text-espresso/60 hover:text-espresso'
            }`}
          >
            Upload New
          </button>
        </div>

        {activeTab === 'browse' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search by alt or filename..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  loadMedia(e.target.value)
                }}
                className="flex-1 rounded-lg border border-espresso/20 px-3.5 py-1.5 text-xs text-espresso bg-white focus:outline-none focus:border-espresso"
              />
            </div>

            {loading ? (
              <div className="py-16 text-center text-xs text-espresso/60">Loading media...</div>
            ) : mediaList.length === 0 ? (
              <div className="py-16 text-center text-xs text-espresso/60">No media found.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[50vh] overflow-y-auto p-1">
                {mediaList.map((item) => {
                  const thumb = item.thumbnailURL || item.url
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelect(item)}
                      className="group relative aspect-4/3 rounded-lg overflow-hidden border border-espresso/15 hover:border-espresso hover:ring-2 hover:ring-espresso/20 transition-all bg-cream/50 cursor-pointer text-left"
                    >
                      {thumb && (
                        <Image
                          src={thumb}
                          alt={item.alt || ''}
                          fill
                          sizes="200px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-espresso/80 text-ivory text-[10px] p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.alt || item.filename}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <form ref={uploadFormRef} onSubmit={handleUploadSubmit} className="space-y-4 max-w-lg mx-auto py-4">
            {uploadError && <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">{uploadError}</div>}
            
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Choose Image File</label>
              <input
                type="file"
                name="file"
                accept="image/*"
                required
                className="block w-full text-xs text-espresso/80 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cream file:text-espresso hover:file:bg-sage/40 file:cursor-pointer cursor-pointer border border-espresso/20 rounded-lg p-2 bg-white"
              />
            </div>

            {requireAltAndCaption && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-espresso mb-1">Alt Text (for SEO and accessibility)</label>
                  <input
                    type="text"
                    name="alt"
                    placeholder="Describe the image, e.g. View of Rapti River at sunset"
                    className="w-full text-xs border border-espresso/20 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-espresso"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-espresso mb-1">Caption (optional)</label>
                  <input
                    type="text"
                    name="caption"
                    placeholder="Optional caption"
                    className="w-full text-xs border border-espresso/20 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-espresso"
                  />
                </div>
              </>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setActiveTab('browse')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={uploading}>
                Upload & Select
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
