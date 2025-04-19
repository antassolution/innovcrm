"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="h-full bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center">
            <h1 className="text-2xl font-semibold">Administration</h1>
          </div>
          <Tabs value={pathname} className="mb-[-1px]">
            <TabsList>
              <Link href="/admin/users">
                <TabsTrigger value="/admin/users">Users</TabsTrigger>
              </Link>
              <Link href="/admin/settings">
                <TabsTrigger value="/admin/settings">Settings</TabsTrigger>
              </Link>
              <Link href="/admin/subscriptions">
                <TabsTrigger value="/admin/subscriptions">Subscriptions</TabsTrigger>
              </Link>
            </TabsList>
            <div className="container mx-auto px-4 py-8">
                {children}
              </div>
           
          </Tabs>
        </div>
      </div>
    </div>
  );
}