'use client'

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useCallback, useEffect, useState } from 'react'

import { StarIcon } from './ui/icons'

export type TestimonialItem = {
  id: string | number
  quote: string
  guestName: string
  country?: string | null
  source: string
  rating: number
  sourceUrl?: string | null
}

const SOURCE_LABELS: Record<string, string> = {
  tripadvisor: 'TripAdvisor',
  booking: 'Booking.com',
  expedia: 'Expedia',
  tripcom: 'Trip.com',
}

export function TestimonialCarousel({ items }: { items: TestimonialItem[] }) {
  const reduced = useReducedMotion()
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    reduced ? [] : [Autoplay({ delay: 6000, stopOnInteraction: true })],
  )
  const [selected, setSelected] = useState(0)

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  if (items.length === 0) return null

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef} role="region" aria-label="Guest reviews carousel">
        <div className="flex">
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`min-w-0 flex-[0_0_100%] px-4 transition-opacity duration-700 md:flex-[0_0_70%] lg:flex-[0_0_55%] ${
                i === selected ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <figure className="mx-auto max-w-2xl text-center">
                <div className="mb-5 flex justify-center gap-1 text-gold" aria-label={`${item.rating} out of 5 stars`}>
                  {Array.from({ length: item.rating }).map((_, s) => (
                    <StarIcon key={s} />
                  ))}
                </div>
                <blockquote className="font-serif text-xl leading-relaxed text-ivory md:text-2xl">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-sm text-ivory/70">
                  <span className="font-semibold text-gold">{item.guestName}</span>
                  {item.country && <span> · {item.country}</span>}
                  <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-ivory/50">
                    {item.sourceUrl ? (
                      <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                        via {SOURCE_LABELS[item.source] ?? item.source}
                      </a>
                    ) : (
                      <>via {SOURCE_LABELS[item.source] ?? item.source}</>
                    )}
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-2.5">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to review ${i + 1}`}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              i === selected ? 'w-6 bg-gold' : 'bg-ivory/30 hover:bg-ivory/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
