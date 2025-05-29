import { useQuery } from "@tanstack/react-query";
import { getAdminUsers } from "@/services/admin-service";
import { UserProfile } from "@/types/user";
import { ApiResponse, PaginatedResponse } from "@/types/common";

type HookReturnType = PaginatedResponse<UserProfile>;

export function useAdminUsers(page = 1, pageSize = 50) {
  return useQuery<ApiResponse<PaginatedResponse<UserProfile>>, Error, HookReturnType>({
    queryKey: ["admin", "users", page, pageSize],
    queryFn: () => getAdminUsers(page, pageSize),
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
    select: (response) => response.data,
  });
}