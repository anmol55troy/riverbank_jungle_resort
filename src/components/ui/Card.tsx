import Image from 'next/image'
import type { ReactNode } from 'react'

import { Link } from '@/i18n/navigation'
import type { ResolvedImage } from '@/lib/media'

type CardProps = {
  image: ResolvedImage | null
  title: string
  description?: string
  href?: string
  tag?: string
  meta?: string
  footer?: ReactNode
  /** On espresso sections */
  dark?: boolean
  /** next/image sizes attribute matched to the grid the card sits in */
  sizes?: string
}

/**
 * Editorial card: no box, no shadow — a graded photograph with a caption
 * block beneath it, the way a lodge brochure lays plates on a page.
 */
export function Card({
  image,
  title,
  description,
  href,
  tag,
  meta,
  footer,
  dark = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
}: CardProps) {
  const body = (
    <article className="group flex h-full flex-col">
      {image && (
        <div className="image-caption relative aspect-[4/3] overflow-hidden bg-cream">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes={sizes}
            className="img-grade object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.045] group-focus-within:scale-[1.045]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100" />
          {tag && (
            <span className="absolute left-4 top-4 bg-espresso/90 px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-gold backdrop-blur-sm">
              {tag}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col pt-5">
        {meta && (
          <p className={`mb-2 text-[10px] font-medium uppercase tracking-[0.26em] ${dark ? 'text-gold' : 'text-clay'}`}>
            {meta}
          </p>
        )}
        <h3 className={`display min-h-[1.9em] text-[1.7rem] ${dark ? '!text-ivory' : ''}`}>
          <span className="title-underline pb-0.5">{title}</span>
        </h3>
        {description && (
          <p className={`mt-2.5 line-clamp-3 text-[15px] leading-7 ${dark ? 'text-ivory/70' : 'text-espresso/68'}`}>
            {description}
          </p>
        )}
        {footer && <div className="mt-auto pt-5">{footer}</div>}
        {href && !footer && (
            <span className={`link-line ${dark ? 'link-line-light' : ''} mt-auto self-start pt-6`}>
            Discover
          </span>
        )}
      </div>
    </article>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full" aria-label={title}>
        {body}
      </Link>
    )
  }
  return body
}
