import type { Credentials } from '../types'
import { checkAccountErrors, httpErrors, instanceStateErrors, RECEIVE_TIMEOUT_SEC } from './constants'
import type { CheckAccountResponse, Notification } from './types'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: unknown
  suffix?: string
  signal?: AbortSignal
}

function buildUrl({ apiUrl, idInstance, apiTokenInstance }: Credentials, endpoint: string, suffix = '') {
  const base = apiUrl.trim().replace(/\/+$/, '')
  return `${base}/waInstance${idInstance.trim()}/${endpoint}/${apiTokenInstance.trim()}${suffix}`
}

async function readError(res: Response) {
  if (httpErrors[res.status]) return httpErrors[res.status]

  const text = await res.text().catch(() => '')
  try {
    const data = JSON.parse(text)
    return data.message ?? data.reason ?? text
  } catch {
    return text || `Ошибка сервера (${res.status})`
  }
}

async function request<T>(
  credentials: Credentials,
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, suffix, signal } = options

  let res: Response
  try {
    res = await fetch(buildUrl(credentials, endpoint, suffix), {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new ApiError('Не удалось подключиться к серверу. Проверьте apiUrl и соединение', 0)
  }

  if (!res.ok) throw new ApiError(await readError(res), res.status)

  const text = await res.text()
  return (text ? JSON.parse(text) : null) as T
}

export const getDefaultApiUrl = (idInstance: string) =>
  idInstance.length >= 4 ? `https://${idInstance.slice(0, 4)}.api.green-api.com` : ''

export function getStateInstance(credentials: Credentials) {
  return request<{ stateInstance: string }>(credentials, 'getStateInstance')
}

export async function checkAuthorization(credentials: Credentials) {
  const { stateInstance } = await getStateInstance(credentials)
  if (stateInstance !== 'authorized') {
    throw new Error(instanceStateErrors[stateInstance] ?? `Инстанс недоступен: ${stateInstance}`)
  }
}

export function checkAccount(credentials: Credentials, phoneNumber: number) {
  return request<CheckAccountResponse>(credentials, 'checkAccount', {
    method: 'POST',
    body: { phoneNumber },
  })
}

export async function findTelegramAccount(credentials: Credentials, phone: string) {
  const result = await checkAccount(credentials, Number(phone))
  if (result.status === false) {
    const reason = result.data?.reason ?? result.reason ?? ''
    throw new Error(checkAccountErrors[reason] ?? (reason || 'Не удалось проверить номер'))
  }
  if (!result.exist || !result.chatId) {
    throw new Error('Номер не найден в Telegram или скрыт настройками приватности')
  }
  return { chatId: result.chatId, username: result.username }
}

export function sendMessage(credentials: Credentials, chatId: string, message: string) {
  return request<{ idMessage: string }>(credentials, 'sendMessage', {
    method: 'POST',
    body: { chatId, message },
  })
}

export function receiveNotification(credentials: Credentials, signal?: AbortSignal) {
  return request<Notification | null>(credentials, 'receiveNotification', {
    suffix: `?receiveTimeout=${RECEIVE_TIMEOUT_SEC}`,
    signal,
  })
}

export function deleteNotification(credentials: Credentials, receiptId: number) {
  return request<{ result: boolean }>(credentials, 'deleteNotification', {
    method: 'DELETE',
    suffix: `/${receiptId}`,
  })
}
