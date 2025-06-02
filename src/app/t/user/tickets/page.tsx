import Link from "next/link"
import {
    Ticket as IconTicket,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
import { Button } from "@/components/ui/button"
import { UserTicketsTable } from "@/components/user/tickets-table"

export default function EmployeeTicketsPage() {
    return (
        <DashboardShell userRole="user" >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Meus Chamados</h1>
                    <p className="text-sm text-muted-foreground">
                        Acompanhe o status dos seus chamados abertos
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    {/* <Input
                        placeholder="Buscar por título…"
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        /> */}
                    <Link href="/t/user/new-ticket">
                        <Button>
                            <IconTicket className="mr-2 h-4 w-4" /> Novo Chamado
                        </Button>
                    </Link>
                </div>
            </div>

            <UserTicketsTable />
        </DashboardShell>
    )
}