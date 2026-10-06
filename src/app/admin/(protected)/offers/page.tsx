import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAdminOffers } from '@/lib/services/offers'
import { SearchBar } from '@/app/admin/_components/tables/SearchBar'
import { Pagination } from '@/app/admin/_components/tables/Pagination'
import { Badge } from '@/app/admin/_components/ui/Badge'
import type { Media } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminOffersPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const searchParams = await props.searchParams
  const q = searchParams.q || ''
  const page = Number(searchParams.page || 1)

  const { docs: offers, total, totalPages } = await getAdminOffers({ search: q, page })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-light text-espresso">Special Offers & Packages</h1>
          <p className="text-xs text-espresso/60">Manage seasonal promotions, honeymoon packages, and stay deals.</p>
        </div>
        <Link
          href="/admin/offers/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-espresso text-ivory hover:bg-espresso-light shadow-xs"
        >
          + Add New Offer
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar placeholder="Search offers..." />
      </div>

      <div className="bg-white rounded-3xl border border-espresso/10 p-5 shadow-xs">
        {offers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-espresso/50 uppercase tracking-wider text-[10px] border-b border-espresso/10">
                  <th className="pb-3 font-semibold">Image</th>
                  <th className="pb-3 font-semibold">Title</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Valid Period</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/5">
                {offers.map((offer) => {
                  const img = offer.image as Media | undefined
                  const thumb = img?.thumbnailURL || img?.url

                  return (
                    <tr key={offer.id} className="hover:bg-cream/20 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-cream border border-espresso/10">
                          {thumb && (
                            <Image src={thumb} alt={offer.title} fill sizes="48px" className="object-cover" unoptimized />
                          )}
                        </div>
                      </td>
                      <td className="py-3 font-medium text-espresso">{offer.title}</td>
                      <td className="py-3">
                        <Badge variant={offer.active ? 'success' : 'default'}>
                          {offer.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 text-espresso/60">
                        {offer.validFrom || offer.validUntil
                          ? `${offer.validFrom ? new Date(offer.validFrom).toLocaleDateString() : 'Now'} - ${
                              offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : 'Ongoing'
                            }`
                          : 'Ongoing'}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/offers/${offer.id}`}
                          className="font-semibold text-gold-dark hover:underline"
                        >
                          Edit Offer
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-espresso/60">
            No special offers found.
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} />
      </div>
    </div>
  )
}
