'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import { ArrowRight, CloseIcon } from './icons'

export type GalleryItem = {
  id: string | number
  url: string
  thumbUrl: string
  alt: string
  caption?: string | null
  category: string
  width: number
  height: number
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  resort: 'Resort',
  rooms: 'Rooms',
  dining: 'Dining',
  wildlife: 'Wildlife',
  experiences: 'Experiences',
  culture: 'Culture',
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState('all')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const reduced = useReducedMotion()

  const categories = ['all', ...Array.from(new Set(items.map((i) => i.category)))]
  const visible = filter === 'all' ? items : items.filter((i) => i.category === filter)

  const close = useCallback(() => setLightbox(null), [])
  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((prev) => {
        if (prev === null) return prev
        return (prev + dir + visible.length) % visible.length
      })
    },
    [visible.length],
  )

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, close, step])

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter gallery by category">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setFilter(cat)
              setLightbox(null)
            }}
            aria-pressed={filter === cat}
            className={`min-h-12 border px-6 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
              filter === cat
                ? 'border-gold bg-gold text-espresso shadow-md'
                : 'border-espresso/10 bg-transparent text-espresso/70 hover:border-gold hover:text-gold-dark'
            }`}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            layout={!reduced}
            onClick={() => setLightbox(i)}
            aria-label={`View larger: ${item.caption ?? item.alt}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg shadow-card"
          >
            <Image
              src={item.thumbUrl}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {item.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/80 to-transparent p-4 pt-10 text-left text-sm text-ivory opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {item.caption}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox !== null && visible[lightbox] && (
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-espresso/95 p-4"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={visible[lightbox].caption ?? visible[lightbox].alt}
          >
            <motion.div
              initial={reduced ? { scale: 1 } : { scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative max-h-[85svh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={visible[lightbox].url}
                alt={visible[lightbox].alt}
                width={visible[lightbox].width}
                height={visible[lightbox].height}
                sizes="90vw"
                className="mx-auto max-h-[80svh] w-auto rounded-md object-contain"
              />
              {visible[lightbox].caption && (
                <p className="mt-3 text-center text-sm text-ivory/80">{visible[lightbox].caption}</p>
              )}
            </motion.div>

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/10 text-ivory transition-colors hover:bg-gold hover:text-espresso"
            >
              <CloseIcon />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                step(-1)
              }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 text-ivory transition-colors hover:bg-gold hover:text-espresso"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                step(1)
              }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 text-ivory transition-colors hover:bg-gold hover:text-espresso"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
