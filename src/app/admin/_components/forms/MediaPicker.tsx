'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '../ui/Button'
import type { Media } from '@/lib/types'
import { MediaBrowserModal } from './MediaBrowserModal'

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

  // Initialize selected from defaultValue if provided
  useEffect(() => {
    if (defaultValue) {
      if (typeof defaultValue === 'object' && defaultValue.id) {
        setSelected(defaultValue as Media)
      }
    }
  }, [defaultValue])

  const handleSelect = (item: Media) => {
    setSelected(item)
    if (onChange) onChange(item)
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelected(null)
    if (onChange) onChange(null)
  }

  const previewUrl = selected?.thumbnailURL || selected?.url

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
                onClick={() => setIsOpen(true)}
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
        <Button type="button" variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
          <svg className="w-4 h-4 mr-1 text-espresso/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {label}
        </Button>
      )}

      <MediaBrowserModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={handleSelect}
        title="Select Media"
        requireAltAndCaption={true}
      />
    </div>
  )
}
