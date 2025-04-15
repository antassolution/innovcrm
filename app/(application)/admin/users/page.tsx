"use client";

import { useState, useEffect } from "react";
import { User } from "@/types";
import { userService } from "@/services/userService";
import { UserList } from "@/components/admin/UserList";
import { UserToolbar } from "@/components/admin/UserToolbar";
import { useToast } from "@/hooks/use-toast";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <UserToolbar onRefresh={loadUsers} />
      <div className="rounded-lg border bg-card">
        <UserList users={users} loading={loading} onRefresh={loadUsers} />
      </div>
    </div>
  );
}