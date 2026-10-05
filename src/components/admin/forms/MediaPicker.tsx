'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { getMediaList, uploadMedia } from '@/lib/services/media'
import type { Media } from '@/lib/types'

export interface MediaPickerProps {
  name: string
  value?: string | null
  defaultValue?: string | Media | null
  onChange?: (media: Media | null) => void
  label?: string
  error?: boolean
}

export function MediaPicker({
  name,
  defaultValue,
  onChange,
  label = 'Select Image',
}: MediaPickerProps) {
  const [selected, setSelected] = useState<Media | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'browse' | 'upload'>('browse')

  // Library state
  const [mediaList, setMediaList] = useState<Media[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  // Initialize selected from defaultValue if provided
  useEffect(() => {
    if (defaultValue) {
      if (typeof defaultValue === 'object' && defaultValue.id) {
        setSelected(defaultValue as Media)
      }
    }
  }, [defaultValue])

  const loadMedia = async (q = '') => {
    setLoading(true)
    try {
      const res = await getMediaList({ search: q, limit: 30 })
      setMediaList(res.docs)
    } catch (e) {
      console.error('Error fetching media:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    loadMedia(search)
  }

  const handleSelect = (item: Media) => {
    setSelected(item)
    if (onChange) onChange(item)
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelected(null)
    if (onChange) onChange(null)
  }

  const uploadDivRef = useRef<HTMLDivElement>(null)

  const handleUploadClick = async () => {
    setUploadError('')
    if (!uploadDivRef.current) return
    
    const fileInput = uploadDivRef.current.querySelector('input[name="file"]') as HTMLInputElement
    const altInput = uploadDivRef.current.querySelector('input[name="alt"]') as HTMLInputElement
    const captionInput = uploadDivRef.current.querySelector('input[name="caption"]') as HTMLInputElement
    
    const file = fileInput?.files?.[0]
    
    if (!file || file.size === 0) {
      setUploadError('Please select a file to upload.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    if (altInput?.value) formData.append('alt', altInput.value)
    if (captionInput?.value) formData.append('caption', captionInput.value)

    setUploading(true)
    try {
      const res = await uploadMedia(formData)
      if (res.success && res.media) {
        handleSelect(res.media)
        if (fileInput) fileInput.value = ''
        if (altInput) altInput.value = ''
        if (captionInput) captionInput.value = ''
      } else {
        setUploadError(res.error || 'Upload failed.')
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const previewUrl = selected?.sizes?.thumbnail?.url || selected?.url

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={selected?.id || ''} />

      {selected ? (
        <div className="flex items-center gap-3 p-2.5 bg-white border border-espresso/20 rounded-xl max-w-md">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-cream shrink-0 border border-espresso/10">
            {previewUrl && (
              <Image
                src={previewUrl}
                alt={selected.alt || 'Selected image'}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-espresso truncate">{selected.filename}</p>
            <p className="text-[11px] text-espresso/60 truncate mt-0.5">{selected.alt || 'No alt text'}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <button
                type="button"
                onClick={handleOpen}
                className="text-xs font-medium text-gold-dark hover:underline cursor-pointer"
              >
                Change
              </button>
              <span className="text-espresso/30">•</span>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-medium text-rose-600 hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Button type="button" variant="secondary" size="sm" onClick={handleOpen}>
          <svg className="w-4 h-4 mr-1 text-espresso/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {label}
        </Button>
      )}

      {/* Media Library Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Select Media" maxWidth="4xl">
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
                    const thumb = item.sizes?.thumbnail?.url || item.url
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item)}
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
            <div ref={uploadDivRef} className="space-y-4 max-w-lg mx-auto py-4">
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

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setActiveTab('browse')}>
                  Cancel
                </Button>
                <Button type="button" variant="primary" size="sm" isLoading={uploading} onClick={handleUploadClick}>
                  Upload & Select
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
