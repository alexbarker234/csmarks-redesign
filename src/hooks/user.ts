import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../database/data";

export const useUser = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const user = await fetchUser(id);
      return user;
    }
  });
};
