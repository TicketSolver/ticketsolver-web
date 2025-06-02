import { Plus } from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";
import { Button } from "@/components/ui/button";

import { UserDashboardStats } from "@/components/user/dashboard-stats";
import { UserRecentTickets } from "@/components/user/recent-tickets";

export default function UserDashboard() {
  return (
    <DashboardShell userRole={"user"}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/t/user/new-ticket/">
            <Plus className="mr-2 h-4 w-4" /> Novo Chamado
          </Link>
        </Button>
      </div>

      {/* Estatísticas */}
      <UserDashboardStats />

      {/* Chamados Recentes */}
      <UserRecentTickets />
    </DashboardShell>
  )
}