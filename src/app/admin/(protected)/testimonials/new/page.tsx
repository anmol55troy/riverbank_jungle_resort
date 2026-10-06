import React from 'react'
import Link from 'next/link'
import { TestimonialForm } from '../TestimonialForm'

export const dynamic = 'force-dynamic'

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin/testimonials" className="hover:text-gray-900">
          Guest Reviews
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">New Review</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-light text-gray-900">Add Guest Review</h1>
      </div>

      <TestimonialForm />
    </div>
  )
}
