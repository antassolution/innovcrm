"use client";

import { useState } from "react";
import {
  Users,
  Building2,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Target,
  DollarSign,
  BarChart4,
  CheckCircle2,
  XCircle,
  Settings,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Contact Management",
    icon: Users,
    items: [
      { name: "All Contacts", href: "/contacts", icon: Users },
      // { name: "Companies", href: "/contacts/companies", icon: Building2 },
      { name: "Add New Contact", href: "/contacts/new", icon: UserPlus },
    ],
  },
  {
    name: "Lead Management",
    icon: Target,
    items: [
      { name: "All Leads", href: "/leads", icon: Target },
      { name: "Add New Lead", href: "/leads/new", icon: UserPlus },
    ],
  },
  {
    name: "Deal Management",
    icon: DollarSign,
    items: [
      { name: "Pipeline View", href: "/deals", icon: BarChart4 },
      { name: "All Deals", href: "/deals/all", icon: Target },
      { name: "Won Deals", href: "/deals/won", icon: CheckCircle2 },
      { name: "Lost Deals", href: "/deals/lost", icon: XCircle },
    ],
  },
  {
    name: "Administration",
    icon: Settings,
    items: [
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Settings", href: "/admin/settings", icon: Settings },
      { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    ],
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div 
      className={cn(
        "relative border-r bg-white transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-2 z-10 h-8 w-8 rounded-full border bg-white"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div className="flex h-full flex-col">
        <nav className="space-y-6 p-4">
          {navigation.map((group) => (
            <div key={group.name}>
              <h3 
                className={cn(
                  "mb-2 px-3 text-sm font-semibold text-muted-foreground transition-all",
                  isCollapsed && "text-center"
                )}
              >
                {!isCollapsed && group.name}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon || group.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                        pathname === item.href && "bg-primary/10 text-primary",
                        isCollapsed && "justify-center"
                      )}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}