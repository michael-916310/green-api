import { useEffect, useRef } from 'react'
import { useChatStore } from '@/entities/chat'
import {
  deleteNotification,
  extractTextFromMessageData,
  receiveNotification,
  type Credentials,
} from '@/shared/api'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useNotificationPoll(credentials: Credentials | null) {
  const upsertChat = useChatStore((s) => s.upsertChat)
  const addMessage = useChatStore((s) => s.addMessage)
  const credentialsRef = useRef(credentials)
  credentialsRef.current = credentials

  useEffect(() => {
    if (!credentials) return

    let cancelled = false
    let abortController: AbortController | null = null

    const processLoop = async () => {
      while (!cancelled) {
        const creds = credentialsRef.current
        if (!creds) break

        abortController = new AbortController()

        try {
          const notification = await receiveNotification(
            creds,
            20,
            abortController.signal,
          )

          if (cancelled) break
          if (!notification) continue

          const { receiptId, body } = notification

          if (body.typeWebhook === 'incomingMessageReceived') {
            const text = extractTextFromMessageData(body.messageData)
            const chatId = body.senderData?.chatId

            if (text && chatId && body.idMessage) {
              const title =
                body.senderData?.chatName ||
                body.senderData?.senderName ||
                body.senderData?.senderContactName ||
                chatId

              upsertChat({
                chatId,
                title,
                phone: body.senderData?.senderPhoneNumber
                  ? String(body.senderData.senderPhoneNumber)
                  : undefined,
              })

              addMessage({
                id: body.idMessage,
                chatId,
                text,
                timestamp: body.timestamp ?? Math.floor(Date.now() / 1000),
                direction: 'incoming',
                senderName: title,
              })
            }
          }

          await deleteNotification(creds, receiptId, abortController.signal)
        } catch (error) {
          if (cancelled) break
          if (error instanceof DOMException && error.name === 'AbortError') {
            break
          }
          await sleep(2000)
        }
      }
    }

    void processLoop()

    return () => {
      cancelled = true
      abortController?.abort()
    }
  }, [credentials, upsertChat, addMessage])
}
