import { LayoutDashboard, Users, Ticket, BarChart, Settings, Headset, Monitor } from "lucide-react"

export const menuLinks = {
  admin: [
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: LayoutDashboard
    },
    {
      title: "Usuários",
      href: "/dashboard/admin/users",
      icon: Users
    },
    {
      title: "Chamados",
      href: "/dashboard/admin/tickets",
      icon: Ticket
    },
    {
      title: "Relatórios",
      href: "/dashboard/admin/reports",
      icon: BarChart
    },
    {
      title: "Configurações",
      href: "/dashboard/admin/settings",
      icon: Settings
    }
  ],
  technician: [
    {
      title: "Dashboard",
      href: "/t/technician",
      icon: LayoutDashboard
    },
    {
      title: "Meus Chamados",
      href: "/t/technician/tickets",
      icon: Ticket
    },
    // {
    //   title: "Acesso Remoto",
    //   href: "/dashboard/technician/remote",
    //   icon: Monitor
    // },
    {
      title: "Histórico",
      href: "/t/technician/history",
      icon: BarChart
    }
  ],
  user: [
    {
      title: "Dashboard",
      href: "/t/user",
      icon: LayoutDashboard
    },
    {
      title: "Novo Chamado",
      href: "/t/user/new-ticket",
      icon: Headset
    },
    {
      title: "Meus Chamados",
      href: "/t/user/tickets",
      icon: Ticket
    },
    {
      title: "Permitir Acesso",
      href: "/t/user/dashboard/grant-access",
      icon: Monitor
    }
  ]
}