import type { Metadata } from 'next'
import { Marcellus, Plus_Jakarta_Sans } from 'next/font/google'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { MobileBookBar } from '@/components/MobileBookBar'
import { Navbar } from '@/components/Navbar'
import { OtaFloat } from '@/components/OtaFloat'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { NavigationProgressBar } from '@/components/NavigationProgressBar'
import { VirtualTourPrompt } from '@/components/VirtualTourPrompt'
import { routing } from '@/i18n/routing'
import { DEFAULTS, SITE_NAME, SITE_URL } from '@/lib/constants'
import { getSiteSettings } from '@/lib/data'
import { resortSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'

import '../globals.css'

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

// Page titles are fully composed by buildMetadata() in src/lib/seo.ts —
// no template here, or the site suffix would be appended twice.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  description:
    'River Bank Jungle Resort is a riverside jungle retreat in Patihani, Chitwan, Nepal, beside Chitwan National Park. Stay, dine and explore the Rapti River.',
  applicationName: SITE_NAME,
  keywords: [
    'River Bank Jungle Resort',
    'Chitwan jungle resort',
    'resort in Patihani',
    'Chitwan National Park accommodation',
    'Rapti River resort',
    'Nepal wildlife safari resort',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  title: {
    default: `${SITE_NAME} | Riverside Luxury in Chitwan, Nepal`,
    template: '%s',
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  const [messages, settings, tNav, tCommon] = await Promise.all([
    getMessages(),
    getSiteSettings().catch(() => null),
    getTranslations('nav'),
    getTranslations('common'),
  ])

  const bookingUrl = settings?.bookingUrl || DEFAULTS.bookingUrl
  const virtualTourUrl = settings?.virtualTourUrl || DEFAULTS.virtualTourUrl
  const whatsapp = settings?.whatsapp ?? DEFAULTS.whatsapp
  const logoUrl = resolveMedia(settings?.logo, 'original')?.url ?? '/logo.png'

  return (
    <html
      lang={locale === 'np' ? 'ne' : 'en'}
      className={`${marcellus.variable} ${plusJakartaSans.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <JsonLd data={resortSchema(settings)} />
        <NextIntlClientProvider messages={messages}>
          <NavigationProgressBar />
          <Navbar
            bookingUrl={bookingUrl}
            virtualTourUrl={virtualTourUrl}
            logoUrl={logoUrl}
          />
          <main>{children}</main>
          <Footer settings={settings} logoUrl={logoUrl} />
          <WhatsAppFloat
            number={whatsapp}
            text={DEFAULTS.whatsappText}
            label={tCommon('whatsappLabel')}
          />
          <OtaFloat
            bookingUrl={settings?.bookingCom ?? DEFAULTS.bookingCom}
            tripadvisorUrl={settings?.tripadvisor ?? DEFAULTS.tripadvisor}
            makemytripUrl={settings?.makemytrip ?? DEFAULTS.makemytrip}
          />
          <MobileBookBar
            bookingUrl={bookingUrl}
            whatsappNumber={whatsapp}
            whatsappText={DEFAULTS.whatsappText}
            bookLabel={tNav('bookNow')}
          />
          <VirtualTourPrompt url={virtualTourUrl} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
