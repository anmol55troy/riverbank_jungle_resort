import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { OutlineLink } from '@/components/ui/Buttons'
import { JsonLd } from '@/components/JsonLd'
import { RichText } from '@/components/ui/RichText'
import { FadeUp } from '@/components/ui/motion'
import { Link } from '@/i18n/navigation'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/data'
import { PLACEHOLDER } from '@/lib/images'
import { blogPostingSchema, breadcrumbSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const posts = await getBlogPosts().catch(() => [])
  return posts.flatMap((post) => (post.slug ? [{ locale: 'en', slug: post.slug }] : []))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: resolveMedia(post.coverImage, 'og')?.url,
    imageAlt: post.title,
    type: 'article',
    publishedTime: post.publishedDate ?? undefined,
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  const cover = resolveMedia(post.coverImage, 'hero')
  const relatedRooms = (post.relatedRooms ?? []).flatMap((r) =>
    typeof r === 'object' && r !== null ? [r] : [],
  )
  const relatedExperiences = (post.relatedExperiences ?? []).flatMap((e) =>
    typeof e === 'object' && e !== null ? [e] : [],
  )

  return (
    <>
      <JsonLd
        data={blogPostingSchema({
          title: post.title,
          description: post.excerpt,
          slug: post.slug ?? slug,
          author: post.author,
          publishedDate: post.publishedDate,
          image: cover?.url ?? null,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Journal', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <article className="grain bg-ivory pt-28 md:pt-36">
        <header className="mx-auto max-w-4xl px-4 pb-12 text-center sm:px-6 md:pb-16">
          <p className="label-caps mb-4">
            {post.category ? post.category.replace(/-/g, ' ') : 'Journal'}
          </p>
          <h1 className="display text-[clamp(2.4rem,5vw,4.6rem)]">{post.title}</h1>
          <div className="hairline mt-6" />
          <p className="mt-5 text-sm text-espresso/60">
            {post.author}
            {post.publishedDate && (
              <>
                {' · '}
                <time dateTime={post.publishedDate}>
                  {new Date(post.publishedDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </>
            )}
          </p>
        </header>

        <div className="relative mx-auto aspect-[16/8] max-w-6xl overflow-hidden px-4 sm:px-6">
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={cover?.url ?? PLACEHOLDER.jungle}
              alt={cover?.alt ?? post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
          <RichText data={post.body} />

          {(relatedRooms.length > 0 || relatedExperiences.length > 0) && (
            <FadeUp className="grain mt-14 rounded-lg bg-cream p-8">
              <p className="label-caps mb-4">Continue Planning</p>
              <ul className="space-y-2.5">
                {relatedRooms.map((room) => (
                  <li key={`room-${room.id}`}>
                    <Link
                      href={`/rooms/${room.slug}`}
                      className="font-serif text-lg text-espresso underline-offset-4 hover:text-gold-dark hover:underline"
                    >
                      Stay: {room.title}
                    </Link>
                  </li>
                ))}
                {relatedExperiences.map((exp) => (
                  <li key={`exp-${exp.id}`}>
                    <Link
                      href="/experiences"
                      className="font-serif text-lg text-espresso underline-offset-4 hover:text-gold-dark hover:underline"
                    >
                      Do: {exp.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </FadeUp>
          )}

          <div className="mt-12 text-center">
            <OutlineLink href="/blog">Back to the Journal</OutlineLink>
          </div>
        </div>
      </article>
    </>
  )
}
