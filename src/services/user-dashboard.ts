import { Ticket } from "@/types/ticket";

export interface Stats {
  total: number;
  inProgress: number;
  waiting: number;
  resolved: number;
}

export async function fetchStats(): Promise<Stats> {
  try {
    const response = await fetch('/api/user/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar estatísticas');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw error;
  }
}

export async function fetchTickets(limit?: number): Promise<Ticket[]> {
  try {
    const url = limit 
      ? `/api/user/tickets?limit=${limit}` 
      : '/api/user/tickets';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar tickets');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Erro ao buscar tickets:', error);
    throw error;
  }
}

export async function createTicket(ticketData: {
  title: string;
  description: string;
  category: number;
  priority: number;
}): Promise<Ticket> {
  try {
    const response = await fetch('/api/user/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao criar ticket');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    throw error;
  }
}

export async function fetchTicketDetails(ticketId: string | number): Promise<Ticket> {
  try {
    const response = await fetch(`/api/user/tickets/${ticketId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar detalhes do ticket');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Erro ao buscar detalhes do ticket ${ticketId}:`, error);
    throw error;
  }
}
