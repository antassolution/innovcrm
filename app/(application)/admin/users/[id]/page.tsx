"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { userService } from "@/services/userService";
import { UserForm } from "@/components/admin/UserForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await userService.getUserById(params.id);
        setUser(data || null);
      } catch (error) {
        console.error("Failed to load user:", error);
        toast({
          title: "Error",
          description: "Failed to load user details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [params.id, toast]);

  const handleSuccess = () => {
    router.push("/admin/users");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-muted-foreground">User not found</div>
        <Link href="/admin/users">
          <Button variant="outline">Back to Users</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-2xl font-semibold">Edit User</h2>
      </div>

      <UserForm user={user} onSuccess={handleSuccess} />
    </div>
  );
}