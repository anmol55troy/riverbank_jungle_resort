export const SITE_URL = (
  process.env.NEXT_PUBLIC_SERVER_URL || 'https://riverbankjungleresort.com.np'
).replace(/\/$/, '')

export const SITE_NAME = 'River Bank Jungle Resort'

/** Fallbacks used when SiteSettings has not been filled in yet */
export const DEFAULTS = {
  address: 'Bharatpur-22, Patihani, Chitwan, Nepal',
  salesOffice: 'Sales Office: Maharajgunj, Kathmandu, Nepal',
  phones: ['+977 56-411121', '+977 56-411120', '+977 9761734722', '+977 9802390019'],
  emails: ['info@riverbankjungleresort.com.np', 'sales@riverbankjungleresort.com.np'],
  whatsapp: '+9779761734722',
  whatsappText: 'Hi River Bank, I would like to enquire about...',
  mapUrl: 'https://maps.app.goo.gl/zGQW2VfhALDefCGf8',
  mapEmbedUrl:
    'https://www.google.com/maps?q=River+Bank+Jungle+Resort+Patihani+Chitwan+Nepal&output=embed',
  bookingUrl: 'https://book-directonline.com/properties/riverbankjungleresortpvtltd',
  virtualTourUrl: 'https://virtualtour.airliftventures.com/riverbank-jungle-resort/',
  facebook: 'https://www.facebook.com/profile.php?id=61555768349361',
  instagram: 'https://www.instagram.com/river_bank_jungle_resort/',
  linkedin: 'https://www.linkedin.com/company/104239283',
  bookingCom: 'https://www.booking.com/hotel/np/river-bank-jungle-resort.html',
  tripadvisor: 'https://www.tripadvisor.com/Search?q=River+Bank+Jungle+Resort+Chitwan',
  makemytrip: 'https://www.makemytrip.com/hotels-international/nepal/chitwan-hotels/',
  // Approximate coordinates for Patihani, Bharatpur-22, Chitwan
  geo: { latitude: 27.578, longitude: 84.288 },
} as const

export const NAV_LINKS = [
  { href: '/about', key: 'about' },
  { href: '/rooms', key: 'rooms' },
  { href: '/dining', key: 'dining' },
  { href: '/experiences', key: 'experiences' },
  { href: '/events', key: 'events' },
  { href: '/sustainability', key: 'sustainability' },
  { href: '/offers', key: 'offers' },
  { href: '/gallery', key: 'gallery' },
  { href: '/awards', key: 'awards' },
  { href: '/blog', key: 'blog' },
  { href: '/contact', key: 'contact' },
] as const

export const PRIMARY_NAV_LINKS = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/rooms', key: 'rooms' },
  { href: '/blog', key: 'blog' },
  { href: '/contact', key: 'contact' },
] as const

export const whatsappHref = (number: string, text: string): string =>
  `https://wa.me/${number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`
