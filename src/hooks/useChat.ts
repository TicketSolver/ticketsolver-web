import { useState, useEffect } from "react";
import {
  getChatHistory,
  markMessagesAsRead,
  sendMessage,
  startChat,
  getChatStatistics,
} from "@/services/chat-service";
import { ChatMessage, ChatInfo } from "@/types/chat/chat";

export function useChat(ticketId: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = async () => {
    try {
      const history = await getChatHistory(ticketId);
      setMessages(history.messages);
      if (history.messages.length > 0) {
        await markMessagesAsRead(ticketId);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const loadChatInfo = async () => {
    try {
      const info = await getChatStatistics(ticketId);
      setChatInfo(info);
    } catch {
      /* falhar silenciosamente */
    }
  };

  const initialize = async () => {
    setLoading(true);
    try {
      await startChat(ticketId);
      await loadChatInfo();
      await loadMessages();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const send = async (content: string): Promise<ChatMessage> => {
    setSending(true);
    try {
      const msg = await sendMessage({ ticketId, content });
      setMessages((prev) => [...prev, msg]);
      return msg;
    } finally {
      setSending(false);
    }
  };

  // inicia tudo ao montar / trocar ticketId
  useEffect(() => {
    initialize();
  }, [ticketId]);

  // polling de novas mensagens
  useEffect(() => {
    const iv = setInterval(async () => {
      try {
        const history = await getChatHistory(ticketId);
        if (history.messages.length > messages.length) {
          setMessages(history.messages);
          await markMessagesAsRead(ticketId);
        }
      } catch (err) {
        setError((err as Error).message);
      }
    }, 5_000);
    return () => clearInterval(iv);
  }, [ticketId, messages.length]);

  return {
    messages,
    chatInfo,
    loading,
    sending,
    error,
    send,
  };
}
