import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'

import { GoldLink, OutlineExternal } from '@/components/Buttons'
import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'
import { SectionHeading } from '@/components/SectionHeading'
import { FadeUp, StaggerGroup, StaggerItem } from '@/components/motion'
import { DEFAULTS } from '@/lib/constants'
import { getSiteSettings } from '@/lib/data'
import { PLACEHOLDER } from '@/lib/images'
import { breadcrumbSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'About Us',
  description:
    'The story of River Bank Jungle Resort in Patihani, Chitwan — a family-run riverside lodge on the Rapti River beside Chitwan National Park, Nepal.',
  path: '/about',
})

const pillars = [
  {
    title: 'On the Riverbank',
    body: 'Our lawns run down to the Rapti itself. Rhinos cross at dawn, gharials bask on the far bank, and the park begins where the water ends.',
  },
  {
    title: 'Rooted in Patihani',
    body: 'We are a short walk from Patihani village and its Tharu community — our guides, kitchens and cultural evenings all begin here.',
  },
  {
    title: 'Comfort Without Compromise',
    body: 'Air-conditioned rooms with marble floors, walk-in showers and balconies — the wild outside your window, none of it inside.',
  },
]

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const settings = await getSiteSettings().catch(() => null)
  const virtualTourUrl = settings?.virtualTourUrl || DEFAULTS.virtualTourUrl

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />
      <Hero
        size="banner"
        image={resolveMedia(settings?.aboutBanner, 'hero') ?? { url: PLACEHOLDER.about, alt: 'Sunlight falling through sal forest near the Rapti River' }}
        label="Our Story"
        title="A Lodge Shaped by the River"
      />

      <section className="grain bg-ivory py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <FadeUp>
            <p className="label-caps mb-3">About River Bank</p>
            <h2 className="font-serif text-3xl leading-tight text-espresso md:text-4xl">
              Between Patihani Village and the National Park
            </h2>
            <div className="hairline mt-5 ml-0" />
            <div className="mt-6 space-y-4 leading-relaxed text-espresso/75">
              <p>
                River Bank Jungle Resort stands at Bharatpur-22, Patihani, on the flat floodplain of the
                Terai where the Rapti River traces the northern boundary of Chitwan National Park. This is
                lowland Nepal — grasslands, sal forest and slow brown water — a landscape of rhinos, gharial
                crocodiles and more than 500 species of birds.
              </p>
              <p>
                The resort was built to feel like a village of its own: cottages and villas around gardens,
                a pool shaded by mango trees, and a riverside terrace where the day starts with tea and ends
                with a sundowner as the buffalo come home across the shallows.
              </p>
              <p>
                We are about 165 km from Kathmandu — a 25-minute flight to Bharatpur followed by a 30-minute
                drive, or a five-to-six-hour road journey from Kathmandu or Pokhara. Airport pickup is
                arranged on request.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <GoldLink href="/rooms">Explore Rooms</GoldLink>
              <OutlineExternal href={virtualTourUrl}>Take the 360° Tour</OutlineExternal>
            </div>
          </FadeUp>
          <FadeUp delay={0.1} className="relative aspect-4/5 overflow-hidden rounded-lg shadow-card">
            <Image
              src={resolveMedia(settings?.aboutSecondaryImage, 'card')?.url ?? PLACEHOLDER.resort}
              alt={resolveMedia(settings?.aboutSecondaryImage, 'card')?.alt || "Resort cottages set in tropical gardens at River Bank Jungle Resort"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </FadeUp>
        </div>
      </section>

      <section className="grain bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading label="Why River Bank" title="What Makes This Place Itself" />
          <StaggerGroup className="grid gap-7 md:grid-cols-3">
            {pillars.map((pillar) => (
              <StaggerItem key={pillar.title}>
                <div className="grain h-full rounded-lg bg-white p-8 shadow-card">
                  <h3 className="font-serif text-xl text-espresso">{pillar.title}</h3>
                  <div className="my-4 h-px w-10 bg-gold" />
                  <p className="text-sm leading-relaxed text-espresso/70">{pillar.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="grain bg-ivory py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <FadeUp>
            <SectionHeading
              label="Responsible Travel"
              title="Light Footprints on the Floodplain"
              intro="From solar water heating to hiring and buying locally in Patihani, we try to keep the resort's weight on this landscape as light as a canoe on the Rapti."
            />
            <GoldLink href="/sustainability">Our Sustainability Commitments</GoldLink>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
