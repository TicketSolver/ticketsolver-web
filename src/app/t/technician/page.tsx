import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
import { TechStats } from "@/components/technician/tech-stats"
import { TechTickets } from "@/components/technician/tech-tickets"
import { TechPerformance } from "@/components/technician/tech-performance"

export default function TechnicianDashboard() {
  return (
    <DashboardShell userRole="technician">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel do Técnico</h1>
        <p className="text-sm text-muted-foreground">
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </p>
      </div>

      <TechStats />

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <TechTickets />

        <TechPerformance />
      </div>

      {/* <TechScheduledTickets /> */}
    </DashboardShell>
  )
}
