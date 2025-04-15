import { useQuery } from "@tanstack/react-query";
import { customerService } from "@/services/customerService";

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: customerService.getCustomers,
  });
}