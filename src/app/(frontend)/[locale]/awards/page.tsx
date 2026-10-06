import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'

import { Hero } from '@/components/frontend/Hero'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Awards & Recognition',
  description:
    'See the guest review awards and recognition received by River Bank Jungle Resort in Chitwan, Nepal.',
  path: '/awards',
})

const AWARDS = [
  { src: '/awards/booking.png', alt: 'Booking.com award for River Bank Jungle Resort', name: 'Booking.com' },
  { src: '/awards/trip.jpg', alt: 'Trip.com award for River Bank Jungle Resort', name: 'Trip.com' },
  { src: '/awards/expedia.jpeg', alt: 'Expedia award for River Bank Jungle Resort', name: 'Expedia' },
  { src: '/awards/hotel.jpeg', alt: 'Hotels.com award for River Bank Jungle Resort', name: 'Hotels.com' },
]

export default async function AwardsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Hero
        size="banner"
        image={{ url: '/hero/slider1.webp', alt: 'River Bank Jungle Resort at dusk' }}
        label="Recognition"
        title="Honoured by our guests"
        subtitle="Every award reflects the care, hospitality and sense of place we share at the riverbank."
      />
      <main className="grain bg-ivory py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            align="center"
            label="Awards & guest reviews"
            title={<>A stay remembered <em className="italic">beyond checkout</em></>}
            intro="Our recognition comes from travellers who have stayed, explored Chitwan and shared their experience with the world."
          />
          <div className="grid items-center gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-14">
            {AWARDS.map((award) => (
              <figure key={award.name} className="flex min-h-52 flex-col items-center justify-center border-b border-espresso/10 pb-8 text-center sm:border-b-0">
                <div className="relative h-40 w-full">
                  <Image src={award.src} alt={award.alt} fill sizes="(max-width: 640px) 80vw, 22vw" className="object-contain" />
                </div>
                <figcaption className="mt-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-espresso/55">{award.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}