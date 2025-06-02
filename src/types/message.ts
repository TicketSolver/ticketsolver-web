
export enum Sender {
    User = "user",
    Technician = "technician",
    Agent = "agent",
}

export interface Message {
    id: number
    ticketId: number
    sender: Sender
    content: string
    timestamp: string
}


export interface StartChatResponse {
  chatInfo: ChatInfo;
  initialMessage: ChatMessage | null;
}

export interface ChatInfo {
    id: number;
    userId: number;
    technicianId: number | null;
    agentId: number | null;
    status: string; // "open", "in_progress", "closed"
    createdAt: string;
    updatedAt: string;
}

export interface ChatMessage {
    id: number;
    chatId: number;
    sender: Sender;
    content: string;
    timestamp: string;
}