import { useQuery } from "@tanstack/react-query";
import { getAdminUsers } from "@/services/admin-service";
import { PaginatedResponse } from "@/types/common";
import { UserProfile } from "@/types/user";

export function useAdminUsers(page = 1, pageSize = 50) {
    return useQuery<PaginatedResponse<UserProfile>, Error>({
        queryKey: ["admin", "users", page, pageSize],
        queryFn: () => getAdminUsers(page, pageSize),
    });
}
