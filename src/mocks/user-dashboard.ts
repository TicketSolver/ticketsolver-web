import { Ticket, TicketStatus, TicketPriority, TicketCategory } from "@/types/ticket"

export const mockTickets: Ticket[] = [
  {
    id: 1243,
    title: "Erro no sistema ERP",
    status: TicketStatus.InProgress,
    priority: TicketPriority.Medium,
    category: TicketCategory.Software,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdById: 5,
    assignedToId: 2,
  },
  {
    id: 1242,
    title: "Problema com impressora",
    status: TicketStatus.Open,
    priority: TicketPriority.Low,
    category: TicketCategory.Hardware,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    createdById: 5,
  },
  {
    id: 1245,
    title: "Problema no ar condicionado",
    status: TicketStatus.Resolved,
    priority: TicketPriority.Low,
    category: TicketCategory.Hardware,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    createdById: 5,
  },
]

export const mockStats = {
  total: 3,
  inProgress: 1,
  waiting: 1,
  resolved: 1
}
