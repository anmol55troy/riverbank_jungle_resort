import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FaqForm } from '../FaqForm'
import { getAdminFaqById } from '@/lib/services/faqs'

export const dynamic = 'force-dynamic'

export default async function EditFaqPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const faq = await getAdminFaqById(id)

  if (!faq) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin/faqs" className="hover:text-gray-900">
          FAQs
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{faq.question}</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light text-gray-900">Edit FAQ</h1>
          <p className="text-xs text-gray-500 mt-0.5 font-mono">ID: {faq.id}</p>
        </div>
      </div>

      <FaqForm faq={faq} />
    </div>
  )
}
