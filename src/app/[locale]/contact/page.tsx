import { setRequestLocale } from 'next-intl/server'

import { EnquiryForm } from '@/components/EnquiryForm'
import { FAQAccordion } from '@/components/ui/FAQAccordion'
import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { FadeUp } from '@/components/ui/motion'
import { MailIcon, PhoneIcon, PinIcon } from '@/components/ui/icons'
import { DEFAULTS } from '@/lib/constants'
import { getFAQs, getSiteSettings } from '@/lib/data'
import { PLACEHOLDER } from '@/lib/images'
import { breadcrumbSchema, faqSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Contact Us',
  description:
    'Contact River Bank Jungle Resort, Bharatpur-22, Patihani, Chitwan, Nepal — phone, email, WhatsApp and directions. Airport pickup from Bharatpur on request.',
  path: '/contact',
})

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
const [settings, faqs] = await Promise.all([getSiteSettings().catch(() => null), getFAQs()])

  const phones = settings?.phones?.length ? settings.phones.map((p) => p.number) : [...DEFAULTS.phones]
  const emails = settings?.emails?.length ? settings.emails.map((e) => e.email) : [...DEFAULTS.emails]
  const address = settings?.address ?? DEFAULTS.address
  const salesOffice = settings?.salesOffice ?? DEFAULTS.salesOffice

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
      {faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}

      <Hero
        size="banner"
        image={resolveMedia(settings?.contactBanner, 'hero') ?? { url: PLACEHOLDER.terrace, alt: 'Resort terrace overlooking the river at golden hour' }}
        label="Reach Us"
        title="Contact"
        subtitle="Write, call or message us on WhatsApp — we reply the same day."
      />

      <section className="grain bg-ivory py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <FadeUp>
            <h2 className="font-serif text-2xl text-espresso md:text-3xl">Send an Enquiry</h2>
            <div className="my-5 h-px w-10 bg-gold" />
            <EnquiryForm formType="contact" />
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="font-serif text-2xl text-espresso md:text-3xl">Find Us</h2>
            <div className="my-5 h-px w-10 bg-gold" />
            <ul className="space-y-4 text-sm text-espresso/80">
              <li className="flex gap-3">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>
                  {address}
                  <br />
                  <span className="text-espresso/55">{salesOffice}</span>
                </span>
              </li>
              {phones.map((phone) => (
                <li key={phone} className="flex items-center gap-3">
                  <PhoneIcon className="h-4 w-4 shrink-0 text-gold" />
                  <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-gold-dark">
                    {phone}
                  </a>
                </li>
              ))}
              {emails.map((email) => (
                <li key={email} className="flex items-center gap-3">
                  <MailIcon className="h-4 w-4 shrink-0 text-gold" />
                  <a href={`mailto:${email}`} className="break-all hover:text-gold-dark">
                    {email}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 overflow-hidden rounded-lg shadow-card">
              <iframe
                src={DEFAULTS.mapEmbedUrl}
                title="Map showing River Bank Jungle Resort in Patihani, Chitwan"
                width="600"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-80 w-full border-0"
              />
            </div>
            <a
              href={settings?.mapUrl ?? DEFAULTS.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-gold-dark underline underline-offset-2 hover:text-gold"
            >
              Open in Google Maps
            </a>
          </FadeUp>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="grain bg-cream py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <SectionHeading
              label="Good to Know"
              title="Frequently Asked Questions"
              intro="Getting here, park permits and what to pack — answered."
            />
            <FadeUp>
              <FAQAccordion
                items={faqs.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))}
              />
            </FadeUp>
          </div>
        </section>
      )}
    </>
  )
}
