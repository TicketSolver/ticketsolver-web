'use client'

import { Ticket, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { StatsCard } from "../dashboard/cards/stats-card";
import { useTechCounters } from "./hooks/use-tech-counters";
import { useMemo } from "react";

export function TechStats() {
  const { counters, isLoading } = useTechCounters();

  const values = useMemo(() => {
    return {
      currentlyWorking: counters?.data?.currentlyWorking || 0,
      solvedToday: counters?.data?.solvedToday || 0,
      highPriority: counters?.data?.highPriority || 0,
      critical: counters?.data?.critical || 0,
    };
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatsCard
        title="Chamados Atribuídos"
        value={values.currentlyWorking}
        icon={Ticket}
        className="text-blue-500"
        description="atualmente em aberto"
        />
      <StatsCard
        title="Resolvidos Hoje"
        value={values.solvedToday}
        icon={CheckCircle2}
        // trend={{ value: 20, isPositive: true }}
        description="em relação a ontem"
        className="text-green-500"
      />
      <StatsCard
        title="Prioridade Alta"
        value={values.highPriority}
        icon={AlertCircle}
        description="exigem atenção imediata"
        className="text-orange-400"
        />
      <StatsCard
        title="Chamados críticos"
        value={values.critical}
        icon={Clock}
        description="exigem atenção imediata"
        className="text-red-600"
      />
    </div>
  )
}