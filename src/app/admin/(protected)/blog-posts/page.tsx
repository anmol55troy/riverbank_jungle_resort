import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAdminBlogPosts } from '@/lib/services/blogs'
import { SearchBar } from '@/components/admin/tables/SearchBar'
import { Pagination } from '@/components/admin/tables/Pagination'
import { Badge } from '@/components/admin/ui/Badge'
import type { Media } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const searchParams = await props.searchParams
  const q = searchParams.q || ''
  const page = Number(searchParams.page || 1)

  const { docs: posts, total, totalPages } = await getAdminBlogPosts({ search: q, page })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-light text-espresso">Blog Posts & Stories</h1>
          <p className="text-xs text-espresso/60">Publish wildlife articles, visitor guides, culture essays, and resort updates.</p>
        </div>
        <Link
          href="/admin/blog-posts/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-espresso text-ivory hover:bg-espresso-light shadow-xs"
        >
          + Write New Post
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar placeholder="Search articles by title..." />
      </div>

      <div className="bg-white rounded-3xl border border-espresso/10 p-5 shadow-xs">
        {posts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-espresso/50 uppercase tracking-wider text-[10px] border-b border-espresso/10">
                  <th className="pb-3 font-semibold">Cover</th>
                  <th className="pb-3 font-semibold">Title</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Published</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/5">
                {posts.map((post) => {
                  const img = post.coverImage as Media | undefined
                  const thumb = img?.thumbnailURL || img?.url

                  return (
                    <tr key={post.id} className="hover:bg-cream/20 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-cream border border-espresso/10">
                          {thumb && (
                            <Image src={thumb} alt={post.title} fill sizes="48px" className="object-cover" unoptimized />
                          )}
                        </div>
                      </td>
                      <td className="py-3 font-medium text-espresso max-w-sm truncate">{post.title}</td>
                      <td className="py-3">
                        <Badge variant="default">
                          {post.category?.replace('-', ' ') || 'General'}
                        </Badge>
                      </td>
                      <td className="py-3 text-espresso/60">
                        {new Date(post.publishedDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/blog-posts/${post.id}`}
                          className="font-semibold text-gold-dark hover:underline"
                        >
                          Edit Post
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
            No blog posts found.
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} />
      </div>
    </div>
  )
}
