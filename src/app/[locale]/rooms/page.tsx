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
    'Deluxe rooms, super deluxe rooms and villas with private plunge pools at River Bank Jungle Resort, Patihani, Chitwan-AC, balconies, marble floors and jungle views.',
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
        subtitle="Every room faces the river or the gardens cool marble underfoot, the Terai at the window."
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

        {/* Room Showcase Grid */}
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
            {roomShowcase.map((room) => (
              <Link
                key={room.slug}
                href={`/rooms/${room.slug}`}
                className="group relative flex h-[480px] sm:h-[560px] lg:h-[640px] w-full items-end overflow-hidden rounded-sm"
              >
                <Image
                  src={room.image}
                  alt={room.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="img-grade object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-light/90 via-espresso/40 to-transparent opacity-80" />

                {/* Elegant bottom-aligned content */}
                <div className="relative z-10 p-6 sm:p-8 w-full">
                  <h3 className="display !text-ivory text-xl sm:text-2xl mb-3 translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                    {room.title}
                  </h3>
                  <div className="flex items-center opacity-0 transition-all duration-500 group-hover:opacity-100">
                    <span className="link-line-light !text-gold !text-[11px] sm:!text-xs">
                      Explore Room
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
