import React from 'react'
import Link from 'next/link'
import { BlogPostForm } from '../BlogPostForm'
import { getRooms, getExperiences } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function NewBlogPostPage() {
  const [rooms, experiences] = await Promise.all([
    getRooms(),
    getExperiences(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin/blog-posts" className="hover:text-gray-900">
          Blog Posts
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">New Post</span>
      </div>

      <h1 className="font-serif text-2xl font-light text-gray-900">Write New Article</h1>
      <BlogPostForm roomsList={rooms} experiencesList={experiences} />
    </div>
  )
}
