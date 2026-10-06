import React from 'react'
import Link from 'next/link'
import { FaqForm } from '../FaqForm'

export const dynamic = 'force-dynamic'

export default function NewFaqPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin/faqs" className="hover:text-gray-900">
          FAQs
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">New FAQ</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-light text-gray-900">Add FAQ</h1>
      </div>

      <FaqForm />
    </div>
  )
}
