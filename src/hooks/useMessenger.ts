import { useEffect, useState } from 'react'
import { findTelegramAccount, sendMessage } from '../api/greenApi'
import { parseNotification } from '../api/parseNotification'
import type { WebhookBody } from '../api/types'
import { nowInSeconds } from '../lib/date'
import type { Credentials } from '../types'
import { useChats } from './useChats'
import { useNotifications } from './useNotifications'

export function useMessenger(credentials: Credentials) {
  const [chats, dispatch] = useChats(credentials.idInstance)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const activeChat = chats.find((c) => c.id === activeChatId) ?? null

  const connectionError = useNotifications(credentials, (body: WebhookBody) => {
    const event = parseNotification(body)
    if (!event) return

    if (event.type === 'status') {
      dispatch({ type: 'setStatus', id: event.idMessage, status: event.status })
      return
    }

    dispatch({
      type: 'addMessage',
      chatId: event.chatId,
      message: event.message,
      title: event.title,
      unread: !event.message.outgoing && event.chatId !== activeChatId,
    })
  })

  useEffect(() => {
    if (activeChat?.unread) dispatch({ type: 'markRead', chatId: activeChat.id })
  }, [activeChat, dispatch])

  async function createChat(phone: string) {
    const existing = chats.find((c) => c.phone === phone)
    if (existing) {
      setActiveChatId(existing.id)
      return
    }

    const { chatId, username } = await findTelegramAccount(credentials, phone)
    dispatch({ type: 'openChat', chat: { id: chatId, phone, username } })
    setActiveChatId(chatId)
  }

  async function send(chatId: string, text: string) {
    const localId = `local-${crypto.randomUUID()}`
    dispatch({
      type: 'addMessage',
      chatId,
      message: { id: localId, text, timestamp: nowInSeconds(), outgoing: true, status: 'pending' },
    })

    try {
      const { idMessage } = await sendMessage(credentials, chatId, text)
      dispatch({ type: 'confirmMessage', chatId, localId, id: idMessage })
    } catch {
      dispatch({ type: 'failMessage', chatId, localId })
    }
  }

  return {
    chats,
    activeChat,
    activeChatId,
    connectionError,
    selectChat: setActiveChatId,
    createChat,
    send,
  }
}
