'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '../ui/Button'
import type { Media } from '@/lib/types'
import { MediaBrowserModal } from './MediaBrowserModal'

export interface GalleryItem {
  image: string | Media
  id?: string | null
}

export interface GalleryPickerProps {
  name: string
  defaultValue?: GalleryItem[] | null
  label?: string
}

export function GalleryPicker({
  name,
  defaultValue = [],
  label = 'Add Gallery Images',
}: GalleryPickerProps) {
  const [items, setItems] = useState<GalleryItem[]>(defaultValue || [])
  const [isOpen, setIsOpen] = useState(false)

  const handleAddMedia = (media: Media) => {
    const id = Math.random().toString(36).substring(2, 10)
    setItems((prev) => [...prev, { image: media, id }])
    setIsOpen(false)
  }

  const handleRemove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newItems.length) return
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp
    setItems(newItems)
  }

  // Generate serialized hidden inputs for each item in the gallery
  return (
    <div className="space-y-3">
      {/* Hidden input storing gallery items as JSON for standard form submission */}
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(
          items.map((item) => ({
            image: typeof item.image === 'object' ? item.image.id : item.image,
            id: item.id || undefined,
          }))
        )}
      />

      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {items.map((item, idx) => {
            const mediaObj = typeof item.image === 'object' ? (item.image as Media) : null
            const url = mediaObj?.thumbnailURL || mediaObj?.url

            return (
              <div
                key={item.id || idx}
                className="group relative aspect-4/3 rounded-xl overflow-hidden border border-gray-300 bg-gray-100"
              >
                {url ? (
                  <Image src={url} alt={mediaObj?.alt || 'Gallery image'} fill sizes="200px" className="object-cover" unoptimized />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-900/40">Image {idx + 1}</div>
                )}

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-gray-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between items-center text-white text-[10px]">
                    <span>#{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="p-1 hover:text-rose-300 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1 bg-white/20 hover:bg-white/40 disabled:opacity-30 rounded text-white cursor-pointer"
                      title="Move backward"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1 bg-white/20 hover:bg-white/40 disabled:opacity-30 rounded text-white cursor-pointer"
                      title="Move forward"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-xl bg-white/40">
          <p className="text-xs text-gray-500 mb-2">No gallery images added yet.</p>
        </div>
      )}

      <div>
        <Button type="button" variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
          + {label}
        </Button>
      </div>

      <MediaBrowserModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={handleAddMedia}
        title="Add Image to Gallery"
        requireAltAndCaption={false}
      />
    </div>
  )
}
