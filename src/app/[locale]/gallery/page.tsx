import { setRequestLocale } from 'next-intl/server'

import { GalleryGrid, type GalleryItem } from '@/components/GalleryGrid'
import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { FadeUp } from '@/components/ui/motion'
import { getGalleryImages, getSiteSettings } from '@/lib/data'
import { PLACEHOLDER } from '@/lib/images'
import { breadcrumbSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Gallery',
  description:
    'Photo gallery of River Bank Jungle Resort, Chitwan — rooms, riverside dining, wildlife on the Rapti River and Tharu cultural evenings in Patihani.',
  path: '/gallery',
})

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const images = await getGalleryImages()
  const settings = await getSiteSettings().catch(() => null)

  const items: GalleryItem[] = images.flatMap((img) => {
    const full = resolveMedia(img.image, 'hero')
    const thumb = resolveMedia(img.image, 'card') ?? full
    if (!full || !thumb) return []
    return [
      {
        id: img.id,
        url: full.url,
        thumbUrl: thumb.url,
        alt: full.alt || img.caption || 'River Bank Jungle Resort',
        caption: img.caption,
        category: img.category,
        width: full.width,
        height: full.height,
      },
    ]
  })

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Gallery', path: '/gallery' },
        ])}
      />
      <Hero
        size="banner"
        image={resolveMedia(settings?.galleryBanner, 'hero') ?? { url: PLACEHOLDER.rhino, alt: 'One-horned rhinoceros grazing in Terai grassland' }}
        label="See"
        title="Gallery"
        subtitle="The resort, the river and the park — as our guests find them."
      />

      <section className="grain bg-ivory py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {items.length === 0 ? (
            <SectionHeading
              label="Coming Soon"
              title="Photographs Are On Their Way"
              intro="Gallery images are managed in the CMS — add some under Gallery Images in the admin panel."
            />
          ) : (
            <FadeUp>
              <GalleryGrid items={items} />
            </FadeUp>
          )}
        </div>
      </section>
    </>
  )
}
