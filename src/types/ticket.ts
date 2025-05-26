
export interface Ticket {
    id: string | number;
    title: string;
    description: string;
    status: number;
    createdAt: string;
    updatedAt: string;
    assignedToId: string
    createdById: string | number;
    category?: TicketCategory;
    priority?: TicketPriority;
    stats?: TicketStatus;
}

export enum TicketCategory {
    Hardware = 1,
    Software,
    Network,
    Access
}

export enum TicketPriority {
    Low = 1,
    Medium,
    High,
    Critical
}

export enum TicketStatus {
    New = 1,
    InProgress,
    Resolved,
    Closed,
    Reopened
}
