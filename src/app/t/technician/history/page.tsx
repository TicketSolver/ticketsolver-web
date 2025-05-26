import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";
import { TechHistoryTable } from "@/components/technician/history/history-table";

export default function TechnicianHistory() {
  return (
    <DashboardShell userRole="technician">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Histórico</h1>
        <p className="text-sm text-muted-foreground">
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </p>
      </div>
      
      <TechHistoryTable />
    </DashboardShell>
  )
}
