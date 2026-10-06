'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '../db/connect'
import { SiteSettingModel } from '../db/models'
import { serializeDoc } from '../db/serialize'
import { requireAdmin } from '../auth/guard'
import type { SiteSetting } from '../types'

export async function getAdminSiteSettings(): Promise<SiteSetting> {
  await requireAdmin()
  await connectDB()
  const doc = await SiteSettingModel.findOne({ globalType: 'site-settings' })
    .populate('logo')
    .populate('defaultSeoImage')
    .populate('aboutBanner')
    .populate('aboutSecondaryImage')
    .populate('diningBanner')
    .populate('roomsBanner')
    .populate('experiencesBanner')
    .populate('offersBanner')
    .populate('galleryBanner')
    .populate('contactBanner')
    .populate('eventsBanner')
    .populate('sustainabilityBanner')
    .lean()

  return serializeDoc<SiteSetting>(doc) || {}
}

export async function saveSiteSettings(formData: FormData): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  await connectDB()

  const siteName = String(formData.get('siteName') || 'River Bank Jungle Resort').trim()
  const tagline = String(formData.get('tagline') || '').trim()
  const logo = String(formData.get('logo') || '').trim()
  const footerText = String(formData.get('footerText') || '').trim()
  const defaultSeoImage = String(formData.get('defaultSeoImage') || '').trim()

  const address = String(formData.get('address') || '').trim()
  const salesOffice = String(formData.get('salesOffice') || '').trim()
  const whatsapp = String(formData.get('whatsapp') || '').trim()
  const mapUrl = String(formData.get('mapUrl') || '').trim()

  // Phones & emails arrays
  const phoneNumbers = formData.getAll('phone') as string[]
  const emailAddresses = formData.getAll('email') as string[]

  const phones = phoneNumbers
    .filter((n) => String(n).trim())
    .map((n) => ({ number: String(n).trim(), id: Math.random().toString(36).substring(2, 9) }))

  const emails = emailAddresses
    .filter((e) => String(e).trim())
    .map((e) => ({ email: String(e).trim(), id: Math.random().toString(36).substring(2, 9) }))

  // Links
  const bookingUrl = String(formData.get('bookingUrl') || '').trim()
  const virtualTourUrl = String(formData.get('virtualTourUrl') || '').trim()
  const facebook = String(formData.get('facebook') || '').trim()
  const instagram = String(formData.get('instagram') || '').trim()
  const linkedin = String(formData.get('linkedin') || '').trim()
  const bookingCom = String(formData.get('bookingCom') || '').trim()
  const tripadvisor = String(formData.get('tripadvisor') || '').trim()
  const makemytrip = String(formData.get('makemytrip') || '').trim()

  // Page Banners
  const aboutBanner = String(formData.get('aboutBanner') || '').trim()
  const aboutSecondaryImage = String(formData.get('aboutSecondaryImage') || '').trim()
  const diningBanner = String(formData.get('diningBanner') || '').trim()
  const roomsBanner = String(formData.get('roomsBanner') || '').trim()
  const experiencesBanner = String(formData.get('experiencesBanner') || '').trim()
  const offersBanner = String(formData.get('offersBanner') || '').trim()
  const galleryBanner = String(formData.get('galleryBanner') || '').trim()
  const contactBanner = String(formData.get('contactBanner') || '').trim()
  const eventsBanner = String(formData.get('eventsBanner') || '').trim()
  const sustainabilityBanner = String(formData.get('sustainabilityBanner') || '').trim()

  const data: Record<string, unknown> = {
    globalType: 'site-settings',
    siteName,
    tagline,
    logo: logo || undefined,
    footerText: footerText || undefined,
    defaultSeoImage: defaultSeoImage || undefined,
    address,
    salesOffice,
    phones: phones.length > 0 ? phones : undefined,
    emails: emails.length > 0 ? emails : undefined,
    whatsapp,
    mapUrl,
    bookingUrl,
    virtualTourUrl,
    facebook,
    instagram,
    linkedin,
    bookingCom: bookingCom || undefined,
    tripadvisor: tripadvisor || undefined,
    makemytrip: makemytrip || undefined,
    aboutBanner: aboutBanner || undefined,
    aboutSecondaryImage: aboutSecondaryImage || undefined,
    diningBanner: diningBanner || undefined,
    roomsBanner: roomsBanner || undefined,
    experiencesBanner: experiencesBanner || undefined,
    offersBanner: offersBanner || undefined,
    galleryBanner: galleryBanner || undefined,
    contactBanner: contactBanner || undefined,
    eventsBanner: eventsBanner || undefined,
    sustainabilityBanner: sustainabilityBanner || undefined,
  }

  try {
    await SiteSettingModel.findOneAndUpdate({ globalType: 'site-settings' }, data, {
      upsert: true,
      new: true,
    })

    // Revalidate all public pages because footer, navbar and banners depend on settings
    revalidatePath('/', 'layout')
    revalidatePath('/sitemap.xml')

    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: (err instanceof Error ? err.message : "An unknown error occurred") || 'Failed to update site settings.' }
  }
}
