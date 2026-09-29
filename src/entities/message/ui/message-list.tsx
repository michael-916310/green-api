import { useEffect, useRef } from 'react'
import type { ChatMessage } from '@/shared/api'
import { MessageBubble } from './message-bubble'
import styles from './message-list.module.css'

interface MessageListProps {
  messages: ChatMessage[]
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className={styles.list}>
      {messages.length === 0 ? (
        <p className={styles.empty}>Нет сообщений. Напишите первое!</p>
      ) : (
        messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))
      )}
      <div ref={bottomRef} />
    </div>
  )
}
