import { Message, Sender } from "@/types/message"

export const mockMessages: Record<number, Message[]> = {
    1245: [
        {
            id: 1,
            ticketId: 1245,
            sender: Sender.User,
            content: "Estou com problema ao acessar o Office 365.",
            timestamp: new Date(Date.now() - 3600e3).toISOString(),
        },
        {
            id: 2,
            ticketId: 1245,
            sender: Sender.Agent,
            content: "Olá! Já verificou sua conexão de rede?",
            timestamp: new Date(Date.now() - 3500e3).toISOString(),
        },
        {
            id: 3,
            ticketId: 1245,
            sender: Sender.Technician,
            content: "Oi! Vou conectar remotamente ao seu computador em instantes.",
            timestamp: new Date(Date.now() - 3400e3).toISOString(),
        },
    ],
}
