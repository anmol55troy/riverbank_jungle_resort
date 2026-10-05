export type SerializedLexicalNode = {
  type: string
  version: number
  [key: string]: unknown
}

export type SerializedEditorState = {
  root: {
    type: string
    children: SerializedLexicalNode[]
    direction: ('ltr' | 'rtl') | null
    format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
    indent: number
    version: number
    [key: string]: unknown
  }
  [key: string]: unknown
}

export interface User {
  id: string
  name?: string | null
  email: string
  loginAttempts?: number | null
  lockUntil?: string | null
  passwordHash?: string | null
  salt?: string | null
  hash?: string | null
  role?: 'admin' | string
  createdAt: string
  updatedAt: string
}

interface MediaSizes {
  thumbnail?: {
    url?: string | null
    width?: number | null
    height?: number | null
    mimeType?: string | null
    filesize?: number | null
    filename?: string | null
  }
  card?: {
    url?: string | null
    width?: number | null
    height?: number | null
    mimeType?: string | null
    filesize?: number | null
    filename?: string | null
  }
  hero?: {
    url?: string | null
    width?: number | null
    height?: number | null
    mimeType?: string | null
    filesize?: number | null
    filename?: string | null
  }
  og?: {
    url?: string | null
    width?: number | null
    height?: number | null
    mimeType?: string | null
    filesize?: number | null
    filename?: string | null
  }
}

export interface Media {
  id: string
  alt: string
  caption?: string | null
  url?: string | null
  thumbnailURL?: string | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
  focalX?: number | null
  focalY?: number | null
  sizes?: MediaSizes
  createdAt: string
  updatedAt: string
}

export interface Amenity {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Room {
  id: string
  title: string
  slug?: string | null
  shortDescription: string
  description: SerializedEditorState
  features?: {
    label: string
    value: string
    id?: string | null
  }[] | null
  amenities?: (string | Amenity)[] | null
  gallery?: {
    image: string | Media
    id?: string | null
  }[] | null
  priceFrom?: {
    amount?: number | null
    currency?: ('USD' | 'NPR') | null
  }
  order?: number | null
  createdAt: string
  updatedAt: string
}

export interface DiningVenue {
  id: string
  title: string
  slug?: string | null
  shortDescription: string
  description: SerializedEditorState
  cuisine?: string | null
  hours?: string | null
  image?: (string | null) | Media
  gallery?: {
    image: string | Media
    id?: string | null
  }[] | null
  order?: number | null
  createdAt: string
  updatedAt: string
}

export interface Experience {
  id: string
  title: string
  slug?: string | null
  shortDescription: string
  description?: SerializedEditorState | null
  duration?: string | null
  image?: (string | null) | Media
  order?: number | null
  createdAt: string
  updatedAt: string
}

export interface Offer {
  id: string
  title: string
  slug?: string | null
  active?: boolean | null
  validFrom?: string | null
  validUntil?: string | null
  description: SerializedEditorState
  image?: (string | null) | Media
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  title: string
  slug?: string | null
  excerpt: string
  body: SerializedEditorState
  coverImage?: (string | null) | Media
  author?: string | null
  publishedDate: string
  category?: ('travel-guide' | 'wildlife' | 'culture' | 'resort-news') | null
  relatedRooms?: (string | Room)[] | null
  relatedExperiences?: (string | Experience)[] | null
  createdAt: string
  updatedAt: string
}

export interface Testimonial {
  id: string
  quote: string
  guestName: string
  country?: string | null
  source: 'tripadvisor' | 'booking' | 'expedia' | 'tripcom'
  rating: number
  sourceUrl?: string | null
  createdAt: string
  updatedAt: string
}

export interface Faq {
  id: string
  question: string
  answer: SerializedEditorState
  order?: number | null
  createdAt: string
  updatedAt: string
}

export interface GalleryImage {
  id: string
  image: string | Media
  caption?: string | null
  category: 'resort' | 'rooms' | 'dining' | 'wildlife' | 'experiences' | 'culture'
  order?: number | null
  createdAt: string
  updatedAt: string
}

export interface FormSubmission {
  id: string
  formType: 'contact' | 'events'
  name: string
  email: string
  phone?: string | null
  subject?: string | null
  eventDate?: string | null
  guests?: number | null
  message: string
  createdAt: string
  updatedAt: string
}

export interface NewsletterSignup {
  id: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface SiteSetting {
  id?: string
  siteName?: string | null
  tagline?: string | null
  logo?: (string | null) | Media
  footerText?: string | null
  defaultSeoImage?: (string | null) | Media
  address?: string | null
  salesOffice?: string | null
  phones?: {
    number: string
    id?: string | null
  }[] | null
  emails?: {
    email: string
    id?: string | null
  }[] | null
  whatsapp?: string | null
  mapUrl?: string | null
  bookingUrl?: string | null
  virtualTourUrl?: string | null
  facebook?: string | null
  instagram?: string | null
  linkedin?: string | null
  bookingCom?: string | null
  tripadvisor?: string | null
  makemytrip?: string | null
  aboutBanner?: (string | null) | Media
  aboutSecondaryImage?: (string | null) | Media
  diningBanner?: (string | null) | Media
  roomsBanner?: (string | null) | Media
  experiencesBanner?: (string | null) | Media
  offersBanner?: (string | null) | Media
  galleryBanner?: (string | null) | Media
  contactBanner?: (string | null) | Media
  eventsBanner?: (string | null) | Media
  sustainabilityBanner?: (string | null) | Media
  createdAt?: string | null
  updatedAt?: string | null
}

