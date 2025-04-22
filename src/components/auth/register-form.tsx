"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff, CheckCircle2 } from "lucide-react"

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
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type InviteCodeFormValues = z.infer<typeof inviteCodeSchema>
type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [codeVerified, setCodeVerified] = useState(false)
  const [inviteData, setInviteData] = useState<{ email: string; name: string } | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const inviteForm = useForm<InviteCodeFormValues>({
    resolver: zodResolver(inviteCodeSchema),
    defaultValues: {
      inviteCode: ""
    }
  })

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

  async function onSubmitCode(data: InviteCodeFormValues) {
    setIsLoading(true)

    try {
      console.log("Verificando código:", data.inviteCode)
      await new Promise(resolve => setTimeout(resolve, 1000))

      setInviteData({
        email: "usuario.precadastrado@empresa.com",
        name: "Usuário Pré-cadastrado"
      })

      registerForm.setValue("email", "usuario.precadastrado@empresa.com")
      registerForm.setValue("name", "Usuário Pré-cadastrado")

      setCodeVerified(true)
    } catch (error) {
      console.error("Erro ao verificar código:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmitRegister(data: RegisterFormValues) {
    setIsLoading(true)

    try {
      console.log("Dados de registro:", data)

      await new Promise(resolve => setTimeout(resolve, 1000))

      router.push("/auth/login?registered=true")
    } catch (error) {
      console.error("Erro ao registrar:", error)
    } finally {
      setIsLoading(false)
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
            {inviteData && (
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
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
