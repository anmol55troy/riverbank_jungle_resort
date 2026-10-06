import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { OutlineLink } from '@/components/ui/Buttons'
import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'
import { RichText } from '@/components/ui/RichText'
import { FadeUp, StaggerGroup, StaggerItem } from '@/components/ui/motion'

import { getExperiences, getRoomBySlug, getRooms, getSiteSettings } from '@/lib/data'
import { PLACEHOLDER } from '@/lib/images'
import { breadcrumbSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const rooms = await getRooms().catch(() => [])
  return rooms.flatMap((room) => (room.slug ? [{ locale: 'en', slug: room.slug }] : []))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const room = await getRoomBySlug(slug)
  if (!room) return {}

  return buildMetadata({
    title: room.title,
    description: room.shortDescription,
    path: `/rooms/${room.slug}`,
    image: resolveMedia(room.gallery?.[0]?.image, 'og')?.url,
    imageAlt: room.title,
  })
}

import {
  Maximize,
  Users,
  Grid,
  PanelBottom,
  ShowerHead,
  Coffee,
  Vault,
  Wind,
  Flashlight,
  Sofa,
  AirVent,
  Wifi,
  Layers,
  Footprints,
  ConciergeBell,
  Droplets,
  Sparkles,
  Tv,
  Shirt,
  Flame,
  Trees,
  Bath,
  AlarmClock,
  CheckCircle2,
} from 'lucide-react'

function getFeatureIcon(label: string) {
  const l = label.toLowerCase()
  if (l.includes('occupancy') || l.includes('adult') || l.includes('person')) return <Users className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  return <Maximize className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
}

function getAmenityIcon(name: string) {
  const n = name.toLowerCase()
  if (n.includes('marble')) return <Grid className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('balcony')) return <PanelBottom className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('shower')) return <ShowerHead className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('coffee') || n.includes('kettle')) return <Coffee className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('safety') || n.includes('box')) return <Vault className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('iron') || n.includes('hairdryer')) return <Wind className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('torch')) return <Flashlight className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('seating')) return <Sofa className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('air condition')) return <AirVent className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('wifi')) return <Wifi className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('towel')) return <Layers className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('slipper')) return <Footprints className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('service')) return <ConciergeBell className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('toiletries')) return <Droplets className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('dental')) return <Sparkles className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('tv')) return <Tv className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('bathrobe')) return <Shirt className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('water')) return <Flame className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('jungle')) return <Trees className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('bath')) return <Bath className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  if (n.includes('wakeup')) return <AlarmClock className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
  
  return <CheckCircle2 className="h-6 w-6 text-gray-600" strokeWidth={1.5} />
}

export default async function RoomDetailPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const [room, experiences, settings] = await Promise.all([
    getRoomBySlug(slug),
    getExperiences(),
    getSiteSettings().catch(() => null),
  ])
  if (!room) notFound()

  const heroImage = resolveMedia(room.gallery?.[0]?.image, 'hero') ?? {
    url: PLACEHOLDER.room,
    alt: room.title,
    width: 1920,
    height: 1280,
  }
  const galleryImages = (room.gallery ?? [])
    .map((g) => resolveMedia(g.image, 'card'))
    .filter((img): img is NonNullable<typeof img> => img !== null)

  const amenities = (room.amenities ?? []).flatMap((a) =>
    typeof a === 'object' && a !== null ? [a.name] : [],
  )

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Rooms & Suites', path: '/rooms' },
          { name: room.title, path: `/rooms/${room.slug}` },
        ])}
      />
      <Hero size="banner" image={heroImage} label="Rooms & Suites" title={room.title} />

      <section className="grain bg-white py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <FadeUp>
            <h1 className="mb-6 text-2xl font-serif font-bold text-[#1e5b87] md:text-3xl">"{room.title}"</h1>
            <div className="text-gray-700 leading-relaxed">
              <RichText data={room.description} />
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-10 grid grid-cols-2 gap-4">
                {galleryImages.slice(1).map((img) => (
                  <div key={img.url} className="relative aspect-4/3 overflow-hidden rounded-lg shadow-card">
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </FadeUp>

          <FadeUp delay={0.1} className="mt-16 space-y-12">
            {(room.features ?? []).length > 0 && (
              <div>
                <h2 className="mb-8 font-serif font-bold text-xl text-[#1e5b87]">Room Features</h2>
                <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                  {(room.features ?? []).map((f) => (
                    <li key={f.id ?? f.label} className="flex items-center gap-4 text-sm text-gray-700">
                      {getFeatureIcon(f.label)}
                      <div className="flex flex-col">
                        {f.label.toLowerCase().includes('occupancy') ? (
                          <span>Occupancy: {f.value}</span>
                        ) : (
                          <span>{f.label}: {f.value}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {amenities.length > 0 && (
              <div>
                <h2 className="mb-8 font-serif font-bold text-xl text-[#1e5b87]">Room Amenities</h2>
                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {amenities.map((name) => (
                    <li key={name} className="flex items-center gap-4 text-sm text-gray-700">
                      {getAmenityIcon(name)}
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </FadeUp>
        </div>
      </section>

      {experiences.length > 0 && (
        <section className="grain bg-cream py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <FadeUp className="mb-10 text-center">
              <p className="label-caps mb-3">Beyond the Room</p>
              <h2 className="font-serif text-3xl text-espresso">Pair Your Stay With the Jungle</h2>
              <div className="hairline mt-5" />
            </FadeUp>
            <StaggerGroup className="grid gap-6 sm:grid-cols-3">
              {experiences.slice(0, 3).map((exp) => (
                <StaggerItem key={exp.id}>
                  <div className="grain rounded-lg bg-white p-6 shadow-card">
                    <h3 className="font-serif text-lg text-espresso">{exp.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-espresso/70">{exp.shortDescription}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
            <FadeUp className="mt-10 text-center">
              <OutlineLink href="/experiences">See All Experiences</OutlineLink>
            </FadeUp>
          </div>
        </section>
      )}
    </>
  )
}
