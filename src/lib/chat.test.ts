import { describe, expect, it } from 'vitest'
import { chatTitle, isValidPhone, normalizePhone } from './chat'

describe('normalizePhone', () => {
  it('keeps only digits', () => {
    expect(normalizePhone('+7 (900) 123-45-67')).toBe('79001234567')
  })
})

describe('chatTitle', () => {
  it('prefers the chat title', () => {
    expect(chatTitle({ id: '1', title: 'Ivan', username: 'ivan', phone: '7900' })).toBe('Ivan')
  })

  it('falls back to username with @', () => {
    expect(chatTitle({ id: '1', username: 'ivan' })).toBe('@ivan')
    expect(chatTitle({ id: '1', username: '@ivan' })).toBe('@ivan')
  })

  it('falls back to phone, then id', () => {
    expect(chatTitle({ id: '1', phone: '79001234567' })).toBe('+79001234567')
    expect(chatTitle({ id: '1' })).toBe('1')
  })
})

describe('isValidPhone', () => {
  it('accepts international numbers of 10 to 15 digits', () => {
    expect(isValidPhone('79001234567')).toBe(true)
    expect(isValidPhone('790012')).toBe(false)
    expect(isValidPhone('7900123456789012')).toBe(false)
  })
})
