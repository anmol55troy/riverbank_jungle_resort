import fs from 'fs'
import path from 'path'
import { connectDB } from '../lib/db/connect'
import { BlogPostModel, MediaModel, RoomModel, ExperienceModel } from '../lib/db/models'
import { uploadToCloudinary } from '../lib/cloudinary'
import { heading, listItems, paragraph, richText } from './lexical'

/**
 * Five additional journal posts. Idempotent per-slug, so it can run against
 * a live database (pnpm seed:blogs) and is also called from the main seed.
 */
export async function seedExtraBlogs(): Promise<void> {
  await connectDB()

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

  /** Reuse an already-uploaded placeholder media doc, or create it from public/placeholders. */
  async function mediaByKey(key: string, alt: string): Promise<string | undefined> {
    const existing = await MediaModel.findOne({
      filename: { $regex: key, $options: 'i' },
    }).lean()

    if (existing) return existing._id.toString()

    try {
      const absPath = path.resolve(process.cwd(), 'public', 'placeholders', `${key}.jpg`)
      if (fs.existsSync(absPath)) {
        const buf = fs.readFileSync(absPath)
        const doc = await processAndSaveImage(buf, `${key}.jpg`, alt)
        return doc.id
      }
      return undefined
    } catch {
      return undefined
    }
  }

  async function experienceIds(titles: string[]): Promise<string[]> {
    const docs = await ExperienceModel.find({
      title: { $in: titles },
    }).lean()
    return docs.map((d) => d._id.toString())
  }

  async function roomIds(slugs: string[]): Promise<string[]> {
    const docs = await RoomModel.find({
      slug: { $in: slugs },
    }).lean()
    return docs.map((d) => d._id.toString())
  }

  const posts = [
    {
      title: 'Sauraha vs Patihani: Where to Stay in Chitwan',
      slug: 'sauraha-vs-patihani-where-to-stay-in-chitwan',
      excerpt:
        'Most visitors default to busy Sauraha — but the quiet Patihani side of Chitwan National Park offers the same safaris without the crowds. An honest comparison.',
      publishedDate: '2026-08-03T00:00:00.000Z',
      category: 'travel-guide' as const,
      imageKey: 'village',
      imageAlt: 'Quiet lane through a Tharu village near Patihani in morning mist',
      relatedRoomSlugs: ['deluxe-room', 'villa-with-private-plunge-pool'],
      relatedExperienceTitles: ['Village Tour', 'Sundowner on the Riverbank'],
      body: richText(
        paragraph(
          'Search for Chitwan hotels and nearly every result lands in Sauraha — the park’s busy eastern gateway, with its strip of guesthouses, souvenir shops and tour desks. It works, but it is not the only way to do Chitwan, and for many travellers it is not the best one.',
        ),
        heading('The Case for Sauraha'),
        paragraph(
          'Sauraha earns its popularity: the widest choice of budget rooms, walk-in tour operators on every corner, and an evening scene of riverside bars. If you are backpacking on a tight budget and want to organise everything on arrival, it delivers.',
        ),
        heading('The Case for Patihani'),
        paragraph(
          'Patihani, on the park’s quieter northwestern side, is a Tharu farming village where the Rapti still feels like a working river. Lodges here sit directly on the bank — no road, no strip, no crowd between you and the water. You hear peafowl at dawn instead of tour buses. The same jeep safaris, canoe trips and jungle walks run from this side, with your lodge arranging permits and guides.',
        ),
        heading('The Honest Trade-offs'),
        listItems([
          'Nightlife: Sauraha has bars and restaurants; Patihani evenings are bonfires and river sunsets',
          'Crowds: Sauraha’s river frontage gets busy at sunset; Patihani’s is often yours alone',
          'Wildlife at the door: rhinos regularly cross near Patihani’s quieter banks',
          'Logistics: both are ~25–35 minutes from Bharatpur Airport; both arrange full safari programmes',
        ]),
        paragraph(
          'Our take is unsurprising — River Bank Jungle Resort sits on the Patihani riverbank precisely because this is the Chitwan we wanted to share: the park at full volume, the tourism turned down.',
        ),
      ),
    },
    {
      title: 'One-Horned Rhinos of Chitwan: Where and When to See Them',
      slug: 'one-horned-rhinos-of-chitwan',
      excerpt:
        'Chitwan holds nearly 700 greater one-horned rhinoceros — the world’s second-largest population. Where they graze, when to look, and how to watch them safely.',
      publishedDate: '2026-06-30T00:00:00.000Z',
      category: 'wildlife' as const,
      imageKey: 'rhino',
      imageAlt: 'Greater one-horned rhinoceros grazing in Chitwan grassland',
      relatedRoomSlugs: [],
      relatedExperienceTitles: ['Jeep Safari', 'Jungle Walk', 'Canoe Safari'],
      body: richText(
        paragraph(
          'The greater one-horned rhinoceros is Chitwan’s signature animal and one of Asia’s great conservation comebacks: from around 100 animals in the 1960s to nearly 700 in the park today, the world’s second-largest population after Kaziranga.',
        ),
        heading('Where They Spend Their Days'),
        paragraph(
          'Rhinos are river-dependent. In the hot middle of the day they wallow in oxbow lakes and muddy wallows deep in the sal forest; early morning and late afternoon bring them out to graze elephant grass along the Rapti and Narayani floodplains. Riverbank lodges frequently see them wade across the shallows at dusk.',
        ),
        heading('Best Seasons for Sightings'),
        listItems([
          'January to March: the elephant grass is cut and burned by local communities; visibility across the floodplains peaks and sightings are daily',
          'April to June: hot and dry; rhinos concentrate tightly around the remaining waterholes and river pools',
          'October to December: lush green post-monsoon park; sightings are common on river banks and jeep tracks',
          'July to September: monsoon; high water spreads wildlife out, but canoe trips can be remarkably rewarding',
        ]),
        heading('Safari Safety with Rhinos'),
        paragraph(
          'On a jungle walk, your two licensed naturalists carry stout bamboo staves, read wind direction constantly, and know climbable trees on every path. Rhinos have poor eyesight but acute hearing and smell: stay downwind, stay quiet, and keep the distance your guides specify.',
        ),
      ),
    },
    {
      title: 'Chitwan Birdwatching Calendar: 540+ Species Season by Season',
      slug: 'chitwan-birdwatching-calendar',
      excerpt:
        'From Siberian winter migrants to resident hornbills, Chitwan is one of Asia’s premier birding habitats. What arrives when, and where to look.',
      publishedDate: '2026-05-18T00:00:00.000Z',
      category: 'wildlife' as const,
      imageKey: 'canoe',
      imageAlt: 'Wooden dugout canoe on mist-covered Rapti River at dawn',
      relatedRoomSlugs: [],
      relatedExperienceTitles: ['Bird Watching Walk', 'Canoe Safari'],
      body: richText(
        paragraph(
          'Chitwan National Park records more than 540 species of birds — over two-thirds of Nepal’s total bird list. The mix of riverine forest, tall alluvial grassland, sal woodland, and oxbow lakes packs extraordinary diversity into a compact area.',
        ),
        heading('Winter: November to February (Peak Season)'),
        paragraph(
          'The absolute peak for birders. Thousands of waterfowl and waders descend from Tibet and Siberia onto the Rapti, Narayani and Bishazari Tal lakes. Look for ruddy shelducks (hundreds lining gravel bars), bar-headed geese, ferruginous ducks, northern pintails, and the endangered Bengal florican in the short grassland.',
        ),
        heading('Spring: March to May'),
        paragraph(
          'Forest birds become vocal as breeding season begins. Excellent for woodpeckers (17 species recorded, including the magnificent great slaty), cuckoos, barbets, minivets, and flycatchers. Great hornbills and Oriental pied hornbills nest in tall silk-cotton (simbal) trees.',
        ),
        heading('Summer & Monsoon: June to September'),
        paragraph(
          'Breeding visitors arrive from the south: Indian pitta, Asian paradise flycatcher, and multiple cuckoo species. The grasslands are at their densest, but canoe safaris offer relaxed waterbirding along the river banks.',
        ),
        heading('Autumn: October to November'),
        paragraph(
          'Passage migrants stop over on their way south across the Himalayas. Good raptor watching over the hills: change of season brings crested serpent eagles, grey-headed fish eagles, and several vultures including the critically endangered white-rumped and slender-billed.',
        ),
      ),
    },
    {
      title: 'Living by the Forest: The Tharu People and the Jungle',
      slug: 'tharu-culture-and-the-jungle',
      excerpt:
        'The Tharu lived alongside rhinos and tigers centuries before Chitwan became a national park. A look at their architecture, cuisine, art, and deep forest knowledge.',
      publishedDate: '2026-04-05T00:00:00.000Z',
      category: 'culture' as const,
      imageKey: 'bonfire',
      imageAlt: 'Evening bonfire gathering on the resort riverbank with lanterns',
      relatedRoomSlugs: [],
      relatedExperienceTitles: ['Tharu Cultural Dance', 'Village Tour'],
      body: richText(
        paragraph(
          'Before modern medicine, before malaria was brought under control in the mid-1950s, the lowland Terai was nearly uninhabitable to outsiders. The indigenous Tharu people lived here for centuries, having developed a genetic resistance to malaria and an encyclopaedic knowledge of the subtropical forest.',
        ),
        heading('Architecture Built for the Climate'),
        paragraph(
          'Traditional Tharu homes are masterpieces of low-impact, local-material design. Walls are woven from river elephant grass and plastered with a mixture of clay, cow dung, and rice husks that keeps interiors cool in the 40°C Terai summer and warm during winter fog. Intricate mud-relief murals of birds, flowers, and forest deities decorate entryways.',
        ),
        heading('A Cuisine of the Floodplains'),
        paragraph(
          'Tharu food is distinct from hill Nepali cuisine: ghighi (freshwater river snails cooked with flaxseed and spices), chichari (sticky Anadi rice steamed in bamboo), patot (taro leaves rolled with spiced lentil paste and steamed), and fresh fish from the Rapti. It is seasonal, light, and rooted in what the river and wetlands produce.',
        ),
        heading('Music, Dance, and Jungle Stories'),
        paragraph(
          'Evening dances — the stick dance (danda nach), peacock dance, and fire dance — are not tourist inventions; they are communal rituals that celebrate the rice harvest, ward off predatory animals, and retell ancestral stories. Experiencing a performance by the riverbank under Chitwan’s stars remains one of the resort’s most moving evenings.',
        ),
      ),
    },
    {
      title: 'How to Get to Chitwan: Flight vs Drive from Kathmandu and Pokhara',
      slug: 'how-to-get-to-chitwan',
      excerpt:
        'Should you take the 25-minute flight to Bharatpur or the scenic 5-hour drive through the Trishuli river valley? Full route details, travel times, and tips.',
      publishedDate: '2026-03-12T00:00:00.000Z',
      category: 'travel-guide' as const,
      imageKey: 'sunset',
      imageAlt: 'Warm golden sunset over the Rapti River and Chitwan tree line',
      relatedRoomSlugs: ['deluxe-room', 'super-deluxe-room', 'villa-with-private-plunge-pool'],
      relatedExperienceTitles: ['Sundowner on the Riverbank'],
      body: richText(
        paragraph(
          'Chitwan sits in Nepal’s lowland Terai, roughly 165 km southwest of Kathmandu — close on the map, further in practice, thanks to hill roads. Here is how the options actually compare.',
        ),
        heading('By Air: 25 Minutes'),
        paragraph(
          'Buddha Air and Yeti Airlines fly Kathmandu–Bharatpur several times daily; the hop takes about 25 minutes and often serves Himalayan views on the right side. From Bharatpur Airport it is roughly 25 km — a 30-minute drive — to the Patihani side of the park. Lodges arrange pickup; share your flight number when you book.',
        ),
        heading('By Road: 5–6 Hours'),
        paragraph(
          'The drive from Kathmandu or Pokhara takes five to six hours in normal conditions, following river valleys most of the way. A private car lets you stop at the Trishuli rafting beaches and viewpoint teahouses; tourist buses run daily from both cities to Sauraha and Bharatpur and are the budget standby.',
        ),
        heading('Which to Choose'),
        listItems([
          'Short on time or prone to car-sickness: fly — it turns a travel day into a safari afternoon',
          'Want scenery and flexibility: private car, with a lunch stop on the Trishuli',
          'Tight budget: tourist bus, booked a day ahead in season',
          'Combining Kathmandu + Pokhara + Chitwan: the classic triangle works in either direction by road',
        ]),
        paragraph(
          'However you arrive, aim to reach the resort by mid-afternoon — in time for tea on the riverbank and the first sundowner as the buffalo cross the shallows.',
        ),
      ),
    },
  ]

  for (const post of posts) {
    const exists = await BlogPostModel.findOne({ slug: post.slug }).lean()
    if (exists) {
      console.log(`  blog exists, skipping: ${post.slug}`)
      continue
    }

    const [coverImage, relatedRooms, relatedExperiences] = await Promise.all([
      mediaByKey(post.imageKey, post.imageAlt),
      roomIds(post.relatedRoomSlugs),
      experienceIds(post.relatedExperienceTitles),
    ])

    await BlogPostModel.create({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      publishedDate: post.publishedDate,
      category: post.category,
      author: 'River Bank Jungle Resort',
      coverImage: coverImage || undefined,
      body: post.body,
      relatedRooms,
      relatedExperiences,
    })
    console.log(`  blog added: ${post.slug}`)
  }
}
