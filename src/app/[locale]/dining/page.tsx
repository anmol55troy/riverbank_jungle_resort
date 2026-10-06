import { setRequestLocale } from 'next-intl/server'

import { Card } from '@/components/ui/Card'
import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StaggerGroup, StaggerItem } from '@/components/ui/motion'
import { getDiningVenues, getSiteSettings } from '@/lib/data'
import { PLACEHOLDER } from '@/lib/images'
import { breadcrumbSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Dining',
  description:
    'Four venues at River Bank Jungle Resort, Chitwan — The Signature Restaurant, Al Fresco Dining, Riverside Retreat and The Classic Bar. Nepali, Indian, Japanese and Continental cuisine.',
  path: '/dining',
})

export default async function DiningPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const [venues, settings] = await Promise.all([
    getDiningVenues(),
    getSiteSettings().catch(() => null),
  ])
  const fallbacks = [PLACEHOLDER.dining, PLACEHOLDER.alfresco, PLACEHOLDER.river, PLACEHOLDER.bar]

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Dining', path: '/dining' },
        ])}
      />
      <Hero
        size="banner"
        image={resolveMedia(settings?.diningBanner, 'hero') ?? { url: PLACEHOLDER.dining, alt: 'A candlelit dinner table set on a riverside terrace' }}
        label="Taste"
        title="Dining by the Rapti"
        subtitle="Nepali, Indian, Japanese and Continental kitchens — from breakfast on the lawn to cocktails at the bar."
      />

      <section className="grain bg-ivory py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading 
            align="center"
            className="!mb-10 md:!mb-14"
            label="Our Venues" 
            title="Four Ways to Eat Well" 
          />
          <StaggerGroup className="grid gap-6 sm:grid-cols-2">
            {venues.map((venue, i) => (
              <StaggerItem key={venue.id}>
                <Card
                  image={
                    resolveMedia(venue.image, 'card') ?? {
                      url: fallbacks[i % fallbacks.length],
                      alt: venue.title,
                      width: 1600,
                      height: 1067,
                    }
                  }
                  title={venue.title}
                  description={venue.shortDescription}
                  href={`/dining/${venue.slug}`}
                  meta={venue.cuisine ?? undefined}
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </>
  )
}
