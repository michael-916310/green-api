import { useState } from 'react'
import { useChatStore } from '@/entities/chat'
import { MessageList } from '@/entities/message'
import { useAuthStore } from '@/features/auth'
import { NewChatModal } from '@/features/create-chat'
import { useNotificationPoll } from '@/features/receive-notifications'
import { MessageInput } from '@/features/send-message'
import type { Credentials } from '@/shared/api'
import { ChatSidebar } from '@/widgets/chat-sidebar'
import styles from './chat-page.module.css'
import headerStyles from './chat-header.module.css'

interface ChatPageProps {
  credentials: Credentials
}

export function ChatPage({ credentials }: ChatPageProps) {
  useNotificationPoll(credentials)

  const logout = useAuthStore((s) => s.logout)
  const chats = useChatStore((s) => s.chats)
  const activeChatId = useChatStore((s) => s.activeChatId)
  const messagesByChat = useChatStore((s) => s.messagesByChat)
  const setActiveChatId = useChatStore((s) => s.setActiveChatId)
  const resetChats = useChatStore((s) => s.reset)

  const [newChatOpened, setNewChatOpened] = useState(false)

  const activeChat = chats.find((c) => c.chatId === activeChatId) ?? null
  const messages = activeChatId ? (messagesByChat[activeChatId] ?? []) : []

  const handleLogout = () => {
    resetChats()
    logout()
  }

  const layoutClass = [
    styles.layout,
    activeChatId ? styles.hideSidebar : styles.hideChat,
  ].join(' ')

  return (
    <div className={layoutClass}>
      <div className={styles.sidebar}>
        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelect={setActiveChatId}
          onNewChat={() => setNewChatOpened(true)}
          onLogout={handleLogout}
        />
      </div>

      <div className={styles.chatPane}>
        {activeChat ? (
          <>
            <header className={headerStyles.chatHeader}>
              <button
                type="button"
                className={headerStyles.backBtn}
                onClick={() => setActiveChatId(null)}
              >
                ← Назад
              </button>
              <div>
                <h2 className={headerStyles.chatTitle}>{activeChat.title}</h2>
                {activeChat.phone ? (
                  <p className={headerStyles.chatMeta}>+{activeChat.phone}</p>
                ) : null}
              </div>
            </header>
            <MessageList messages={messages} />
            <MessageInput
              credentials={credentials}
              chatId={activeChat.chatId}
            />
          </>
        ) : (
          <div className={styles.empty}>
            Выберите чат или создайте новый, чтобы начать переписку
          </div>
        )}
      </div>

      <NewChatModal
        opened={newChatOpened}
        onClose={() => setNewChatOpened(false)}
        credentials={credentials}
      />
    </div>
  )
}
