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
  password: string
  defUserTypeId: number
  tenantId: number
  key: string
}

export default function UsersPage() {
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
    tenantId: 1, // Ajuste se o tenantId for dinâmico
    key: ""
  })

  // 'recent' agora é PaginatedResponse<UserProfile> graças ao 'select' no hook
  const { data: recent, isFetching } = useAdminUsers(page, perPage);
  const [editUser, setEditUser] = useState<UserProfile | null>(null);

  // Acessando items e count diretamente de 'recent'
  const items = recent?.items ?? []

  const handleEditUser = (user: UserProfile) => {
    setEditUser(user);
    // Pode ser necessário popular o formulário de edição com os dados do 'editUser' aqui
    // setNewUser({ ...newUser, ...user }); // Exemplo, ajuste conforme seu formulário de edição
    setIsCreateUserOpen(true); // Reutilizando o modal de criação para edição? Considere um modal separado ou lógica condicional.
  };

  // Assumindo que usePreregisterUser é para criar, não editar
  const { createUser, isLoading: isCreating, error: createError } = usePreregisterUser()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Atualiza o total de itens quando os dados são carregados
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

  // Lógica para atualizar usuário (se você tiver um formulário de edição)
  const handleUpdateUser = async () => {
    if (!editUser) return;

    try {
      // Ajuste o payload conforme necessário para a sua API de PUT
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // Use os dados do estado 'newUser' ou um estado separado para edição
        body: JSON.stringify({
          fullName: newUser.fullName, // Exemplo: use os campos do estado newUser
          email: newUser.email,
          defUserTypeId: newUser.defUserTypeId,
          // Inclua outros campos que podem ser editados
        })
      });
      if (!res.ok) {
         const errorBody = await res.json().catch(() => ({ message: 'Falha desconhecida' }));
         throw new Error(`Falha na atualização: ${errorBody.message}`);
      }
      toast.success("Usuário atualizado");
      setIsCreateUserOpen(false); // Fecha o modal
      setEditUser(null); // Limpa o usuário em edição
      // Opcional: Refetch a lista de usuários para ver a alteração
      // queryClient.invalidateQueries(["admin", "users"]); // Se estiver usando useQueryClient
    } catch (error: any) {
      toast.error("Erro ao atualizar usuário", {
         description: error.message || "Tente novamente.",
      });
    }
  };

  const filteredUsers = items.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      || user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all"
      || SwitchRole(user.defUserTypeId) === roleFilter
    return matchesSearch && matchesRole
  })

  if (!isMounted) return null // Renderiza apenas no cliente

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

  const getStatusBadge = (statusId: number) => {
    // Assumindo que defUserStatusId 1 = Ativo, 2 = Inativo, etc.
    switch (statusId) {
      case 1:
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
      case 2:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inativo</Badge>
      default:
        return <Badge variant="outline">Status ID: {statusId}</Badge>
    }
  }


  const handleCreateUser = async () => {
    // validações
    if (!newUser.email || !newUser.fullName || !newUser.password) {
      toast.error("Preencha os campos obrigatórios", {
        description: "Nome, Email e Senha Temporária são obrigatórios.",
      })
      return
    }

    // A validação da chave parece estar correta
    if (([1, 2, 3].includes(newUser.defUserTypeId)) && !newUser.key) {
      toast.error("Preencha o campo de chave", {
        description:
          newUser.defUserTypeId === 1
            ? "A Admin Key é obrigatória."
            : "A Public Key é obrigatória.",
      })
      return
    }

    const payload = { ...newUser }
    const result = await createUser(payload) // Assumindo que createUser retorna ApiResponse<any> ou similar
    if (result?.success && result.data?.result?.succeeded) { // Ajuste o acesso a 'succeeded' conforme a estrutura de retorno de createUser
      toast.success("Usuário criado com sucesso!", {
        description: `Usuário "${newUser.fullName}" foi adicionado.`,
      })
      // Limpa o formulário após sucesso
      setNewUser({
        email: "",
        fullName: "",
        password: "",
        defUserTypeId: 3,
        tenantId: 1, // Ajuste se necessário
        key: "",
      })
      setIsCreateUserOpen(false)
    } else {
      const errorMessage = createError != null
        ? (typeof createError === "object" && (createError as any) instanceof Error ? (createError as Error).message : createError)
        : (result?.message || "Falha ao criar usuário"); 

      toast.error(errorMessage, {
        description: "Tente novamente.",
      });
    }
  }

  return (
    <DashboardShell userRole="admin"> {/* Ajuste userRole conforme necessário */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie usuários, técnicos e administradores do sistema
          </p>
        </div>

        {/* Modal de Criação/Edição */}
        <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
                setEditUser(null); // Limpa o usuário em edição ao abrir para criar
                setNewUser({ // Limpa o formulário
                    email: "",
                    fullName: "",
                    password: "",
                    defUserTypeId: 3,
                    tenantId: 1,
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
                  value={newUser.fullName} // Usando newUser state para o formulário
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  placeholder="Digite o nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email} // Usando newUser state
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="usuario@empresa.com"
                />
              </div>

              {/* Campo de Senha apenas para criação */}
              {!editUser && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha Temporária *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password} // Usando newUser state
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
                  value={newUser.defUserTypeId.toString()} // Usando newUser state
                  onValueChange={(value) => {
                    setNewUser({ ...newUser, defUserTypeId: parseInt(value), key: "" }) // Limpa a chave ao mudar o tipo
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
                    value={newUser.key} // Usando newUser state
                    onChange={(e) => setNewUser({ ...newUser, key: e.target.value })}
                    placeholder={newUser.defUserTypeId === 1 ? "Digite a Admin Key" : "Digite a Public Key"}
                  />
                </div>
              )}

            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateUserOpen(false)}
                disabled={isCreating} // Desabilita se estiver criando
              >
                Cancelar
              </Button>
              {editUser ? (
                 <Button
                   onClick={handleUpdateUser}
                   disabled={isLoading} // Use um estado de loading para update se houver
                 >
                   Atualizar Usuário
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
                <TableHead>Departamento</TableHead> {/* tenantId */}
                <TableHead>Status</TableHead> {/* defUserStatusId */}
                <TableHead>Último Acesso</TableHead> {/* Não disponível no JSON fornecido */}
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching ? (
                 <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                       Carregando usuários...
                    </TableCell>
                 </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(SwitchRole(user.defUserTypeId))}</TableCell>
                    <TableCell>{user.tenantId}</TableCell> {/* Exibindo tenantId */}
                    <TableCell>{getStatusBadge(user.defUserStatusId)}</TableCell> {/* Exibindo status */}
                    <TableCell>{"N/A"}</TableCell> {/* Campo Último Acesso não disponível */}
                    <TableCell className="text-right"> {/* Alinhar à direita */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           {/* Adicionar lógica para popular o formulário de edição */}
                           <DropdownMenuItem onClick={() => handleEditUser(user)}>
                             <Edit className="h-4 w-4 mr-2" />
                             Editar
                           </DropdownMenuItem>
                           {/* Adicionar lógica para alterar função/status */}
                           <DropdownMenuItem>
                             <Shield className="h-4 w-4 mr-2" />
                             Alterar Função
                           </DropdownMenuItem>
                           <DropdownMenuItem>
                             <ShieldCheck className="h-4 w-4 mr-2" />
                             Alterar Status
                           </DropdownMenuItem>
                           {/* Adicionar lógica para remover */}
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
          {/* Renderiza a paginação apenas se houver dados */}
          {recent?.count !== undefined && (
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