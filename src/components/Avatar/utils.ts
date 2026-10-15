import { AVATAR_PALETTES } from './constants'

export function pickPalette(seed: string) {
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length]
}

export function getInitials(name: string) {
  const letters = name
    .replace(/^[+@]/, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
  return /^\d/.test(letters) ? '#' : letters.toUpperCase()
}
