import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BlogPostForm } from '../BlogPostForm'
import { getAdminBlogPostById } from '@/lib/services/blogs'
import { getRooms, getExperiences } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function EditBlogPostPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const [post, rooms, experiences] = await Promise.all([
    getAdminBlogPostById(id),
    getRooms(),
    getExperiences(),
  ])

  if (!post) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin/blog-posts" className="hover:text-gray-900">
          Blog Posts
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{post.title}</span>
      </div>

      <div>
        <h1 className="font-serif text-2xl font-light text-gray-900">Edit Article</h1>
        <p className="text-xs text-gray-500 mt-0.5 font-mono">ID: {post.id}</p>
      </div>

      <BlogPostForm post={post} roomsList={rooms} experiencesList={experiences} />
    </div>
  )
}
