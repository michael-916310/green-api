import { Button } from '@mantine/core'
import type { Chat } from '@/entities/chat'
import styles from './chat-sidebar.module.css'

interface ChatSidebarProps {
  chats: Chat[]
  activeChatId: string | null
  onSelect: (chatId: string) => void
  onNewChat: () => void
  onLogout: () => void
}

export function ChatSidebar({
  chats,
  activeChatId,
  onSelect,
  onNewChat,
  onLogout,
}: ChatSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Чаты</h2>
        <Button size="xs" variant="subtle" color="gray" onClick={onLogout}>
          Выйти
        </Button>
      </div>

      <div style={{ padding: '10px 12px' }}>
        <Button fullWidth onClick={onNewChat} color="blue">
          Новый чат
        </Button>
      </div>

      <div className={styles.list}>
        {chats.length === 0 ? (
          <p className={styles.empty}>
            Пока нет чатов. Создайте новый по номеру телефона получателя.
          </p>
        ) : (
          chats.map((chat) => {
            const active = chat.chatId === activeChatId
            return (
              <button
                key={chat.chatId}
                type="button"
                className={`${styles.item} ${active ? styles.itemActive : ''}`}
                onClick={() => onSelect(chat.chatId)}
              >
                <span className={styles.itemTitle}>{chat.title}</span>
                {chat.phone ? (
                  <span className={styles.itemMeta}>+{chat.phone}</span>
                ) : (
                  <span className={styles.itemMeta}>{chat.chatId}</span>
                )}
              </button>
            )
          })
        )}
      </div>
    </aside>
  )
}
