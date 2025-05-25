"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { toast } from "sonner"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [isMounted, setIsMounted] = useState(false)

  const toastShownRef = useRef(false)
  
  useEffect(() => {
    setIsMounted(true)
    if(toastShownRef.current){
      return;
    } 
    const reset = searchParams?.get("reset")
    const registered = searchParams?.get("registered")
    const error = searchParams?.get("error")
    if (error) {
      toast.error("Erro ao fazer login", {
        description: "Verifique suas credenciais e tente novamente."
      })
      toastShownRef.current = true;
    }
    else if (reset === "success") {
      toast.success("Senha redefinida com sucesso!", {
        description: "Você pode agora fazer login com sua nova senha."
      })
      toastShownRef.current = true;
    } else if (registered === "true") {
      toast.success("Conta criada com sucesso!", {
        description: "Sua conta foi criada. Por favor, faça login para continuar."
      })
      toastShownRef.current = true;
    }
  }, [searchParams])

  if (!isMounted) {
    return <div className="w-full max-w-md mx-auto p-8">Carregando...</div>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
