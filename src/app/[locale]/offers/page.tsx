import { setRequestLocale } from 'next-intl/server'

import { GoldExternal } from '@/components/ui/Buttons'
import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'
import { RichText } from '@/components/ui/RichText'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { FadeUp, StaggerGroup, StaggerItem } from '@/components/ui/motion'
import Image from 'next/image'
import { DEFAULTS } from '@/lib/constants'
import { getActiveOffers, getSiteSettings } from '@/lib/data'
import { PLACEHOLDER } from '@/lib/images'
import { breadcrumbSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Special Offers',
  description:
    'Seasonal packages and special offers at River Bank Jungle Resort, Chitwan — safari-inclusive stays, monsoon rates and family packages. Book direct for the best price.',
  path: '/offers',
})

const formatDate = (value: string | null | undefined): string | null =>
  value
    ? new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

export default async function OffersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
const [offers, settings] = await Promise.all([getActiveOffers(), getSiteSettings().catch(() => null)])
  const bookingUrl = settings?.bookingUrl || DEFAULTS.bookingUrl

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Special Offers', path: '/offers' },
        ])}
      />
      <Hero
        size="banner"
        image={{ url: '/media/facilities-banner.webp', alt: 'River Bank Jungle Resort swimming pool and lodge at dusk' }}
        label="Offers"
        title="Special Offers"
        subtitle="Book direct for our best rates — packages below are confirmed by email or WhatsApp."
      />

      <section className="grain bg-ivory py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {offers.length === 0 ? (
            <FadeUp className="text-center">
              <SectionHeading
                label="Right Now"
                title="No Published Offers at the Moment"
                intro="New seasonal packages are added through the year — enquire directly and we will share unpublished rates for your dates."
              />
              <GoldExternal href={bookingUrl}>Check Availability</GoldExternal>
            </FadeUp>
          ) : (
            <StaggerGroup className="space-y-8">
              {offers.map((offer, i) => {
                const image = resolveMedia(offer.image, 'card')
                const from = formatDate(offer.validFrom)
                const until = formatDate(offer.validUntil)
                return (
                  <StaggerItem key={offer.id}>
                    <article className="grain grid overflow-hidden rounded-lg bg-white shadow-card md:grid-cols-[2fr_3fr]">
                      <div className="relative min-h-56">
                        <Image
                          src={image?.url ?? [PLACEHOLDER.pool, PLACEHOLDER.terrace][i % 2]}
                          alt={image?.alt ?? offer.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 40vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-8">
                        {(from || until) && (
                          <p className="label-caps mb-2 !text-clay">
                            {from && until ? `${from} – ${until}` : until ? `Until ${until}` : `From ${from}`}
                          </p>
                        )}
                        <h2 className="font-serif text-2xl text-espresso">{offer.title}</h2>
                        <div className="my-4 h-px w-10 bg-gold" />
                        <RichText data={offer.description} className="text-sm" />
                        <GoldExternal href={bookingUrl} className="mt-6">
                          Book This Offer
                        </GoldExternal>
                      </div>
                    </article>
                  </StaggerItem>
                )
              })}
            </StaggerGroup>
          )}
        </div>
      </section>
    </>
  )
}
