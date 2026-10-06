import React from 'react'
import Link from 'next/link'
import { getDashboardStats } from '@/lib/services/dashboard'
import { Badge } from '@/app/admin/_components/ui/Badge'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  const quickStats = [
    { label: 'Rooms & Suites', count: stats.roomsCount, href: '/admin/rooms', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { label: 'Dining Venues', count: stats.diningCount, href: '/admin/dining-venues', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { label: 'Experiences', count: stats.experiencesCount, href: '/admin/experiences', color: 'bg-sky-50 text-sky-800 border-sky-200' },
    { label: 'Active Offers', count: `${stats.activeOffersCount} / ${stats.offersCount}`, href: '/admin/offers', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { label: 'Blog Articles', count: stats.blogsCount, href: '/admin/blog-posts', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    { label: 'Gallery Images', count: stats.galleryCount, href: '/admin/gallery-images', color: 'bg-rose-50 text-rose-800 border-rose-200' },
    { label: 'Guest Reviews', count: stats.testimonialsCount, href: '/admin/testimonials', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { label: 'Media Assets', count: stats.mediaCount, href: '/admin/media', color: 'bg-slate-50 text-slate-800 border-slate-200' },
    { label: 'Enquiries', count: stats.submissionsCount, href: '/admin/form-submissions', color: 'bg-teal-50 text-teal-800 border-teal-200' },
    { label: 'Newsletter Signups', count: stats.newsletterCount, href: '/admin/newsletter-signups', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  ]

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-espresso">Resort Management Dashboard</h1>
          <p className="text-xs text-espresso/60 mt-1">
            Welcome to the River Bank Jungle Resort administration console.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/rooms/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-espresso text-ivory hover:bg-espresso-light shadow-xs transition-colors"
          >
            <span>+ Add Room</span>
          </Link>
          <Link
            href="/admin/blog-posts/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-gold text-espresso hover:bg-gold-dark hover:text-white shadow-xs transition-colors"
          >
            <span>+ New Article</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {quickStats.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group p-4 rounded-2xl bg-white border border-espresso/10 hover:border-espresso/30 shadow-xs hover:shadow-card transition-all"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-espresso/60 truncate">{item.label}</p>
            <p className="text-2xl font-serif font-medium text-espresso mt-2 group-hover:text-gold-dark transition-colors">
              {item.count}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Inquiries section */}
      <div className="bg-white rounded-3xl border border-espresso/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-espresso/10 pb-4">
          <div>
            <h2 className="font-serif text-lg text-espresso font-medium">Recent Customer Enquiries</h2>
            <p className="text-xs text-espresso/60">Submissions received via website contact and events forms</p>
          </div>
          <Link
            href="/admin/form-submissions"
            className="text-xs font-semibold text-gold-dark hover:underline"
          >
            View All ({stats.submissionsCount}) →
          </Link>
        </div>

        {stats.recentSubmissions.length > 0 ? (
          <div className="divide-y divide-espresso/5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-espresso/50 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Form Type</th>
                  <th className="pb-3 font-semibold">Guest Name</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Date Received</th>
                  <th className="pb-3 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/5">
                {stats.recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-3">
                      <Badge variant={sub.formType === 'events' ? 'warning' : 'info'}>
                        {sub.formType === 'events' ? 'Wedding / Event' : 'Contact'}
                      </Badge>
                    </td>
                    <td className="py-3 font-medium text-espresso">{sub.name}</td>
                    <td className="py-3 text-espresso/70">{sub.email}</td>
                    <td className="py-3 text-espresso/50">
                      {new Date(sub.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/form-submissions`}
                        className="text-gold-dark hover:underline font-semibold"
                      >
                        Read message
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-espresso/60">
            No customer inquiries yet.
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-cream/40 rounded-2xl border border-espresso/10 p-5 space-y-2">
          <h3 className="font-serif text-base text-espresso font-medium">Sitewide Settings</h3>
          <p className="text-xs text-espresso/70">
            Update resort contact phone numbers, emails, WhatsApp link, social media profiles, and hero banners.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/settings"
              className="text-xs font-semibold text-espresso hover:text-gold-dark transition-colors inline-flex items-center gap-1"
            >
              Configure Settings →
            </Link>
          </div>
        </div>

        <div className="bg-cream/40 rounded-2xl border border-espresso/10 p-5 space-y-2">
          <h3 className="font-serif text-base text-espresso font-medium">Media Library</h3>
          <p className="text-xs text-espresso/70">
            Upload resort photography. Automatic high-resolution resizing, card formats, and thumbnail generation.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/media"
              className="text-xs font-semibold text-espresso hover:text-gold-dark transition-colors inline-flex items-center gap-1"
            >
              Open Media Library →
            </Link>
          </div>
        </div>

        <div className="bg-cream/40 rounded-2xl border border-espresso/10 p-5 space-y-2">
          <h3 className="font-serif text-base text-espresso font-medium">Administrator Accounts</h3>
          <p className="text-xs text-espresso/70">
            Manage admin users, reset passwords with scrypt encryption, or create new resort staff accounts.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/users"
              className="text-xs font-semibold text-espresso hover:text-gold-dark transition-colors inline-flex items-center gap-1"
            >
              Manage Users ({stats.usersCount}) →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
