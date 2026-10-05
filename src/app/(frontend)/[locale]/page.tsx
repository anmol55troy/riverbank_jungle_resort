import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'

import { BookingWidget } from '@/components/BookingWidget'
import { GoldExternal, TextExternal, TextLink } from '@/components/Buttons'
import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'
import { SalBranchMotif } from '@/components/Motifs'
import { RiverRule } from '@/components/RiverRule'
import { SectionHeading } from '@/components/SectionHeading'
import { FadeUp } from '@/components/motion'
import { TestimonialCarousel } from '@/components/TestimonialCarousel'
import { CertificateCarousel } from '@/components/CertificateCarousel'
import { PropertyImageSlider } from '@/components/PropertyImageSlider'
import { Link } from '@/i18n/navigation'
import { DEFAULTS } from '@/lib/constants'
import {
  getDiningVenues,
  getExperiences,
  getRooms,
  getSiteSettings,
  getTestimonials,
} from '@/lib/data'
import { PLACEHOLDER } from '@/lib/images'
import { reviewsSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'River Bank Jungle Resort | Waterfront Cabins & Luxury Resort in Chitwan',
  description:
    'Experience waterfront river cabins and luxury stays at River Bank Jungle Resort in Patihani. Located on the Rapti River banks beside Chitwan National Park, offering jeep safaris and canoe rides.',
  path: '/',
  isHome: true,
})

/** Fallback thumbnails for the excursion list, used until the CMS has an image. */
const EXPERIENCE_FALLBACKS = [
  PLACEHOLDER.canoe,
  PLACEHOLDER.jungle,
  PLACEHOLDER.bird,
  PLACEHOLDER.crocodile,
  PLACEHOLDER.culture,
  PLACEHOLDER.village,
  PLACEHOLDER.sunset,
]

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const [rooms, experiences, dining, testimonials, settings] = await Promise.all([
    getRooms(),
    getExperiences(),
    getDiningVenues(),
    getTestimonials(),
    getSiteSettings().catch(() => null),
  ])

  const bookingUrl = settings?.bookingUrl || DEFAULTS.bookingUrl
  const virtualTourUrl = settings?.virtualTourUrl || DEFAULTS.virtualTourUrl

  const [featured, ...restExperiences] = experiences

  return (
    <>
      <JsonLd data={reviewsSchema(testimonials)} />

      <Hero
        video={{
          url: '/hero/river-bank-hero.mp4',
          poster: '/hero/river-bank-hero-poster.webp',
          title: 'River Bank Jungle Resort beside the Rapti River',
        }}
        slides={[
          {
            url: '/hero/slider1.webp',
            alt: 'Evening falls over River Bank Jungle Resort — the main lodge and pool at dusk',
          },
          {
            url: '/media/facilities-banner.webp',
            alt: 'The swimming pool and main lodge at dusk, water reflecting the evening sky',
          },
          {
            url: '/hero/slider2.webp',
            alt: 'Twin villa wings glowing at dusk across the resort lawns',
          },
          {
            url: '/hero/riverside.webp',
            alt: 'Guests at breakfast on the terrace above the Rapti River',
          },
          {
            url: '/hero/slider6.webp',
            alt: 'Deluxe twin room with carved timber ceiling and Tibetan tiger rug',
          },
          {
            url: '/hero/riverbank.webp',
            alt: 'The resort at night from above, beside the dark ribbon of the Rapti',
          },
        ]}
        title={
          <>
            Where the Rapti <em>slows</em>,<br />
            the jungle begins
          </>
        }
        subtitle="A riverside lodge on the quiet side of Chitwan — safari mornings, slow afternoons, dinner under the Terai sky."
      >
        <BookingWidget bookingUrl={bookingUrl} />
        <TextExternal href={virtualTourUrl} light>
          Walk Through in 360°
        </TextExternal>
      </Hero>

      <section className="grain relative z-20 -mt-1 border-y border-sage-dark/30 bg-ivory shadow-[0_12px_30px_-24px_rgba(32,55,45,0.6)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-[1.25fr_1fr_1fr] md:items-center md:gap-10 md:py-14">
          <div>
            <p className="kicker mb-2">Plan your stay</p>
            <h2 className="display text-2xl sm:text-3xl">Your time by the Rapti starts here.</h2>
          </div>
          <p className="text-sm leading-7 text-espresso/65">
            Check our best available rates, choose your room and let us arrange the river, safari and airport pickup.
          </p>
          <GoldExternal href={bookingUrl} className="w-full md:w-auto">Check availability</GoldExternal>
        </div>
      </section>

      <section aria-label="Awards and guest review certificates" className="grain relative overflow-hidden border-y border-sage/40 bg-cream py-20 sm:py-24 lg:py-32">
        {/* Left top botanical leaf accent framing the section header without encroaching on carousel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-6 -top-4 z-10 hidden h-56 w-48 sm:h-64 sm:w-56 md:h-72 md:w-64 lg:w-72 md:block opacity-75"
          style={{
            backgroundImage: "url('/textures/leaves.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'left top',
            maskImage: 'radial-gradient(ellipse at 10% 10%, black 35%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 10% 10%, black 35%, transparent 72%)',
            filter: 'drop-shadow(3px 8px 20px rgba(26,46,36,0.22))',
          }}
        />

        {/* Right top botanical leaf accent framing the section header without encroaching on carousel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-4 z-10 hidden h-56 w-48 sm:h-64 sm:w-56 md:h-72 md:w-64 lg:w-72 md:block opacity-75"
          style={{
            backgroundImage: "url('/textures/leaves.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'right top',
            maskImage: 'radial-gradient(ellipse at 90% 10%, black 35%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 90% 10%, black 35%, transparent 72%)',
            filter: 'drop-shadow(-3px 8px 20px rgba(26,46,36,0.22))',
          }}
        />

        <div className="relative z-20 mx-auto mb-8 max-w-7xl px-4 text-center sm:px-6">
          <p className="kicker mb-2 font-extrabold text-sm">Verified Guest Recognition</p>
          <h2 className="display text-[clamp(1.9rem,3.8vw,3rem)]">
            Awarded by the world&rsquo;s <em className="italic">most trusted</em> travel platforms
          </h2>
          <RiverRule className="mx-auto mt-6" />
        </div>

        <div className="relative z-20">
          <CertificateCarousel />
        </div>
      </section>

      {/* The property — asymmetric editorial spread with automatic image slider */}
      <section className="grain relative overflow-hidden bg-ivory py-20 sm:py-24 lg:py-32">
        <SalBranchMotif className="absolute -top-6 right-0 hidden h-44 text-gold opacity-[0.14] lg:block" />
        <div className="relative mx-auto grid max-w-7xl min-w-0 gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-12 lg:items-stretch lg:gap-14">
          <FadeUp className="flex flex-col justify-center min-w-0 max-w-full lg:col-span-5 lg:pr-4">
            <h2 className="display text-[clamp(2rem,4.2vw,3.4rem)]">
              A riverside address in Nepal&rsquo;s <em className="italic">first</em> national park
            </h2>
            <RiverRule className="mt-6" />
            <div className="mt-8 space-y-5 text-base sm:text-[17px] font-medium leading-[1.8] text-espresso text-justify">
              <p>
                River Bank sits in Patihani, on the stretch of the Rapti most visitors never see. The lawns
                end at the water; the water ends at the sal forest of Chitwan National Park. Mornings begin
                with mist and the call of peafowl, and end beside a fire with the jungle at your back.
              </p>
              <p>
                Twenty-two air-conditioned rooms, suites and villas face the river and the grasslands beyond.
                Every stay is built around the park — jeeps at first light, dugout canoes drifting past
                basking gharials, Tharu villages a short walk from the gate.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-3.5 sm:gap-5">
              <Link
                href="/about"
                className="inline-flex min-h-12 items-center justify-center bg-gold px-6 sm:px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-espresso shadow-md transition-all duration-300 hover:bg-gold-dark hover:text-ivory focus-visible:ring-2 focus-visible:ring-gold"
              >
                Our Story
              </Link>
              <Link
                href="/experiences"
                className="inline-flex min-h-12 items-center justify-center border-2 border-espresso bg-transparent px-6 sm:px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-espresso transition-all duration-300 hover:bg-espresso hover:text-ivory focus-visible:ring-2 focus-visible:ring-espresso"
              >
                Days in the Park
              </Link>
            </div>
          </FadeUp>

          <div className="relative flex flex-col min-w-0 max-w-full lg:col-span-7">
            <FadeUp delay={0.1} className="w-full h-full min-w-0 max-w-full flex flex-col">
              <PropertyImageSlider className="w-full h-full min-w-0 max-w-full" />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Full-bleed 3-column highlight banner — Stay, Dine, Experience */}
      <section aria-label="Resort Highlights" className="relative w-full overflow-hidden bg-espresso">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {[
            {
              label: 'STAY',
              title: 'Modern Comfort',
              buttonText: 'OUR SUITE ROOMS',
              href: '/rooms',
              image: resolveMedia(rooms[0]?.gallery?.[0]?.image, 'hero') ?? {
                url: PLACEHOLDER.room,
                alt: 'Modern Comfort suite rooms at River Bank Jungle Resort',
                width: 1600,
                height: 1067,
              },
            },
            {
              label: 'DINE',
              title: 'Diverse Gastronomy',
              buttonText: 'OUR DINING EXPERIENCE',
              href: '/dining',
              image: resolveMedia(dining[0]?.image, 'hero') ?? {
                url: '/hero/pouring-wine.jpg',
                alt: 'Diverse Gastronomy dining experience at River Bank Jungle Resort',
                width: 1600,
                height: 1067,
              },
            },
            {
              label: 'EXPERIENCE',
              title: 'Endless Adventures',
              buttonText: 'ALL THE ACTIVITIES',
              href: '/experiences',
              image: resolveMedia(featured?.image, 'hero') ?? {
                url: PLACEHOLDER.jeep,
                alt: 'Endless Adventures jungle safari experience at River Bank Jungle Resort',
                width: 1600,
                height: 1067,
              },
            },
          ].map((tile) => (
            <Link
              key={tile.label}
              href={tile.href}
              className="group relative flex h-[480px] sm:h-[560px] md:h-[640px] lg:h-[720px] w-full items-center justify-center overflow-hidden"
            >
              <Image
                src={tile.image.url}
                alt={tile.image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="img-grade object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/35 transition-colors duration-500 group-hover:bg-black/45" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/35" />

              <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
                <span className="mb-3 sm:mb-4 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-white/90">
                  {tile.label}
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl lg:text-[2.85rem] font-normal leading-tight text-white drop-shadow-md">
                  {tile.title}
                </h3>
                <span className="mt-6 sm:mt-8 inline-flex items-center justify-center border border-white/70 px-6 py-2.5 sm:px-8 sm:py-3 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-[1px] transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-espresso group-hover:shadow-md">
                  {tile.buttonText}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>



      {/* The Experience — 4 highlighted visual panels matching the reference image */}
      <section aria-label="Resort Experiences" className="relative w-full overflow-hidden">
        {/* Section Header with authentic Nepali Lokta Kagaz texture */}
        <div className="grain relative w-full bg-ivory pt-20 pb-16 sm:pt-24 lg:pt-32">
          <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
            <SectionHeading
              label="The Park"
              title={
                <>
                  The <em className="italic">Experience</em>
                </>
              }
              intro="Through our personalized service & thoughtful curated excursions, we create memories that will last a lifetime."
              align="center"
            />
          </div>
        </div>

        {/* 4 Full-Bleed Edge-to-Edge Visual Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 w-full overflow-hidden bg-espresso">
          {[
            {
              title: 'RECREATION',
              href: '/experiences',
              image: '/media/Recreation.jpg',
              alt: 'Recreation, swimming pool and leisure at River Bank Jungle Resort',
            },
            {
              title: 'JEEP SAFARI',
              href: '/experiences',
              image: '/media/Jeep safari.jpg',
              alt: 'Open 4x4 Jeep Safari through Chitwan National Park',
            },
            {
              title: 'CANOEING SAFARI',
              href: '/experiences',
              image: '/media/canoing safari.jpg',
              alt: 'Traditional dugout canoe safari along the Rapti River',
            },
            {
              title: 'THARU CULTURAL DANCE',
              href: '/experiences',
              image: '/media/tharu dance.webp',
              alt: 'Authentic Tharu cultural dance and performance',
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative flex h-[460px] sm:h-[520px] md:h-[580px] lg:h-[640px] w-full items-center justify-center overflow-hidden"
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="img-grade object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/45" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

              <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
                <h3 className="font-serif text-sm sm:text-base md:text-lg font-medium tracking-[0.26em] text-white drop-shadow-md transition-all duration-300 group-hover:text-gold group-hover:scale-105">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Discover More CTA Button with authentic Nepali Lokta Kagaz texture */}
        <div className="grain relative flex items-center justify-center bg-ivory pt-16 pb-20 sm:pb-24 lg:pb-32">
          <div className="relative z-10">
            <Link
              href="/experiences"
              className="inline-flex min-h-12 items-center justify-center bg-gold px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-espresso shadow-md transition-all duration-300 hover:bg-gold-dark hover:text-ivory focus-visible:ring-2 focus-visible:ring-gold"
            >
              Discover More
            </Link>
          </div>
        </div>
      </section>

      {/* Commitment to Greener Tomorrow — Full-bleed Sustainability Banner */}
      <section aria-label="Sustainability" className="relative w-full overflow-hidden bg-espresso py-24 sm:py-32 lg:py-40 flex items-center justify-center">
        {/* Background Image */}
        <Image
          src="/media/sustanibility.webp"
          alt="River Bank Jungle Resort grounds and organic gardens"
          fill
          sizes="100vw"
          className="img-grade object-cover"
        />

        {/* Dark vignette and atmospheric scrim */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/55" />

        {/* Centered Content matching reference image */}
        <FadeUp className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-medium uppercase tracking-[0.18em] sm:tracking-[0.22em] text-white drop-shadow-md">
            COMMITMENT TO GREENER TOMORROW
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-xs sm:text-sm md:text-[15px] leading-relaxed sm:leading-[1.9] text-white/90 drop-shadow-sm font-normal">
            At River Bank, our commitment to environmental responsibility shines through our organic farming, ensuring a supply of fresh, chef-crafted meals. Explore our gardens, where herbs naturally protect our crops, and seasonal rotations enrich our cuisine. Our dedication extends to efficient waste management and rainwater harvesting, showcasing our commitment to sustainable practices.
          </p>
        </FadeUp>
      </section>

      {/* White Nepali Kagaz Divider Band with Golden Learn More Button */}
      <div className="grain relative flex items-center justify-center bg-ivory py-16 sm:py-20">
        <div className="relative z-10 flex justify-center">
          <Link
            href="/sustainability"
            className="inline-flex min-h-12 items-center justify-center bg-gold px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-espresso shadow-md transition-all duration-300 hover:bg-gold-dark hover:text-ivory focus-visible:ring-2 focus-visible:ring-gold"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Guest book */}
      {testimonials.length > 0 && (
        <section className="relative overflow-hidden bg-espresso py-20 sm:py-24 lg:py-32">
          <Image
            src={PLACEHOLDER.sunset}
            alt=""
            fill
            sizes="100vw"
            className="img-grade object-cover opacity-15"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading label="Guest Book" title="In their words" dark align="center" />
            <FadeUp>
              <TestimonialCarousel
                items={testimonials.map((t) => ({
                  id: t.id,
                  quote: t.quote,
                  guestName: t.guestName,
                  country: t.country,
                  source: t.source,
                  rating: t.rating ?? 5,
                  sourceUrl: t.sourceUrl,
                }))}
              />
            </FadeUp>
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-espresso py-24 sm:py-32 lg:py-40 text-center">
        <Image
          src={PLACEHOLDER.terrace}
          alt=""
          fill
          sizes="100vw"
          className="img-grade object-cover opacity-20"
          aria-hidden="true"
        />
        <FadeUp className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <p className="kicker-light mb-5">Reservations</p>
          <h2 className="display !text-ivory text-[clamp(2.2rem,5vw,4rem)]">
            The river is an <em className="italic text-gold">early riser</em>
          </h2>
          <RiverRule className="mx-auto mt-7" />
          <p className="mx-auto mt-7 max-w-xl text-[15px] leading-[1.85] text-ivory/70">
            So is the safari jeep. Book direct for the best rate and we&rsquo;ll have the permits, the
            airport pickup and the first pot of tea arranged before you arrive.
          </p>
          <div className="mt-11 flex flex-col items-center justify-center gap-7 sm:flex-row sm:gap-10">
            <GoldExternal href={bookingUrl}>Book Now</GoldExternal>
            <TextLink href="/contact" light>
              Talk to Us
            </TextLink>
          </div>
        </FadeUp>
      </section>
    </>
  )
}
