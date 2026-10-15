const timeFormat = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' })
const dayFormat = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' })
const shortDayFormat = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit' })

const MS_IN_DAY = 86_400_000

const toDate = (timestamp: number) => new Date(timestamp * 1000)

export const nowInSeconds = () => Math.floor(Date.now() / 1000)

function daysAgo(date: Date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const day = new Date(date)
  day.setHours(0, 0, 0, 0)
  return Math.round((today.getTime() - day.getTime()) / MS_IN_DAY)
}

export const formatTime = (timestamp: number) => timeFormat.format(toDate(timestamp))

export function formatDay(timestamp: number) {
  const date = toDate(timestamp)
  const diff = daysAgo(date)
  if (diff === 0) return 'Сегодня'
  if (diff === 1) return 'Вчера'
  return dayFormat.format(date)
}

export function formatListDate(timestamp: number) {
  const date = toDate(timestamp)
  return daysAgo(date) === 0 ? timeFormat.format(date) : shortDayFormat.format(date)
}

export const isSameDay = (a: number, b: number) => toDate(a).toDateString() === toDate(b).toDateString()
