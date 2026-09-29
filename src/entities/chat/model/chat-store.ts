import { create } from 'zustand'
import type { Chat, ChatMessage } from '@/shared/api'

interface ChatState {
  chats: Chat[]
  activeChatId: string | null
  messagesByChat: Record<string, ChatMessage[]>
  setActiveChatId: (chatId: string | null) => void
  upsertChat: (chat: Chat) => void
  addMessage: (message: ChatMessage) => void
  reset: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChatId: null,
  messagesByChat: {},

  setActiveChatId: (chatId) => set({ activeChatId: chatId }),

  upsertChat: (chat) =>
    set((state) => {
      const exists = state.chats.some((c) => c.chatId === chat.chatId)
      if (exists) {
        return {
          chats: state.chats.map((c) =>
            c.chatId === chat.chatId ? { ...c, ...chat } : c,
          ),
        }
      }
      return { chats: [chat, ...state.chats] }
    }),

  addMessage: (message) =>
    set((state) => {
      const list = state.messagesByChat[message.chatId] ?? []
      if (list.some((m) => m.id === message.id)) {
        return state
      }
      return {
        messagesByChat: {
          ...state.messagesByChat,
          [message.chatId]: [...list, message],
        },
      }
    }),

  reset: () =>
    set({
      chats: [],
      activeChatId: null,
      messagesByChat: {},
    }),
}))
