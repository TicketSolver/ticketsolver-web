
import { ChatMessage, SendMessageRequest, ChatHistory, ChatInfo } from "@/types/chat/chat"

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token')
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  }
}

export async function sendMessage(request: SendMessageRequest): Promise<ChatMessage> {
  const response = await fetch(`/api/chat/messages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao enviar mensagem')
  }

  const result = await response.json()
  return result.data
}

export async function getChatHistory(
  ticketId: number, 
  page: number = 1, 
  pageSize: number = 50
): Promise<ChatHistory> {
  const response = await fetch(
    `/api/chat/tickets/${ticketId}/history?page=${page}&pageSize=${pageSize}`,
    {
      headers: getAuthHeaders(),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao buscar histórico')
  }

  const result = await response.json()
  return result.data
}

export async function markMessagesAsRead(ticketId: number): Promise<void> {
  const response = await fetch(`/api/chat/messages/mark-read`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ticketId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao marcar mensagens como lidas')
  }
}

export async function startChat(ticketId: number): Promise<ChatInfo> {
  const response = await fetch(`/api/chat/tickets/${ticketId}/start`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao iniciar chat')
  }

  const result = await response.json()
  return result.data
}

export async function getUnreadChats(): Promise<any[]> {
  const response = await fetch(`/api/chat/unread`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao buscar chats não lidos')
  }

  const result = await response.json()
  return result.data
}

export async function getRecentChats(limit: number = 10): Promise<any[]> {
  const response = await fetch(`/api/chat/recent?limit=${limit}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao buscar chats recentes')
  }

  const result = await response.json()
  return result.data
}

export async function getChatStatistics(ticketId: number): Promise<any> {
  const response = await fetch(`/api/chat/tickets/${ticketId}/statistics`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao buscar estatísticas')
  }

  const result = await response.json()
  return result.data
}

export async function searchMessages(searchRequest: any): Promise<any> {
  const response = await fetch(`/api/chat/search`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(searchRequest),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao buscar mensagens')
  }

  const result = await response.json()
  return result.data
}
