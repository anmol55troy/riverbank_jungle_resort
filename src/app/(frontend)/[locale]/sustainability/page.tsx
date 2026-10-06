import { setRequestLocale } from 'next-intl/server'
import { getSiteSettings } from '@/lib/data'
import Image from 'next/image'

import { Hero } from '@/components/frontend/Hero'
import { JsonLd } from '@/components/frontend/JsonLd'
import { FadeUp } from '@/components/ui/motion'
import { PLACEHOLDER } from '@/lib/images'
import { breadcrumbSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Sustainability',
  description:
    'How River Bank Jungle Resort protects the Rapti riverbank and supports the Patihani community — local hiring, plastic reduction, solar heating and responsible safaris.',
  path: '/sustainability',
})



export default async function SustainabilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const settings = await getSiteSettings().catch(() => null)
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Sustainability', path: '/sustainability' },
        ])}
      />
      <Hero
        size="banner"
        image={resolveMedia(settings?.sustainabilityBanner, 'hero') ?? { url: PLACEHOLDER.sustainability, alt: 'Morning light over the river and grassland' }}
        label="Responsible Travel"
        title="Sustainability"
        subtitle="The park gives us everything. This is how we give back."
      />

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <FadeUp>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-wide text-espresso uppercase mb-6">
              COMMITMENT TO <span className="text-[#0a6625] font-bold">GREENER TOMORROW</span>
            </h2>
            <p className="text-[14px] leading-relaxed text-espresso/80 max-w-4xl mx-auto">
              At River Bank, our commitment to environmental responsibility shines through our organic farming, ensuring a supply of fresh, chef-crafted meals. Explore our gardens, where herbs naturally protect our crops, and seasonal rotations enrich our cuisine. Our dedication extends to efficient waste management and rainwater harvesting, showcasing our commitment to sustainable practices
            </p>
          </FadeUp>

          <FadeUp delay={0.1} className="mt-16 mb-16">
             <Image src="/sustainability/ecosystem.png" alt="Ecosystem" width={1200} height={400} className="w-full h-auto object-contain" />
          </FadeUp>

          <FadeUp delay={0.2} className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-100 bg-[#eae8e3]">
            <div className="flex flex-col sm:flex-row items-center text-left">
              <div className="bg-[#0a6625] p-8 flex items-center justify-center min-w-[120px] self-stretch">
                <Image src="/sustainability/plant-9.png" alt="" width={60} height={60} className="object-contain filter invert brightness-0" /> 
              </div>
              <div className="p-6">
                <p className="text-[13px] leading-relaxed text-espresso/80">
                  It is not something we do, it is who we are. Believing in Mother Nature and practitioner on the same, we are contributing to the better place to live for everyone.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center text-left bg-[#e3e0da]">
              <div className="bg-[#0a6625] p-8 flex items-center justify-center min-w-[120px] self-stretch">
                <Image src="/sustainability/riverbank.png" alt="" width={60} height={60} className="object-contain filter invert brightness-0" /> 
              </div>
              <div className="p-6">
                <p className="text-[13px] leading-relaxed text-espresso/80">
                  River bank practice waste reduction, recycling effort ans zero waste initiatives. We supremely trust the process of composting and the use or reuse or biodegradable amenities.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-espresso flex items-center justify-center min-h-[500px]">
        <Image
          src="/media/sustanibility.webp"
          alt="Sustainability Background"
          fill
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 w-full py-20 md:py-28">
          <FadeUp className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="w-full md:w-1/3 flex justify-center">
              <Image src="/sustainability/pillars.png" alt="Go Green Lifestyle" width={300} height={300} className="object-contain" />
            </div>

            <div className="w-full md:w-2/3 bg-[#2a2a2a]/60 backdrop-blur-sm rounded-xl p-8 md:p-10 border border-white/10 shadow-2xl">
              
              <div className="flex flex-col sm:flex-row gap-6 mb-8 items-start">
                <div className="flex-shrink-0 w-16 h-16 relative">
                  <Image src="/sustainability/earth.png" alt="" fill className="object-contain filter invert brightness-0" />
                </div>
                <div>
                  <p className="text-white text-sm leading-[1.8] font-light">
                    We stakeholders, being a naturalist, are the practitioner of trans-formative journey towards responsibility future. Believing in sustainable ecosystem, we make an efforts towards wildlife conservation, such as preserving natural habitat through collaboration with local conservation organizations.
                  </p>
                </div>
              </div>

              <div className="w-full h-px bg-white/20 mb-8" />

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 relative">
                  <Image src="/sustainability/plant-9.png" alt="" fill className="object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(87%) saturate(583%) hue-rotate(97deg) brightness(94%) contrast(92%)' }} /> 
                </div>
                <div>
                  <p className="text-white text-sm leading-[1.8] font-light">
                    Our sustainability journey is anchored by four essential pillars: Environmental Responsibility, Corporate Social Responsibility, Organic Farm, and Rain Water Harvest. We stakeholders, being a naturalist, are the practitioner of trans-formative journey towards responsibility future.
                  </p>
                </div>
              </div>

            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
