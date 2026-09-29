export interface Credentials {
  idInstance: string
  apiTokenInstance: string
}

export interface SendMessageResponse {
  idMessage: string
}

export interface CheckAccountResponse {
  exist?: boolean
  chatId?: string
  fromCache?: boolean
  status?: boolean
  reason?: string
}

export interface TextMessageData {
  typeMessage: 'textMessage'
  textMessageData: {
    textMessage: string
  }
}

export interface ExtendedTextMessageData {
  typeMessage: 'extendedTextMessage'
  extendedTextMessageData: {
    text: string
  }
}

export type MessageData =
  | TextMessageData
  | ExtendedTextMessageData
  | { typeMessage: string; [key: string]: unknown }

export interface SenderData {
  chatId: string
  chatName?: string
  sender?: string
  senderName?: string
  senderContactName?: string
  senderPhoneNumber?: number
}

export interface IncomingMessageWebhook {
  typeWebhook: 'incomingMessageReceived'
  timestamp: number
  idMessage: string
  senderData: SenderData
  messageData: MessageData
}

export interface NotificationBody {
  typeWebhook: string
  timestamp?: number
  idMessage?: string
  senderData?: SenderData
  messageData?: MessageData
  [key: string]: unknown
}

export interface ReceiveNotificationResponse {
  receiptId: number
  body: NotificationBody
}

export interface ChatMessage {
  id: string
  chatId: string
  text: string
  timestamp: number
  direction: 'incoming' | 'outgoing'
  senderName?: string
}

export interface Chat {
  chatId: string
  title: string
  phone?: string
}
