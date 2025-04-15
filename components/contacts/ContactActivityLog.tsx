"use client";

import { useEffect, useState } from "react";
import { ContactHistory } from "@/types";
import { contactService } from "@/services/contactService";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, Users, FileText, Loader2 } from "lucide-react";

interface ContactActivityLogProps {
  contactId: string;
}

const activityIcons = {
  email: Mail,
  call: Phone,
  meeting: Users,
  note: FileText,
} as const;

const activityColors = {
  email: "bg-blue-100 text-blue-600",
  call: "bg-green-100 text-green-600",
  meeting: "bg-purple-100 text-purple-600",
  note: "bg-gray-100 text-gray-600",
} as const;

export function ContactActivityLog({ contactId }: ContactActivityLogProps) {
  const [activities, setActivities] = useState<ContactHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await contactService.getContactHistory(contactId);
        setActivities(data);
      } catch (error) {
        console.error("Failed to load activities:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [contactId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
          <CardDescription>Recent interactions with this contact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
          <CardDescription>Recent interactions with this contact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            No activities found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
        <CardDescription>Recent interactions with this contact</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 border-b last:border-0 pb-4 last:pb-0"
              >
                <div className={`rounded-full p-2 ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {format(new Date(activity.date), "MMM d, yyyy")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}