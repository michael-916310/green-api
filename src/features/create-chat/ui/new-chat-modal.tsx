import { useState } from 'react'
import { Button, Modal, Stack, TextInput, Text } from '@mantine/core'
import { useChatStore } from '@/entities/chat'
import { GreenApiError, checkAccount, type Credentials } from '@/shared/api'

interface NewChatModalProps {
  opened: boolean
  onClose: () => void
  credentials: Credentials
}

function normalizePhone(input: string): number | null {
  const digits = input.replace(/\D/g, '')
  if (digits.length < 11 || digits.length > 12) return null
  return Number(digits)
}

export function NewChatModal({
  opened,
  onClose,
  credentials,
}: NewChatModalProps) {
  const upsertChat = useChatStore((s) => s.upsertChat)
  const setActiveChatId = useChatStore((s) => s.setActiveChatId)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleClose = () => {
    setPhone('')
    setError('')
    onClose()
  }

  const handleCreate = async () => {
    const phoneNumber = normalizePhone(phone)
    if (!phoneNumber) {
      setError(
        'Введите номер в международном формате (11 или 12 цифр), например 79991234567',
      )
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await checkAccount(credentials, phoneNumber)

      if (result.status === false) {
        setError(result.reason || 'Не удалось проверить номер')
        return
      }

      if (!result.exist || !result.chatId) {
        setError('Аккаунт MAX на этом номере не найден')
        return
      }

      upsertChat({
        chatId: result.chatId,
        title: String(phoneNumber),
        phone: String(phoneNumber),
      })
      setActiveChatId(result.chatId)
      handleClose()
    } catch (err) {
      const message =
        err instanceof GreenApiError
          ? err.message
          : 'Ошибка при создании чата'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal opened={opened} onClose={handleClose} title="Новый чат" centered>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Введите номер телефона получателя в международном формате (РФ или РБ)
        </Text>
        <TextInput
          label="Номер телефона"
          placeholder="79991234567"
          value={phone}
          onChange={(e) => setPhone(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void handleCreate()
          }}
        />
        {error ? (
          <Text size="sm" c="red">
            {error}
          </Text>
        ) : null}
        <Button loading={loading} onClick={() => void handleCreate()}>
          Создать чат
        </Button>
      </Stack>
    </Modal>
  )
}
