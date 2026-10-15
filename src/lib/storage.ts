import type { Chat, Credentials } from '../types'

const CREDENTIALS_KEY = 'green-chat:credentials'
const chatsKey = (idInstance: string) => `green-chat:chats:${idInstance}`

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function remove(key: string) {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export const loadCredentials = () => read<Credentials>(CREDENTIALS_KEY)
export const saveCredentials = (credentials: Credentials) => write(CREDENTIALS_KEY, credentials)
export const clearCredentials = () => remove(CREDENTIALS_KEY)

export function loadChats(idInstance: string): Chat[] {
  const chats = read<Chat[]>(chatsKey(idInstance))
  if (!Array.isArray(chats)) return []
  return chats.map((chat) => ({
    ...chat,
    messages: chat.messages.map((m) => (m.status === 'pending' ? { ...m, status: 'failed' } : m)),
  }))
}

export const saveChats = (idInstance: string, chats: Chat[]) => write(chatsKey(idInstance), chats)
