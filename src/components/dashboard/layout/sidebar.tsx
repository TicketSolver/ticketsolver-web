"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Ticket,
  Settings,
  BarChart,
  Headset,
  Monitor,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  userRole: "admin" | "technician" | "user";
}

export function Sidebar({ userRole }: Readonly<SidebarProps>) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const adminItems = [
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
  ]

  const technicianItems = [
    {
      title: "Dashboard",
      href: "/dashboard/technician",
      icon: LayoutDashboard
    },
    {
      title: "Meus Chamados",
      href: "/dashboard/technician/tickets",
      icon: Ticket
    },
    // {
    //   title: "Acesso Remoto",
    //   href: "/dashboard/technician/remote",
    //   icon: Monitor
    // },
    {
      title: "Histórico",
      href: "/dashboard/technician/history",
      icon: BarChart
    }
  ]

  const userItems = [
    {
      title: "Dashboard",
      href: "/t/user/",
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
      href: "/t/user/grant-access",
      icon: Monitor

    }
  ]

  let menuItems;

  if (userRole === "admin") {
    menuItems = adminItems;
  } else if (userRole === "technician") {
    menuItems = technicianItems;
  } else {
    menuItems = userItems;
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  if (!isMounted) {
    return null
  }

  return (
    <>
      { }
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-3 left-3 z-50"
      >
        {isMobileOpen ? <X /> : <Menu />}
      </Button>

      { }
      {isMobileOpen && (
        <button
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
          aria-label="Close mobile sidebar"
        />
      )}

      { }
      <div className={cn(
        "fixed h-full w-64 border-r bg-background z-50 transition-transform",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-4 h-16 flex items-center border-b">
          <h1 className="text-xl font-bold">TicketSolver</h1>
        </div>

        <nav className="p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}
