import { whatsappHref } from '@/lib/constants'

import { WhatsAppIcon } from '../ui/icons'

type Props = {
  bookingUrl: string
  whatsappNumber: string
  whatsappText: string
  bookLabel: string
}

/** Sticky bottom action bar — mobile only. */
export function MobileBookBar({ bookingUrl, whatsappNumber, whatsappText, bookLabel }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-sage-dark/50 md:hidden">
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-12 items-center justify-center bg-sage-dark px-4 text-sm font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-forest"
      >
        {bookLabel}
      </a>
      <a
        href={whatsappHref(whatsappNumber, whatsappText)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-12 items-center justify-center gap-2 bg-forest px-4 text-sm font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:text-sage"
      >
        <WhatsAppIcon className="h-4.5 w-4.5" /> WhatsApp
      </a>
    </div>
  )
}
