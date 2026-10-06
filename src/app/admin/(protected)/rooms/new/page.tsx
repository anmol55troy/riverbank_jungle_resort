import React from 'react'
import Link from 'next/link'
import { RoomForm } from '../RoomForm'
import { getAllAmenities } from '@/lib/services/amenities'

export const dynamic = 'force-dynamic'

export default async function NewRoomPage() {
  const amenities = await getAllAmenities()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin/rooms" className="hover:text-gray-900">
          Rooms & Suites
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">New Room</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-light text-gray-900">Add New Room</h1>
      </div>

      <RoomForm amenitiesList={amenities} />
    </div>
  )
}
