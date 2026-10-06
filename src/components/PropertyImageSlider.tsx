'use client'

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

const PROPERTY_SLIDES = [
  {
    url: '/media/facilities-banner.webp',
    alt: 'The main lodge and swimming pool at River Bank Jungle Resort at dusk',
    title: 'The Lodge & Swimming Pool',
  },
  {
    url: '/media/image slider 2.webp',
    alt: 'Night aerial view of River Bank Jungle Resort and villas along the Rapti River',
    title: 'Riverside Resort Grounds',
  },
  {
    url: '/media/image slider 3.webp',
    alt: 'Stone pathway and illuminated villa gardens at twilight',
    title: 'Garden Walkways & Villas',
  },
  {
    url: '/media/image slider 4.webp',
    alt: 'Evening reflections across the resort swimming pool and dining hall',
    title: 'Evening by the Water',
  },
]

export function PropertyImageSlider({ className = '' }: { className?: string }) {
  const autoplay = useRef(
    Autoplay({
      delay: 3800,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 35,
      skipSnaps: false,
    },
    [autoplay.current]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)

  // Explicit auto-scroll timer to guarantee auto-advance across all browsers & hydration states
  useEffect(() => {
    if (!emblaApi) return

    // Play autoplay plugin if available
    try {
      const plugin = emblaApi.plugins()?.autoplay
      if (plugin && typeof plugin.play === 'function') {
        plugin.play()
      }
    } catch {
      // ignore
    }

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return
      if (emblaApi) {
        emblaApi.scrollNext()
      }
    }, 3500)

    return () => clearInterval(interval)
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    onSelect()
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  return (
    <div
      className={`group relative w-full max-w-full overflow-hidden rounded-sm shadow-[0_20px_50px_-15px_rgba(26,46,36,0.30)] ring-1 ring-espresso/10 aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[530px] ${className}`}
      aria-roledescription="carousel"
      aria-label="Resort property gallery"
    >
      {/* Embla Viewport for continuous horizontal slide/scroll */}
      <div className="h-full w-full overflow-hidden cursor-grab active:cursor-grabbing select-none" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {PROPERTY_SLIDES.map((slide, index) => (
            <div key={slide.url} className="relative h-full min-w-0 flex-[0_0_100%]">
              <Image
                src={slide.url}
                alt={slide.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority={index === 0}
                className="img-grade object-cover pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Subtle vignette scrim */}
      <div className="pointer-events-none absolute inset-0 z-15 bg-gradient-to-t from-black/60 via-transparent to-black/15" />

      {/* Control Dock: Caption Banner & Dots matching the reference image */}
      <div className="absolute inset-x-0 bottom-0 z-20 bg-black/85 backdrop-blur-md border-t border-gold/25">
        <div className="flex items-center justify-center border-b border-gold/15 px-3 py-2 sm:px-5 sm:py-3.5">
          <p className="font-serif text-xs tracking-[0.20em] sm:text-base md:text-lg text-gold uppercase drop-shadow-md transition-all duration-300">
            {PROPERTY_SLIDES[selectedIndex]?.title ?? ''}
          </p>
        </div>

        {/* Pagination Indicator Dots */}
        <div
          className="flex items-center justify-center gap-2 py-2 sm:gap-2.5 sm:py-3"
          role="tablist"
          aria-label="Slide dots"
        >
          {PROPERTY_SLIDES.map((slide, index) => {
            const isActive = index === selectedIndex
            return (
              <button
                key={slide.url}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                onClick={() => scrollTo(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 focus-visible:outline-gold cursor-pointer ${
                  isActive
                    ? 'w-6 sm:w-8 bg-gold shadow-[0_0_12px_rgba(197,155,88,0.75)]'
                    : 'w-1.5 sm:w-2 bg-[#8E978F] hover:bg-gray-200'
                }`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
