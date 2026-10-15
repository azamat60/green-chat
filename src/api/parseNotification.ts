import { nowInSeconds } from '../lib/date'
import type { Message, MessageStatus } from '../types'
import type { MessageData, WebhookBody } from './types'

export type ChatEvent =
  | { type: 'message'; chatId: string; title?: string; message: Message }
  | { type: 'status'; idMessage: string; status: MessageStatus }

function extractText(data?: MessageData) {
  if (!data) return null
  if (data.typeMessage === 'textMessage') return data.textMessageData?.textMessage ?? null
  if (data.typeMessage === 'extendedTextMessage') return data.extendedTextMessageData?.text ?? null
  return null
}

function toStatus(status?: string): MessageStatus | null {
  if (status === 'sent' || status === 'delivered' || status === 'read') return status
  if (status) return 'failed'
  return null
}

export function parseNotification(body: WebhookBody): ChatEvent | null {
  const { typeWebhook, idMessage, timestamp, senderData } = body

  if (typeWebhook === 'outgoingMessageStatus') {
    const status = toStatus(body.status)
    return idMessage && status ? { type: 'status', idMessage, status } : null
  }

  if (typeWebhook !== 'incomingMessageReceived' && typeWebhook !== 'outgoingMessageReceived') return null

  const text = extractText(body.messageData)
  if (!text || !idMessage || !senderData?.chatId) return null

  const outgoing = typeWebhook === 'outgoingMessageReceived'

  return {
    type: 'message',
    chatId: senderData.chatId,
    title: outgoing
      ? senderData.chatName
      : senderData.senderContactName || senderData.senderName || senderData.chatName,
    message: {
      id: idMessage,
      text,
      timestamp: timestamp ?? nowInSeconds(),
      outgoing,
      status: outgoing ? 'sent' : undefined,
    },
  }
}
