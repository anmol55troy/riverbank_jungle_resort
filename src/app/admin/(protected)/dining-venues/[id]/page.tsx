import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DiningVenueForm } from '../DiningVenueForm'
import { getAdminDiningVenueById } from '@/lib/services/dining'

export const dynamic = 'force-dynamic'

export default async function EditDiningVenuePage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const venue = await getAdminDiningVenueById(id)

  if (!venue) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin/dining-venues" className="hover:text-gray-900">
          Dining & Venues
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{venue.title}</span>
      </div>

      <div>
        <h1 className="font-serif text-2xl font-light text-gray-900">Edit Dining Venue</h1>
        <p className="text-xs text-gray-500 mt-0.5 font-mono">ID: {venue.id}</p>
      </div>

      <DiningVenueForm venue={venue} />
    </div>
  )
}
