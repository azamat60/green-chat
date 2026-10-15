import { useEffect, useEffectEvent, useState } from 'react'
import { RETRY_DELAY_MS } from '../api/constants'
import { deleteNotification, receiveNotification } from '../api/greenApi'
import type { WebhookBody } from '../api/types'
import type { Credentials } from '../types'

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        resolve()
      },
      { once: true },
    )
  })
}

export function useNotifications(credentials: Credentials, onNotification: (body: WebhookBody) => void) {
  const handleNotification = useEffectEvent(onNotification)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    async function poll() {
      while (!signal.aborted) {
        try {
          const notification = await receiveNotification(credentials, signal)
          setError(null)
          if (!notification) continue

          try {
            handleNotification(notification.body)
          } finally {
            await deleteNotification(credentials, notification.receiptId)
          }
        } catch (e) {
          if (signal.aborted) return
          setError(e instanceof Error ? e.message : 'Не удалось получить сообщения')
          await wait(RETRY_DELAY_MS, signal)
        }
      }
    }

    poll()
    return () => controller.abort()
  }, [credentials])

  return error
}
