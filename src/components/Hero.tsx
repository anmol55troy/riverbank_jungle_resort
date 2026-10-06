'use client'

import Image from 'next/image'
import { useEffect, useState, type ReactNode } from 'react'

type Slide = { url: string; alt: string }

type Props = {
  /** Optional property film. The poster remains the no-motion fallback. */
  video?: { url: string; poster: string; title: string }
  /** Single background image (inner pages) */
  image?: Slide
  /** Multiple backgrounds — cinematic crossfade slideshow (home) */
  slides?: Slide[]
  label?: string
  /** Accepts <em> for an italic word — the display face carries the emphasis */
  title: ReactNode
  subtitle?: string
  children?: ReactNode
  /** Full viewport height (home) vs shorter banner (inner pages) */
  size?: 'full' | 'banner'
}

/** How long each slide holds before the next dissolve begins */
const SLIDE_MS = 7000

/**
 * Film-style dissolve. Previously driven by framer-motion; now a plain CSS
 * opacity transition, which keeps the effect but removes the library from
 * every page that renders a hero.
 */
function Crossfade({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS)
    return () => clearInterval(id)
  }, [slides.length])

  return (
    <>
      {slides.map((slide, i) => (
        <div
          key={slide.url}
          className="hero-slide animate-kenburns absolute inset-0"
          style={{ opacity: index === i ? 1 : 0 }}
          aria-hidden={index === i ? undefined : true}
        >
          <Image
            src={slide.url}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="img-grade object-cover"
          />
        </div>
      ))}
    </>
  )
}

export function Hero({
  video,
  image,
  slides,
  label,
  title,
  subtitle,
  children,
  size = 'full',
}: Props) {
  const backgroundSlides = slides && slides.length > 0 ? slides : image ? [image] : []

  return (
    <section
      className={`relative flex items-center justify-center overflow-hidden bg-espresso ${
        size === 'full' ? 'min-h-svh' : 'min-h-[58svh] pt-28 md:pt-32'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        {video ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={video.poster}
            aria-label={video.title}
          >
            <source src={video.url} type="video/mp4" />
          </video>
        ) : backgroundSlides.length > 1 ? (
          <Crossfade slides={backgroundSlides} />
        ) : backgroundSlides[0] ? (
          <div className="animate-kenburns absolute inset-0">
            <Image
              src={backgroundSlides[0].url}
              alt={backgroundSlides[0].alt}
              fill
              priority
              sizes="100vw"
              className="img-grade object-cover"
            />
          </div>
        ) : null}
        {/* Universal scrim: constant base gradient + a soft radial pool of
            shadow behind the text block, so the copy reads over any slide. */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/35 to-forest/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_58%_50%_at_50%_46%,rgba(20,38,31,0.5),transparent_72%)]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-6 sm:gap-10 px-4 sm:px-6 lg:px-8 py-20 sm:py-28 md:py-32 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-center lg:gap-16">
        <div className="max-w-3xl text-center lg:text-left">
          {label && <p className="kicker-light hero-text-shadow hero-rise mb-3 sm:mb-5">{label}</p>}
          {/* hero-settle, not hero-rise: this is the LCP element, so it is
              painted at full opacity from the first frame. */}
          <h1 className="display hero-text-shadow hero-settle !text-ivory text-[clamp(2rem,5.5vw,4.75rem)] [&_em]:italic [&_em]:text-sage">
            {title}
          </h1>
          {subtitle && (
            <p className="hero-text-shadow hero-rise hero-delay-1 mt-3 sm:mt-6 max-w-lg text-[13px] sm:text-[15px] leading-[1.7] sm:leading-[1.75] text-ivory/85 lg:ml-0">
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="hero-rise hero-delay-2 flex w-full flex-col items-center justify-center gap-3 sm:gap-5 lg:items-stretch">
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
