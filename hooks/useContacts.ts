import { useQuery } from "@tanstack/react-query";
import { contactService } from "@/services/contactService";

export function useContacts(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["contacts", page, pageSize],
    queryFn: () => contactService.getContacts(page, pageSize),
  });
}
