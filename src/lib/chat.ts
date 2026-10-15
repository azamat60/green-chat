import type { Chat } from '../types'

const PHONE_MIN_LENGTH = 10
const PHONE_MAX_LENGTH = 15

export const normalizePhone = (value: string) => value.replace(/\D/g, '')

export const isValidPhone = (digits: string) =>
  digits.length >= PHONE_MIN_LENGTH && digits.length <= PHONE_MAX_LENGTH

export function chatTitle(chat: Pick<Chat, 'id' | 'title' | 'phone' | 'username'>) {
  if (chat.title) return chat.title
  if (chat.username) return chat.username.startsWith('@') ? chat.username : `@${chat.username}`
  if (chat.phone) return `+${chat.phone}`
  return chat.id
}

export function chatSubtitle(chat: Pick<Chat, 'phone' | 'username'>) {
  return [chat.phone && `+${chat.phone}`, chat.username].filter(Boolean).join(' · ')
}
