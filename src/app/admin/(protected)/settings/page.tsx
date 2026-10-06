import React from 'react'
import { SettingsForm } from './SettingsForm'
import { getAdminSiteSettings } from '@/lib/services/settings'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const settings = await getAdminSiteSettings()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light text-gray-900">Global Site Settings</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure resort contact info, brand assets, social links, and public page header imagery
          </p>
        </div>
      </div>

      <SettingsForm settings={settings} />
    </div>
  )
}
