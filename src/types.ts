export interface Credentials {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed'

export interface Message {
  id: string
  text: string
  timestamp: number
  outgoing: boolean
  status?: MessageStatus
}

export interface Chat {
  id: string
  title?: string
  phone?: string
  username?: string
  messages: Message[]
  unread: number
}
