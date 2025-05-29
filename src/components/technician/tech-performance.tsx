'use client'

import { BarChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { useTechPerformance } from "./hooks/use-tech-performance";
import { useMemo } from "react";

export function TechPerformance() {
  const { performance, isLoading } = useTechPerformance();

  const values = useMemo(() => {
    return {
      satisfaction: performance?.data?.satisfaction || 0,
      anwserTime: performance?.data?.anwserTime || 0,
      solvingPercentage: performance?.data?.solvingPercentage || 0,
    }
  }, [performance?.data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meu Desempenho</CardTitle>
        <CardDescription>
          Estatísticas da semana atual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxa de Resolução</span>
              <span className="font-medium">{values.solvingPercentage}%</span>
            </div>
            <Progress value={values.solvingPercentage} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Satisfação do Cliente</span>
              <span className="font-medium">{values.satisfaction}%</span>
            </div>
            <Progress value={values.satisfaction} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tempo de Resposta</span>
              <span className="font-medium">{values.anwserTime} min</span>
            </div>
            <Progress value={values.anwserTime} max={120} className="h-2" />
          </div>

          <div className="pt-4">
            <div className="h-[120px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <BarChart className="h-8 w-8" />
                <p className="text-sm">Dados de desempenho detalhados</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}