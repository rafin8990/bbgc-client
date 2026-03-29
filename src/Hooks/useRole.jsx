import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiossecure from "./useAxiossecure";

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiossecure();

  const {
    data: role = "user",
    isLoading: roleLoading,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: ["role", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/${user.email}/role`
      );
      return res.data?.role || "user";
    },
  });

  return { role, roleLoading };
};

export default useRole;
