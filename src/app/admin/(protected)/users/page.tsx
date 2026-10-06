import React from 'react'
import Link from 'next/link'
import { getAdminUsers } from '@/lib/services/users'
import { getCurrentUser } from '@/lib/auth/guard'
import { SearchBar } from '@/app/admin/_components/tables/SearchBar'
import { Pagination } from '@/app/admin/_components/tables/Pagination'
import { Badge } from '@/app/admin/_components/ui/Badge'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const [searchParams, currentUser] = await Promise.all([
    props.searchParams,
    getCurrentUser(),
  ])

  const q = searchParams.q || ''
  const page = Number(searchParams.page || 1)

  const { docs: users, total, totalPages } = await getAdminUsers({ search: q, page })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-light text-gray-900">Administrators</h1>
          <p className="text-xs text-gray-500">
            Manage authenticated administrators who have access to the management console
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          + Add Administrator
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar placeholder="Search by name or email..." />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-200">
                  <th className="pb-3 font-semibold">User</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Created</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/5">
                {users.map((u) => {
                  const isCurrent = u.id === currentUser?.id
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 font-medium text-gray-900 flex items-center gap-2">
                        <span>{u.name || 'Unnamed Admin'}</span>
                        {isCurrent && (
                          <Badge variant="gold" size="sm">
                            You
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 text-gray-500 font-mono">{u.email}</td>
                      <td className="py-3">
                        <Badge variant="forest" size="sm">
                          Administrator
                        </Badge>
                      </td>
                      <td className="py-3 text-gray-500 whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/users/${u.id}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-gray-500">
            No users found.
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} />
      </div>
    </div>
  )
}
