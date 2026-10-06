import mongoose, { Schema } from 'mongoose'

// --- 1. Media Model ---
const mediaSchema = new Schema(
  {
    alt: { type: String, required: true },
    caption: String,
    url: String,
    thumbnailURL: String,
    filename: { type: String, unique: true, sparse: true }, // sparse so nulls don't collide
    mimeType: String,
    filesize: Number,
    width: Number,
    height: Number,
    focalX: Number,
    focalY: Number,
    provider: { type: String, default: 'cloudinary' },
    public_id: String,
  },
  { timestamps: true, collection: 'media' }
)

export const MediaModel = mongoose.models.Media || mongoose.model('Media', mediaSchema)

// --- 2. Amenity Model ---
const amenitySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true, collection: 'amenities' }
)

export const AmenityModel = mongoose.models.Amenity || mongoose.model('Amenity', amenitySchema)

// --- 3. Room Model ---
const roomSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    description: { type: Schema.Types.Mixed, required: true },
    features: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
        id: String,
      },
    ],
    amenities: [{ type: Schema.Types.ObjectId, ref: 'Amenity' }],
    gallery: [
      {
        image: { type: Schema.Types.ObjectId, ref: 'Media', required: true },
        id: String,
      },
    ],
    priceFrom: {
      amount: Number,
      currency: { type: String, enum: ['USD', 'NPR'], default: 'USD' },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'rooms' }
)

export const RoomModel = mongoose.models.Room || mongoose.model('Room', roomSchema)

// --- 4. Dining Venue Model ---
const diningVenueSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    description: { type: Schema.Types.Mixed, required: true },
    cuisine: String,
    hours: String,
    image: { type: Schema.Types.ObjectId, ref: 'Media' },
    gallery: [
      {
        image: { type: Schema.Types.ObjectId, ref: 'Media', required: true },
        id: String,
      },
    ],
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'dining-venues' }
)

export const DiningVenueModel =
  mongoose.models.DiningVenue || mongoose.model('DiningVenue', diningVenueSchema)

// --- 5. Experience Model ---
const experienceSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    description: Schema.Types.Mixed,
    duration: String,
    image: { type: Schema.Types.ObjectId, ref: 'Media' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'experiences' }
)

export const ExperienceModel =
  mongoose.models.Experience || mongoose.model('Experience', experienceSchema)

// --- 6. Offer Model ---
const offerSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
    validFrom: Date,
    validUntil: Date,
    description: { type: Schema.Types.Mixed, required: true },
    image: { type: Schema.Types.ObjectId, ref: 'Media' },
  },
  { timestamps: true, collection: 'offers' }
)

export const OfferModel = mongoose.models.Offer || mongoose.model('Offer', offerSchema)

// --- 7. Blog Post Model ---
const blogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    body: { type: Schema.Types.Mixed, required: true },
    coverImage: { type: Schema.Types.ObjectId, ref: 'Media' },
    author: { type: String, default: 'River Bank Jungle Resort' },
    publishedDate: { type: Date, required: true },
    category: {
      type: String,
      enum: ['travel-guide', 'wildlife', 'culture', 'resort-news'],
      default: 'travel-guide',
    },
    relatedRooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
    relatedExperiences: [{ type: Schema.Types.ObjectId, ref: 'Experience' }],
  },
  { timestamps: true, collection: 'blog-posts' }
)

export const BlogPostModel =
  mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema)

// --- 8. Testimonial Model ---
const testimonialSchema = new Schema(
  {
    quote: { type: String, required: true },
    guestName: { type: String, required: true },
    country: String,
    source: {
      type: String,
      enum: ['tripadvisor', 'booking', 'expedia', 'tripcom'],
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, default: 5, required: true },
    sourceUrl: String,
  },
  { timestamps: true, collection: 'testimonials' }
)

export const TestimonialModel =
  mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema)

// --- 9. FAQ Model ---
const faqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: Schema.Types.Mixed, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'faqs' }
)

export const FaqModel = mongoose.models.Faq || mongoose.model('Faq', faqSchema)

// --- 10. Gallery Image Model ---
const galleryImageSchema = new Schema(
  {
    image: { type: Schema.Types.ObjectId, ref: 'Media', required: true },
    caption: String,
    category: {
      type: String,
      enum: ['resort', 'rooms', 'dining', 'wildlife', 'experiences', 'culture'],
      default: 'resort',
      required: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'gallery-images' }
)

export const GalleryImageModel =
  mongoose.models.GalleryImage || mongoose.model('GalleryImage', galleryImageSchema)

// --- 11. Form Submission Model ---
const formSubmissionSchema = new Schema(
  {
    formType: { type: String, enum: ['contact', 'events'], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    subject: String,
    eventDate: String,
    guests: Number,
    message: { type: String, required: true },
  },
  { timestamps: true, collection: 'form-submissions' }
)

export const FormSubmissionModel =
  mongoose.models.FormSubmission || mongoose.model('FormSubmission', formSubmissionSchema)

// --- 12. Newsletter Signup Model ---
const newsletterSignupSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true, collection: 'newsletter-signups' }
)

export const NewsletterSignupModel =
  mongoose.models.NewsletterSignup || mongoose.model('NewsletterSignup', newsletterSignupSchema)

// --- 13. Site Settings (Globals) Model ---
const siteSettingSchema = new Schema(
  {
    globalType: { type: String, default: 'site-settings', required: true },
    siteName: { type: String, default: 'River Bank Jungle Resort' },
    tagline: {
      type: String,
      default: 'A riverside sanctuary on the edge of Chitwan National Park',
    },
    logo: { type: Schema.Types.ObjectId, ref: 'Media' },
    footerText: String,
    defaultSeoImage: { type: Schema.Types.ObjectId, ref: 'Media' },
    address: { type: String, default: 'Bharatpur-22, Patihani, Chitwan, Nepal' },
    salesOffice: { type: String, default: 'Sales Office: Maharajgunj, Kathmandu, Nepal' },
    phones: [
      {
        number: { type: String, required: true },
        id: String,
      },
    ],
    emails: [
      {
        email: { type: String, required: true },
        id: String,
      },
    ],
    whatsapp: { type: String, default: '+9779761734722' },
    mapUrl: { type: String, default: 'https://maps.app.goo.gl/zGQW2VfhALDefCGf8' },
    bookingUrl: {
      type: String,
      default: 'https://book-directonline.com/properties/riverbankjungleresortpvtltd',
    },
    virtualTourUrl: {
      type: String,
      default: 'https://virtualtour.airliftventures.com/riverbank-jungle-resort/',
    },
    facebook: {
      type: String,
      default: 'https://www.facebook.com/profile.php?id=61555768349361',
    },
    instagram: {
      type: String,
      default: 'https://www.instagram.com/river_bank_jungle_resort/',
    },
    linkedin: {
      type: String,
      default: 'https://www.linkedin.com/company/104239283',
    },
    tiktok: String,
    bookingCom: String,
    tripadvisor: String,
    makemytrip: String,
    aboutBanner: { type: Schema.Types.ObjectId, ref: 'Media' },
    aboutSecondaryImage: { type: Schema.Types.ObjectId, ref: 'Media' },
    diningBanner: { type: Schema.Types.ObjectId, ref: 'Media' },
    roomsBanner: { type: Schema.Types.ObjectId, ref: 'Media' },
    experiencesBanner: { type: Schema.Types.ObjectId, ref: 'Media' },
    offersBanner: { type: Schema.Types.ObjectId, ref: 'Media' },
    galleryBanner: { type: Schema.Types.ObjectId, ref: 'Media' },
    contactBanner: { type: Schema.Types.ObjectId, ref: 'Media' },
    eventsBanner: { type: Schema.Types.ObjectId, ref: 'Media' },
    sustainabilityBanner: { type: Schema.Types.ObjectId, ref: 'Media' },
  },
  { timestamps: true, collection: 'globals' }
)

export const SiteSettingModel =
  mongoose.models.SiteSetting || mongoose.model('SiteSetting', siteSettingSchema)

// --- 14. User Model ---
const userSchema = new Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: String, // Upgraded scrypt password hash
    hash: String, // Payload legacy PBKDF2 hash
    salt: String, // Payload legacy PBKDF2 salt
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    role: { type: String, default: 'admin' },
  },
  { timestamps: true, collection: 'users' }
)

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema)

// --- 15. Admin Session Model ---
const adminSessionSchema = new Schema(
  {
    tokenHash: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
    ip: String,
    userAgent: String,
  },
  { timestamps: true, collection: 'admin-sessions' }
)

export const AdminSessionModel =
  mongoose.models.AdminSession || mongoose.model('AdminSession', adminSessionSchema)
