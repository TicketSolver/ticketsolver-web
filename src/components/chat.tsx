"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/types/chat/chat";

interface ChatProps {
  ticketId: number;
}

export function Chat({ ticketId }: ChatProps) {
  const {
    messages,
    chatInfo,
    loading,
    sending,
    error,
    send,
  } = useChat(ticketId);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await send(newMessage.trim());
      setNewMessage("");
      scrollToBottom();
    } catch {
      // erro já tratado no hook
    }
  };

  const getSenderIcon = (type: string) => {
    if (type === "AI") return <Bot className="h-4 w-4" />;
    if (type === "Technician" || type === "Admin")
      return <Wrench className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  const getSenderColor = (type: string) => {
    switch (type) {
      case "AI":
        return "bg-blue-100 text-blue-800";
      case "Technician":
        return "bg-green-100 text-green-800";
      case "Admin":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Carregando chat...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-96 border rounded-lg">
      {error && (
        <Alert className="mb-2" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {chatInfo && (
        <div className="p-3 border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <Badge variant="outline">
              {chatInfo.isActive ? "Chat Ativo" : "Chat Inativo"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Ticket #{ticketId}
            </span>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhuma mensagem ainda. Inicie a conversa!
              </p>
            </div>
          ) : (
            messages.map((message: ChatMessage) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.senderType === "User"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.senderType !== "User" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className={getSenderColor(message.senderType)}
                    >
                      {getSenderIcon(message.senderType)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] ${
                    message.senderType === "User" ? "order-first" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {message.senderName}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getSenderColor(
                        message.senderType
                      )}`}
                    >
                      {message.senderType === "AI"
                        ? "IA"
                        : message.senderType === "Technician"
                        ? "Técnico"
                        : message.senderType === "Admin"
                        ? "Admin"
                        : "Você"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleTimeString(
                        "pt-BR",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </span>
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.senderType === "User"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
                {message.senderType === "User" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={sending}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
