import { Ticket, TicketPriority, TicketStatus } from "@/types/ticket";
import { Badge } from "./badge";

const styles = {
  [TicketStatus.New]: "bg-gray-100 text-gray-800 border-gray-200",
  [TicketStatus.InProgress]: "bg-blue-100 text-blue-800 border-blue-200",
  [TicketStatus.Resolved]: "bg-green-100 text-green-800 border-green-200",
  [TicketStatus.Closed]: "bg-purple-100 text-purple-800 border-purple-200",
  [TicketStatus.Reopened]: "bg-red-100 text-red-800 border-red-200",
}

const title = {
  [TicketStatus.New]: "Novo",
  [TicketStatus.InProgress]: "Em progresso",
  [TicketStatus.Resolved]: "Resolvido",
  [TicketStatus.Closed]: "Fechado",
  [TicketStatus.Reopened]: "Reaberto",
}

export function TicketStatusBadge({ status }: { status: Ticket['status'] }) {
  return (
    <Badge variant="outline" className={styles[status]}>
      {title[status]}
    </Badge>
  );
}
