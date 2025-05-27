export interface AdminOverview {
    totalTickets: number;
    activeTickets: number;
    avgResolutionTime: string;
    activeTechnicians: number;
}

export interface Ticket {
    priority: string;
    id: number;
    title: string;
    status: string;
    technicianName: string | null;
}
export interface TicketFull {
    id: string | number;
    title: string;
    description: string;
    status: number;
    createdAt: string;
    updatedAt: string;
    assignedby: {
        id: string | number;
        name: string;
    }
    createdBy: {
        id: string | number;
        name: string;
    }
    category?: TicketCategory;
    priority?: TicketPriority;
    stats?: TicketStatus;
}

enum TicketCategory {
    Hardware = 1,
    Software,
    Network,
    Access
}
enum TicketPriority {
    Low = 1,
    Medium,
    High,
    Critical
}

enum TicketStatus {
    New = 1,
    InProgress,
    Resolved,
    Closed,
    Reopened
}