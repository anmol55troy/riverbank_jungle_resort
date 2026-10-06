import { setRequestLocale } from 'next-intl/server'

import { JsonLd } from '@/components/JsonLd'
import { breadcrumbSchema } from '@/lib/jsonld'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Terms & Conditions',
  description:
    'Terms and conditions for staying at and booking River Bank Jungle Resort, Patihani, Chitwan — reservations, cancellations, check-in times and liability.',
  path: '/terms',
})

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Terms & Conditions', path: '/terms' },
        ])}
      />
      <section className="grain bg-ivory pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-serif text-3xl text-espresso md:text-4xl">Terms & Conditions</h1>
          <div className="my-6 h-px w-16 bg-gold" />
          <div className="rich-text">
            {/* Placeholder legal copy — replace with counsel-reviewed text before launch */}
            <h2>Reservations & Payment</h2>
            <p>
              Reservations are confirmed on receipt of a booking confirmation from the resort or our online
              booking engine. Rates are quoted per room per night and may change until confirmed.
            </p>
            <h2>Check-in & Check-out</h2>
            <p>
              Check-in is from 2:00 PM and check-out is by 12:00 noon. Early check-in and late check-out are
              subject to availability.
            </p>
            <h2>Cancellations</h2>
            <p>
              Cancellation terms depend on the rate and season under which you booked and are stated in your
              booking confirmation. Contact us as early as possible to amend a reservation.
            </p>
            <h2>Safari Activities</h2>
            <p>
              National park activities are subject to park regulations, weather and wildlife conditions.
              Park permits and government fees are payable per person and are non-refundable once issued.
            </p>
            <h2>Liability</h2>
            <p>
              The resort sits beside a national park; guests must follow guide and staff instructions during
              all activities. The resort is not liable for loss of valuables left outside room safety
              deposit boxes.
            </p>
            <h2>Contact</h2>
            <p>
              Questions about these terms: info@riverbankjungleresort.com.np · +977 56-411121.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
