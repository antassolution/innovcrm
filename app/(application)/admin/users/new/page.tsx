"use client";

import { UserForm } from "@/components/admin/UserForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewUserPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin/users");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-2xl font-semibold">Add New User</h2>
      </div>

      <UserForm onSuccess={handleSuccess} />
    </div>
  );
}