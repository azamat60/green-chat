import { describe, expect, it } from 'vitest'
import { isSameDay } from './date'

describe('isSameDay', () => {
  it('compares calendar days in local time', () => {
    const morning = new Date(2026, 0, 10, 9).getTime() / 1000
    const evening = new Date(2026, 0, 10, 21).getTime() / 1000
    const nextDay = new Date(2026, 0, 11, 9).getTime() / 1000

    expect(isSameDay(morning, evening)).toBe(true)
    expect(isSameDay(evening, nextDay)).toBe(false)
  })
})
