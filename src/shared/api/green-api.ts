import type {
  CheckAccountResponse,
  Credentials,
  ExtendedTextMessageData,
  MessageData,
  ReceiveNotificationResponse,
  SendMessageResponse,
  TextMessageData,
} from './types'

const API_PREFIX = '/green-api'

function instancePath(
  credentials: Credentials,
  method: string,
  suffix = '',
): string {
  const { idInstance, apiTokenInstance } = credentials
  return `${API_PREFIX}/waInstance${idInstance}/${method}/${apiTokenInstance}${suffix}`
}

async function parseError(response: Response): Promise<string> {
  const text = await response.text()
  try {
    const json = JSON.parse(text) as { message?: string; error?: string }
    return json.message || json.error || text || response.statusText
  } catch {
    return text || response.statusText
  }
}

export class GreenApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'GreenApiError'
    this.status = status
  }
}

export async function sendMessage(
  credentials: Credentials,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> {
  const response = await fetch(instancePath(credentials, 'sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  })

  if (!response.ok) {
    throw new GreenApiError(await parseError(response), response.status)
  }

  return response.json() as Promise<SendMessageResponse>
}

export async function checkAccount(
  credentials: Credentials,
  phoneNumber: number,
): Promise<CheckAccountResponse> {
  const response = await fetch(instancePath(credentials, 'checkAccount'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber }),
  })

  if (!response.ok) {
    throw new GreenApiError(await parseError(response), response.status)
  }

  return response.json() as Promise<CheckAccountResponse>
}

export async function receiveNotification(
  credentials: Credentials,
  receiveTimeout = 20,
  signal?: AbortSignal,
): Promise<ReceiveNotificationResponse | null> {
  const url = `${instancePath(credentials, 'receiveNotification')}?receiveTimeout=${receiveTimeout}`
  const response = await fetch(url, { method: 'GET', signal })

  if (!response.ok) {
    throw new GreenApiError(await parseError(response), response.status)
  }

  const text = await response.text()
  if (!text || text === 'null') {
    return null
  }

  return JSON.parse(text) as ReceiveNotificationResponse
}

export async function deleteNotification(
  credentials: Credentials,
  receiptId: number,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(
    instancePath(credentials, 'deleteNotification', `/${receiptId}`),
    { method: 'DELETE', signal },
  )

  if (!response.ok) {
    throw new GreenApiError(await parseError(response), response.status)
  }
}

export function extractTextFromMessageData(
  messageData: MessageData | undefined,
): string | null {
  if (!messageData) return null

  if (messageData.typeMessage === 'textMessage') {
    return (
      (messageData as TextMessageData).textMessageData?.textMessage ?? null
    )
  }

  if (messageData.typeMessage === 'extendedTextMessage') {
    return (
      (messageData as ExtendedTextMessageData).extendedTextMessageData?.text ??
      null
    )
  }

  return null
}
