import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { OfferForm } from '../OfferForm'
import { getAdminOfferById } from '@/lib/services/offers'

export const dynamic = 'force-dynamic'

export default async function EditOfferPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const offer = await getAdminOfferById(id)

  if (!offer) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin/offers" className="hover:text-gray-900">
          Offers
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{offer.title}</span>
      </div>

      <div>
        <h1 className="font-serif text-2xl font-light text-gray-900">Edit Special Offer</h1>
        <p className="text-xs text-gray-500 mt-0.5 font-mono">ID: {offer.id}</p>
      </div>

      <OfferForm offer={offer} />
    </div>
  )
}
