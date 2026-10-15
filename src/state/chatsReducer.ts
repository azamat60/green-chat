import type { Chat, Message, MessageStatus } from '../types'

type ChatInfo = Pick<Chat, 'id' | 'title' | 'phone' | 'username'>

export type ChatsAction =
  | { type: 'openChat'; chat: ChatInfo }
  | { type: 'addMessage'; chatId: string; message: Message; title?: string; unread?: boolean }
  | { type: 'confirmMessage'; chatId: string; localId: string; id: string }
  | { type: 'failMessage'; chatId: string; localId: string }
  | { type: 'setStatus'; id: string; status: MessageStatus }
  | { type: 'markRead'; chatId: string }

const statusRank: Record<MessageStatus, number> = {
  failed: 0,
  pending: 1,
  sent: 2,
  delivered: 3,
  read: 4,
}

function updateChat(chats: Chat[], chatId: string, update: (chat: Chat) => Chat) {
  return chats.map((chat) => (chat.id === chatId ? update(chat) : chat))
}

function updateMessage(chats: Chat[], chatId: string, messageId: string, patch: Partial<Message>) {
  return updateChat(chats, chatId, (chat) => ({
    ...chat,
    messages: chat.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
  }))
}

export function chatsReducer(chats: Chat[], action: ChatsAction): Chat[] {
  switch (action.type) {
    case 'openChat': {
      if (chats.some((c) => c.id === action.chat.id)) return chats
      return [{ ...action.chat, messages: [], unread: 0 }, ...chats]
    }

    case 'addMessage': {
      const existing = chats.find((c) => c.id === action.chatId)
      if (existing?.messages.some((m) => m.id === action.message.id)) return chats

      const chat = existing ?? { id: action.chatId, messages: [], unread: 0 }
      const next: Chat = {
        ...chat,
        title: chat.title ?? action.title,
        messages: [...chat.messages, action.message],
        unread: action.unread ? chat.unread + 1 : chat.unread,
      }
      return [next, ...chats.filter((c) => c.id !== action.chatId)]
    }

    case 'confirmMessage':
      return updateMessage(chats, action.chatId, action.localId, { id: action.id, status: 'sent' })

    case 'failMessage':
      return updateMessage(chats, action.chatId, action.localId, { status: 'failed' })

    case 'setStatus':
      return chats.map((chat) => {
        const target = chat.messages.find((m) => m.id === action.id)
        if (!target?.status || statusRank[action.status] <= statusRank[target.status]) return chat
        return {
          ...chat,
          messages: chat.messages.map((m) => (m === target ? { ...m, status: action.status } : m)),
        }
      })

    case 'markRead':
      return updateChat(chats, action.chatId, (chat) => (chat.unread ? { ...chat, unread: 0 } : chat))
  }
}
