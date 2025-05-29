"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {createTicket } from "@/services/ticket-service"
import { TicketPriority, TicketCategory } from "@/types/ticket"
import { toast } from "sonner"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const schema = z.object({
    title: z.string().min(3, "Mínimo de 3 caracteres"),
    description: z.string().optional(),
    category: z.enum([
        TicketCategory[TicketCategory.Hardware],
        TicketCategory[TicketCategory.Software],
        TicketCategory[TicketCategory.Network],
        TicketCategory[TicketCategory.Access],
    ] as const),
    priority: z.enum([
        TicketPriority[TicketPriority.Low],
        TicketPriority[TicketPriority.Medium],
        TicketPriority[TicketPriority.High],
        TicketPriority[TicketPriority.Critical],
    ] as const),
})

type FormValues = z.infer<typeof schema>

export function NewTicketForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            description: "",
            category: TicketCategory[TicketCategory.Software],
            priority: TicketPriority[TicketPriority.Medium],
        },
    })

    async function onSubmit(data: FormValues) {
        setIsSubmitting(true)
        try {
            const categoryIndex = TicketCategory[data.category as keyof typeof TicketCategory] as unknown as number
            const priorityIndex = TicketPriority[data.priority as keyof typeof TicketPriority] as unknown as number

            await createTicket({
                title: data.title,
                description: data.description,
                category: categoryIndex,
                priority: priorityIndex,
            })

            toast.success("Chamado criado com sucesso!")
            router.push("/t/user/")
        } catch (err) {
            console.error(err)
            toast.error("Falha ao criar chamado")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Computador não liga" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descrição (opcional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Detalhe o problema" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoria</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(TicketCategory)
                                                .filter((v) => typeof v === "string")
                                                .map((cat) => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prioridade</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(TicketPriority)
                                                .filter((v) => typeof v === "string")
                                                .map((prio) => (
                                                    <SelectItem key={prio} value={prio}>
                                                        {prio}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Criando..." : "Criar Chamado"}
                </Button>
            </form>
        </Form>
    )
}
