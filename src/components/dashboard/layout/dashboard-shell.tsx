
import { Header } from "./header"
import { Sidebar } from "./sidebar"

interface DashboardShellProps {
  children: React.ReactNode;
  userRole: "admin" | "technician" | "user";
  userName: string;
}

export function DashboardShell({ children, userRole, userName }: Readonly<DashboardShellProps>) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={userRole} />
      <div className="md:ml-64">
        <Header userRole={userRole} userName={userName} />
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
