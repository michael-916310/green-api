import { MantineProvider } from '@mantine/core'
import { useAuthStore } from '@/features/auth'
import { ChatPage } from '@/pages/chat-page'
import { LoginPage } from '@/pages/login-page'
import '@mantine/core/styles.css'
import './styles/max-theme.css'

export function App() {
  const credentials = useAuthStore((s) => s.credentials)

  return (
    <MantineProvider
      theme={{
        primaryColor: 'blue',
        defaultRadius: 'md',
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      {credentials ? (
        <ChatPage credentials={credentials} />
      ) : (
        <LoginPage />
      )}
    </MantineProvider>
  )
}
