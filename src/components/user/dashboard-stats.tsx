'use client'

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Clock, CheckCircle2, Monitor } from "lucide-react";
import { StatsCard } from "../dashboard/cards/stats-card";
import { getUserCounters } from "@/services/ticket-service";

export function UserDashboardStats() {
  const { data: stats, isLoading } = useQuery<ApiResponse<Record<string, number>>>({
    queryKey: ['user', 'stats'],
    queryFn: getUserCounters
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatsCard
        title="Chamados Abertos"
        value={stats?.data?.open}
        icon={AlertCircle}
        description="Aguardando atendimento"
      />
      <StatsCard
        title="Em Andamento"
        value={stats?.data?.inProgress}
        icon={Clock}
        description="Sendo atendidos"
      />
      <StatsCard
        title="Resolvidos"
        value={stats?.data?.resolved}
        icon={CheckCircle2}
        description="Neste mês"
      />
      <StatsCard
        title="Total"
        value={stats?.data?.total}
        icon={Monitor}
        description="Todos os chamados"
      />
    </div>
  );
}
