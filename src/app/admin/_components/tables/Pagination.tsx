'use client'

import React from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button } from '../ui/Button'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
}

export function Pagination({ currentPage, totalPages, totalItems }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) {
    return (
      <div className="text-xs text-espresso/60 py-2">
        Showing all {totalItems} {totalItems === 1 ? 'record' : 'records'}
      </div>
    )
  }

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-between py-3 border-t border-espresso/10">
      <div className="text-xs text-espresso/60">
        Page <span className="font-semibold text-espresso">{currentPage}</span> of{' '}
        <span className="font-semibold text-espresso">{totalPages}</span> ({totalItems} total)
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => navigateToPage(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => navigateToPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
