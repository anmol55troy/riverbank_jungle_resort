'use client'

import { useEffect, useState } from 'react'

import { CloseIcon, ExternalIcon } from './ui/icons'

type Props = {
  url: string
}

/** Invites visitors to preview the property after they have had time to orient themselves. */
export function VirtualTourPrompt({ url }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!url) return

    const timer = window.setTimeout(() => setOpen(true), 5000)
    return () => window.clearTimeout(timer)
  }, [url])

  useEffect(() => {
    if (!open) return

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
        className="relative z-10 max-h-[calc(100svh-2rem)] w-full max-w-3xl overflow-y-auto rounded-2xl border border-sage/40 bg-ivory p-4 pb-6 shadow-2xl sm:p-7"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close virtual tour prompt"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700"
        >
          <CloseIcon />
        </button>
        <p className="kicker mb-3"><b>See River Bank before you arrive</b></p>
        <h2 id="tour-prompt-title" className="display pr-8 text-3xl sm:text-4xl">
          Take a quiet walk through the resort.
        </h2>

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
        <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row sm:items-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-sage-dark px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory shadow-sm transition-all hover:bg-forest hover:shadow"
          >
            Open in full screen <ExternalIcon />
          </a>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-forest/20 bg-transparent px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-forest/70 transition-all hover:bg-forest/5 hover:text-forest"
          >
            Maybe later
          </button>
        </div>
      </section>
    </div>
  )
}