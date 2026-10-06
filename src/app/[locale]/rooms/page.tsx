import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { getSiteSettings, getRooms } from '@/lib/data'

import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link } from '@/i18n/navigation'
import { PLACEHOLDER } from '@/lib/images'
import { breadcrumbSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Rooms & Suites',
  description:
    'Deluxe rooms, super deluxe rooms and villas with private plunge pools at River Bank Jungle Resort, Patihani, Chitwan — AC, balconies, marble floors and jungle views.',
  path: '/rooms',
})

export default async function RoomsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const settings = await getSiteSettings().catch(() => null)
  const rooms = await getRooms()
  const roomShowcase = rooms.slice(0, 3).map((room) => ({
    slug: room.slug,
    title: room.title,
    image: resolveMedia(room.gallery?.[0]?.image, 'card')?.url || PLACEHOLDER.room,
    alt: room.title,
  }))

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Rooms & Suites', path: '/rooms' },
        ])}
      />
      <Hero
        size="banner"
        image={resolveMedia(settings?.roomsBanner, 'hero') ?? { url: PLACEHOLDER.room, alt: 'A softly lit resort bedroom with a balcony facing the jungle' }}
        label="Stay"
        title="Rooms & Suites"
        subtitle="Every room faces the river or the gardens — cool marble underfoot, the Terai at the window."
      />

      {/* 3 Full-Bleed Edge-to-Edge Accommodation Showcase */}
      <section aria-label="Luxury Accommodation" className="relative w-full overflow-hidden">
        {/* Header with authentic Nepali Lokta Kagaz texture and standardized editorial typography */}
        <div className="grain relative w-full bg-ivory pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28">
          <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
            <SectionHeading
              label="Minimalist Jungle Design and a Dialogue with Nature"
              title={
                <>
                  Luxury Accommodation in <em className="italic">Chitwan</em>
                </>
              }
              intro={
                <>
                  Gaze at the lush sal forests of Chitwan National Park and the tranquil waters of the Rapti River while enjoying refined modern comfort. Choose from our distinct accommodation options offering an oasis of serenity and relaxing ambiance tailored to your every need.
                  <span className="mt-3 block text-espresso/70">
                    All suites and villas feature custom handcrafted furniture, individual climate control, marble bathrooms, and private balconies overlooking the river and gardens.
                  </span>
                </>
              }
              align="center"
            />
          </div>
        </div>

        {/* 3 Full-Bleed Edge-to-Edge Room Columns using provided images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 w-full overflow-hidden bg-espresso">
          {roomShowcase.map((room) => (
            <Link
              key={room.slug}
              href={`/rooms/${room.slug}`}
              className="group relative flex h-[520px] sm:h-[600px] md:h-[680px] lg:h-[760px] w-full items-center justify-center overflow-hidden"
            >
              <Image
                src={room.image}
                alt={room.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="img-grade object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/25 transition-colors duration-500 group-hover:bg-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25" />

              {/* Centered thin bordered rectangle button matching reference image */}
              <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
                <span className="inline-flex items-center justify-center border border-white/80 bg-black/20 px-6 py-2.5 sm:px-8 sm:py-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-[2px] transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-espresso group-hover:shadow-lg">
                  {room.title}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Small White Nepali Kagaz Divider Band between the accommodation section and the footer */}
        <div className="grain relative w-full bg-ivory py-8 sm:py-12 md:py-14" />
      </section>
    </>
  )
}
