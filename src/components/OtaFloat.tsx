'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { CloseIcon, ChevronDown } from './ui/icons'

type Props = {
  bookingUrl: string
  tripadvisorUrl: string
  makemytripUrl: string
  agodaUrl?: string
  expediaUrl?: string
}

const OTA_ITEMS = [
  { key: 'booking', label: 'Booking.com', icon: '/awards/booking-icon.webp', className: 'bg-[#123f91]' },
  { key: 'tripadvisor', label: 'TripAdvisor', icon: '/awards/tripadvisor-icon.svg', className: 'bg-white' },
  { key: 'makemytrip', label: 'MakeMyTrip', icon: '/awards/makemytrip-icon.webp', className: 'bg-white' },
  { key: 'agoda', label: 'Agoda', icon: '/media/agoda-logo.svg', className: 'bg-[#28292c]' },
  { key: 'expedia', label: 'Expedia', icon: '/media/expedia-logo_brandlogos.net_jivv9.png', className: 'bg-white' },
] as const

export function OtaFloat({ bookingUrl, tripadvisorUrl, makemytripUrl, agodaUrl, expediaUrl }: Props) {
  const urls = {
    booking: bookingUrl,
    tripadvisor: tripadvisorUrl,
    makemytrip: makemytripUrl,
    agoda: agodaUrl || 'https://www.agoda.com/river-bank-jungle-resort/hotel/chitwan-np.html?ds=nN5OhaZ1D55gnN3P',
    expedia: expediaUrl || 'https://www.expedia.co.in/River-Bank-Jungle-Resort.h100514483.Hotel-Information'
  }
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={menuRef} className="fixed bottom-20 right-4 z-40 flex flex-col items-center gap-2 md:bottom-24 md:right-6" aria-label="Online reservations">
      <div
        className={`flex flex-col gap-2 transition-all duration-300 ${
          isOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        {OTA_ITEMS.map((item) => (
          <a
            key={item.key}
            href={urls[item.key as keyof typeof urls]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Book through ${item.label}`}
            title={`Book through ${item.label}`}
            onClick={() => setIsOpen(false)}
            className={`group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/60 p-1.5 shadow-lg transition-transform duration-300 hover:scale-110 ${item.className}`}
          >
            <Image src={item.icon} alt="" aria-hidden="true" width={80} height={32} className="max-h-full max-w-full rounded-[0.35rem] object-contain" />
            <span className="pointer-events-none absolute right-14 whitespace-nowrap bg-forest px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {item.label}
            </span>
          </a>
        ))}
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle booking options"
        aria-expanded={isOpen}
        className="flex h-13 w-13 items-center justify-center rounded-full bg-forest text-ivory shadow-card transition-all duration-300 hover:bg-forest-dark focus:outline-none"
      >
        {isOpen ? <CloseIcon className="h-6 w-6" /> : (
          <div className="flex flex-col items-center justify-center">
            <span className="text-[9px] font-bold uppercase tracking-wider">Book</span>
            <ChevronDown className="h-3 w-3 -mt-0.5 rotate-180" />
          </div>
        )}
      </button>
    </div>
  )
}