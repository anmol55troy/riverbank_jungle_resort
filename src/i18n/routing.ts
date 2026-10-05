import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // Nepali ('np') is scaffolded for later — add translations in messages/np.json
  // and it becomes available at /np without further code changes.
  locales: ['en', 'np'],
  defaultLocale: 'en',
  // English lives at the root (/rooms), Nepali will live under /np (/np/rooms)
  localePrefix: 'as-needed',
})

export type Locale = (typeof routing.locales)[number]
