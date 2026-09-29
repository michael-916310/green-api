import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Credentials } from '@/shared/api'

interface AuthState {
  credentials: Credentials | null
  setCredentials: (credentials: Credentials) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      credentials: null,
      setCredentials: (credentials) => set({ credentials }),
      logout: () => set({ credentials: null }),
    }),
    {
      name: 'green-api-auth',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
