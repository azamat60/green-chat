import { Fragment, useEffect, useRef } from 'react'
import { formatDay, formatTime, isSameDay } from '../../lib/date'
import type { Message } from '../../types'
import styles from './MessageList.module.css'
import { StatusIcon } from './StatusIcon'

export function MessageList({ messages }: { messages: Message[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (container) container.scrollTop = container.scrollHeight
  }, [messages.length])

  if (messages.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>Напишите первое сообщение</div>
      </div>
    )
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.messages}>
        {messages.map((message, index) => {
          const prev = messages[index - 1]
          const showDay = !prev || !isSameDay(prev.timestamp, message.timestamp)

          return (
            <Fragment key={message.id}>
              {showDay && <div className={styles.day}>{formatDay(message.timestamp)}</div>}
              <div className={`${styles.bubble} ${message.outgoing ? styles.out : styles.in}`}>
                <span className={styles.text}>{message.text}</span>
                <span className={styles.meta}>
                  {formatTime(message.timestamp)}
                  {message.outgoing && <StatusIcon status={message.status} />}
                </span>
              </div>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
