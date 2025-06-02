import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
import { TicketPage } from "@/components/tickets/ticket-page"

export default async function TicketDetailPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = await params;

  return (
    <DashboardShell
      userRole="technician"
    >
      <TicketPage ticketId={ticketId} />
    </DashboardShell>
  )
}
