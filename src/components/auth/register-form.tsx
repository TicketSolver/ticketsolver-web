"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Resolver } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import {
  verifyInviteCode,
  registerUser
} from "@/services/auth"
import {
  InviteCodeFormValues,
  RegisterFormValues,
  RegisterRequest
} from "@/types/auth"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

const inviteCodeSchema = z.object({
  inviteCode: z.string().min(6, "Código de convite inválido")
})

const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um email válido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string().min(8, "A senha de confirmação deve ter pelo menos 8 caracteres"),
  inviteCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [codeVerified, setCodeVerified] = useState(false)
  const [inviteData] = useState<{ email: string; name: string } | null>(null)
  const [inviteType, setInviteType] = useState<"public" | "admin" | null>(null)
  const [tenantKey, setTenantKey] = useState("")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const inviteForm = useForm<InviteCodeFormValues>({
    resolver: zodResolver(inviteCodeSchema) as Resolver<InviteCodeFormValues>,
    defaultValues: {
      inviteCode: ""
    }
  })

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema) as Resolver<RegisterFormValues>,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      inviteCode: ""
    }
  })

async function onSubmitCode(data: InviteCodeFormValues) {
  setIsLoading(true);

  try {
    console.log("Verificando código de convite:", data.inviteCode);
    const result = await verifyInviteCode(data.inviteCode);
    if (!result) {
      toast.error("Resposta inválida do servidor");
      return;
    }

    if (result.success && result.data) {

      if (!result.data.tenantKey) {
        toast.error("Falha na validação do código: dados incompletos!");
        return;
      }
      
      const cleanKey = result.data.tenantKey.trim();
      setTenantKey(cleanKey);
      localStorage.setItem('temp_tenant_key', cleanKey);
      const typeKey = result.data.typeKey;
      registerForm.setValue("name", data.inviteCode);
      if ('email' in result.data && typeof result.data.email === 'string') {
        registerForm.setValue("email", result.data.email);
      }
      if (typeKey === 0) {
        console.log("Definindo tipo como admin");
        setInviteType("admin");
      } else if (typeKey === 1) {
        console.log("Definindo tipo como public");
        setInviteType("public");
      } else {
        console.log("typeKey desconhecido:", typeKey);
      }
      console.log("Definindo codeVerified como true");
      setCodeVerified(true);
      toast.success("Código de convite validado com sucesso!");
    } else {
      console.error("Verificação falhou:", result.message);
      toast.error(result.message || "Código de convite inválido!");
    }
  } catch (error) {
    console.error("Erro ao verificar código:", error);
    toast.error("Erro ao processar a verificação do código!");
  } finally {
    setIsLoading(false);
  }
}

async function onSubmitRegister(data: RegisterFormValues) {
  setIsLoading(true);

  try {
    const currentTenantKey = tenantKey || localStorage.getItem('temp_tenant_key');

    if (!currentTenantKey) {
      toast.error("Chave do tenant não encontrada. Por favor, verifique o código novamente.");
      setCodeVerified(false); 
      return;
    }
    const registerData: RegisterRequest = {
      email: data.email,
      password: data.password,
      key: currentTenantKey
    };

    console.log("Dados enviados para registro:", JSON.stringify(registerData, null, 2));
    const result = await registerUser(registerData);

    if (result.success) {
      toast.success("Registro realizado com sucesso!");
      localStorage.removeItem('temp_tenant_key');
      router.push("/auth/login?registered=true");
    } else {
      toast.error(result.message || "Erro ao registrar usuário");
    }
  } catch (error) {
    console.error("Erro ao registrar:", error);
    toast.error("Erro ao registrar usuário!");
  } finally {
    setIsLoading(false);
  }
}



  if (!isMounted) {
    return <div className="w-full max-w-md mx-auto p-8">Carregando...</div>
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
        <CardDescription className="text-center">
          {codeVerified
            ? "Complete seu cadastro para acessar o TicketSolver"
            : "Digite o código de convite fornecido pelo administrador"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!codeVerified ? (
          <Form {...inviteForm}>
            <form onSubmit={inviteForm.handleSubmit(onSubmitCode)} className="space-y-4">
              <FormField
                control={inviteForm.control}
                name="inviteCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Convite</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o código fornecido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verificando..." : "Verificar Código"}
              </Button>
            </form>
          </Form>
        ) : (
          <>
            {inviteData && inviteType === "public" && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  Código válido! Complete seu cadastro abaixo.
                </AlertDescription>
              </Alert>
            )}
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="space-y-4">
              <FormField
                control={registerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Convite</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled={true}
                        readOnly={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Crie uma senha"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirme sua senha"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Finalizando..." : "Finalizar Cadastro"}
                </Button>
              </form>
            </Form>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-center text-sm mt-2">
          Já possui uma conta?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
