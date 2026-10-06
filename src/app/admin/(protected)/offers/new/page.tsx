import React from 'react'
import Link from 'next/link'
import { OfferForm } from '../OfferForm'

export const dynamic = 'force-dynamic'

export default function NewOfferPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin/offers" className="hover:text-gray-900">
          Offers
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">New Offer</span>
      </div>

      <h1 className="font-serif text-2xl font-light text-gray-900">Add New Special Offer</h1>
      <OfferForm />
    </div>
  )
}
