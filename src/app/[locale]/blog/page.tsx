import { setRequestLocale } from 'next-intl/server'
import Image from 'next/image'

import { Card } from '@/components/ui/Card'
import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StaggerGroup, StaggerItem } from '@/components/ui/motion'
import { getBlogPosts } from '@/lib/data'
import { PLACEHOLDER } from '@/lib/images'
import { breadcrumbSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'
import { Link } from '@/i18n/navigation'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Journal & Travel Guides',
  description:
    'Travel guides and stories from River Bank Jungle Resort — the best time to visit Chitwan, safari planning guides and things to do around the national park.',
  path: '/blog',
})

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const posts = await getBlogPosts()
  const fallbacks = [PLACEHOLDER.jungle, PLACEHOLDER.jeep, PLACEHOLDER.village]
  const [featured, ...remainingPosts] = posts

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Journal', path: '/blog' },
        ])}
      />
      <Hero
        size="banner"
        image={{ url: PLACEHOLDER.jungle, alt: 'Green canopy of sal forest in Chitwan National Park' }}
        label="Journal"
        title="Stories & Travel Guides"
        subtitle="Practical guides to Chitwan from the people who live beside the park."
      />

      <section className="grain bg-ivory py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <SectionHeading label="Soon" title="First Stories Coming Shortly" />
          ) : (
            <>
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid gap-8 border-b border-espresso/15 pb-16 md:grid-cols-12 md:gap-16 md:pb-24 lg:gap-20"
              >
                <div className="relative aspect-[16/10] overflow-hidden md:col-span-7 md:aspect-[4/3] lg:col-span-8">
                  <Image
                    src={resolveMedia(featured.coverImage, 'hero')?.url ?? fallbacks[0]}
                    alt={resolveMedia(featured.coverImage, 'hero')?.alt ?? featured.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 66vw"
                    className="img-grade object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-col justify-center md:col-span-5 lg:col-span-4">
                  <p className="kicker mb-4 text-gold-dark">Featured story</p>
                  <h2 className="display text-[clamp(2.15rem,4.2vw,3.7rem)] leading-tight text-espresso group-hover:text-espresso-light transition-colors duration-300">
                    {featured.title}
                  </h2>
                  <p className="mt-6 text-[16px] leading-[1.8] text-espresso/75">
                    {featured.excerpt}
                  </p>
                  <span className="link-line mt-10 self-start text-espresso group-hover:text-gold-dark">
                    Read the story
                  </span>
                </div>
              </Link>

              <div className="mt-16 md:mt-24">
                {remainingPosts.length > 0 && (
                  <SectionHeading
                    label="More from the riverbank"
                    title="Plan a richer Chitwan stay"
                    className="mb-14 md:mb-20"
                  />
                )}
                <StaggerGroup className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:gap-x-12 lg:gap-y-20">
                  {remainingPosts.map((post, i) => (
                    <StaggerItem key={post.id}>
                      <Card
                        image={
                          resolveMedia(post.coverImage, 'card') ?? {
                            url: fallbacks[(i + 1) % fallbacks.length],
                            alt: post.title,
                            width: 1600,
                            height: 1067,
                          }
                        }
                        title={post.title}
                        description={post.excerpt}
                        href={`/blog/${post.slug}`}
                        meta={
                          post.publishedDate
                            ? new Date(post.publishedDate).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })
                            : undefined
                        }
                      />
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
