
export interface Ticket {
    id: string | number;
    title: string;
    status: number;
    createdAt: string;
    assignedToId: string
    createdById: string | number;
    category: TicketCategory;
    priority: TicketPriority;
    stats: TicketStatus;
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
