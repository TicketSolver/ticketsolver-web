
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
