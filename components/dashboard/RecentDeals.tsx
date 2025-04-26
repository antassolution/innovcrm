"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface RecentDealsProps {
  deals: Array<{
    _id: string;
    title: string;
    value: number;
    status: 'active' | 'won' | 'lost';
    createdAt: string;
    customerId: {
      _id: string;
      name: string;
      company: string;
      avatar?: string;
    };
    assignedTo: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
    };
  }>;
}

export function RecentDeals({ deals }: RecentDealsProps) {
  const getStatusColor = (status: 'active' | 'won' | 'lost') => {
    switch (status) {
      case 'won':
        return 'bg-green-500';
      case 'lost':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Deals</CardTitle>
        <CardDescription>Latest deal activity in your pipeline</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0 divide-y">
          {deals.map((deal) => (
            <div key={deal._id} className="flex items-center gap-4 p-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={deal.customerId.avatar} alt={deal.customerId.name} />
                <AvatarFallback>{getInitials(deal.customerId.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">{deal.title}</p>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(deal.status)} text-white`}
                  >
                    {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {deal.customerId.company} • ${deal.value.toLocaleString()}
                </p>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(deal.createdAt), { addSuffix: true })}
                  </span>
                  <span className="px-2 text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    Assigned to {deal.assignedTo.name}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {deals.length === 0 && (
            <div className="flex items-center justify-center p-4">
              <p className="text-sm text-muted-foreground">No recent deals found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}