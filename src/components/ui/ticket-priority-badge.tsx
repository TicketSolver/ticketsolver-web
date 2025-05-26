import { Ticket, TicketPriority } from "@/types/ticket";
import { Badge } from "./badge";

const styles = {
  [TicketPriority.Critical]: "bg-red-100 text-red-800 border-red-200",
  [TicketPriority.High]: "bg-orange-100 text-orange-800 border-orange-200",
  [TicketPriority.Medium]: "bg-yellow-100 text-yellow-800 border-yellow-200",
  [TicketPriority.Low]: "bg-blue-100 text-blue-800 border-blue-200",
}

const title = {
  [TicketPriority.Critical]: "Crítico",
  [TicketPriority.High]: "Alta",
  [TicketPriority.Medium]: "Média",
  [TicketPriority.Low]: "Baixa",
}

export function TicketPriorityBadge({ priority }: { priority: Ticket['priority'] }) {
  return (
    <Badge variant="outline" className={styles[priority]}>
      {title[priority]}
    </Badge>
  );
}
