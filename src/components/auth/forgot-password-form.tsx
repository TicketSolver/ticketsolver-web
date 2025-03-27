"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

const forgotPasswordSchema = z.object({
    email: z.string().email("Digite um email válido")
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() { 
    const [isLoading, setIsLoading] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)


    useEffect(() => {
    setIsMounted(true)
}, [])

const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
        email: ""
    }
})

async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true)
    
    try {
    console.log("Solicitação de recuperação para:", data.email)
    
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitted(true)
    } catch (error) {
    console.error("Erro ao solicitar recuperação:", error)
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
        <CardTitle className="text-2xl font-bold text-center">Recuperação de Senha</CardTitle>
        <CardDescription className="text-center">
        Digite seu email para receber um link de recuperação
        </CardDescription>
    </CardHeader>
    <CardContent>
        {isSubmitted ? (
        <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
                Se o email fornecido estiver registrado em nosso sistema, enviaremos um link de 
                recuperação em instantes. Por favor, verifique sua caixa de entrada e pasta de spam.
            </AlertDescription>
        </Alert>
        ) : (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input 
                            placeholder="seu.email@empresa.com" 
                            type="email"
                            {...field} 
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
                </Button>
            </form>
        </Form>
        )}
    </CardContent>
    <CardFooter className="flex flex-col">
        <div className="text-center text-sm mt-2">
            Lembrou sua senha?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
            Voltar para o login
            </Link>
        </div>
    </CardFooter>
    </Card>
)
}
