import { useQuery } from "@tanstack/react-query";
import { getAdminTickets } from "@/services/admin-service";
import { PaginatedResponse } from "@/types/common";
import { TicketFull } from "@/types/admin";

export function useAdminTickets(page = 1, pageSize = 50) {
    return useQuery<PaginatedResponse<TicketFull>, Error>({
        queryKey: ["admin", "tickets", page, pageSize],
        queryFn: () => getAdminTickets(page, pageSize),
    });
}
