"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
  storeId?: string;
  role?: string;
}

async function fetchCurrentUser(): Promise<User | null> {
  const res = await fetch("/api/auth/me");
  // User is genuinely not authenticated
  if (res.status === 401) {
    return null;
  }

  // Any other failure should be treated as an error
  if (!res.ok) {
    throw new Error("Failed to fetch current user");
  }
  const data = await res.json();
  if (data.success && data.data) return data.data;
  return null;
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user = null, isLoading: loading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
  });

  const logoutMutation = useMutation({
    mutationFn: () => fetch("/api/auth/logout", { method: "POST" }),
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      router.push("/");
      router.refresh();
    },
  });

  return {
    user,
    loading,
    isLoggedIn: !!user,
    logout: logoutMutation.mutate,
  };
}
