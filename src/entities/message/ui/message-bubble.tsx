import type { ChatMessage } from '@/shared/api'
import styles from './message-bubble.module.css'

interface MessageBubbleProps {
  message: ChatMessage
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutgoing = message.direction === 'outgoing'

  return (
    <div
      className={`${styles.row} ${isOutgoing ? styles.rowOutgoing : styles.rowIncoming}`}
    >
      <div
        className={`${styles.bubble} ${isOutgoing ? styles.outgoing : styles.incoming}`}
      >
        {!isOutgoing && message.senderName ? (
          <div className={styles.sender}>{message.senderName}</div>
        ) : null}
        <div>{message.text}</div>
        <div className={styles.meta}>
          <span>{formatTime(message.timestamp)}</span>
        </div>
      </div>
    </div>
  )
}
