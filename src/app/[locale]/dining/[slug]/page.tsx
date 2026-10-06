import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { GoldLink, OutlineLink } from '@/components/ui/Buttons'
import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'
import { RichText } from '@/components/ui/RichText'
import { FadeUp } from '@/components/ui/motion'
import { getDiningVenueBySlug, getDiningVenues } from '@/lib/data'
import { PLACEHOLDER } from '@/lib/images'
import { breadcrumbSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const venues = await getDiningVenues().catch(() => [])
  return venues.flatMap((venue) => (venue.slug ? [{ locale: 'en', slug: venue.slug }] : []))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const venue = await getDiningVenueBySlug(slug)
  if (!venue) return {}

  return buildMetadata({
    title: venue.title,
    description: venue.shortDescription,
    path: `/dining/${venue.slug}`,
    image: resolveMedia(venue.image, 'og')?.url,
    imageAlt: venue.title,
  })
}

export default async function DiningVenuePage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const venue = await getDiningVenueBySlug(slug)
  if (!venue) notFound()

  const heroImage = resolveMedia(venue.image, 'hero') ?? {
    url: PLACEHOLDER.dining,
    alt: venue.title,
    width: 1920,
    height: 1280,
  }
  const galleryImages = (venue.gallery ?? [])
    .map((g) => resolveMedia(g.image, 'card'))
    .filter((img): img is NonNullable<typeof img> => img !== null)

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Dining', path: '/dining' },
          { name: venue.title, path: `/dining/${venue.slug}` },
        ])}
      />
      <Hero size="banner" image={heroImage} label="Dining" title={venue.title} subtitle={venue.cuisine ?? undefined} />

      <section className="grain bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FadeUp>
            {venue.hours && (
              <p className="label-caps mb-6 text-center">Open {venue.hours}</p>
            )}
            <RichText data={venue.description} />
            {galleryImages.length > 0 && (
              <div className="mt-10 grid grid-cols-2 gap-4">
                {galleryImages.map((img) => (
                  <div key={img.url} className="relative aspect-4/3 overflow-hidden rounded-lg shadow-card">
                    <Image src={img.url} alt={img.alt} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <GoldLink href="/contact">Reserve a Table</GoldLink>
              <OutlineLink href="/dining">All Venues</OutlineLink>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
