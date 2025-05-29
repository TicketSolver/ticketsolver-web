import { useQuery } from "@tanstack/react-query";
import { getAdminRecentTickets } from "@/services/admin-service";
import { PaginatedResponse } from "@/types/common";
import { Ticket } from "@/types/admin";

export function useAdminRecentTickets(page = 1, pageSize = 5) {
    return useQuery<PaginatedResponse<Ticket>, Error>({
        queryKey: ["admin", "recentTickets", page, pageSize],
        queryFn: () => getAdminRecentTickets(page, pageSize),
    });
}
