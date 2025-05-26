"use client"

import { useEffect, useState } from "react"
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  X
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"

import { Toaster, toast } from "sonner"

interface User {
  id: number
  name: string
  email: string
  role: string
  department: string
  status: string
  lastAccess: string
}

interface NewUserData {
  email: string
  fullName: string
  password: string
  defUserTypeId: number
  tenantId: number
  key: string // Campo para a chave (Admin ou Public)
}

export default function UsersPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Formulário de novo usuário
  const [newUser, setNewUser] = useState<NewUserData>({
    email: "",
    fullName: "",
    password: "",
    defUserTypeId: 3, // Padrão: Usuário
    tenantId: 1, // Assumindo tenant padrão
    key: "" // Inicializa a chave vazia
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const users: User[] = [
    {
      id: 1,
      name: "João Silva",
      email: "joao.silva@empresa.com",
      role: "technician",
      department: "TI",
      status: "active",
      lastAccess: "2025-01-20 14:30"
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria.santos@empresa.com",
      role: "user",
      department: "Financeiro",
      status: "active",
      lastAccess: "2025-01-20 10:15"
    },
    {
      id: 3,
      name: "Carlos Pereira",
      email: "carlos.pereira@empresa.com",
      role: "technician",
      department: "TI",
      status: "active",
      lastAccess: "2025-01-20 16:45"
    },
    {
      id: 4,
      name: "Ana Oliveira",
      email: "ana.oliveira@empresa.com",
      role: "admin",
      department: "TI",
      status: "active",
      lastAccess: "2025-01-20 09:20"
    },
    {
      id: 5,
      name: "Pedro Costa",
      email: "pedro.costa@empresa.com",
      role: "user",
      department: "Vendas",
      status: "inactive",
      lastAccess: "2025-01-15 11:30"
    }
  ]

  // Função de filtro
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Administrador</Badge>
      case "technician":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Técnico</Badge>
      case "user":
        return <Badge variant="outline">Usuário</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inativo</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleCreateUser = async () => {
    // Validação básica dos campos obrigatórios
    if (!newUser.email || !newUser.fullName || !newUser.password) {
      toast.error("Preencha os campos obrigatórios", {
        description: "Nome, Email e Senha Temporária são obrigatórios.",
      })
      return
    }

    // Validação da chave condicionalmente
    if ((newUser.defUserTypeId === 1 || newUser.defUserTypeId === 2 || newUser.defUserTypeId === 3) && !newUser.key) {
       toast.error("Preencha o campo de chave", {
        description: newUser.defUserTypeId === 1 ? "A Admin Key é obrigatória." : "A Public Key é obrigatória.",
      })
      return
    }


    setIsLoading(true)

    try {
      // Simulação de chamada API
      // const response = await fetch('/api/users', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newUser),
      // })

      // Simulação de sucesso/erro da API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da API
      const success = Math.random() > 0.2; // 80% de chance de sucesso

      if (success) { // if (response.ok) {
        toast.success("Usuário criado com sucesso!", {
          description: `Usuário "${newUser.fullName}" foi adicionado.`,
        })

        // Reset form e fecha modal
        setNewUser({
          email: "",
          fullName: "",
          password: "",
          defUserTypeId: 3, // Reseta para o padrão
          tenantId: 1,
          key: "" // Reseta a chave
        })
        setIsCreateUserOpen(false) // Fecha o Dialog

        // Aqui você pode recarregar a lista de usuários
        // window.location.reload() ou implementar um refetch

      } else {
        // const error = await response.json()
        toast.error("Erro ao criar usuário", {
          description: "Ocorreu um problema ao salvar o usuário. Tente novamente.", // error.message || "Erro ao criar usuário",
        })
      }
    } catch (error) {
      toast.error("Erro de conexão", {
        description: "Não foi possível conectar ao servidor. Verifique sua internet.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardShell userRole="admin" userName="Administrador">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie usuários, técnicos e administradores do sistema
          </p>
        </div>

        <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar um novo usuário no sistema
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                  placeholder="Digite o nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="usuario@empresa.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha Temporária *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Digite uma senha temporária"
                />
                <p className="text-xs text-muted-foreground">
                  O usuário deverá alterar na primeira conexão
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userType">Tipo de Usuário</Label>
                <Select
                  value={newUser.defUserTypeId.toString()}
                  onValueChange={(value) => {
                    setNewUser({...newUser, defUserTypeId: parseInt(value), key: ""}) // Limpa a chave ao mudar o tipo
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Administrador</SelectItem>
                    <SelectItem value="2">Técnico</SelectItem>
                    <SelectItem value="3">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Campo de Chave Condicional */}
              {(newUser.defUserTypeId === 1 || newUser.defUserTypeId === 2 || newUser.defUserTypeId === 3) && (
                 <div className="space-y-2">
                   <Label htmlFor="key">
                     {newUser.defUserTypeId === 1 ? "Admin Key *" : "Public Key *"}
                   </Label>
                   <Input
                     id="key"
                     value={newUser.key}
                     onChange={(e) => setNewUser({...newUser, key: e.target.value})}
                     placeholder={newUser.defUserTypeId === 1 ? "Digite a Admin Key" : "Digite a Public Key"}
                   />
                 </div>
              )}

            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateUserOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateUser}
                disabled={isLoading}
              >
                {isLoading ? "Criando..." : "Criar Usuário"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as funções</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
                <SelectItem value="technician">Técnicos</SelectItem>
                <SelectItem value="user">Usuários</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            {filteredUsers.length} usuários encontrados de {users.length} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.lastAccess).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            Alterar Função
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado com os filtros aplicados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Toaster position="bottom-right" />
    </DashboardShell>
  )
}
