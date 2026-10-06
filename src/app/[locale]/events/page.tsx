import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { getSiteSettings, getEventVenues } from '@/lib/data'
import { Link } from '@/i18n/navigation'


import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { FadeUp } from '@/components/ui/motion'
import { breadcrumbSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Meetings & Events',
  description:
    'Host retreats, conferences, weddings and riverside celebrations at River Bank Jungle Resort in Chitwan — venues, catering and accommodation in one riverside setting.',
  path: '/events',
})



export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const settings = await getSiteSettings().catch(() => null)
  const eventVenues = await getEventVenues().catch(() => [])
return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Meetings & Events', path: '/events' },
        ])}
      />
      <Hero
        size="banner"
        image={resolveMedia(settings?.eventsBanner, 'hero') ?? {
          url: '/hero/slider4.webp',
          alt: 'The resort’s timber-vaulted event hall with sunken lounge and floor-to-ceiling windows',
        }}
        label="Gather"
        title="Meetings & Events"
        subtitle="Corporate retreats, weddings and family celebrations — with the jungle for a backdrop."
      />

      <section className="grain bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <SectionHeading 
            align="center"
            className="!mb-8"
            title="Welcome to Our Exquisite Banquet and Wedding Venue" 
          />
          <FadeUp>
            <p className="text-base leading-loose text-espresso/80 md:text-lg">
              At Hotel River Bank, we hold the belief that every moment and occasion is exceptional. We&apos;re honored to extend a heartfelt invitation to join us for a celebration beyond compare at our stunning banquet and wedding venue. Set against the breathtaking backdrop of National Park Chitwan, our 5-star oasis awaits to infuse your special day with the perfect blend of opulence, charm, and romance.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="grain bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            align="center"
            className="!mb-12 md:!mb-20"
            label="Featured Venues"
            title="Our Signature Halls"
          />
          <div className="flex flex-col gap-12 md:gap-16">
            {eventVenues.map((venue, index) => {
              const isReverse = index % 2 !== 0
              const imageUrl = resolveMedia(venue.image, 'card')?.url || '/hero/slider4.webp'
              
              return (
                <div key={venue.id} className={`group flex flex-col overflow-hidden rounded-2xl bg-ivory shadow-card transition-shadow hover:shadow-xl ${isReverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                  <div className="relative h-72 md:h-auto md:w-1/2">
                    <Image
                      src={imageUrl}
                      alt={venue.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12 lg:p-16">
                    <h3 className="display mb-4 text-3xl text-espresso sm:text-4xl">{venue.title}</h3>
                    <p className="mb-8 leading-loose text-espresso/70">
                      {venue.shortDescription}
                    </p>
                    <div>
                      <Link
                        href={`/events/${venue.slug}`}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-sage-dark px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory shadow-sm transition-all hover:bg-forest hover:shadow"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      
    </>
  )
}
