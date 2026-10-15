import { chatSubtitle, chatTitle } from '../../lib/chat'
import type { Chat } from '../../types'
import { Avatar } from '../Avatar'
import { Composer } from '../Composer'
import { BackIcon } from '../icons'
import { MessageList } from '../MessageList'
import styles from './ChatPanel.module.css'

interface Props {
  chat: Chat
  onSend: (text: string) => void
  onBack: () => void
}

export function ChatPanel({ chat, onSend, onBack }: Props) {
  const title = chatTitle(chat)
  const subtitle = chatSubtitle(chat)

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={onBack} aria-label="Назад">
          <BackIcon width={22} height={22} />
        </button>
        <Avatar seed={chat.id} name={title} size={40} />
        <div className={styles.info}>
          <span className={styles.title}>{title}</span>
          {subtitle && subtitle !== title && <span className={styles.subtitle}>{subtitle}</span>}
        </div>
      </header>

      <MessageList key={chat.id} messages={chat.messages} />
      <Composer key={chat.id} onSend={onSend} />
    </section>
  )
}
