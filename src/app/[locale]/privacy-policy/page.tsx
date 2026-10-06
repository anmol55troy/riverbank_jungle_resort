import { setRequestLocale } from 'next-intl/server'

import { JsonLd } from '@/components/JsonLd'
import { breadcrumbSchema } from '@/lib/jsonld'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'Privacy policy for River Bank Jungle Resort, Chitwan, Nepal — how we handle enquiry data, newsletter emails and website analytics.',
  path: '/privacy-policy',
})

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy-policy' },
        ])}
      />
      <section className="grain bg-ivory pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-serif text-3xl text-espresso md:text-4xl">Privacy Policy</h1>
          <div className="my-6 h-px w-16 bg-gold" />
          <div className="rich-text">
            {/* Placeholder legal copy — replace with counsel-reviewed text before launch */}
            <p>
              River Bank Jungle Resort Pvt. Ltd. (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates
              riverbankjungleresort.com.np. This page explains what personal information we collect and how
              we use it.
            </p>
            <h2>Information We Collect</h2>
            <p>
              When you submit an enquiry or booking request we collect your name, email address, phone
              number and the contents of your message. When you subscribe to our newsletter we store your
              email address. We do not process online payments on this website.
            </p>
            <h2>How We Use It</h2>
            <p>
              We use your information solely to respond to enquiries, manage reservations and — only if you
              subscribed — send occasional news and offers. We do not sell or rent personal data to third
              parties.
            </p>
            <h2>Third-Party Services</h2>
            <p>
              Bookings made through our booking engine and online travel agencies (Booking.com, TripAdvisor,
              MakeMyTrip) are governed by those services&rsquo; own privacy policies.
            </p>
            <h2>Your Rights</h2>
            <p>
              You may request a copy of the personal data we hold about you, or ask us to delete it, by
              emailing info@riverbankjungleresort.com.np.
            </p>
            <h2>Contact</h2>
            <p>
              River Bank Jungle Resort, Bharatpur-22, Patihani, Chitwan, Nepal ·
              info@riverbankjungleresort.com.np
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
