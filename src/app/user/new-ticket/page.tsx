import { NewTicketForm } from "@/components/user/new-ticket-form"
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"

export default function NewTicketPage() {
    return (
        <DashboardShell userRole="user" userName="Maria Souza">
            <div className="max-w-xl mx-auto py-8">
                <h1 className="text-2xl font-bold mb-6">Abrir Novo Chamado</h1>
                <NewTicketForm />
            </div>
        </DashboardShell>
    )
}
