# MAX Chat — GREEN-API

Веб-чат на React + TypeScript для отправки и получения текстовых сообщений в мессенджере **MAX** через [GREEN-API](https://green-api.com/max).

## Стек

- Vite + React 19 + TypeScript
- Feature-Sliced Design (FSD)
- Mantine (формы, модалки)
- Zustand (состояние)
- Vite proxy (обход CORS при запросах к GREEN-API)


## Локальный запуск

```bash
npm install
npm run dev
```

Откройте `http://127.0.0.1:5173/`.

Запросы идут на `/green-api/...` и проксируются Vite на `https://api.green-api.com`.

Если в кабинете указан другой `apiUrl` (например `https://3100.api.green-api.com`), создайте файл `.env`:

```env
VITE_GREEN_API_HOST=https://3100.api.green-api.com
```

и перезапустите `npm run dev`.

## Сценарий проверки

1. Откройте приложение и введите `idInstance` / `apiTokenInstance`.
2. Нажмите **Новый чат**, введите номер получателя (например `79991234567`).
3. Отправьте текстовое сообщение — оно должно прийти в MAX.
4. Ответьте из приложения MAX — ответ появится в веб-чате (long-poll).

## Сборка

```bash
npm run build
npm run preview
```

`preview` также использует proxy на GREEN-API.

Для публикации в интернет нужен reverse-proxy с тем же правилом: путь `/green-api` → хост GREEN-API (статика сама по себе CORS не обойдёт).

## Структура (Feature-Sliced Design)

```
src/
  app/                    — провайдеры, тема
  pages/                  — login-page, chat-page
  widgets/                — chat-sidebar
  features/               — auth, create-chat, send-message, receive-notifications
  entities/               — chat (store), message (UI)
  shared/api/             — green-api и types
```

Импорты через алиас `@/` (например `@/features/auth`). Имена файлов и каталогов — kebab-case.
