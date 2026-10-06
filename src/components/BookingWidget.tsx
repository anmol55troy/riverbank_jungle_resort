'use client'

import { useState } from 'react'

type Props = {
  bookingUrl: string
}

const today = () => new Date().toISOString().slice(0, 10)

const tomorrow = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

export function BookingWidget({ bookingUrl }: Props) {
  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(tomorrow)

  const href = (() => {
    if (!bookingUrl) return '#'
    try {
      const url = new URL(bookingUrl)
      url.searchParams.set('checkInDate', checkIn)
      url.searchParams.set('checkOutDate', checkOut)
      url.searchParams.set('items[0][adults]', '2')
      url.searchParams.set('items[0][children]', '0')
      url.searchParams.set('items[0][infants]', '0')
      url.searchParams.set('currency', 'USD')
      return url.toString()
    } catch {
      // If it's a relative path or invalid URL, fallback gracefully
      return bookingUrl
    }
  })()

  return (
    <div className="w-full max-w-[22rem] sm:max-w-[27rem] border border-ivory/20 bg-forest/45 p-2 sm:p-4 backdrop-blur-sm">
      <p className="border border-ivory/15 bg-ivory/10 px-3 py-1.5 text-center font-serif text-sm sm:text-2xl text-ivory sm:px-4 sm:py-3">
        Make a reservation
      </p>
      <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-px bg-ivory/15">
        <label className="bg-forest/55 px-2 py-1.5 sm:px-3 sm:py-3 text-center text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.12em] text-ivory/80">
          Check in
          <input
            type="date"
            value={checkIn}
            min={today()}
            onChange={(event) => setCheckIn(event.target.value)}
            className="mt-0.5 sm:mt-2 block w-full bg-transparent text-center text-xs sm:text-base font-semibold tracking-normal text-ivory outline-none [color-scheme:dark]"
          />
        </label>
        <label className="bg-forest/55 px-2 py-1.5 sm:px-3 sm:py-3 text-center text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.12em] text-ivory/80">
          Check out
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(event) => setCheckOut(event.target.value)}
            className="mt-0.5 sm:mt-2 block w-full bg-transparent text-center text-xs sm:text-base font-semibold tracking-normal text-ivory outline-none [color-scheme:dark]"
          />
        </label>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 sm:mt-3 flex min-h-10 sm:min-h-14 items-center justify-center bg-ivory px-4 py-2 sm:px-5 text-xs sm:text-sm font-medium uppercase tracking-[0.2em] sm:tracking-[0.28em] text-sage-dark transition-colors hover:bg-sage hover:text-forest"
      >
        Book now
      </a>
    </div>
  )
}