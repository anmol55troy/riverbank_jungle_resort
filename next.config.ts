import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  serverExternalPackages: ['mongoose'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/media/**',
      },
      {
        pathname: '/placeholders/**',
      },
      {
        pathname: '/hero/**',
      },
      {
        pathname: '/awards/**',
      },
      {
        pathname: '/textures/**',
      },
      {
        pathname: '/sustainability/**',
      },
      {
        pathname: '/logo.png',
      },
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fastly.picsum.photos' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  outputFileTracingIncludes: {
    '/api/**/*': ['./public/media/**/*'],
  },
  async redirects() {
    return [
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/rooms-suites', destination: '/rooms', permanent: true },
      { source: '/deluxe-room', destination: '/rooms/deluxe-room', permanent: true },
      { source: '/super-deluxe-room', destination: '/rooms/super-deluxe-room', permanent: true },
      { source: '/villa', destination: '/rooms/villa-with-private-plunge-pool', permanent: true },
      { source: '/dining-bar', destination: '/dining', permanent: true },
      { source: '/activities', destination: '/experiences', permanent: true },
      { source: '/safari', destination: '/experiences', permanent: true },
      { source: '/gallery-page', destination: '/gallery', permanent: true },
      { source: '/faq', destination: '/contact', permanent: true },
      { source: '/faqs', destination: '/contact', permanent: true },
      {
        source: '/best-time-to-visit-chitwan-national-park',
        destination: '/blog/best-time-to-visit-chitwan-national-park',
        permanent: true,
      },
      {
        source: '/chitwan-jungle-safari-complete-guide',
        destination: '/blog/chitwan-jungle-safari-complete-guide',
        permanent: true,
      },
      {
        source: '/15-things-to-do-in-chitwan',
        destination: '/blog/15-things-to-do-in-chitwan',
        permanent: true,
      },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withNextIntl(nextConfig)

