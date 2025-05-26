import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";

export default function TechnicianHistory() {
  return (
    <DashboardShell userRole="technician" userName="João Silva">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Histórico</h1>
        <p className="text-sm text-muted-foreground">
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </p>
      </div>
{/* 
      <TechStats /> */}

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* <TechTickets />

        <TechPerformance /> */}
      </div>

      {/* <TechScheduledTickets /> */}
    </DashboardShell>
  )
}
