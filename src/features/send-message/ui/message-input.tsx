import { useState } from 'react'
import { Button } from '@mantine/core'
import { useChatStore } from '@/entities/chat'
import { GreenApiError, sendMessage, type Credentials } from '@/shared/api'
import styles from './message-input.module.css'

interface MessageInputProps {
  credentials: Credentials
  chatId: string
}

export function MessageInput({ credentials, chatId }: MessageInputProps) {
  const addMessage = useChatStore((s) => s.addMessage)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    const message = text.trim()
    if (!message || loading) return

    setLoading(true)
    setError('')

    try {
      const { idMessage } = await sendMessage(credentials, chatId, message)
      addMessage({
        id: idMessage,
        chatId,
        text: message,
        timestamp: Math.floor(Date.now() / 1000),
        direction: 'outgoing',
      })
      setText('')
    } catch (err) {
      const msg =
        err instanceof GreenApiError ? err.message : 'Не удалось отправить'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {error ? <div className={styles.error}>{error}</div> : null}
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          void handleSend()
        }}
      >
        <textarea
          className={styles.input}
          placeholder="Введите сообщение..."
          value={text}
          rows={1}
          onChange={(e) => setText(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void handleSend()
            }
          }}
        />
        <Button type="submit" loading={loading} disabled={!text.trim()}>
          Отправить
        </Button>
      </form>
    </>
  )
}
