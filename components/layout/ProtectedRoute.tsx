"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User, PermissionType } from "@/types";
import { hasPermission } from "@/lib/permissionUtils";
import { userService } from "@/services/userService";
import Cookies from "js-cookie";
import { fa } from "@faker-js/faker";



interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: PermissionType;
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("Checking authentication...");
    const checkAuth = async () => {
      try {
        // Check if we have a token in localStorage
        // const token = Cookies.get("authToken");
        // console.log("Token from cookies:", token);
        // if (!token) {
        //   // No token found, redirect to login
        //   router.push("/login");
        //   return;
        // }

        // Get current user data
        // Normally you'd have a getCurrentUser endpoint, but we'll work with what we have
        const userData = await userService.getCurrentUser();

        console.log("Current user data:", userData);


        setCurrentUser(userData);

        // If user is not active, redirect to login
        // if (userData?.status !== "active") {
        //   localStorage.removeItem("token");
        //   router.push("/login");
        //   return;
        // }
        console.log("User data:", userData);
        console.log("requiredPermission:", requiredPermission);
        console.log("hasPermission:", (requiredPermission && !hasPermission(userData, requiredPermission)));

        // If permission check is required and user doesn't have the permission
        if (requiredPermission && !hasPermission(userData, requiredPermission)) {
          // Redirect to dashboard or unauthorized page
          router.push("/dashboard");
          return;
        }
        return false;
      } catch (error) {
        console.error("Authentication check failed:", error);
        // On error, clear token and redirect to login
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, requiredPermission]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render children only if authentication passed
  return <>{children}</>;
}