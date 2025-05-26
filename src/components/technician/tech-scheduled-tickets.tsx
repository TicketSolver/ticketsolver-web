'use client'

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";

export function TechScheduledTickets(){
  return (
    <Card>
        <CardHeader>
          <CardTitle>Próximos Atendimentos</CardTitle>
          <CardDescription>
            Chamados agendados para atendimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Manutenção do Computador</p>
                  <p className="text-xs text-muted-foreground">Maria Rodrigues - Financeiro</p>
                </div>
              </div>
              <div className="text-sm text-right">
                <p className="font-medium">Hoje</p>
                <p className="text-muted-foreground">15:30</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>PL</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Instalação de Software</p>
                  <p className="text-xs text-muted-foreground">Paulo Lima - Marketing</p>
                </div>
              </div>
              <div className="text-sm text-right">
                <p className="font-medium">Amanhã</p>
                <p className="text-muted-foreground">10:00</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>JA</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Configuração de Rede</p>
                  <p className="text-xs text-muted-foreground">Juliana Alves - Vendas</p>
                </div>
              </div>
              <div className="text-sm text-right">
                <p className="font-medium">Amanhã</p>
                <p className="text-muted-foreground">14:15</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}