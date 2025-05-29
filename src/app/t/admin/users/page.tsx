"use client"

import { usePreregisterUser } from '@/hooks/usePreregisterUser'
import { UserProfile } from '@/types/user'
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
import { useSession } from "next-auth/react"; // Import useSession
import { usePagination } from "@/hooks/usePagination"
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
import { TablePagination } from "@/components/ui/table-pagination"
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
import { useAdminUsers } from "@/hooks/useAdminUser"

interface NewUserData {
  email: string
  fullName: string
  password?: string
  defUserTypeId: number
  tenantId: number
  key: string
}

export default function UsersPage() {
  const { data: session } = useSession();
  const loggedInUserTenantId = (session?.user as any)?.tenantId || 1;

  const [isMounted, setIsMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    page, perPage, total,
    actions: {
      setPage,
      setPerPage,
      updateTotal,
    }
  } = usePagination({
    initialPage: 1,
    initialPerPage: 10,
  });

  const [newUser, setNewUser] = useState<NewUserData>({
    email: "",
    fullName: "",
    password: "",
    defUserTypeId: 3,
    tenantId: loggedInUserTenantId,
    key: ""
  })

  const { data: recent, isFetching } = useAdminUsers(page, perPage);
  const [editUser, setEditUser] = useState<UserProfile | null>(null);

  const items = recent?.items ?? []

  const handleEditUser = (user: UserProfile) => {
    setEditUser(user);
    setNewUser({
      email: user.email,
      fullName: user.fullName,
      defUserTypeId: user.defUserTypeId,
      tenantId: user.tenantId,
      key: "", 
    });
    setIsCreateUserOpen(true);
  };
  const { createUser, isLoading: isCreating, error: createError } = usePreregisterUser()

  useEffect(() => {
    setIsMounted(true)
  }, [])
  useEffect(() => {
    if (session?.user && !editUser) {
      setNewUser(prev => ({ ...prev, tenantId: (session.user as any).tenantId || 1 }));
    }
  }, [session, editUser]);


  useEffect(() => {
    if (recent?.count != null) {
      updateTotal(recent?.count);
    }
  }, [recent, updateTotal]);

  function SwitchRole(role: number) {
    switch (role) {
      case 1: return "admin"
      case 2: return "technician"
      case 3: return "user"
      default: return "unknown"
    }
  }

  const handleUpdateUser = async () => {
    if (!editUser) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newUser.fullName,
          email: newUser.email,
          defUserTypeId: newUser.defUserTypeId,
        })
      });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ message: 'Falha desconhecida' }));
        throw new Error(`Falha na atualização: ${errorBody.message}`);
      }
      toast.success("Usuário atualizado");
      setIsCreateUserOpen(false);
      setEditUser(null);
    } catch (error: any) {
      toast.error("Erro ao atualizar usuário", {
        description: error.message || "Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = items.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      || user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all"
      || SwitchRole(user.defUserTypeId) === roleFilter
    return matchesSearch && matchesRole
  })

  if (!isMounted) return null

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

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.fullName || !newUser.password) {
      toast.error("Preencha os campos obrigatórios", {
        description: "Nome, Email e Senha Temporária são obrigatórios.",
      })
      return
    }
    if (!newUser.tenantId) {
        toast.error("ID do Tenant não encontrado.", {
            description: "Não foi possível determinar o tenantId para este usuário.",
        });
        return;
    }

    if (([1, 2, 3].includes(newUser.defUserTypeId)) && !newUser.key) {
      toast.error("Preencha o campo de chave", {
        description:
          newUser.defUserTypeId === 1
            ? "A Admin Key é obrigatória."
            : "A Public Key é obrigatória.",
      })
      return
    }
    const payload = { 
      ...newUser,
      password: newUser.password || ""
    }
    const result = await createUser(payload)
    if (result?.success && result.data?.result?.succeeded) {
      toast.success("Usuário criado com sucesso!", {
        description: `Usuário "${newUser.fullName}" foi adicionado.`,
      })
      setNewUser({
        email: "",
        fullName: "",
        password: "",
        defUserTypeId: 3,
        tenantId: loggedInUserTenantId,
        key: "",
      })
      setIsCreateUserOpen(false)
    } else {
      const errorMessage = createError != null
        ? (typeof createError === "object" && (createError as any) instanceof Error ? (createError as Error).message : String(createError))
        : (result?.message || "Falha ao criar usuário");

      toast.error(errorMessage, {
        description: "Tente novamente.",
      });
    }
  }

  return (
    <DashboardShell userRole="admin"> 
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie usuários, técnicos e administradores do sistema
          </p>
        </div>

        <Dialog open={isCreateUserOpen} onOpenChange={(isOpen) => {
          setIsCreateUserOpen(isOpen);
          if (!isOpen) {
            setEditUser(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditUser(null);
              setNewUser({
                email: "",
                fullName: "",
                password: "",
                defUserTypeId: 3,
                tenantId: loggedInUserTenantId,
                key: ""
              });
              setIsCreateUserOpen(true);
            }}>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editUser ? "Editar Usuário" : "Criar Novo Usuário"}</DialogTitle>
              <DialogDescription>
                {editUser ? "Edite os dados do usuário" : "Preencha os dados para criar um novo usuário no sistema"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  placeholder="Digite o nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="usuario@empresa.com"
                  disabled={!!editUser}
                />
              </div>

              {!editUser && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha Temporária *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Digite uma senha temporária"
                  />
                  <p className="text-xs text-muted-foreground">
                    O usuário deverá alterar na primeira conexão
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="userType">Tipo de Usuário</Label>
                <Select
                  value={newUser.defUserTypeId.toString()}
                  onValueChange={(value) => {
                    setNewUser({ ...newUser, defUserTypeId: parseInt(value), key: "" })
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

              {/* Campo de Chave Condicional - only for new users if password is also present */}
              {(!editUser && (newUser.defUserTypeId === 1 || newUser.defUserTypeId === 2 || newUser.defUserTypeId === 3)) && (
                <div className="space-y-2">
                  <Label htmlFor="key">
                    {newUser.defUserTypeId === 1 ? "Admin Key *" : "Public Key *"}
                  </Label>
                  <Input
                    id="key"
                    value={newUser.key}
                    onChange={(e) => setNewUser({ ...newUser, key: e.target.value })}
                    placeholder={newUser.defUserTypeId === 1 ? "Digite a Admin Key" : "Digite a Public Key"}
                  />
                </div>
              )}
               {/* Display Tenant ID (read-only for info) - No need to display this if it's always the logged-in user's tenant */}
              {/*
              <div className="space-y-2">
                <Label htmlFor="tenantId">Tenant ID</Label>
                <Input id="tenantId" value={newUser.tenantId} disabled />
              </div>
              */}


            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateUserOpen(false);
                  setEditUser(null); // Clear edit user state
                }}
                disabled={isCreating || isLoading}
              >
                Cancelar
              </Button>
              {editUser ? (
                <Button
                  onClick={handleUpdateUser}
                  disabled={isLoading}
                >
                  {isLoading ? "Atualizando..." : "Atualizar Usuário"}
                </Button>
              ) : (
                <Button
                  onClick={handleCreateUser}
                  disabled={isCreating}
                >
                  {isCreating ? "Criando..." : "Criar Usuário"}
                </Button>
              )}
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                {/* Removed: Departamento, Status, Último Acesso */}
                {/* If you add "Última Alteração", you'll need data for it, e.g., user.updatedAt */}
                {/* <TableHead>Última Alteração</TableHead> */}
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching ? (
                <TableRow>
                  {/* Adjusted colSpan from 7 to 4 */}
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Carregando usuários...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(SwitchRole(user.defUserTypeId))}</TableCell>
                    {/* Removed: user.tenantId (Departamento), getStatusBadge, "N/A" (Último Acesso) */}
                    {/* If you display user.updatedAt for "Última Alteração":
                    <TableCell>{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
                    */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          {/* Add logic for these actions if needed */}
                          <DropdownMenuItem onClick={() => toast.info("Funcionalidade 'Alterar Função' não implementada.")}>
                            <Shield className="h-4 w-4 mr-2" />
                            Alterar Função
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Funcionalidade 'Alterar Status' não implementada.")}>
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Alterar Status
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => toast.error("Funcionalidade 'Remover' não implementada.")}>
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
                  {/* Adjusted colSpan from 7 to 4 */}
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado com os filtros aplicados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {recent?.count !== undefined && recent.count > 0 && ( // Render pagination only if there are items
            <TablePagination
              count={recent?.count || 0}
              page={page}
              perPage={perPage}
              onPageChange={setPage}
              onPerPageChange={setPerPage}
            />
          )}
        </CardContent>
      </Card>
      <Toaster position="bottom-right" />
    </DashboardShell>
  )
}