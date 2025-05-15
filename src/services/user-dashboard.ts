import { Ticket, TicketCategory, TicketStatus } from "@/types/ticket";

export interface Stats {
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  totalTickets: number;
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    title: 'Problema com impressora',
    description: 'A impressora não está imprimindo corretamente',
    status: 0,
    priority: 1,
    createdById: 'user1',
    assignedToId: "user2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: TicketCategory.Hardware,
    stats: TicketStatus.Open
  },
  {
    id: '2',
    title: 'Computador lento',
    description: 'Meu computador está muito lento para iniciar',
    status: 1,
    priority: 2,
    createdById: 'user1',
    assignedToId: 'tech1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    category: TicketCategory.Hardware,
    stats: TicketStatus.Open
  }
];

const MOCK_STATS: Stats = {
  openTickets: 2,
  inProgressTickets: 1,
  resolvedTickets: 3,
  totalTickets: 6
};


export async function fetchTickets(limit?: number): Promise<Ticket[]> {
  try {
    const url = limit ? `/api/tickets?limit=${limit}` : '/api/tickets';
    console.log(`Buscando tickets de ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.warn(`Erro ao buscar tickets: ${response.status}. Usando dados simulados.`);
      return limit ? MOCK_TICKETS.slice(0, limit) : MOCK_TICKETS;
    }
    
    const result = await response.json();
    console.log("Tickets recebidos:", result.data ? `${result.data.length} tickets` : "nenhum");
    
    if (!result.success) {
      console.warn("API retornou falha para tickets. Usando dados simulados.");
      return limit ? MOCK_TICKETS.slice(0, limit) : MOCK_TICKETS;
    }
    
    return result.data || [];
  } catch (error) {
    console.error("Erro ao buscar tickets:", error);
    return limit ? MOCK_TICKETS.slice(0, limit) : MOCK_TICKETS;
  }
}


export async function fetchStats(): Promise<Stats> {
  try {
    console.log("Buscando estatísticas de tickets");
    const response = await fetch('/api/tickets/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.warn(`Erro ao buscar estatísticas: ${response.status}. Usando dados simulados.`);
      return MOCK_STATS;
    }
    
    const result = await response.json();
    console.log("Estatísticas recebidas:", result);
    
    if (!result.success) {
      console.warn("API retornou falha para estatísticas. Usando dados simulados.");
      return MOCK_STATS;
    }
    
    return result.data || MOCK_STATS;
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return MOCK_STATS;
  }
}
