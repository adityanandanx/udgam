import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, register, getProfile } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
        queryClient.invalidateQueries({ queryKey: ["me"] });
        router.push("/dashboard");
      } else {
        throw new Error("window is undefined");
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem("token");
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push("/login");
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      router.push("/login?register=success");
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not logged in");
        return await getProfile(token);
      } else {
        throw new Error("window is undefined");
      }
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });
};
