import { useQuery } from "@tanstack/react-query";
import { getAdminOverview } from "@/services/admin-service";
import { AdminOverview } from "@/types/admin";

export function useAdminStats() {
  return useQuery<AdminOverview, Error>({
    queryKey: ["admin", "overview"],
    queryFn: getAdminOverview,
    staleTime: 1000 * 60 * 5,
  });
}
