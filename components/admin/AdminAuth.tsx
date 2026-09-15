// components/admin/AdminAuth.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/(frontend)/hooks/useAuth";

export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>,
) {
  return function AdminProtectedComponent(props: P) {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      if (!loading && isClient) {
        if (!user) {
          router.push("/login?redirect=/admin");
          return;
        }

        // Check if user has admin role
        const isAdmin = user.role === "admin" || user.role === "super_admin";
        if (!isAdmin) {
          router.push("/dashboard");
          return;
        }

        setIsAuthorized(true);
      }
    }, [user, loading, router, isClient]);

    // Show loading state
    if (!isClient || loading || !isAuthorized) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
