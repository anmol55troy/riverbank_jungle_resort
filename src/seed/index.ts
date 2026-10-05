/**
 * Seed script — fills the database with demo content so the site works
 * immediately after setup. Run with: pnpm seed
 *
 * Idempotent: skips seeding if content already exists.
 */
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

import { connectDB } from '../lib/db/connect'
import {
  UserModel,
  AmenityModel,
  RoomModel,
  DiningVenueModel,
  ExperienceModel,
  OfferModel,
  BlogPostModel,
  TestimonialModel,
  FaqModel,
  GalleryImageModel,
  SiteSettingModel,
  MediaModel,
} from '../lib/db/models'
import { uploadToCloudinary } from '../lib/cloudinary'
import { hashPassword } from '../lib/auth/password'
import { PLACEHOLDER } from '../lib/images'
import { seedExtraBlogs } from './extra-blogs'
import { heading, listItems, paragraph, paragraphs, richText } from './lexical'

const ADMIN_EMAIL = 'admin@riverbankjungleresort.com.np'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'riverbank123'

/** Load a bundled placeholder image, falling back to picsum and finally a generated gradient. */
async function fetchImageBuffer(source: string, seedName: string): Promise<Buffer> {
  if (source.startsWith('/')) {
    try {
      const abs = path.resolve(process.cwd(), 'public', source.replace(/^\//, ''))
      const buf = fs.readFileSync(abs)
      if (buf.length > 10_000) return buf
    } catch {
      // fall through to remote sources
    }
  }
  const candidates = [
    ...(source.startsWith('http') ? [source] : []),
    `https://picsum.photos/seed/${seedName}/1600/1067`,
  ]
  for (const url of candidates) {
    try {
      const res = await fetch(url, { redirect: 'follow' })
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer())
        if (buf.length > 10_000) return buf
      }
    } catch {
      // try next source
    }
  }
  // Offline fallback: warm gradient placeholder
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1067">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#C2A05C"/><stop offset="1" stop-color="#2A211A"/>
    </linearGradient></defs>
    <rect width="1600" height="1067" fill="url(#g)"/>
  </svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 80 }).toBuffer()
}

async function run(): Promise<void> {
  await connectDB()

  const existing = await AmenityModel.countDocuments()
  if (existing > 0) {
    console.log('Seed data already present — nothing to do. (Drop the database to reseed.)')
    process.exit(0)
  }

  console.log('Seeding River Bank Jungle Resort demo content…')

  // ---------- Admin user ----------
  const usersCount = await UserModel.countDocuments()
  if (usersCount === 0) {
    const passwordHash = await hashPassword(ADMIN_PASSWORD)
    await UserModel.create({
      email: ADMIN_EMAIL,
      passwordHash,
      name: 'Resort Admin',
      role: 'admin',
    })
    console.log(`Created admin user ${ADMIN_EMAIL} (password: ${ADMIN_PASSWORD})`)
  }

  // ---------- Media ----------
  async function processAndSaveImage(buffer: Buffer, filename: string, alt: string) {
    const result = await uploadToCloudinary(buffer)
    const doc = await MediaModel.create({
      alt,
      url: result.secure_url,
      thumbnailURL: result.secure_url,
      filename: result.public_id,
      mimeType: result.format ? `image/${result.format}` : 'image/jpeg',
      filesize: result.bytes,
      width: result.width,
      height: result.height,
      provider: 'cloudinary',
      public_id: result.public_id,
    })
    return doc
  }

  const mediaCache = new Map<string, string>()
  async function media(key: keyof typeof PLACEHOLDER, alt: string): Promise<string> {
    const cached = mediaCache.get(key)
    if (cached !== undefined) return cached
    const buffer = await fetchImageBuffer(PLACEHOLDER[key], key)
    const doc = await processAndSaveImage(buffer, `${key}.jpg`, alt)
    mediaCache.set(key, doc.id)
    console.log(`  media: ${key}`)
    return doc.id
  }

  // Static OG fallback image for pages without their own
  const ogBuffer = await fetchImageBuffer(PLACEHOLDER.hero, 'og-default')
  const publicDir = path.resolve(process.cwd(), 'public')
  fs.mkdirSync(publicDir, { recursive: true })
  fs.writeFileSync(
    path.join(publicDir, 'og-default.jpg'),
    await sharp(ogBuffer).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 85 }).toBuffer(),
  )
  console.log('  wrote public/og-default.jpg')

  // ---------- Amenities ----------
  const amenityNames = [
    'Air conditioning',
    'Complimentary Wi-Fi',
    'Balcony',
    'Marble floor',
    'Walk-in shower',
    'Tea/coffee maker',
    'Electric kettle',
    'Safety deposit box',
    'Iron & ironing board',
    'Hairdryer',
    'Emergency torch',
    'LED TV',
    'Bathrobe',
    'Slippers',
    'Room service',
    'Toiletries',
    'Dental kit',
    'Instant hot water',
    'Jungle view',
    'En-suite bathroom',
    'Wake-up service',
  ]
  const amenityIds: string[] = []
  for (const name of amenityNames) {
    const doc = await AmenityModel.create({ name })
    amenityIds.push(doc._id.toString())
  }
  console.log(`  ${amenityIds.length} amenities`)

  // ---------- Rooms ----------
  const deluxeImg = await media('room', 'Deluxe Room interior with balcony doors opening toward the jungle')
  const superDeluxeImg = await media('roomAlt', 'Super Deluxe Room with river-facing seating area')
  const villaImg = await media('villa', 'Private plunge pool on a villa terrace at dusk')

  await RoomModel.create({
    title: 'Deluxe Room',
    slug: 'deluxe-room',
    order: 1,
    shortDescription:
      'Split-level comfort at the edge of the gardens — cool marble floors, a private balcony and the sounds of the riverine jungle at dusk.',
    description: richText(
      paragraph(
        'Set among the mango trees a short stroll from the riverbank, our Deluxe Rooms are built over two easy levels — a 378 sq.ft upper floor and a 514 sq.ft lower floor, with a 270 sq.ft bedroom at the heart of it. Doors open onto a private balcony where mornings arrive with birdsong from the Terai grasslands rather than an alarm clock.',
      ),
      paragraph(
        'Inside, marble floors keep the lowland heat at bay, the walk-in shower runs instantly hot, and the air conditioning hums quietly beneath the ceiling. Everything you need for a safari base camp is here: tea and coffee on tap, a safety deposit box for your documents, and an emergency torch for the walk back from dinner under an unlit, star-heavy sky.',
      ),
      paragraph(
        'Deluxe Rooms sleep two adults and one child comfortably — the right fit for couples and small families building their days around jeep safaris and canoe trips on the Rapti.',
      ),
    ),
    features: [
      { label: 'Upstairs area', value: '378 sq.ft' },
      { label: 'Downstairs area', value: '514 sq.ft' },
      { label: 'Bedroom', value: '270 sq.ft' },
      { label: 'Occupancy', value: '2 adults + 1 child' },
      { label: 'View', value: 'Garden & jungle' },
    ],
    amenities: amenityIds,
    gallery: [{ image: deluxeImg }],
    priceFrom: { amount: 95, currency: 'USD' },
  })

  await RoomModel.create({
    title: 'Super Deluxe Room',
    slug: 'super-deluxe-room',
    order: 2,
    shortDescription:
      'Our most generous rooms — wide river-facing balconies, a lounge corner for slow afternoons and space to spread out after a day in the park.',
    description: richText(
      paragraph(
        'The Super Deluxe Rooms take everything guests love about the Deluxe category and stretch it — more floor, more light, and balconies angled toward the Rapti so you can watch egrets work the shallows without leaving your chair.',
      ),
      paragraph(
        'A seating corner with a daybed makes room for lazy hours between excursions; the bathroom pairs a walk-in rain shower with bathrobes, slippers and a full set of toiletries. Marble underfoot, strong Wi-Fi, and a kettle for the ritual of early-morning tea before the safari jeep rolls out.',
      ),
      paragraph(
        'Choose a Super Deluxe if you are staying more than a night or two — the extra space earns its keep once the jungle sets your rhythm.',
      ),
    ),
    features: [
      { label: 'Occupancy', value: '2 adults + 2 children' },
      { label: 'View', value: 'River & garden' },
      { label: 'Balcony', value: 'Private, river-facing' },
    ],
    amenities: amenityIds,
    gallery: [{ image: superDeluxeImg }],
    priceFrom: { amount: 130, currency: 'USD' },
  })

  await RoomModel.create({
    title: 'Villa with Private Plunge Pool',
    slug: 'villa-with-private-plunge-pool',
    order: 3,
    shortDescription:
      'A private villa with its own plunge pool and walled garden — the resort’s most secluded address, minutes from the riverbank.',
    description: richText(
      paragraph(
        'Behind its own garden wall, the Villa is a world of its own: a broad bedroom and lounge, a shaded terrace, and a private plunge pool that holds the day’s heat off while parakeets argue in the trees overhead.',
      ),
      paragraph(
        'The villa is where honeymooners and long-stay guests land — breakfast can be served on your terrace, massages arranged poolside, and a private candlelit dinner set beside the water once the cicadas begin. Full amenities run from marble floors and a walk-in shower to bathrobes, an LED TV and a well-stocked tea tray.',
      ),
      paragraph(
        'Step out of your gate and the river is minutes away on foot; step back in and Chitwan is yours alone.',
      ),
    ),
    features: [
      { label: 'Occupancy', value: '2 adults + 1 child' },
      { label: 'Pool', value: 'Private plunge pool' },
      { label: 'Terrace', value: 'Walled private garden' },
    ],
    amenities: amenityIds,
    gallery: [{ image: villaImg }],
    priceFrom: { amount: 220, currency: 'USD' },
  })
  console.log('  3 rooms')

  // ---------- Dining ----------
  const diningSeed = [
    {
      title: 'The Signature Restaurant',
      slug: 'the-signature-restaurant',
      image: await media('dining', 'Elegant dining room set for dinner at The Signature Restaurant'),
      cuisine: 'Nepali · Indian · Japanese · Continental',
      hours: '6:30 AM – 10:30 PM',
      shortDescription:
        'The resort’s main dining room — four kitchens under one roof, from dal bhat done properly to sushi and wood-grilled continental plates.',
      description: richText(
        paragraph(
          'The Signature Restaurant is the heart of the resort table. Its menu runs wide on purpose: slow-simmered Nepali thali and tandoor-bright Indian dishes sit beside Japanese classics and Continental grills, so a week of dinners never repeats itself.',
        ),
        paragraph(
          'Breakfast is a spread of fresh fruit, eggs and parathas before the morning safari; dinner is unhurried, candlelit and best finished with masala tea on the veranda.',
        ),
      ),
    },
    {
      title: 'Al Fresco Dining',
      slug: 'al-fresco-dining',
      image: await media('alfresco', 'Open-air dining tables set on the lawn beneath string lights'),
      cuisine: 'Grills · Nepali specialities',
      hours: 'Evenings, weather permitting',
      shortDescription:
        'Tables on the lawn under the mango trees — grills, bonfires and dinner served beneath the Terai stars.',
      description: richText(
        paragraph(
          'When the evening cools, the lawns become a dining room. Al Fresco dinners are built around the grill — river fish, tandoori platters and seasonal vegetables — served at long candlelit tables with a bonfire crackling nearby in the cooler months.',
        ),
        paragraph('Ask the team to pair your dinner with a Tharu cultural performance for the full Chitwan evening.'),
      ),
    },
    {
      title: 'Riverside Retreat',
      slug: 'riverside-retreat',
      image: await media('river', 'Dining deck overlooking the Rapti River at sunset'),
      cuisine: 'Sundowners · Light plates',
      hours: 'Afternoon – sunset',
      shortDescription:
        'Our deck on the Rapti itself — sundowners, snacks and front-row seats as rhinos and buffalo come down to the water.',
      description: richText(
        paragraph(
          'The Riverside Retreat is the seat everyone wants at 5 PM: a deck hanging over the bank where the day slows with the current. Order a cold drink and a plate of pakoras, and let the river do the entertaining — kingfishers at work, canoes drifting home, and, on lucky evenings, a rhino crossing in the gold light.',
        ),
      ),
    },
    {
      title: 'The Classic Bar',
      slug: 'the-classic-bar',
      image: await media('bar', 'Warmly lit resort bar with spirits shelved behind the counter'),
      cuisine: 'Cocktails · Wines · Spirits',
      hours: '11:00 AM – late',
      shortDescription:
        'A proper hotel bar — single malts, Nepali craft beers and cocktails mixed to order after a day in the park.',
      description: richText(
        paragraph(
          'Wood, low light and a well-stocked back bar: The Classic Bar is where safari stories get taller as the evening goes on. The list runs from Gurkha beers and Khukri rum to single malts and a short, confident cocktail card.',
        ),
      ),
    },
  ]
  for (const [i, venue] of diningSeed.entries()) {
    await DiningVenueModel.create({
      ...venue,
      order: i + 1,
    })
  }
  console.log('  4 dining venues')

  // ---------- Experiences ----------
  const experiencesSeed = [
    {
      title: 'Jeep Safari',
      slug: 'jeep-safari',
      duration: 'Half or full day',
      shortDescription:
        'Roll into the park at first light in an open 4x4 with a licensed naturalist, tracking one-horned rhinos through the grasslands, watching for sloth bears in the sal forest, and — with luck on your side — crossing paths with a Bengal tiger.',
    },
    {
      title: 'Canoe Safari',
      slug: 'canoe-safari',
      duration: '1.5–2 hours',
      shortDescription:
        'Drift down the Rapti in a traditional dugout canoe, eye-level with the river: gharial and mugger crocodiles bask on the sandbanks, kingfishers dive beside you, and the only engine is the boatman’s pole.',
    },
    {
      title: 'Jungle Walk',
      slug: 'jungle-walk',
      duration: '2–4 hours',
      shortDescription:
        'On foot the jungle changes scale — two naturalists lead you along animal trails to read pugmarks, termite cities and alarm calls, the safest and most intimate way to feel how the forest actually breathes.',
    },
    {
      title: 'Bird Watching',
      slug: 'bird-watching',
      duration: 'Early morning',
      shortDescription:
        'Chitwan shelters over 540 recorded species; with binoculars and a patient guide you can tick hornbills, paradise flycatchers, storks and — in winter — migratory waterfowl crowding the oxbow lakes.',
    },
    {
      title: 'Crocodile Breeding Center',
      slug: 'crocodile-breeding-center',
      duration: '2 hours',
      shortDescription:
        'Visit the conservation hatchery that pulled the fish-eating gharial back from the brink — see hatchlings up close and learn how each release day sends young crocodiles back into the Rapti and Narayani rivers.',
    },
    {
      title: 'Tharu Cultural Dance',
      slug: 'tharu-cultural-dance',
      duration: 'Evening',
      shortDescription:
        'After dinner, drummers from Patihani village take the stage for the stick dance — a whirling, percussive tradition the Tharu have carried for generations, performed by the community itself, not a hotel troupe.',
    },
    {
      title: 'Village Tour',
      slug: 'village-tour',
      duration: '2–3 hours',
      shortDescription:
        'Cycle or walk into Patihani village to see Tharu longhouses painted with rice-flour murals, meet farmers working buffalo carts, and understand how people and the park have shared this floodplain for centuries.',
    },
    {
      title: 'Sundowner on the Riverbank',
      slug: 'sundowner-on-the-riverbank',
      duration: '1 hour',
      shortDescription:
        'A table on the sand, a cold drink in hand, and the sun dropping behind the far bank of the Rapti — the simplest experience we offer, and the one guests talk about longest.',
    },
    {
      title: 'Pool & Yoga',
      slug: 'pool-and-yoga',
      duration: 'Anytime',
      shortDescription:
        'Between safaris, the resort slows down: morning yoga on the lawn as mist lifts off the river, and long afternoons at the pool with the jungle canopy for a fence line.',
    },
  ]
  for (const [i, exp] of experiencesSeed.entries()) {
    await ExperienceModel.create({
      ...exp,
      order: i + 1,
    })
  }
  console.log('  9 experiences')

  // ---------- Offers ----------
  const poolImg = await media('pool', 'Resort swimming pool edged by tropical planting')
  const terraceImg = await media('terrace', 'Terrace seating overlooking the river in the evening')
  await OfferModel.create({
    title: 'Safari Package — 2 Nights, All Experiences',
    slug: 'safari-package-2-nights',
    active: true,
    description: richText(
      paragraph(
        'Two nights’ stay with full board, jeep safari, canoe ride, jungle walk, Tharu cultural evening and all park permits included. The complete Chitwan itinerary, arranged before you arrive.',
      ),
      listItems([
        'All meals at The Signature Restaurant',
        'Jeep safari & canoe trip with naturalist guides',
        'National park permits and fees included',
        'Airport pickup from Bharatpur on request',
      ]),
    ),
    image: poolImg,
  })
  await OfferModel.create({
    title: 'Stay 3, Pay 2 — Monsoon Green Season',
    slug: 'stay-3-pay-2-monsoon',
    active: true,
    description: richText(
      paragraph(
        'The monsoon turns the Terai emerald and the river full — and the resort quiet. Stay three nights between June and September and the third night is on us, with riverside breakfast included.',
      ),
    ),
    image: terraceImg,
  })
  console.log('  2 offers')

  // ---------- Blog posts ----------
  const jungleImg = await media('jungle', 'Sal forest canopy inside Chitwan National Park')
  const jeepImg = await media('jeep', 'Safari jeep on a grassland track at golden hour')
  const villageImg = await media('village', 'Tharu village lane with traditional houses')

  await BlogPostModel.create({
    title: 'Best Time to Visit Chitwan National Park',
    slug: 'best-time-to-visit-chitwan-national-park',
    excerpt:
      'October to March brings dry trails, cool mornings and the best wildlife viewing in Chitwan — but every season has its case. A month-by-month guide from the riverbank.',
    publishedDate: '2026-07-10T00:00:00.000Z',
    category: 'travel-guide',
    author: 'River Bank Jungle Resort',
    coverImage: jungleImg,
    body: richText(
      paragraph(
        'Ask ten guides for the best month to visit Chitwan and you will get ten confident answers. The honest one: it depends what you want the park to show you.',
      ),
      heading('October to March — The Classic Season'),
      paragraph(
        'After the monsoon withdraws, the Terai dries into safari weather: mornings around 8–15°C, afternoons in the mid-20s, and grasslands short enough to spot rhinos at distance. This is peak season for a reason — book rooms and safaris ahead.',
      ),
      heading('April to June — Hot, but Rewarding'),
      paragraph(
        'Heat builds toward 35°C+, and that is exactly why wildlife concentrates at water. Riverbanks and waterholes become theatres; serious photographers quietly love these months.',
      ),
      heading('July to September — The Green Season'),
      paragraph(
        'Monsoon rain swells the Rapti and paints everything green. Some jungle activities pause when trails flood, but the resort is at its most peaceful, birdlife is rich, and rates are gentlest.',
      ),
      paragraph(
        'Whenever you come, build in at least two nights — one for the jeep safari, one for the river. Three lets the place work on you properly.',
      ),
    ),
  })

  await BlogPostModel.create({
    title: 'Chitwan Jungle Safari: Complete Guide',
    slug: 'chitwan-jungle-safari-complete-guide',
    excerpt:
      'Jeep or canoe? Half day or full day? What permits cost, what to pack and how to maximise your chances of seeing rhinos and tigers — a complete safari guide.',
    publishedDate: '2026-07-20T00:00:00.000Z',
    category: 'wildlife',
    author: 'River Bank Jungle Resort',
    coverImage: jeepImg,
    body: richText(
      paragraph(
        'Chitwan National Park protects nearly a thousand square kilometres of grassland, sal forest and river — home to one-horned rhinos, Bengal tigers, sloth bears, gharials and more than 540 bird species. Here is how to plan a safari that does it justice.',
      ),
      heading('Choose Your Safari'),
      listItems([
        'Jeep safari — covers the most ground; best odds for rhino and big mammals',
        'Canoe safari — silent, river-level views of crocodiles and waterbirds',
        'Jungle walk — guided on foot; the most visceral way to meet the forest',
        'Full-day combination — jeep, walk and canoe in one long, unforgettable day',
      ]),
      heading('Permits & Practicalities'),
      paragraph(
        'Park entry permits are issued per person per day and are arranged by the resort — bring your passport. Safaris leave early; the first hours after dawn are when the park is most alive.',
      ),
      heading('What to Pack'),
      paragraph(
        'Neutral-coloured clothing, closed shoes, a hat, sunscreen, insect repellent and binoculars. Mornings November–February start cold on an open jeep — bring a warm layer you can shed.',
      ),
    ),
  })

  await BlogPostModel.create({
    title: '15 Things to Do in Chitwan',
    slug: '15-things-to-do-in-chitwan',
    excerpt:
      'Beyond the jeep safari: canoe trips, birding, Tharu culture, cycling to Bishazari Lake and where to watch the sunset — fifteen ways to fill your days in Chitwan.',
    publishedDate: '2026-07-28T00:00:00.000Z',
    category: 'travel-guide',
    author: 'River Bank Jungle Resort',
    coverImage: villageImg,
    body: richText(
      paragraph(
        'The safari may be the headline, but Chitwan rewards guests who stay long enough to go past it. Fifteen favourites, gathered from our guides and guests:',
      ),
      listItems([
        'Jeep safari deep into the national park',
        'Dugout canoe trip down the Rapti River',
        'Guided jungle walk with naturalists',
        'Bird watching at dawn on the oxbow lakes',
        'Visit the gharial Crocodile Breeding Center',
        'Tharu stick-dance evening',
        'Cycle through Patihani village',
        'Sunset sundowner on the riverbank',
        'Elephant viewing at a respectful distance',
        'Photograph rhinos from the riverside deck',
        'Morning yoga on the lawn',
        'Cooking demo: learn a proper dal bhat',
        'Day trip to Bishazari Tal wetlands',
        'Visit the elephant breeding centre at Khorsor',
        'Do absolutely nothing beside the pool',
      ]),
      paragraph(
        'Our front desk builds custom itineraries around any of these — tell us how many days you have and we will make them count.',
      ),
    ),
  })
  console.log('  3 blog posts')

  await seedExtraBlogs()

  // ---------- Testimonials ----------
  const testimonialsSeed = [
    {
      quote:
        'We watched a rhino cross the river from our breakfast table. The rooms are immaculate, the guides are brilliant, and the riverside sundowners are worth the trip alone.',
      guestName: 'Emma & James H.',
      country: 'United Kingdom',
      source: 'tripadvisor' as const,
      rating: 5,
    },
    {
      quote:
        'Best resort we stayed at in Nepal. The villa plunge pool was heaven after a hot safari day, and the staff remembered everything — names, drinks, even our safari wish list.',
      guestName: 'Sofia M.',
      country: 'Spain',
      source: 'booking' as const,
      rating: 5,
    },
    {
      quote:
        'The canoe safari at dawn was pure magic — crocodiles, kingfishers and total silence. Food was outstanding: the Nepali thali and the tandoori river fish especially.',
      guestName: 'Daniel K.',
      country: 'Germany',
      source: 'tripadvisor' as const,
      rating: 5,
    },
    {
      quote:
        'Perfect family stay. The kids loved the Tharu dance evening and the pool; we loved the balcony views and the genuinely warm service. Airport pickup was seamless.',
      guestName: 'Priya S.',
      country: 'India',
      source: 'expedia' as const,
      rating: 5,
    },
    {
      quote:
        'Quiet, green and right on the river — far from the crowds. The naturalist guides are exceptional; we saw more wildlife in two days than we expected in a week.',
      guestName: 'Marc L.',
      country: 'France',
      source: 'tripcom' as const,
      rating: 4,
    },
    {
      quote:
        'From the welcome drink to the last sundowner, everything felt considered. The Signature Restaurant could hold its own in Kathmandu — in Patihani it is a small miracle.',
      guestName: 'Ayaka T.',
      country: 'Japan',
      source: 'booking' as const,
      rating: 5,
    },
  ]
  for (const t of testimonialsSeed) {
    await TestimonialModel.create(t)
  }
  console.log('  6 testimonials')

  // ---------- FAQs ----------
  const faqsSeed = [
    {
      question: 'Where exactly is River Bank Jungle Resort located?',
      answer: paragraphs(
        'The resort is at Bharatpur-22, Patihani, Chitwan, Nepal — on the banks of the Rapti River at the edge of Chitwan National Park. Note that we are in the peaceful Patihani area on the park’s northwestern side, not in the busier Sauraha tourist hub.',
      ),
    },
    {
      question: 'How do I get to the resort from Kathmandu?',
      answer: paragraphs(
        'You have two easy options. By road, the resort is about 165 km from Kathmandu — a 5–6 hour drive (similar from Pokhara). By air, it is a 25-minute flight from Kathmandu to Bharatpur Airport, followed by a 30-minute drive to the resort.',
      ),
    },
    {
      question: 'How far is the resort from Bharatpur Airport?',
      answer: paragraphs(
        'About 25 km, roughly a 30-minute drive. We arrange airport pickup on request — just share your flight details when you book.',
      ),
    },
    {
      question: 'What activities can I do at the resort?',
      answer: paragraphs(
        'Jeep safaris and jungle walks in Chitwan National Park, canoe trips on the Rapti River, bird watching, a visit to the gharial Crocodile Breeding Center, Tharu cultural dance evenings, village tours, riverside sundowners, and downtime at the pool or morning yoga. Our desk arranges permits and guides for everything.',
      ),
    },
    {
      question: 'When is the best time to visit Chitwan?',
      answer: paragraphs(
        'October to March offers dry trails, comfortable temperatures and the best wildlife viewing. April to June is hotter but excellent for spotting animals at waterholes. The monsoon (June–September) is lush, quiet and great value, though some jungle activities pause when the river runs high.',
      ),
    },
    {
      question: 'Do the rooms have air conditioning and Wi-Fi?',
      answer: paragraphs(
        'Yes. All rooms are air-conditioned with complimentary Wi-Fi, instant hot water, tea/coffee makers, LED TVs, safety deposit boxes and en-suite bathrooms with walk-in showers.',
      ),
    },
    {
      question: 'Is airport pickup available, and are meals included?',
      answer: paragraphs(
        'Airport pickup from Bharatpur is available on request. Meal plans depend on the rate you book — The Signature Restaurant serves Nepali, Indian, Japanese and Continental cuisine, and most guests choose our full-board safari packages.',
      ),
    },
  ]
  for (const [i, faq] of faqsSeed.entries()) {
    await FaqModel.create({ ...faq, order: i + 1 })
  }
  console.log('  7 FAQs')

  // ---------- Gallery ----------
  const gallerySeed: { key: keyof typeof PLACEHOLDER; caption: string; category: string }[] = [
    { key: 'hero', caption: 'The Rapti River at dawn', category: 'resort' },
    { key: 'resort', caption: 'Cottages set in the gardens', category: 'resort' },
    { key: 'pool', caption: 'The pool under the mango trees', category: 'resort' },
    { key: 'room', caption: 'Deluxe Room interior', category: 'rooms' },
    { key: 'villa', caption: 'Villa plunge pool at dusk', category: 'rooms' },
    { key: 'dining', caption: 'Dinner at The Signature Restaurant', category: 'dining' },
    { key: 'alfresco', caption: 'Al fresco evening on the lawn', category: 'dining' },
    { key: 'rhino', caption: 'One-horned rhino in the grassland', category: 'wildlife' },
    { key: 'bird', caption: 'Kingfisher over the river', category: 'wildlife' },
    { key: 'jeep', caption: 'Morning jeep safari', category: 'experiences' },
    { key: 'canoe', caption: 'Dugout canoe on the Rapti', category: 'experiences' },
    { key: 'culture', caption: 'Tharu cultural evening', category: 'culture' },
  ]
  for (const [i, item] of gallerySeed.entries()) {
    const img = await media(item.key, item.caption)
    await GalleryImageModel.create({
      image: img,
      caption: item.caption,
      category: item.category,
      order: i + 1,
    })
  }
  console.log('  12 gallery images')

  // ---------- Site settings ----------
  let logoId: string | undefined
  try {
    const logoBuf = fs.readFileSync(path.resolve(process.cwd(), 'public', 'logo.png'))
    const logoDoc = await processAndSaveImage(logoBuf, 'logo.png', 'River Bank Jungle Resort logo')
    logoId = logoDoc.id
  } catch {
    // logo file missing — site falls back to /logo.png
  }

  await SiteSettingModel.findOneAndUpdate(
    { globalType: 'site-settings' },
    {
      globalType: 'site-settings',
      ...(logoId ? { logo: logoId } : {}),
      siteName: 'River Bank Jungle Resort',
      tagline: 'A riverside sanctuary on the edge of Chitwan National Park',
      footerText:
        'A riverside sanctuary in Patihani on the banks of the Rapti River, where the Terai jungle of Chitwan National Park meets five-star comfort.',
      address: 'Bharatpur-22, Patihani, Chitwan, Nepal',
      salesOffice: 'Sales Office: Maharajgunj, Kathmandu, Nepal',
      phones: [
        { number: '+977 56-411121' },
        { number: '+56-411120' },
        { number: '+977 9761734722' },
        { number: '+977 9802390019' },
      ],
      emails: [
        { email: 'info@riverbankjungleresort.com.np' },
        { email: 'sales@riverbankjungleresort.com.np' },
      ],
      whatsapp: '+9779761734722',
      mapUrl: 'https://maps.app.goo.gl/zGQW2VfhALDefCGf8',
      bookingUrl: 'https://book-directonline.com/properties/riverbankjungleresortpvtltd',
      virtualTourUrl: 'https://virtualtour.airliftventures.com/riverbank-jungle-resort/',
      facebook: 'https://www.facebook.com/profile.php?id=61555768349361',
      instagram: 'https://www.instagram.com/river_bank_jungle_resort/',
      linkedin: 'https://www.linkedin.com/company/104239283',
      bookingCom: 'https://www.booking.com/hotel/np/river-bank-jungle-resort.html',
      tripadvisor: 'https://www.tripadvisor.com/Search?q=River+Bank+Jungle+Resort+Chitwan',
      makemytrip: 'https://www.makemytrip.com/hotels-international/nepal/chitwan-hotels/',
    },
    { upsert: true, new: true }
  )
  console.log('  site settings')

  console.log('Seed complete. Admin: ' + ADMIN_EMAIL)
  process.exit(0)
}

run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
