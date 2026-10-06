import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RoomForm } from '../RoomForm'
import { getAdminRoomById } from '@/lib/services/rooms'
import { getAllAmenities } from '@/lib/services/amenities'

export const dynamic = 'force-dynamic'

export default async function EditRoomPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const [room, amenities] = await Promise.all([
    getAdminRoomById(id),
    getAllAmenities(),
  ])

  if (!room) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin/rooms" className="hover:text-gray-900">
          Rooms & Suites
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{room.title}</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light text-gray-900">Edit Room</h1>
          <p className="text-xs text-gray-500 mt-0.5 font-mono">ID: {room.id}</p>
        </div>
      </div>

      <RoomForm room={room} amenitiesList={amenities} />
    </div>
  )
}
