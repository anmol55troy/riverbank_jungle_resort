import { setRequestLocale } from 'next-intl/server'
import { getSiteSettings } from '@/lib/data'

import { EnquiryForm } from '@/components/EnquiryForm'
import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { FadeUp, StaggerGroup, StaggerItem } from '@/components/ui/motion'
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

const venues = [
  {
    title: 'Riverside Lawn',
    body: 'Open-air ceremonies and receptions on the banks of the Rapti — space for up to 200 guests with the park as your backdrop.',
  },
  {
    title: 'Conference Hall',
    body: 'An air-conditioned hall for meetings, retreats and training days, with projector, sound and full-day catering from our kitchens.',
  },
  {
    title: 'Private Dinners',
    body: 'Long-table dinners under the trees or on the terrace — Tharu dance performances and bonfires on request.',
  },
]

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const settings = await getSiteSettings().catch(() => null)
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

      <section className="grain bg-ivory py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading label="Spaces" title="Rooms to Gather, Lawns to Celebrate" />
          <StaggerGroup className="grid gap-7 md:grid-cols-3">
            {venues.map((venue) => (
              <StaggerItem key={venue.title}>
                <div className="grain h-full rounded-lg bg-white p-8 shadow-card">
                  <h3 className="font-serif text-xl text-espresso">{venue.title}</h3>
                  <div className="my-4 h-px w-10 bg-gold" />
                  <p className="text-sm leading-relaxed text-espresso/70">{venue.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="grain bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeading
            label="Enquire"
            title="Tell Us About Your Event"
            intro="Share a date and a rough guest count — our events team will reply with availability, menus and rates."
          />
          <FadeUp>
            <EnquiryForm formType="events" />
          </FadeUp>
        </div>
      </section>
    </>
  )
}
