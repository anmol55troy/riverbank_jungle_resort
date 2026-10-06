import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { DEFAULTS, NAV_LINKS, SITE_NAME } from '@/lib/constants'
import type { SiteSetting } from '@/lib/types'

import { ExternalIcon, FacebookIcon, InstagramIcon, LinkedInIcon, MailIcon, PhoneIcon, PinIcon } from '../ui/icons'
import { PalmMotif } from '../ui/Motifs'
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
  const address = settings?.address ?? DEFAULTS.address
  const salesOffice = settings?.salesOffice ?? DEFAULTS.salesOffice
  const mapUrl = settings?.mapUrl ?? DEFAULTS.mapUrl
  const mapEmbedUrl = DEFAULTS.mapEmbedUrl
  const bookingUrl = settings?.bookingUrl || DEFAULTS.bookingUrl
  const virtualTourUrl = settings?.virtualTourUrl || DEFAULTS.virtualTourUrl

  const socials = [
    { href: settings?.facebook ?? DEFAULTS.facebook, label: 'Facebook', icon: FacebookIcon },
    { href: settings?.instagram ?? DEFAULTS.instagram, label: 'Instagram', icon: InstagramIcon },
    { href: settings?.linkedin ?? DEFAULTS.linkedin, label: 'LinkedIn', icon: LinkedInIcon },
  ]

  const otas = [
    { href: settings?.bookingCom ?? DEFAULTS.bookingCom, label: 'Booking.com' },
    { href: settings?.tripadvisor ?? DEFAULTS.tripadvisor, label: 'TripAdvisor' },
    { href: settings?.makemytrip ?? DEFAULTS.makemytrip, label: 'MakeMyTrip' },
  ]

  return (
    <footer className="grain grain-dark relative overflow-hidden bg-espresso pb-16 text-ivory md:pb-0">
      <PalmMotif className="absolute -right-10 -top-8 hidden h-80 rotate-180 text-gold opacity-[0.08] lg:block" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-2 lg:grid-cols-4 lg:py-24">
        <div>
          <Image
            src={logoUrl}
            alt="River Bank Jungle Resort"
            width={155}
            height={80}
            className="h-20 w-auto"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/70">
            {settings?.footerText ??
              'A riverside sanctuary in Patihani on the banks of the Rapti River, where the Terai jungle of Chitwan National Park meets five-star comfort.'}
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 text-ivory/80 transition-colors hover:border-gold hover:text-gold"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="label-caps mb-5">{t('explore')}</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 lg:grid-cols-1">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link href={link.href} className="text-sm text-ivory/75 transition-colors hover:text-gold">
                  {tNav(link.key)}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={virtualTourUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-ivory/75 transition-colors hover:text-gold"
              >
                {tNav('virtualTour')} <ExternalIcon />
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="label-caps mb-5">{t('contactUs')}</h2>
          <ul className="space-y-3 text-sm text-ivory/75">
            <li className="flex gap-2.5">
              <PinIcon className="mt-1 h-4 w-4 shrink-0 text-gold" />
              <span>
                {address}
                <br />
                <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                  {t('viewOnMap')}
                </a>
              </span>
            </li>
            {phones.map((phone) => (
              <li key={phone} className="flex items-center gap-2.5">
                <PhoneIcon className="h-4 w-4 shrink-0 text-gold" />
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-gold">
                  {phone}
                </a>
              </li>
            ))}
            {emails.map((email) => (
              <li key={email} className="flex items-center gap-2.5">
                <MailIcon className="h-4 w-4 shrink-0 text-gold" />
                <a href={`mailto:${email}`} className="break-all hover:text-gold">
                  {email}
                </a>
              </li>
            ))}
            <li className="pt-1 text-xs text-ivory/50">{salesOffice}</li>
          </ul>
        </div>

        <div>
          <h2 className="label-caps mb-5">{t('reservations')}</h2>
          <div className="mb-8 space-y-2">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-center bg-ivory px-4 text-xs font-semibold uppercase tracking-[0.16em] text-sage-dark transition-colors hover:bg-sage hover:text-forest"
            >
              Book direct
            </a>
            {otas.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex min-h-11 items-center justify-between gap-2 px-4 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                  label === 'Booking.com'
                    ? 'bg-[#123f91] text-white hover:bg-[#1d55b5]'
                    : label === 'TripAdvisor'
                      ? 'bg-[#55a947] text-white hover:bg-[#69bd5a]'
                      : 'bg-ivory text-forest hover:bg-sage'
                }`}
              >
                <span>{label}</span>
                <ExternalIcon />
              </a>
            ))}
          </div>
          <h2 className="label-caps mb-3">{t('newsletter')}</h2>
          <p className="mb-4 text-xs leading-relaxed text-ivory/60">{t('newsletterBlurb')}</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="relative border-t border-ivory/10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:py-10">
          <div>
            <p className="label-caps mb-2">Find us by the Rapti</p>
            <p className="max-w-md text-sm leading-7 text-ivory/65">
              Bharatpur-22, Patihani, Chitwan, Nepal. Open the map for directions to River Bank Jungle Resort.
            </p>
          </div>
          <div className="relative h-44 w-full overflow-hidden border border-ivory/15 md:h-36 md:w-[28rem]">
            <iframe
              title="Map to River Bank Jungle Resort in Patihani, Chitwan"
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0 grayscale-[0.15]"
            />
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-ivory/50 sm:px-6 md:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. {t('rights')}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-gold">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
