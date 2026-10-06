import React from 'react'
import Link from 'next/link'
import { ExperienceForm } from '../ExperienceForm'

export const dynamic = 'force-dynamic'

export default function NewExperiencePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin/experiences" className="hover:text-gray-900">
          Experiences
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">New Experience</span>
      </div>

      <h1 className="font-serif text-2xl font-light text-gray-900">Add New Experience</h1>
      <ExperienceForm />
    </div>
  )
}
