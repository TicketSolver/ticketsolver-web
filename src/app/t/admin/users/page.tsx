"use client"

import { useDeleteUser } from '@/hooks/useDeleteUser';
import { usePreregisterUser } from '@/hooks/usePreregisterUser'
import { UserProfile, UserUpdatePayload } from '@/types/user'
import { useEffect, useState } from "react"
import {
  Users, UserPlus, Search, Filter, MoreHorizontal, Edit, Trash2, Shield, ShieldCheck, X, KeyRound
} from "lucide-react"
import { useSession } from "next-auth/react";
import { usePagination } from "@/hooks/usePagination"
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { TablePagination } from "@/components/ui/table-pagination"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog"

import { Toaster, toast } from "sonner"
import { useAdminUsers } from "@/hooks/useAdminUser"
import { useUpdateUser } from '@/hooks/useUpdateUser';

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

  const {
    page, perPage, total,
    actions: { setPage, setPerPage, updateTotal }
  } = usePagination({ initialPage: 1, initialPerPage: 10 });

  const [newUser, setNewUser] = useState<NewUserData>({
    email: "",
    fullName: "",
    password: "",
    defUserTypeId: 3,
    tenantId: loggedInUserTenantId,
    key: ""
  });
  const { data: recent, isFetching, refetch: refetchAdminUsers } = useAdminUsers(page, perPage);
  const [editUser, setEditUser] = useState<UserProfile | null>(null);

  const items = recent?.items ?? []

  const { createUser, isLoading: isCreating, error: createError } = usePreregisterUser();
  const { updateUser, isLoading: isUpdating, error: updateError } = useUpdateUser();
  const { deleteUser: deleteUserHook, isLoading: isDeleting, error: deleteError } = useDeleteUser();

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
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


  const handleEditUser = (user: UserProfile) => {
    setEditUser(user);
    setNewUser({
      email: user.email,
      fullName: user.fullName,
      defUserTypeId: user.defUserTypeId,
      tenantId: user.tenantId,
      password: "",
      key: "",
    });
    setIsCreateUserOpen(true);
  };

  function SwitchRole(role: number) {
    switch (role) {
      case 1: return "admin"
      case 2: return "technician"
      case 3: return "user"
      default: return "unknown"
    }
  }

  const handleActualUpdateUser = async () => {
    if (!editUser || !editUser.id) return;

    const payload: UserUpdatePayload = {};

    const hasFullNameChanged = newUser.fullName !== editUser.fullName;

    const hasDefUserTypeIdChanged = newUser.defUserTypeId !== editUser.defUserTypeId;

    var changesMade = hasFullNameChanged || hasDefUserTypeIdChanged;

    if (newUser.fullName !== editUser.fullName) {
      payload.fullName = newUser.fullName;
      changesMade = true;
    }
    if (newUser.defUserTypeId !== editUser.defUserTypeId) {
      payload.defUserTypeId = newUser.defUserTypeId;
      changesMade = true;
    }

    if (!changesMade) {
      toast.info("Nenhuma alteração detectada.");
      setIsCreateUserOpen(false);
      setEditUser(null);
      return;
    }
    const payloadToSend: UserUpdatePayload = {
      fullName: newUser.fullName,
      defUserTypeId: newUser.defUserTypeId,
      // Se você tiver outros campos que são editáveis e que o backend espera,
      // adicione-os aqui da mesma forma, pegando de `newUser`.
      // Ex: email: newUser.email (se o email fosse editável e esperado)
    };

    console.log("Payload a ser enviado para atualização:", payloadToSend);
    const result = await updateUser(editUser.id, payloadToSend);

    if (result?.success) {
      toast.success("Usuário atualizado com sucesso!");
      setIsCreateUserOpen(false);
      setEditUser(null);
      if (refetchAdminUsers) refetchAdminUsers();
    } else {
      toast.error("Erro ao atualizar usuário", {
        description: result?.message || updateError?.message || "Tente novamente."
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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return <Badge className="bg-red-100 text-red-800 border-red-200">Administrador</Badge>
      case "technician": return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Técnico</Badge>
      case "user": return <Badge variant="outline">Usuário</Badge>
      default: return <Badge variant="outline">{role}</Badge>
    }
  }
  const handleOpenConfirmDeleteDialog = (user: UserProfile) => {
    setUserToDelete(user);
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete || !userToDelete.id) return;

    const result = await deleteUserHook(userToDelete.id);

    if (result.success) {
      toast.success(result.message || "Usuário removido com sucesso!");
      if (refetchAdminUsers) {
        refetchAdminUsers();
      }
    } else {
      toast.error("Erro ao remover usuário", {
        description: result.message || deleteError?.message || "Tente novamente.",
      });
    }
    setIsConfirmDeleteDialogOpen(false);
    setUserToDelete(null);
  };
  const handleCreateUserSubmit = async () => {
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
        description: newUser.defUserTypeId === 1 ? "A Admin Key é obrigatória." : "A Public Key é obrigatória.",
      })
      return
    }
    const payloadToCreate = {
      ...newUser,
      password: newUser.password || ""
    }
    const result = await createUser(payloadToCreate)
    if (result?.success && result.data?.result?.succeeded) {
      toast.success("Usuário criado com sucesso!", {
        description: `Usuário "${newUser.fullName}" foi adicionado.`,
      })
      setNewUser({
        email: "", fullName: "", password: "",
        defUserTypeId: 3, tenantId: loggedInUserTenantId, key: "",
      })
      setIsCreateUserOpen(false)
      if (refetchAdminUsers) refetchAdminUsers();
    } else {
      const errorMessage = createError
        ? (typeof createError === "object" && (createError as any) instanceof Error ? (createError as Error).message : String(createError))
        : (result?.message || "Falha ao criar usuário");
      toast.error(errorMessage || "Falha ao criar usuário", { description: "Tente novamente." });
    }
  }

  const handleRequestPasswordReset = (userEmail: string) => {
    toast.info(`Solicitação de reset de senha para ${userEmail} (não implementado).`);
  }

  if (!isMounted) { // Check for isMounted before returning main JSX
    return null;
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
            setNewUser({
              email: "", fullName: "", password: "",
              defUserTypeId: 3, tenantId: loggedInUserTenantId, key: ""
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditUser(null);
              setNewUser({
                email: "", fullName: "", password: "",
                defUserTypeId: 3, tenantId: loggedInUserTenantId, key: ""
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
                {editUser ? "Edite os dados do usuário abaixo." : "Preencha os dados para criar um novo usuário."}
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
                  id="email" type="email" value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="usuario@empresa.com"
                  disabled={!!editUser}
                />
              </div>

              {!editUser && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha Temporária *</Label>
                  <Input
                    id="password" type="password" value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Digite uma senha temporária"
                  />
                  <p className="text-xs text-muted-foreground">
                    O usuário deverá alterar na primeira conexão.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="userType">Tipo de Usuário *</Label>
                <Select
                  value={newUser.defUserTypeId.toString()}
                  onValueChange={(value) => {
                    setNewUser({ ...newUser, defUserTypeId: parseInt(value), key: newUser.defUserTypeId === 1 && newUser.defUserTypeId.toString() === value ? newUser.key : "" }) // Preserve key only if type remains admin or technician, and it was one of them
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Administrador</SelectItem>
                    <SelectItem value="2">Técnico</SelectItem>
                    <SelectItem value="3">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!editUser && (newUser.defUserTypeId === 1 || newUser.defUserTypeId === 2 || newUser.defUserTypeId === 3) && (
                <div className="space-y-2">
                  <Label htmlFor="key">
                    {newUser.defUserTypeId === 1 ? "Admin Key *" : "Public Key *"}
                  </Label>
                  <Input
                    id="key" value={newUser.key}
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
                disabled={isCreating || isUpdating}
              >
                Cancelar
              </Button>
              {editUser ? (
                <Button onClick={handleActualUpdateUser} disabled={isUpdating}>
                  {isUpdating ? "Atualizando..." : "Atualizar Usuário"}
                </Button>
              ) : (
                <Button onClick={handleCreateUserSubmit} disabled={isCreating}>
                  {isCreating ? "Criando..." : "Criar Usuário"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>Filtros e Busca</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou email..." value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Filtrar por função" /></SelectTrigger>
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
        <CardHeader><CardTitle>Lista de Usuários</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {/* ... (TableHead para Nome, Email, Função) ... */}
            </TableHeader>
            <TableBody>
              {isFetching ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Carregando usuários...</TableCell></TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(SwitchRole(user.defUserTypeId))}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />Editar Perfil
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem onClick={() => handleRequestPasswordReset(user.email)}>
                            <KeyRound className="h-4 w-4 mr-2" />Redefinir Senha
                          </DropdownMenuItem> */}
                          <DropdownMenuItem
                            className="text-red-500 hover:!text-red-500 hover:!bg-red-100"
                            onClick={() => handleOpenConfirmDeleteDialog(user)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />Remover Usuário
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Nenhum usuário encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          {/* ... (TablePagination) ... */}
        </CardContent>
      </Card>

      {/* Diálogo de Confirmação para Deletar Usuário */}
      {userToDelete && (
        <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Remoção</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja remover o usuário <strong>{userToDelete.fullName}</strong> ({userToDelete.email})? Esta ação não poderá ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end">
              <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)} disabled={isDeleting}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
                {isDeleting ? "Removendo..." : "Confirmar Remoção"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Toaster position="bottom-right" />
    </DashboardShell>
  )
}