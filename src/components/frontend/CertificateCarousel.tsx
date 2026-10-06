'use client'

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

export type CertificateItem = {
  src: string
  alt: string
  platform: string
  score: string
  outOf: string
  awardTitle: string
  description: string
}

const CERTIFICATES: CertificateItem[] = [
  {
    src: '/awards/booking.png',
    alt: 'Booking.com Traveller Review Awards 2026 for River Bank Jungle Resort',
    platform: 'Booking.com',
    score: '9.0',
    outOf: '/10',
    awardTitle: 'Traveller Review Awards 2026',
    description: 'Recognized for consistent 9+ ratings from international wildlife travellers.',
  },
  {
    src: '/awards/trip.jpg',
    alt: 'Trip.com Amazing Verified Reviews 2026 for River Bank Jungle Resort',
    platform: 'Trip.com',
    score: '9.7',
    outOf: '/10',
    awardTitle: 'Amazing · Verified Reviews 2026',
    description: 'Top-tier rating for safari hospitality, cleanliness and riverside atmosphere.',
  },
  {
    src: '/awards/expedia.jpeg',
    alt: 'Expedia Exceptional Verified Reviews Award for River Bank Jungle Resort',
    platform: 'Expedia',
    score: '5.0',
    outOf: '/5',
    awardTitle: 'Exceptional · Verified Reviews',
    description: 'Perfect score across service, jungle excursions and dining experience.',
  },
  {
    src: '/awards/hotel.jpeg',
    alt: 'Hotels.com Exceptional Guest Rated 2026 for River Bank Jungle Resort',
    platform: 'Hotels.com',
    score: '10',
    outOf: '/10',
    awardTitle: 'Exceptional · Guest Rated 2026',
    description: 'Celebrated by verified guests as an unforgettable Chitwan wilderness retreat.',
  },
]

export function CertificateCarousel() {
  const autoplayRef = useRef(
    Autoplay({
      delay: 3200,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      skipSnaps: false,
      duration: 35,
    },
    [autoplayRef.current]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [zoomImage, setZoomImage] = useState<CertificateItem | null>(null)

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

  // Continuous auto-move effect: ensures smooth auto-advancing every 3.2s
  useEffect(() => {
    if (!emblaApi) return

    try {
      const plugin = emblaApi.plugins()?.autoplay
      if (plugin && typeof plugin.play === 'function') {
        plugin.play()
      }
    } catch {
      // ignore
    }

    const interval = setInterval(() => {
      // Pause only when full-screen zoom preview is active
      if (!zoomImage && emblaApi) {
        emblaApi.scrollNext()
      }
    }, 3200)

    return () => clearInterval(interval)
  }, [emblaApi, zoomImage])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  // Close zoom modal on escape key
  useEffect(() => {
    if (!zoomImage) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomImage(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [zoomImage])

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
      {/* Carousel Viewport */}
      <div className="overflow-hidden py-6" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {CERTIFICATES.map((cert, index) => {
            const isActive = index === selectedIndex
            return (
              <div
                key={cert.platform}
                className="min-w-0 flex-[0_0_88%] px-3 sm:flex-[0_0_70%] md:flex-[0_0_55%] lg:flex-[0_0_46%]"
              >
                <div
                  onClick={() => setZoomImage(cert)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setZoomImage(cert)
                    }
                  }}
                  aria-label={`Inspect ${cert.platform} certificate (${cert.awardTitle})`}
                  className={`group lokta-texture relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-[#FDFBF7] p-5 transition-all duration-500 sm:p-7 ${
                    isActive
                      ? 'scale-100 border-gold/60 shadow-[0_16px_40px_-12px_rgba(26,46,36,0.22)] ring-2 ring-gold/25'
                      : 'scale-[0.92] border-espresso/10 opacity-60 hover:opacity-90'
                  }`}
                >
                  {/* Top Header with Verified Score Badge */}
                  <div className="flex items-center justify-between border-b border-espresso/10 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-dark">
                        {cert.platform}
                      </span>
                      <h3 className="font-serif text-lg font-normal text-espresso sm:text-xl">
                        {cert.awardTitle}
                      </h3>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-baseline gap-0.5 rounded-md bg-espresso px-2.5 py-1 text-ivory shadow-xs">
                        <span className="font-serif text-xl font-bold tracking-tight text-gold">
                          {cert.score}
                        </span>
                        <span className="text-[10px] text-ivory/70">{cert.outOf}</span>
                      </div>
                      <span className="mt-1 text-[9px] uppercase tracking-[0.14em] text-espresso/45">
                        Guest Score
                      </span>
                    </div>
                  </div>

                  {/* Certificate Image Frame */}
                  <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#FAF8F5] p-2 ring-1 ring-espresso/5 transition-transform duration-500 group-hover:scale-[1.02] sm:h-72 sm:aspect-auto">
                    <Image
                      src={cert.src}
                      alt={cert.alt}
                      fill
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 420px"
                      priority={index === 0}
                      className="object-contain p-1 drop-shadow-sm"
                    />

                    {/* Subtle Hover Lens Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-espresso/30 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                      <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-espresso/90 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-gold shadow-lg">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                          />
                        </svg>
                        Click to view full certificate
                      </span>
                    </div>
                  </div>

                  {/* Description Footer */}
                  <div className="mt-4 flex items-center justify-between pt-1">
                    <p className="line-clamp-2 text-xs leading-relaxed text-espresso/70">
                      {cert.description}
                    </p>
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-dark group-hover:underline">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation Controls & Pagination */}
      <div className="mt-4 flex items-center justify-center gap-6 px-2">
        {/* Left / Right Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous certificate"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-white text-espresso shadow-xs transition-all hover:bg-gold hover:text-espresso active:scale-95"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next certificate"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-white text-espresso shadow-xs transition-all hover:bg-gold hover:text-espresso active:scale-95"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Indicator Dots */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Certificate slides">
          {CERTIFICATES.map((cert, i) => (
            <button
              key={cert.platform}
              type="button"
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`Go to ${cert.platform} certificate`}
              onClick={() => scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? 'w-8 bg-gold'
                  : 'w-2 bg-espresso/25 hover:bg-espresso/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal to View High-Resolution Certificate */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-espresso/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={zoomImage.awardTitle}
        >
          {/* Backdrop dismiss */}
          <div
            className="absolute inset-0"
            onClick={() => setZoomImage(null)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gold/30 bg-white p-5 shadow-2xl sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-espresso/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">
                  {zoomImage.platform} Official Certificate
                </span>
                <h2 className="mt-1 font-serif text-2xl font-light text-espresso sm:text-3xl">
                  {zoomImage.awardTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setZoomImage(null)}
                aria-label="Close certificate preview"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-espresso/10 text-espresso transition-colors hover:bg-espresso hover:text-ivory"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* High-Res Certificate Display */}
            <div className="relative my-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#FAF8F5] p-2 ring-1 ring-espresso/10 sm:h-[460px] sm:aspect-auto">
              <Image
                src={zoomImage.src}
                alt={zoomImage.alt}
                fill
                sizes="(max-width: 1024px) 95vw, 800px"
                className="object-contain p-2"
                priority
              />
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col items-center justify-between gap-3 border-t border-espresso/10 pt-4 sm:flex-row">
              <p className="text-xs text-espresso/70">{zoomImage.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.14em] text-espresso/50">
                  Verified Score:
                </span>
                <span className="font-serif text-xl font-bold text-gold-dark">
                  {zoomImage.score} {zoomImage.outOf}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
