import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExperienceForm } from '../ExperienceForm'
import { getAdminExperienceById } from '@/lib/services/experiences'

export const dynamic = 'force-dynamic'

export default async function EditExperiencePage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const exp = await getAdminExperienceById(id)

  if (!exp) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin/experiences" className="hover:text-gray-900">
          Experiences
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{exp.title}</span>
      </div>

      <div>
        <h1 className="font-serif text-2xl font-light text-gray-900">Edit Experience</h1>
        <p className="text-xs text-gray-500 mt-0.5 font-mono">ID: {exp.id}</p>
      </div>

      <ExperienceForm experience={exp} />
    </div>
  )
}
