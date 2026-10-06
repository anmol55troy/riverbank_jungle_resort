'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/app/admin/_components/forms/FormField'
import { TextInput, Textarea } from '@/app/admin/_components/forms/Inputs'
import { MediaPicker } from '@/app/admin/_components/forms/MediaPicker'
import { Button } from '@/app/admin/_components/ui/Button'
import { useToast } from '@/app/admin/_components/ui/Toast'
import { saveSiteSettings } from '@/lib/services/settings'
import type { SiteSetting } from '@/lib/types'

export interface SettingsFormProps {
  settings: SiteSetting
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter()
  const { addToast } = useToast()

  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'links' | 'banners'>('general')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Dynamic phones & emails state
  const [phones, setPhones] = useState<string[]>(
    settings.phones && settings.phones.length > 0
      ? settings.phones.map((p) => p.number)
      : ['+977-9800000000']
  )
  const [emails, setEmails] = useState<string[]>(
    settings.emails && settings.emails.length > 0
      ? settings.emails.map((e) => e.email)
      : ['info@riverbankjungleresort.com']
  )

  const handleAddPhone = () => setPhones([...phones, ''])
  const handleRemovePhone = (index: number) => setPhones(phones.filter((_, i) => i !== index))
  const handlePhoneChange = (index: number, val: string) => {
    const next = [...phones]
    next[index] = val
    setPhones(next)
  }

  const handleAddEmail = () => setEmails([...emails, ''])
  const handleRemoveEmail = (index: number) => setEmails(emails.filter((_, i) => i !== index))
  const handleEmailChange = (index: number, val: string) => {
    const next = [...emails]
    next[index] = val
    setEmails(next)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    // Re-append phones and emails
    formData.delete('phone')
    phones.filter((p) => p.trim()).forEach((p) => formData.append('phone', p.trim()))

    formData.delete('email')
    emails.filter((em) => em.trim()).forEach((em) => formData.append('email', em.trim()))

    try {
      const res = await saveSiteSettings(formData)
      if (res.success) {
        addToast('Site settings updated successfully.', 'success')
        router.refresh()
      } else {
        setError(res.error || 'Failed to save site settings.')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Tabs */}
      <div className="flex border-b border-espresso/15 gap-4 sm:gap-6 overflow-x-auto pb-px">
        {[
          { id: 'general', label: 'General & Brand' },
          { id: 'contact', label: 'Contact & Location' },
          { id: 'links', label: 'Links & Booking' },
          { id: 'banners', label: 'Page Banners' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-espresso text-espresso'
                : 'border-transparent text-espresso/50 hover:text-espresso'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          {error}
        </div>
      )}

      {/* Tab: General & Brand */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-3xl border border-espresso/10 p-6 sm:p-8 space-y-6 shadow-xs">
          <FormField label="Resort Name" required>
            <TextInput
              name="siteName"
              defaultValue={settings.siteName || 'River Bank Jungle Resort'}
              required
            />
          </FormField>

          <FormField label="Tagline / Motto">
            <TextInput
              name="tagline"
              defaultValue={settings.tagline || ''}
              placeholder="e.g. Luxury Sanctuary on the Edge of Chitwan National Park"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Resort Logo">
              <MediaPicker
                name="logo"
                defaultValue={settings.logo as any}
                label="Select Logo"
              />
            </FormField>

            <FormField label="Default SEO Share Image">
              <MediaPicker
                name="defaultSeoImage"
                defaultValue={settings.defaultSeoImage as any}
                label="Select SEO Image"
              />
            </FormField>
          </div>

          <FormField label="Footer Description Text">
            <Textarea
              name="footerText"
              defaultValue={settings.footerText || ''}
              rows={3}
              placeholder="Brief resort synopsis displayed in global footer..."
            />
          </FormField>
        </div>
      )}

      {/* Tab: Contact & Location */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-3xl border border-espresso/10 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Resort Physical Address" required>
              <TextInput
                name="address"
                defaultValue={settings.address || ''}
                placeholder="e.g. Sauraha, Chitwan, Nepal"
              />
            </FormField>

            <FormField label="Sales & Reservations Office">
              <TextInput
                name="salesOffice"
                defaultValue={settings.salesOffice || ''}
                placeholder="e.g. Thamel, Kathmandu, Nepal"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="WhatsApp Direct Number">
              <TextInput
                name="whatsapp"
                defaultValue={settings.whatsapp || ''}
                placeholder="+9779800000000"
              />
            </FormField>

            <FormField label="Google Maps Embed / Navigation URL">
              <TextInput
                name="mapUrl"
                defaultValue={settings.mapUrl || ''}
                placeholder="https://maps.google.com/..."
              />
            </FormField>
          </div>

          {/* Dynamic Phones */}
          <div className="space-y-3 pt-2 border-t border-espresso/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-espresso uppercase tracking-wider">
                Telephone Numbers
              </label>
              <Button type="button" variant="ghost" size="sm" onClick={handleAddPhone}>
                + Add Phone
              </Button>
            </div>
            <div className="space-y-2">
              {phones.map((phone, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => handlePhoneChange(idx, e.target.value)}
                    placeholder="+977-..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-espresso/15 bg-white text-xs text-espresso focus:outline-hidden focus:border-espresso/40"
                  />
                  {phones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhone(idx)}
                      className="p-2 text-rose-600 hover:text-rose-800 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Emails */}
          <div className="space-y-3 pt-2 border-t border-espresso/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-espresso uppercase tracking-wider">
                Email Addresses
              </label>
              <Button type="button" variant="ghost" size="sm" onClick={handleAddEmail}>
                + Add Email
              </Button>
            </div>
            <div className="space-y-2">
              {emails.map((email, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(idx, e.target.value)}
                    placeholder="info@..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-espresso/15 bg-white text-xs text-espresso focus:outline-hidden focus:border-espresso/40"
                  />
                  {emails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(idx)}
                      className="p-2 text-rose-600 hover:text-rose-800 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Links & Booking */}
      {activeTab === 'links' && (
        <div className="bg-white rounded-3xl border border-espresso/10 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Direct Booking Engine URL">
              <TextInput
                name="bookingUrl"
                defaultValue={settings.bookingUrl || ''}
                placeholder="https://..."
              />
            </FormField>

            <FormField label="360° Virtual Tour URL">
              <TextInput
                name="virtualTourUrl"
                defaultValue={settings.virtualTourUrl || ''}
                placeholder="https://..."
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-espresso/10">
            <FormField label="Facebook URL">
              <TextInput
                name="facebook"
                defaultValue={settings.facebook || ''}
                placeholder="https://facebook.com/..."
              />
            </FormField>

            <FormField label="Instagram URL">
              <TextInput
                name="instagram"
                defaultValue={settings.instagram || ''}
                placeholder="https://instagram.com/..."
              />
            </FormField>

            <FormField label="LinkedIn URL">
              <TextInput
                name="linkedin"
                defaultValue={settings.linkedin || ''}
                placeholder="https://linkedin.com/..."
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-espresso/10">
            <FormField label="Booking.com Listing">
              <TextInput
                name="bookingCom"
                defaultValue={settings.bookingCom || ''}
                placeholder="https://booking.com/..."
              />
            </FormField>

            <FormField label="TripAdvisor Profile">
              <TextInput
                name="tripadvisor"
                defaultValue={settings.tripadvisor || ''}
                placeholder="https://tripadvisor.com/..."
              />
            </FormField>

            <FormField label="MakeMyTrip Listing">
              <TextInput
                name="makemytrip"
                defaultValue={settings.makemytrip || ''}
                placeholder="https://makemytrip.com/..."
              />
            </FormField>
          </div>
        </div>
      )}

      {/* Tab: Page Header Banners */}
      {activeTab === 'banners' && (
        <div className="bg-white rounded-3xl border border-espresso/10 p-6 sm:p-8 space-y-6 shadow-xs">
          <p className="text-xs text-espresso/60 mb-2">
            Assign hero background imagery displayed at the top of each public page.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="About Page Hero Banner">
              <MediaPicker
                name="aboutBanner"
                defaultValue={settings.aboutBanner as any}
                label="Select About Banner"
              />
            </FormField>

            <FormField label="About Page Secondary Image">
              <MediaPicker
                name="aboutSecondaryImage"
                defaultValue={settings.aboutSecondaryImage as any}
                label="Select About Secondary Image"
              />
            </FormField>

            <FormField label="Rooms & Suites Banner">
              <MediaPicker
                name="roomsBanner"
                defaultValue={settings.roomsBanner as any}
                label="Select Rooms Banner"
              />
            </FormField>

            <FormField label="Dining Venues Banner">
              <MediaPicker
                name="diningBanner"
                defaultValue={settings.diningBanner as any}
                label="Select Dining Banner"
              />
            </FormField>

            <FormField label="Safari & Experiences Banner">
              <MediaPicker
                name="experiencesBanner"
                defaultValue={settings.experiencesBanner as any}
                label="Select Experiences Banner"
              />
            </FormField>

            <FormField label="Special Offers Banner">
              <MediaPicker
                name="offersBanner"
                defaultValue={settings.offersBanner as any}
                label="Select Offers Banner"
              />
            </FormField>

            <FormField label="Resort Photo Gallery Banner">
              <MediaPicker
                name="galleryBanner"
                defaultValue={settings.galleryBanner as any}
                label="Select Gallery Banner"
              />
            </FormField>

            <FormField label="Contact Us Banner">
              <MediaPicker
                name="contactBanner"
                defaultValue={settings.contactBanner as any}
                label="Select Contact Banner"
              />
            </FormField>

            <FormField label="Events & Weddings Banner">
              <MediaPicker
                name="eventsBanner"
                defaultValue={settings.eventsBanner as any}
                label="Select Events Banner"
              />
            </FormField>

            <FormField label="Sustainability Banner">
              <MediaPicker
                name="sustainabilityBanner"
                defaultValue={settings.sustainabilityBanner as any}
                label="Select Sustainability Banner"
              />
            </FormField>
          </div>
        </div>
      )}

      {/* Save Button Bar */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button type="submit" isLoading={isSubmitting} size="lg">
          Save Site Settings
        </Button>
      </div>
    </form>
  )
}
