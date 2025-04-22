export interface Ticket {
    id: number
    title: string
    description?: string
    status: TicketStatus
    priority: TicketPriority
    category: TicketCategory
    createdAt: string
    updatedAt?: string
    createdById: number
    assignedToId?: number
}

export enum TicketCategory {
    Hardware,
    Software,
    Network,
    Access
}

export enum TicketPriority {
    Low,
    Medium,
    High,
    Critical
}

export enum TicketStatus {
    Open,
    InProgress,
    Resolved,
    Closed
}
