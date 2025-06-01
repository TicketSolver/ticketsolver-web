import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { assignUsersToTicket, getTicketUsers, getUnassingedTechnicians, unassingUser } from "@/services/ticket-service";
import { User, X } from "lucide-react";
import { MultiSelect } from "../ui/multi-select";
import { Button } from "../ui/button";
import { useState } from "react";

export function TicketTechnicians({ ticketId }: { ticketId: number | string }) {
  const { data: techs, isLoading } = useQuery<ApiResponse<any[]>>({
    queryKey: ['ticket', ticketId, 'tech'],
    queryFn: async () => await getTicketUsers(+ticketId),
    refetchOnWindowFocus: false,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Técnicos responsáveis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap items-center mb-2 w-full">
          {techs?.data?.length > 0 ? techs.data.map(tech => (
            <TechItem user={tech.user} ticketId={ticketId} key={tech.id} />
          )) : (
            <p>Nenhum técnico vinculado.</p>
          )}
        </div>

        <UserAttacher ticketId={ticketId} />

      </CardContent>
    </Card>
  );
}

function UserAttacher({ ticketId }: { ticketId: number | string }) {
  const [isAttaching, setIsAttaching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const queryClient = useQueryClient();

  const { data: techs, isLoading: isTechniciansLoading } = useQuery<ApiResponse<any[]>>({
    queryKey: ['ticket', ticketId, 'tech', 'unassigned'],
    queryFn: async () => await getUnassingedTechnicians(+ticketId),
    refetchOnWindowFocus: false,
  });

  async function handleAttachUsers() {
    if (isAttaching || selectedUsers.length === 0) return;
    setIsAttaching(true);

    try {
      await assignUsersToTicket(+ticketId, selectedUsers);
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId, 'tech'] });
      setSelectedUsers([]);
    } catch (error) {

    }

    setIsAttaching(false);
  }

  const users = techs?.data?.length > 0
    ? techs.data.map(user => ({ label: user.name, value: user.id }))
    : [];

  return (
    <div className="flex gap-2 items-center">
      <MultiSelect
        value={selectedUsers}
        onChange={(selected) => setSelectedUsers(selected)}
        disabled={isAttaching || isTechniciansLoading}
        options={users}
      />

      <Button
        disabled={selectedUsers.length === 0 || isAttaching || isTechniciansLoading}
        onClick={handleAttachUsers}
      >Vincular</Button>
    </div>
  );
}

function TechItem({ user, ticketId }: { user: { id: string; email?: string; name?: string }, ticketId: number | string }) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  async function handleDettachUser() {
    if (isLoading) return;
    setIsLoading(true);
    console.log('aqui')
    try {
      await unassingUser(+ticketId, user.id);
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId, 'tech'] })
    } catch (error) {

    }

    setIsLoading(false);
  }

  return (
    <div className="flex gap-2 items-center py-2 px-4 rounded-xl bg-gray-100 border-[1px]">
      <User className="h-6 w-6" />
      <div className="">
        <strong>{user.name}</strong>
        <p className="text-sm">{user.email}</p>
      </div>

      <Button 
        variant="destructive" 
        size="icon" 
        className="ml-2 cursor-pointer"
        onClick={handleDettachUser}
        disabled={isLoading}
        >
        <X />
      </Button>
    </div>
  );
}