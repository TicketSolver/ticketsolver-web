// services/chat-service.ts
import {
  ChatMessage,
  SendMessageRequest,
  ChatHistory,
  ChatInfo
} from "@/types/chat/chat";
import { getAuthHeaders } from "./auth-client";
import { getTicketById } from "./ticket-service";

export async function sendMessage(
  request: SendMessageRequest
): Promise<ChatMessage> {
  const res = await fetch("/api/chat/messages", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erro ao enviar mensagem");
  }
  return (await res.json()).data;
}

export async function getChatHistory(
  ticketId: number,
  page = 1,
  pageSize = 50
): Promise<ChatHistory> {
  const res = await fetch(
    `/api/chat/tickets/${ticketId}/history?page=${page}&pageSize=${pageSize}`,
    { headers: getAuthHeaders() }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erro ao buscar histórico");
  }
  return (await res.json()).data;
}

export async function markMessagesAsRead(ticketId: number): Promise<void> {
  const res = await fetch("/api/chat/messages/mark-read", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ ticketId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erro ao marcar mensagens como lidas");
  }
}

export async function startChat(ticketId: number): Promise<ChatInfo> {
  console.log("Iniciando chat para o ticket:", ticketId);

  const ticket = await getTicketById(ticketId);
  if (!ticket || !ticket.title) {
    throw new Error("Ticket inválido ou não encontrado");
  }
  console.log("Ticket encontrado:", ticket);
  const content =
    `Olá, você é um chat especializado em suporte TI que me auxiliará na solução do meu problema: ` +
    `"${ticket.title}" — ${ticket.description}. ` +
    `Por favor, seja objetivo e claro, dando soluções práticas e diretas.`;
  console.log("Conteúdo da mensagem:", content);
    const res = await fetch(`/api/chat/tickets/${ticketId}/start`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ content }),
  });
  console.log("Resposta do servidor:", res.status, res.statusText);
  const payload = await res.json();
  console.log("Payload recebido:", payload);
  if (!res.ok) throw new Error(payload.message || "Erro ao iniciar chat");
  return payload.data as ChatInfo;
}

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

export async function getChatStatistics(ticketId: number): Promise<any> {
  const res = await fetch(
    `/api/chat/tickets/${ticketId}/statistics`,
    { headers: getAuthHeaders() }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erro ao buscar estatísticas");
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
