import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { GoldExternal, OutlineLink } from '@/components/ui/Buttons'
import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'
import { RichText } from '@/components/ui/RichText'
import { FadeUp, StaggerGroup, StaggerItem } from '@/components/ui/motion'
import { DEFAULTS } from '@/lib/constants'
import { getExperiences, getRoomBySlug, getRooms, getSiteSettings } from '@/lib/data'
import { PLACEHOLDER } from '@/lib/images'
import { breadcrumbSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const rooms = await getRooms().catch(() => [])
  return rooms.flatMap((room) => (room.slug ? [{ locale: 'en', slug: room.slug }] : []))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const room = await getRoomBySlug(slug)
  if (!room) return {}

  return buildMetadata({
    title: room.title,
    description: room.shortDescription,
    path: `/rooms/${room.slug}`,
    image: resolveMedia(room.gallery?.[0]?.image, 'og')?.url,
    imageAlt: room.title,
  })
}

export default async function RoomDetailPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const [room, experiences, settings] = await Promise.all([
    getRoomBySlug(slug),
    getExperiences(),
    getSiteSettings().catch(() => null),
  ])
  if (!room) notFound()

  const bookingUrl = settings?.bookingUrl || DEFAULTS.bookingUrl
  const heroImage = resolveMedia(room.gallery?.[0]?.image, 'hero') ?? {
    url: PLACEHOLDER.room,
    alt: room.title,
    width: 1920,
    height: 1280,
  }
  const galleryImages = (room.gallery ?? [])
    .map((g) => resolveMedia(g.image, 'card'))
    .filter((img): img is NonNullable<typeof img> => img !== null)

  const amenities = (room.amenities ?? []).flatMap((a) =>
    typeof a === 'object' && a !== null ? [a.name] : [],
  )

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Rooms & Suites', path: '/rooms' },
          { name: room.title, path: `/rooms/${room.slug}` },
        ])}
      />
      <Hero size="banner" image={heroImage} label="Rooms & Suites" title={room.title} />

      <section className="grain bg-ivory py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[2fr_1fr]">
          <FadeUp>
            <RichText data={room.description} />

            {galleryImages.length > 1 && (
              <div className="mt-10 grid grid-cols-2 gap-4">
                {galleryImages.slice(1).map((img) => (
                  <div key={img.url} className="relative aspect-4/3 overflow-hidden rounded-lg shadow-card">
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </FadeUp>

          <FadeUp delay={0.1}>
            <aside className="space-y-8 lg:sticky lg:top-28">
              {room.priceFrom?.amount != null && (
                <div className="rounded-lg bg-espresso p-6 text-center text-ivory">
                  <p className="label-caps">From</p>
                  <p className="mt-1 font-serif text-3xl">
                    {room.priceFrom.currency ?? 'USD'} {room.priceFrom.amount}
                  </p>
                  <p className="text-xs text-ivory/60">per night</p>
                  <GoldExternal href={bookingUrl} className="mt-5 w-full">
                    Book Now
                  </GoldExternal>
                </div>
              )}
              {room.priceFrom?.amount == null && (
                <GoldExternal href={bookingUrl} className="w-full">
                  Check Rates & Book
                </GoldExternal>
              )}

              {(room.features ?? []).length > 0 && (
                <div className="grain rounded-lg bg-white p-6 shadow-card">
                  <h2 className="label-caps mb-4">At a Glance</h2>
                  <dl className="space-y-3">
                    {(room.features ?? []).map((f) => (
                      <div key={f.id ?? f.label} className="flex justify-between gap-4 border-b border-espresso/8 pb-2 text-sm">
                        <dt className="text-espresso/60">{f.label}</dt>
                        <dd className="text-right font-medium text-espresso">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {amenities.length > 0 && (
                <div className="grain rounded-lg bg-white p-6 shadow-card">
                  <h2 className="label-caps mb-4">Amenities</h2>
                  <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-espresso/75">
                    {amenities.map((name) => (
                      <li key={name} className="flex items-start gap-1.5">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </FadeUp>
        </div>
      </section>

      {experiences.length > 0 && (
        <section className="grain bg-cream py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <FadeUp className="mb-10 text-center">
              <p className="label-caps mb-3">Beyond the Room</p>
              <h2 className="font-serif text-3xl text-espresso">Pair Your Stay With the Jungle</h2>
              <div className="hairline mt-5" />
            </FadeUp>
            <StaggerGroup className="grid gap-6 sm:grid-cols-3">
              {experiences.slice(0, 3).map((exp) => (
                <StaggerItem key={exp.id}>
                  <div className="grain rounded-lg bg-white p-6 shadow-card">
                    <h3 className="font-serif text-lg text-espresso">{exp.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-espresso/70">{exp.shortDescription}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
            <FadeUp className="mt-10 text-center">
              <OutlineLink href="/experiences">See All Experiences</OutlineLink>
            </FadeUp>
          </div>
        </section>
      )}
    </>
  )
}
