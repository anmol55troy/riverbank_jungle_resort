/**
 * Placeholder imagery, served from Picsum Photos.
 *
 * The resort replaces all of these through the CMS: every consumer resolves a media
 * relation first and only falls back to these when the collection has
 * no image yet.
 */
const local = (key: string) => `https://picsum.photos/seed/${key}/1600/1067`

export const PLACEHOLDER = {
  // — Chitwan / Rapti (Wikimedia Commons) —
  hero: local('hero'),
  river: local('river'),
  jungle: local('jungle'),
  rhino: local('rhino'),
  elephant: local('elephant'),
  bird: local('bird'),
  canoe: local('canoe'),
  crocodile: local('crocodile'),
  culture: local('culture'),
  village: local('village'),
  sunset: local('sunset'),
  about: local('about'),
  sustainability: local('sustainability'),

  // — Interiors & resort life (Unsplash) —
  jeep: local('jeep'),
  room: local('room'),
  roomAlt: local('roomAlt'),
  villa: local('villa'),
  dining: local('dining'),
  diningAlt: local('diningAlt'),
  bar: local('bar'),
  alfresco: local('alfresco'),
  pool: local('pool'),
  resort: local('resort'),
  terrace: local('terrace'),
  events: local('events'),
  yoga: local('yoga'),
} as const

