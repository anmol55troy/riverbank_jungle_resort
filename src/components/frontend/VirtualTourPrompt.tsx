'use client'

import { useEffect, useState } from 'react'

import { CloseIcon, ExternalIcon } from '../ui/icons'

type Props = {
  url: string
}

/** Invites visitors to preview the property after they have had time to orient themselves. */
export function VirtualTourPrompt({ url }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!url) return

    try {
      if (window.sessionStorage.getItem('river-bank-tour-seen')) return
    } catch {
      // Storage can be disabled by privacy settings; the prompt still works.
    }

    const timer = window.setTimeout(() => setOpen(true), 25000)
    return () => window.clearTimeout(timer)
  }, [url])

  useEffect(() => {
    if (!open) return

    try {
      window.sessionStorage.setItem('river-bank-tour-seen', 'true')
    } catch {
      // Continue without persistence when storage is unavailable.
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  if (!open || !url) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-forest/45 p-4 sm:items-center" role="presentation">
      <button
        type="button"
        aria-label="Close virtual tour prompt"
        className="absolute inset-0 cursor-default"
        onClick={() => setOpen(false)}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-prompt-title"
        className="relative z-10 max-h-[calc(100svh-2rem)] w-full max-w-3xl overflow-y-auto border border-sage/40 bg-ivory p-4 pb-6 shadow-2xl sm:p-7"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close virtual tour prompt"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-forest/60 transition-colors hover:text-forest"
        >
          <CloseIcon />
        </button>
        <p className="kicker mb-3">See River Bank before you arrive</p>
        <h2 id="tour-prompt-title" className="display pr-8 text-3xl sm:text-4xl">
          Take a quiet walk through the resort.
        </h2>
        <p className="mt-3 max-w-md text-sm leading-7 text-forest/70">
          Explore the rooms, riverside lawns and shared spaces without leaving this page.
        </p>
        <div className="relative mt-6 aspect-[16/9] min-h-[220px] overflow-hidden bg-cream sm:min-h-[360px]">
          <iframe
            title="River Bank Jungle Resort virtual tour"
            src={url}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-sage-dark px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-forest"
          >
            Open in full screen <ExternalIcon />
          </a>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-forest/60 transition-colors hover:text-forest sm:text-center"
          >
            Maybe later
          </button>
        </div>
      </section>
    </div>
  )
}