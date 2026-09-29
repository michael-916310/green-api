import { useState } from 'react'
import { Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { useAuthStore } from '@/features/auth'
import styles from './login-page.module.css'

export function LoginPage() {
  const setCredentials = useAuthStore((s) => s.setCredentials)
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const id = idInstance.trim()
    const token = apiTokenInstance.trim()

    if (!id || !token) {
      setError('Заполните idInstance и apiTokenInstance')
      return
    }

    if (!/^\d+$/.test(id)) {
      setError('idInstance должен содержать только цифры')
      return
    }

    setError('')
    setCredentials({ idInstance: id, apiTokenInstance: token })
  }

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.brand}>MAX Chat</h1>
        <p className={styles.subtitle}>
          Введите учётные данные инстанса GREEN-API для работы с мессенджером
          MAX
        </p>

        <Stack gap="md">
          <TextInput
            label="idInstance"
            placeholder="3100000000"
            value={idInstance}
            onChange={(e) => setIdInstance(e.currentTarget.value)}
            required
            autoComplete="off"
          />
          <PasswordInput
            label="apiTokenInstance"
            placeholder="токен из личного кабинета"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.currentTarget.value)}
            required
            autoComplete="off"
          />
          <Button type="submit" fullWidth color="blue" size="md">
            Войти
          </Button>
        </Stack>

        {error ? <p className={styles.error}>{error}</p> : null}
      </form>
    </div>
  )
}
