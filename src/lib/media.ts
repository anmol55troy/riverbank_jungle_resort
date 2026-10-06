import type { Media } from '@/lib/types'

type MediaLike = Media | number | string | null | undefined

export type ResolvedImage = {
  url: string
  alt: string
  width: number
  height: number
}

/**
 * Resolve a media relation to a usable image, preferring an
 * optimized size when available. Returns null when the media is not populated.
 */
export function resolveMedia(
  media: MediaLike,
  _size?: 'thumbnail' | 'card' | 'hero' | 'og' | 'original',
): ResolvedImage | null {
  if (!media || typeof media === 'number' || typeof media === 'string') return null


  if (media.url && media.width && media.height) {
    return { url: media.url, alt: media.alt ?? '', width: media.width, height: media.height }
  }

  return null
}
