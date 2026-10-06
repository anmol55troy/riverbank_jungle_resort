import { setRequestLocale } from 'next-intl/server'

import { GoldExternal } from '@/components/ui/Buttons'
import { Card } from '@/components/ui/Card'
import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { FadeUp, StaggerGroup, StaggerItem } from '@/components/ui/motion'
import { DEFAULTS } from '@/lib/constants'
import { getExperiences, getSiteSettings } from '@/lib/data'
import { PLACEHOLDER } from '@/lib/images'
import { breadcrumbSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Experiences & Safaris',
  description:
    'Jeep safaris, canoe trips, jungle walks, bird watching and Tharu cultural evenings — experiences at River Bank Jungle Resort on the edge of Chitwan National Park.',
  path: '/experiences',
})

const fallbacks = [
  PLACEHOLDER.jeep,
  PLACEHOLDER.canoe,
  PLACEHOLDER.jungle,
  PLACEHOLDER.bird,
  PLACEHOLDER.crocodile,
  PLACEHOLDER.culture,
  PLACEHOLDER.village,
  PLACEHOLDER.sunset,
  PLACEHOLDER.pool,
]

export default async function ExperiencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
const [experiences, settings] = await Promise.all([
    getExperiences(),
    getSiteSettings().catch(() => null),
  ])
  const bookingUrl = settings?.bookingUrl || DEFAULTS.bookingUrl

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Experiences', path: '/experiences' },
        ])}
      />
      <Hero
        size="banner"
        image={resolveMedia(settings?.experiencesBanner, 'hero') ?? { url: PLACEHOLDER.jeep, alt: 'Open safari jeep on a grassland track in Chitwan National Park' }}
        label="Do"
        title="Into the Park"
        subtitle="Every experience is guided by licensed naturalists and can be arranged at the front desk — or before you arrive."
      />

      <section className="grain bg-ivory py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            label="Experiences"
            title="Nine Ways to Meet the Terai"

          />
          <StaggerGroup className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((exp, i) => (
              <StaggerItem key={exp.id}>
                <Card
                  image={
                    resolveMedia(exp.image, 'card') ?? {
                      url: fallbacks[i % fallbacks.length],
                      alt: exp.title,
                      width: 1600,
                      height: 1067,
                    }
                  }
                  title={exp.title}
                  description={exp.shortDescription}
                  meta={exp.duration ?? undefined}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
          <FadeUp className="mt-14 text-center">
            <p className="mx-auto mb-6 max-w-xl text-sm text-espresso/70">
              Safari permits and park fees are arranged by the resort. Tell us your dates and we will build
              your itinerary.
            </p>
            <GoldExternal href={bookingUrl}>Plan Your Stay</GoldExternal>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
