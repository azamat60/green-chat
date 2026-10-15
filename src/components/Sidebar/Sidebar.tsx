import { useState } from 'react'
import type { Chat } from '../../types'
import { LogoutIcon, PlusIcon } from '../icons'
import { NewChatForm } from '../NewChatForm'
import { ChatListItem } from './ChatListItem'
import styles from './Sidebar.module.css'

interface Props {
  chats: Chat[]
  activeChatId: string | null
  connectionError: string | null
  onSelect: (chatId: string) => void
  onCreate: (phone: string) => Promise<void>
  onLogout: () => void
}

export function Sidebar({ chats, activeChatId, connectionError, onSelect, onCreate, onLogout }: Props) {
  const [creating, setCreating] = useState(false)

  async function handleCreate(phone: string) {
    await onCreate(phone)
    setCreating(false)
  }

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <h2 className={styles.title}>Чаты</h2>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => setCreating((v) => !v)}
            aria-label="Новый чат"
            title="Новый чат"
          >
            <PlusIcon width={20} height={20} />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            onClick={onLogout}
            aria-label="Выйти"
            title="Выйти"
          >
            <LogoutIcon width={20} height={20} />
          </button>
        </div>
      </header>

      {connectionError && <div className={styles.connection}>Нет соединения: {connectionError}</div>}

      {creating && <NewChatForm onCreate={handleCreate} onClose={() => setCreating(false)} />}

      {chats.length > 0 ? (
        <ul className={styles.list}>
          {chats.map((chat) => (
            <li key={chat.id}>
              <ChatListItem chat={chat} active={chat.id === activeChatId} onSelect={onSelect} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <p>Пока нет чатов</p>
          {!creating && (
            <button type="button" className={styles.emptyButton} onClick={() => setCreating(true)}>
              Начать переписку
            </button>
          )}
        </div>
      )}
    </aside>
  )
}
