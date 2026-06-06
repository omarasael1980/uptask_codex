import { useQuery } from "@tanstack/react-query";
import { getAuthenticatedUser } from "@/api/AuthApi";

export const useAuth = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getAuthenticatedUser,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  return { data, isError, isLoading };
};
