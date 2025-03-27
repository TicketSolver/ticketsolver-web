"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const resetPasswordSchema = z.object({
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string().min(8, "A senha de confirmação deve ter pelo menos 8 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(true)

  // Verificar token ao carregar
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Em produção, você validaria o token com seu backend
        console.log("Verificando token:", token)
        // Simular validação do token
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Se o token for inválido, atualize o estado
        if (token === "invalid") {
          setIsTokenValid(false)
        }
      } catch (error) {
        console.error("Erro ao verificar token:", error)
        setIsTokenValid(false)
      }
    }
    
    verifyToken()
    setIsMounted(true)
  }, [token])

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  async function onSubmit(data: ResetPasswordFormValues) {
    setIsLoading(true)
    
    try {
      // Aqui você implementaria a lógica real de redefinição de senha
      console.log("Redefinindo senha com token:", token)
      console.log("Nova senha:", data.password)
      
      // Simular resposta do servidor
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirecionar para a página de login após redefinição bem-sucedida
      router.push("/auth/login?reset=success")
    } catch (error) {
      console.error("Erro ao redefinir senha:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Renderiza um placeholder até que o componente seja montado no cliente
  if (!isMounted) {
    return <div className="w-full max-w-md mx-auto p-8">Carregando...</div>
  }

  // Se o token for inválido, mostrar mensagem de erro
  if (!isTokenValid) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Link Inválido</CardTitle>
          <CardDescription className="text-center">
            Este link de redefinição de senha é inválido ou expirou.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="mb-4">
              Por favor, solicite um novo link de redefinição de senha.
            </p>
            <Button asChild>
              <Link href="/auth/forgot-password">
                Solicitar Novo Link
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Criar Nova Senha</CardTitle>
        <CardDescription className="text-center">
          Digite e confirme sua nova senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Digite sua nova senha" 
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
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Nova Senha</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Confirme sua nova senha" 
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
              {isLoading ? "Redefinindo..." : "Redefinir Senha"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
