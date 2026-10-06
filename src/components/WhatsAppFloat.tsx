import { whatsappHref } from '@/lib/constants'

import { WhatsAppIcon } from './ui/icons'

type Props = {
  number: string
  text: string
  label: string
}

export function WhatsAppFloat({ number, text, label }: Props) {
  return (
    <a
      href={whatsappHref(number, text)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card transition-all duration-300 hover:bg-[#128C7E] hover:shadow-card-hover md:bottom-6 md:right-6 md:h-14 md:w-14"
    >
      <WhatsAppIcon className="h-6 w-6 md:h-7 md:w-7" />
    </a>
  )
}
