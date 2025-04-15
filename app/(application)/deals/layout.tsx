"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DealsLayout({
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
            <h1 className="text-2xl font-semibold">Deals</h1>
          </div>
          <Tabs value={pathname} className="mb-[-1px]">
            <TabsList>
              <Link href="/deals">
                <TabsTrigger value="/deals">Pipeline View</TabsTrigger>
              </Link>
              <Link href="/deals/all">
                <TabsTrigger value="/deals/all">All Deals</TabsTrigger>
              </Link>
              <Link href="/deals/won">
                <TabsTrigger value="/deals/won">Won Deals</TabsTrigger>
              </Link>
              <Link href="/deals/lost">
                <TabsTrigger value="/deals/lost">Lost Deals</TabsTrigger>
              </Link>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}