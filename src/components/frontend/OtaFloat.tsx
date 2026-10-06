import Image from 'next/image'

type Props = {
  bookingUrl: string
  tripadvisorUrl: string
  makemytripUrl: string
}

const OTA_ITEMS = [
  { key: 'booking', label: 'Booking.com', icon: '/awards/booking-icon.webp', className: 'bg-[#123f91]' },
  { key: 'tripadvisor', label: 'TripAdvisor', icon: '/awards/tripadvisor-icon.svg', className: 'bg-white' },
  { key: 'makemytrip', label: 'MakeMyTrip', icon: '/awards/makemytrip-icon.webp', className: 'bg-white' },
] as const

export function OtaFloat({ bookingUrl, tripadvisorUrl, makemytripUrl }: Props) {
  const urls = { booking: bookingUrl, tripadvisor: tripadvisorUrl, makemytrip: makemytripUrl }

  return (
    <div className="fixed bottom-36 right-4 z-40 flex flex-col gap-2 md:bottom-24 md:right-6" aria-label="Online reservations">
      {OTA_ITEMS.map((item) => (
        <a
          key={item.key}
          href={urls[item.key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Book through ${item.label}`}
          title={`Book through ${item.label}`}
          className={`group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/60 p-1.5 shadow-lg transition-transform duration-300 hover:scale-110 ${item.className}`}
        >
          <Image src={item.icon} alt="" aria-hidden="true" width={80} height={32} className="max-h-full max-w-full rounded-[0.35rem] object-contain" />
          <span className="pointer-events-none absolute right-14 whitespace-nowrap bg-forest px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            {item.label}
          </span>
        </a>
      ))}
    </div>
  )
}