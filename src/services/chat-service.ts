// services/chat-service.ts
import {
  ChatMessage,
  SendMessageRequest,
  ChatInfo
} from "@/types/chat/chat";
import { getAuthHeaders } from "./auth-client";
import { getTicketById } from "./ticket-service";





export async function getUnreadChats(): Promise<any[]> {
  const res = await fetch("/api/chat/unread", {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erro ao buscar chats não lidos");
  }
  return (await res.json()).data;
}

export async function getRecentChats(limit = 10): Promise<any[]> {
  const res = await fetch(`/api/chat/recent?limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erro ao buscar chats recentes");
  }
  return (await res.json()).data;
}


export async function searchMessages(searchRequest: any): Promise<any> {
  const res = await fetch("/api/chat/search", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(searchRequest),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erro ao buscar mensagens");
  }
  return (await res.json()).data;
}
export interface ChatHistory {
  messages: ChatMessage[];
}

const CREDENTIALS = { credentials: "same-origin" as const };

export async function startChat(ticketId: number): Promise<ChatInfo> {
  const res = await fetch(
    `/api/chat/tickets/${ticketId}/start`,
    { method: "POST", ...CREDENTIALS }
  );
  if (!res.ok) throw new Error("Erro ao iniciar chat");
  const json = await res.json();
  return json.data as ChatInfo;
}

export async function getChatHistory(
  ticketId: number,
  page = 1,
  pageSize = 50
): Promise<ChatHistory> {
  const res = await fetch(
    `/api/chat/tickets/${ticketId}/history?page=${page}&pageSize=${pageSize}`,
    CREDENTIALS
  );
  if (!res.ok) throw new Error("Erro ao buscar histórico");
  const json = await res.json();
  return json.data as ChatHistory;
}

export async function sendMessage(params: {
  ticketId: number;
  content: string;
}): Promise<ChatMessage> {
  const res = await fetch(`/api/chat/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    ...CREDENTIALS,
  });
  if (!res.ok) throw new Error("Erro ao enviar mensagem");
  const json = await res.json();
  return json.data as ChatMessage;
}

export async function markMessagesAsRead(
  ticketId: number
): Promise<void> {
  const res = await fetch(`/api/chat/messages/mark-read`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticketId }),
    ...CREDENTIALS,
  });
  if (!res.ok) throw new Error("Erro ao marcar mensagens como lidas");
}

export async function getChatStatistics(
  ticketId: number
): Promise<ChatInfo> {
  const res = await fetch(
    `/api/chat/tickets/${ticketId}/statistics`,
    CREDENTIALS
  );
  if (!res.ok) throw new Error("Erro ao buscar estatísticas");
  const json = await res.json();
  return json.data as ChatInfo;
}