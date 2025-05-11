"use client";

import { Search, Bell, Menu, Hand, User, Settings, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { userService } from "@/services/userService";

export function Header() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await userService.getCurrentUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();

    // Clear local storage
    localStorage.clear();

    // Redirect to home page
    router.push("/logout");
  };

  // Generate initials for avatar fallback
  const getInitials = () => {
    if (!currentUser) return "U";
    const firstInitial = currentUser.firstName ? currentUser.firstName.charAt(0) : "";
    const lastInitial = currentUser.lastName ? currentUser.lastName.charAt(0) : "";
    return `${firstInitial}${lastInitial}` || "U";
  };

  // Get full name
  const getFullName = () => {
    if (!currentUser) return "User";
    return `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "User";
  };

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-4">
        {/* Logo Section - Left */}
        <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center text-primary">
              <Zap className="h-8 w-8 stroke-[1.5]" />
              <span className="font-bold text-2xl logo-gradient ml-1">SalesPro</span>
            </div>
          </Link>

        {/* Search Section - Middle */}
        <div className="flex-1 flex justify-center max-w-2xl mx-auto px-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="w-full pl-10 bg-muted"
            />
          </div>
        </div>

        {/* Actions Section - Right */}
        <div className="flex shrink-0 items-center gap-2 ml-auto">
         
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{getFullName()}</p>
                  <p className="text-xs leading-none text-muted-foreground">{currentUser?.email || "loading..."}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer hover:bg-gray-100" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}