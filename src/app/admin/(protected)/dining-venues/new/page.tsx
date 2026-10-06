import React from 'react'
import Link from 'next/link'
import { DiningVenueForm } from '../DiningVenueForm'

export const dynamic = 'force-dynamic'

export default function NewDiningVenuePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin/dining-venues" className="hover:text-gray-900">
          Dining & Venues
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">New Venue</span>
      </div>

      <h1 className="font-serif text-2xl font-light text-gray-900">Add New Dining Venue</h1>
      <DiningVenueForm />
    </div>
  )
}
