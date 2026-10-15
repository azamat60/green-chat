import { useMessenger } from '../../hooks/useMessenger'
import type { Credentials } from '../../types'
import { ChatPanel } from '../ChatPanel'
import { Sidebar } from '../Sidebar'
import styles from './Messenger.module.css'

interface Props {
  credentials: Credentials
  onLogout: () => void
}

export function Messenger({ credentials, onLogout }: Props) {
  const { chats, activeChat, activeChatId, connectionError, selectChat, createChat, send } =
    useMessenger(credentials)

  return (
    <div className={styles.layout} data-chat-open={activeChat ? '' : undefined}>
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        connectionError={connectionError}
        onSelect={selectChat}
        onCreate={createChat}
        onLogout={onLogout}
      />

      {activeChat ? (
        <ChatPanel
          chat={activeChat}
          onSend={(text) => send(activeChat.id, text)}
          onBack={() => selectChat(null)}
        />
      ) : (
        <div className={styles.placeholder}>
          <span>Выберите чат или создайте новый</span>
        </div>
      )}
    </div>
  )
}
