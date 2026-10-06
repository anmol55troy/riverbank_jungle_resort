import React from 'react'
import Link from 'next/link'
import { EventVenueForm } from '../EventVenueForm'

export const dynamic = 'force-dynamic'

export default function NewEventVenuePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin/event-venues" className="hover:text-gray-900">
          Event Venues
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">New Event Venue</span>
      </div>

      <h1 className="font-serif text-2xl font-light text-gray-900">Add New Event Venue</h1>
      <EventVenueForm />
    </div>
  )
}
