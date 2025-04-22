"use client"

import { useEffect, useState, useRef } from "react"
import { Message, Sender } from "@/types/message"
import { fetchMessages, sendMessage } from "@/services/chat-service"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LucideIcon, User, Cpu, Headset } from "lucide-react"
import { toast } from "sonner"
import { JSX } from "react/jsx-runtime"

interface ChatProps {
    ticketId: number
}

export function Chat({ ticketId }: Readonly<ChatProps>) {
    const [msgs, setMsgs] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState("")
    const endRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const data = await fetchMessages(ticketId)
                setMsgs(data)
            } catch (err) {
                console.error(err)
                toast.error("Erro ao carregar chat")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [ticketId])

    // auto-scroll
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [msgs])

    async function handleSend() {
        if (!content.trim()) {
            return
        }
        try {
            const newMsg = await sendMessage(
                ticketId,
                Sender.User,
                content.trim()
            )
            setMsgs((m) => [...m, newMsg])
            setContent("")
        } catch (err) {
            console.error(err)
            toast.error("Não foi possível enviar a mensagem")
        }
    }

    function renderAvatar(sender: Sender): JSX.Element {
        let Icon: LucideIcon
        let bg: string
        switch (sender) {
            case Sender.User:
                Icon = User; bg = "bg-gray-200"
                break
            case Sender.Technician:
                Icon = Headset; bg = "bg-green-200"
                break
            case Sender.Agent:
                Icon = Cpu; bg = "bg-blue-200"
                break
        }
        return (
            <Avatar className={`h-8 w-8 ${bg}`}>
                <AvatarFallback>
                    <Icon className="h-5 w-5 text-gray-600" />
                </AvatarFallback>
            </Avatar>
        )
    }

    return (
        <div className="flex flex-col h-[500px] border rounded">
            <div className="flex-1 overflow-auto p-4 space-y-4 bg-white">
                {(() => {
                    if (loading) {
                        return <p>Carregando conversas…</p>
                    }
                    if (msgs.length === 0) {
                        return (
                            <p className="text-center text-sm text-muted-foreground">
                                Nenhuma mensagem ainda
                            </p>
                        )
                    }
                    return msgs.map((m) => (
                        <div
                            key={m.id}
                            className={`flex ${m.sender === Sender.User
                                ? "justify-end"
                                : "justify-start"
                                }`}
                        >
                            {m.sender !== Sender.User &&
                                renderAvatar(m.sender)}
                            <div
                                className={`max-w-[70%] px-4 py-2 rounded-lg ${m.sender === Sender.User
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-gray-100"
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{m.content}</p>
                                <span className="block text-xs text-muted-foreground text-right">
                                    {new Date(m.timestamp).toLocaleTimeString("pt-BR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                            {m.sender === Sender.User &&
                                renderAvatar(m.sender)}
                        </div>
                    ))
                })()}
                <div ref={endRef} />
            </div>

            <div className="flex p-2 border-t bg-gray-50">
                <Input
                    placeholder="Digite uma mensagem…"
                    value={content}
                    onChange={(e) => setContent(e.currentTarget.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            handleSend()
                        }
                    }}
                />
                <Button
                    className="ml-2"
                    onClick={handleSend}
                >
                    Enviar
                </Button>
            </div>
        </div>
    )
}
