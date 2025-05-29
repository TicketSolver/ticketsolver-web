import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
import { TicketPage } from "@/components/tickets/ticket-page"

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticketId = Number(id)
  
  return (
    <DashboardShell
      userRole="user"
    >
      <TicketPage ticketId={ticketId} />
    </DashboardShell>
  )
}
