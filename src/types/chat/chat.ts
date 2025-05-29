export interface ChatMessage {
    id: number
    ticketId: number
    senderId: string
    senderName: string
    senderType: 'Admin' | 'Technician' | 'User' | 'AI'
    content: string
    createdAt: string
    isRead: boolean
}

export interface SendMessageRequest {
    ticketId: number
    content: string
    
}

export interface ChatHistory {
    messages: ChatMessage[]
    totalCount: number
    page: number
    pageSize: number
}

export interface ChatInfo {
    id: number
    ticketId: number
    isActive: boolean
    createdAt: string
    lastMessageAt?: string
    participantCount: number
    isArchived: boolean
}

export interface UnreadCount {
    unreadCount: number
}
