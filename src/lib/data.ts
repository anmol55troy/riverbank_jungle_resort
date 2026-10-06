import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { connectDB } from './db/connect'
import {
  AmenityModel,
  BlogPostModel,
  DiningVenueModel,
  ExperienceModel,
  EventVenueModel,
  FaqModel,
  GalleryImageModel,
  MediaModel,
  OfferModel,
  RoomModel,
  SiteSettingModel,
  TestimonialModel,
} from './db/models'
import { serializeDoc, serializeDocs } from './db/serialize'
import type {
  BlogPost,
  DiningVenue,
  Experience,
  EventVenue,
  Faq,
  GalleryImage,
  Offer,
  Room,
  SiteSetting,
  Testimonial,
} from './types'

// Ensure models are registered in Mongoose
void AmenityModel
void MediaModel

export const getSiteSettings = cache(unstable_cache(async (): Promise<SiteSetting> => {
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
}, ['getSiteSettings'], { revalidate: 3600, tags: ['getSiteSettings'] }))

export const getRooms = cache(unstable_cache(async (): Promise<Room[]> => {
  await connectDB()
  const docs = await RoomModel.find({})
    .sort({ order: 1 })
    .limit(50)
    .populate('amenities')
    .populate('gallery.image')
    .lean()

  return serializeDocs<Room>(docs)
}, ['getRooms'], { revalidate: 3600, tags: ['getRooms'] }))

export const getRoomBySlug = cache(unstable_cache(async (slug: string): Promise<Room | null> => {
  await connectDB()
  const doc = await RoomModel.findOne({ slug })
    .populate('amenities')
    .populate('gallery.image')
    .lean()

  return serializeDoc<Room>(doc) ?? null
}, ['getRoomBySlug'], { revalidate: 3600, tags: ['getRoomBySlug'] }))

export const getDiningVenues = cache(unstable_cache(async (): Promise<DiningVenue[]> => {
  await connectDB()
  const docs = await DiningVenueModel.find({})
    .sort({ order: 1 })
    .limit(50)
    .populate('image')
    .populate('gallery.image')
    .lean()

  return serializeDocs<DiningVenue>(docs)
}, ['getDiningVenues'], { revalidate: 3600, tags: ['getDiningVenues'] }))

export const getDiningVenueBySlug = cache(unstable_cache(async (slug: string): Promise<DiningVenue | null> => {
  await connectDB()
  const doc = await DiningVenueModel.findOne({ slug })
    .populate('image')
    .populate('gallery.image')
    .lean()

  return serializeDoc<DiningVenue>(doc) ?? null
}, ['getDiningVenueBySlug'], { revalidate: 3600, tags: ['getDiningVenueBySlug'] }))

export const getExperiences = cache(unstable_cache(async (): Promise<Experience[]> => {
  await connectDB()
  const docs = await ExperienceModel.find({})
    .sort({ order: 1 })
    .limit(50)
    .populate('image')
    .lean()

  return serializeDocs<Experience>(docs)
}, ['getExperiences'], { revalidate: 3600, tags: ['getExperiences'] }))

export const getEventVenues = cache(unstable_cache(async (): Promise<EventVenue[]> => {
  await connectDB()
  const docs = await EventVenueModel.find({})
    .sort({ order: 1 })
    .limit(50)
    .populate('image')
    .populate('gallery.image')
    .lean()

  return serializeDocs<EventVenue>(docs)
}, ['getEventVenues'], { revalidate: 3600, tags: ['getEventVenues'] }))

export const getEventVenueBySlug = cache(unstable_cache(async (slug: string): Promise<EventVenue | null> => {
  await connectDB()
  const doc = await EventVenueModel.findOne({ slug })
    .populate('image')
    .populate('gallery.image')
    .lean()

  return serializeDoc<EventVenue>(doc) ?? null
}, ['getEventVenueBySlug'], { revalidate: 3600, tags: ['getEventVenueBySlug'] }))

export const getActiveOffers = cache(unstable_cache(async (): Promise<Offer[]> => {
  await connectDB()
  const docs = await OfferModel.find({ active: true })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('image')
    .lean()

  return serializeDocs<Offer>(docs)
}, ['getActiveOffers'], { revalidate: 3600, tags: ['getActiveOffers'] }))

export const getBlogPosts = cache(unstable_cache(async (limit = 50): Promise<BlogPost[]> => {
  await connectDB()
  const docs = await BlogPostModel.find({})
    .sort({ publishedDate: -1 })
    .limit(limit)
    .populate('coverImage')
    .populate('relatedRooms')
    .populate('relatedExperiences')
    .lean()

  return serializeDocs<BlogPost>(docs)
}, ['getBlogPosts'], { revalidate: 3600, tags: ['getBlogPosts'] }))

export const getBlogPostBySlug = cache(unstable_cache(async (slug: string): Promise<BlogPost | null> => {
  await connectDB()
  const doc = await BlogPostModel.findOne({ slug })
    .populate('coverImage')
    .populate({
      path: 'relatedRooms',
      populate: { path: 'gallery.image' },
    })
    .populate('relatedExperiences')
    .lean()

  return serializeDoc<BlogPost>(doc) ?? null
}, ['getBlogPostBySlug'], { revalidate: 3600, tags: ['getBlogPostBySlug'] }))

export const getTestimonials = cache(unstable_cache(async (): Promise<Testimonial[]> => {
  await connectDB()
  const docs = await TestimonialModel.find({}).limit(20).lean()
  return serializeDocs<Testimonial>(docs)
}, ['getTestimonials'], { revalidate: 3600, tags: ['getTestimonials'] }))

export const getFAQs = cache(unstable_cache(async (): Promise<Faq[]> => {
  await connectDB()
  const docs = await FaqModel.find({}).sort({ order: 1 }).limit(50).lean()
  return serializeDocs<Faq>(docs)
}, ['getFAQs'], { revalidate: 3600, tags: ['getFAQs'] }))

export const getGalleryImages = cache(unstable_cache(async (): Promise<GalleryImage[]> => {
  await connectDB()
  const docs = await GalleryImageModel.find({})
    .sort({ order: 1 })
    .limit(200)
    .populate('image')
    .lean()

  return serializeDocs<GalleryImage>(docs)
}, ['getGalleryImages'], { revalidate: 3600, tags: ['getGalleryImages'] }))
