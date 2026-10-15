import { chatTitle } from '../../lib/chat'
import { formatListDate } from '../../lib/date'
import type { Chat } from '../../types'
import { Avatar } from '../Avatar'
import styles from './ChatListItem.module.css'

interface Props {
  chat: Chat
  active: boolean
  onSelect: (chatId: string) => void
}

export function ChatListItem({ chat, active, onSelect }: Props) {
  const last = chat.messages.at(-1)
  const title = chatTitle(chat)

  return (
    <button
      type="button"
      className={`${styles.item} ${active ? styles.active : ''}`}
      onClick={() => onSelect(chat.id)}
    >
      <Avatar seed={chat.id} name={title} />
      <div className={styles.body}>
        <div className={styles.row}>
          <span className={styles.name}>{title}</span>
          {last && <span className={styles.date}>{formatListDate(last.timestamp)}</span>}
        </div>
        <div className={styles.row}>
          <span className={styles.preview}>
            {last ? `${last.outgoing ? 'Вы: ' : ''}${last.text}` : 'Нет сообщений'}
          </span>
          {chat.unread > 0 && <span className={styles.badge}>{chat.unread}</span>}
        </div>
      </div>
    </button>
  )
}
