import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { DEFAULTS, NAV_LINKS, SITE_NAME } from '@/lib/constants'
import type { SiteSetting } from '@/lib/types'

import { FacebookIcon, InstagramIcon, LinkedInIcon, MailIcon, PhoneIcon, PinIcon, TiktokIcon } from './ui/icons'
import { NewsletterForm } from './NewsletterForm'

type Props = {
  settings: SiteSetting | null
  logoUrl?: string
}

export async function Footer({ settings, logoUrl = '/logo.png' }: Props) {
  const t = await getTranslations('footer')
  const tNav = await getTranslations('nav')

  const phones = settings?.phones?.length ? settings.phones.map((p) => p.number) : [...DEFAULTS.phones]
  const emails = settings?.emails?.length ? settings.emails.map((e) => e.email) : [...DEFAULTS.emails]
  const address = settings?.address || DEFAULTS.address
  const mapEmbedUrl = DEFAULTS.mapEmbedUrl
  const virtualTourUrl = settings?.virtualTourUrl || DEFAULTS.virtualTourUrl

  const socials = [
    { href: settings?.facebook || DEFAULTS.facebook, label: 'Facebook', icon: FacebookIcon },
    { href: settings?.instagram || DEFAULTS.instagram, label: 'Instagram', icon: InstagramIcon },
    { href: settings?.linkedin || DEFAULTS.linkedin, label: 'LinkedIn', icon: LinkedInIcon },
    { href: settings?.tiktok || 'https://tiktok.com', label: 'TikTok', icon: TiktokIcon },
  ]

  const otas = [
    { href: settings?.bookingCom || DEFAULTS.bookingCom, label: 'Booking.com' },
    { href: settings?.tripadvisor || DEFAULTS.tripadvisor, label: 'TripAdvisor' },
    { href: settings?.makemytrip || DEFAULTS.makemytrip, label: 'MakeMyTrip' },
    { href: 'https://www.agoda.com/river-bank-jungle-resort/hotel/chitwan-np.html?ds=nN5OhaZ1D55gnN3P', label: 'Agoda', image: '/media/agoda-logo.svg' },
    { href: 'https://www.expedia.co.in/River-Bank-Jungle-Resort.h100514483.Hotel-Information', label: 'Expedia' },
  ]

  return (
    <footer className="bg-espresso pb-6 pt-16 text-ivory sm:pt-20 lg:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1: Contact */}
          <div>
            <Image
              src={logoUrl}
              alt="River Bank Jungle Resort"
              width={155}
              height={80}
              className="mb-8 h-16 w-auto"
            />
            <ul className="flex flex-col">
              {!!address && (
                <li className="flex items-start gap-4 border-b border-ivory/10 py-4 first:pt-0">
                  <PinIcon className="mt-1 h-4 w-4 shrink-0 text-gold" />
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="font-medium text-ivory">{address}</span>
                  </div>
                </li>
              )}
              {emails.length > 0 && (
                <li className="flex items-start gap-4 border-b border-ivory/10 py-4 first:pt-0">
                  <MailIcon className="mt-1 h-4 w-4 shrink-0 text-gold" />
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="font-medium text-ivory">Email Address</span>
                    {Array.from(new Set([...emails, 'sales@riverbankjungleresort.com.np'])).map((email) => (
                      <a
                        key={email}
                        href={`mailto:${email}`}
                        className="text-xs text-ivory/50 transition-colors hover:text-gold"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </li>
              )}
              {phones.length > 0 && (
                <li className="flex items-start gap-4 border-b border-ivory/10 py-4 first:pt-0">
                  <PhoneIcon className="mt-1 h-4 w-4 shrink-0 text-gold" />
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="font-medium text-ivory">Call Us</span>
                    <a
                      href={`tel:${phones[0].replace(/[^0-9+]/g, '')}`}
                      className="text-xs text-ivory/50 transition-colors hover:text-gold"
                    >
                      {phones.join(', ')}
                    </a>
                  </div>
                </li>
              )}
              <li className="py-4">
                <div className="flex gap-4">
                  {socials.map(({ href, label, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="group flex items-center justify-center rounded border border-ivory/20 p-2 text-ivory/60 transition-colors hover:border-gold hover:text-gold"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-4 text-xs font-medium uppercase tracking-wider text-ivory/60">
              {NAV_LINKS.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="transition-colors hover:text-gold">
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={virtualTourUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold"
                >
                  {tNav('virtualTour')}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter & Booking */}
          <div>
            <h3 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory">
              Newsletter
            </h3>
            <p className="mb-4 text-xs leading-relaxed text-ivory/60">
              {t('newsletterBlurb')}
            </p>
            <NewsletterForm />

            <h3 className="mb-4 mt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory">
              Online Reservations
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {otas.map(({ href, label, image }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-10 w-full items-center justify-center rounded text-[10px] font-bold transition-all hover:-translate-y-0.5 ${
                    label === 'Booking.com'
                      ? 'bg-[#003b95] text-white'
                      : label === 'TripAdvisor'
                        ? 'bg-[#34e0a1] text-black'
                        : label === 'MakeMyTrip'
                          ? 'bg-white text-black'
                          : label === 'Agoda'
                            ? 'bg-[#28292c] text-white'
                            : label === 'Expedia'
                              ? 'bg-[#0000a0] text-white'
                              : 'bg-white text-black'
                  }`}
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={label}
                      width={80}
                      height={32}
                      className="object-contain h-8 w-auto"
                    />
                  ) : label === 'MakeMyTrip' ? (
                    <span className="text-[11px]">
                      <span className="text-[#246bb3]">make</span>
                      <span className="text-[#ed1c24]">MY</span>
                      <span className="text-[#246bb3]">trip</span>
                    </span>
                  ) : label === 'TripAdvisor' ? (
                    <span className="tracking-tight">tripadvisor</span>
                  ) : label === 'Expedia' ? (
                    <span className="tracking-tight text-[11px]">Expedia</span>
                  ) : (
                    label
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Location Map */}
          <div>
            <h3 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory">
              Location
            </h3>
            <div className="relative h-48 w-full overflow-hidden border border-ivory/15">
              <iframe
                title="Map to River Bank Jungle Resort in Patihani, Chitwan"
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0 grayscale-[0.15]"
              />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-ivory/50">
              Bharatpur-22, Patihani, Chitwan, Nepal. Open the map for directions to River Bank Jungle Resort.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ivory/10 pt-6 text-xs text-ivory/40 md:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. {t('rights')}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="transition-colors hover:text-gold">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-gold">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
