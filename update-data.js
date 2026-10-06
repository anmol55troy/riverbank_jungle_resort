const fs = require('fs');

let content = fs.readFileSync('src/lib/data.ts', 'utf8');

// Add import { unstable_cache } from 'next/cache'
if (!content.includes("import { unstable_cache }")) {
  content = content.replace("import { cache } from 'react'", "import { cache } from 'react'\nimport { unstable_cache } from 'next/cache'");
}

const functionNames = [
  'getSiteSettings',
  'getRooms',
  'getRoomBySlug',
  'getDiningVenues',
  'getDiningVenueBySlug',
  'getExperiences',
  'getActiveOffers',
  'getBlogPosts',
  'getBlogPostBySlug',
  'getTestimonials',
  'getFAQs',
  'getGalleryImages'
];

functionNames.forEach(fn => {
  // Regex to match: export const FN_NAME = cache(async (args) => { ... })
  // We'll replace it carefully.
  // Actually, since the file structure is simple, let's use a simpler regex or exact replacement.
});

// Write back
fs.writeFileSync('src/lib/data.ts', content);
