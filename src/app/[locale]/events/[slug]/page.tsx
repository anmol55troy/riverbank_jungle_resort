import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import Image from 'next/image'

import { getEventVenueBySlug } from '@/lib/data'
import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'
import { Link } from '@/i18n/navigation'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/jsonld'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const venue = await getEventVenueBySlug(slug)
  if (!venue) return buildMetadata({ title: 'Not Found', description: 'Venue not found', path: `/events/${slug}` })

  const image = resolveMedia(venue.image, 'hero')
  return buildMetadata({
    title: venue.title,
    description: venue.shortDescription,
    path: `/events/${slug}`,
    image: image?.url,
  })
}

export default async function EventVenuePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const venue = await getEventVenueBySlug(slug)
  if (!venue) notFound()

  const heroImage = resolveMedia(venue.image, 'hero')
  
  // Parse amenities correctly if they are coming from DB
  const amenitiesList = venue.amenities && Array.isArray(venue.amenities) ? venue.amenities : []

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Meetings & Events', path: '/events' },
          { name: venue.title, path: `/events/${venue.slug}` },
        ])}
      />

      <Hero
        size="banner"
        image={heroImage ?? { url: '/hero/slider6.webp', alt: venue.title }}
        title={venue.title}
        label="Meetings & Events"
      />

      <main className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-6 text-2xl font-bold text-forest sm:text-3xl">
              {venue.title}
            </h2>
            <p className="mx-auto max-w-3xl text-sm leading-loose text-espresso/80 sm:text-base">
              {venue.shortDescription}
            </p>
          </div>

          <div className="mb-16 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-2 divide-x divide-y divide-gray-200 text-center sm:grid-cols-5 sm:divide-y-0">
              <div className="flex flex-col p-4 sm:p-6">
                <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Hall Size</span>
                <span className="text-sm font-medium text-espresso">{venue.hallSize || '-'}</span>
              </div>
              <div className="flex flex-col p-4 sm:p-6">
                <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">U Setup</span>
                <span className="text-sm font-medium text-espresso">{venue.uSetup || '-'}</span>
              </div>
              <div className="flex flex-col p-4 sm:p-6">
                <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Classroom Setup</span>
                <span className="text-sm font-medium text-espresso">{venue.classroomSetup || '-'}</span>
              </div>
              <div className="flex flex-col p-4 sm:p-6">
                <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Theater Setup</span>
                <span className="text-sm font-medium text-espresso">{venue.theaterSetup || '-'}</span>
              </div>
              <div className="flex flex-col p-4 sm:p-6">
                <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Round Table Setup</span>
                <span className="text-sm font-medium text-espresso">{venue.roundTableSetup || '-'}</span>
              </div>
            </div>
          </div>

          <div className="mb-20 text-center">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded bg-gold px-10 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold/90"
            >
              Inquiry Now
            </Link>
          </div>

          {amenitiesList.length > 0 && (
            <div className="mb-20">
              <h3 className="mb-8 text-xl font-bold text-espresso">Hall Amenities</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {amenitiesList.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-sm text-espresso/80">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ivory text-forest">
                      {/* Simple check icon since we don't have exact icons for everything */}
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {venue.gallery && venue.gallery.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {venue.gallery.map((item, i) => {
                const imgUrl = resolveMedia(item.image, 'original')?.url
                if (!imgUrl) return null
                return (
                  <div key={item.id || i} className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                    <Image
                      src={imgUrl}
                      alt={venue.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
