import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";
import { TechTicketsTable } from "@/components/technician/tickets/tickets-table";

export default function TechnicianTickets() {
  return (
    <DashboardShell userRole="technician">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Chamados</h1>
        <p className="text-sm text-muted-foreground">
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </p>
      </div>

      <TechTicketsTable />

    </DashboardShell>
  )
}
